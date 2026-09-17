"""
Lightweight SQLite REST API Server for Saham Analyzer
Berjalan di port 5050, melayani endpoint SQLite untuk frontend Vue
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from db import get_db_connection, init_db
from sync_market import sync_all_stocks_to_sqlite

PORT = 5050

class StockApiHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # 1. Endpoint List Semua Saham dari SQLite (Joined dengan signals & bandarmology)
            if path == '/api/db/stocks' or path == '/api/db/stocks/':
                group = query.get('group', [None])[0]
                sql = '''
                    SELECT 
                        s.*,
                        ts.entry_low, ts.entry_high, ts.stop_loss, ts.take_profit_1, ts.take_profit_2,
                        ts.pivot, ts.support_1, ts.support_2, ts.resistance_1, ts.resistance_2,
                        ts.atr, ts.risk_points, ts.reward_points, ts.risk_reward_ratio, ts.action_verdict,
                        b.bandar_status, b.bandar_action, b.smart_money_score, b.smart_money_phase,
                        b.vwap, b.net_top5_lot, b.net_top5_val, b.top1_buyer, b.top1_buyer_lot,
                        b.top1_seller, b.top1_seller_lot
                    FROM stocks s
                    LEFT JOIN trade_signals ts ON s.ticker = ts.ticker
                    LEFT JOIN bandarmology b ON s.ticker = b.ticker
                '''
                if group:
                    cursor.execute(sql + ' WHERE s.group_name LIKE ? ORDER BY s.change_pct DESC', (f'%{group}%',))
                else:
                    cursor.execute(sql + ' ORDER BY s.change_pct DESC')
                
                rows = [dict(row) for row in cursor.fetchall()]
                self._respond_json({"status": "success", "count": len(rows), "data": rows})

            # 2. Endpoint Detail Spesifik Satu Saham
            elif path.startswith('/api/db/stocks/'):
                ticker = path.split('/')[-1].upper().replace('.JK', '')
                cursor.execute('SELECT * FROM stocks WHERE ticker = ?', (ticker,))
                stock_row = cursor.fetchone()

                if not stock_row:
                    self._respond_json({"status": "error", "message": f"Saham {ticker} tidak ditemukan di database"}, status=404)
                    return

                # Ambil bandarmology
                cursor.execute('SELECT * FROM bandarmology WHERE ticker = ?', (ticker,))
                bandar_row = cursor.fetchone()

                # Ambil trade signals
                cursor.execute('SELECT * FROM trade_signals WHERE ticker = ?', (ticker,))
                signal_row = cursor.fetchone()

                # Ambil news
                cursor.execute('SELECT * FROM stock_news WHERE ticker = ? ORDER BY id DESC LIMIT 5', (ticker,))
                news_rows = [dict(r) for r in cursor.fetchall()]

                data = {
                    **dict(stock_row),
                    "bandar": dict(bandar_row) if bandar_row else None,
                    "signals": dict(signal_row) if signal_row else None,
                    "news": news_rows
                }
                self._respond_json({"status": "success", "data": data})

            # 3. Endpoint Market Summary (IHSG, Top Gainer, Top Loser, Stats)
            elif path == '/api/db/market-summary':
                cursor.execute('SELECT * FROM market_indices WHERE ticker = "^JKSE"')
                ihsg_row = cursor.fetchone()

                cursor.execute('SELECT ticker, name, price, change, change_pct, volume, group_name FROM stocks ORDER BY change_pct DESC LIMIT 5')
                top_gainers = [dict(r) for r in cursor.fetchall()]

                cursor.execute('SELECT ticker, name, price, change, change_pct, volume, group_name FROM stocks ORDER BY change_pct ASC LIMIT 5')
                top_losers = [dict(r) for r in cursor.fetchall()]

                cursor.execute('SELECT COUNT(*) as total_stocks, AVG(change_pct) as avg_change FROM stocks')
                stats = dict(cursor.fetchone())

                self._respond_json({
                    "status": "success",
                    "ihsg": dict(ihsg_row) if ihsg_row else None,
                    "top_gainers": top_gainers,
                    "top_losers": top_losers,
                    "stats": stats
                })

            else:
                self._respond_json({"status": "error", "message": "Endpoint not found"}, status=404)

        except Exception as e:
            self._respond_json({"status": "error", "message": str(e)}, status=500)
        finally:
            conn.close()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/db/sync':
            try:
                sync_all_stocks_to_sqlite()
                self._respond_json({"status": "success", "message": "Sinkronisasi seluruh saham bursa ke SQLite berhasil!"})
            except Exception as e:
                self._respond_json({"status": "error", "message": str(e)}, status=500)
        else:
            self._respond_json({"status": "error", "message": "Endpoint not found"}, status=404)

    def _respond_json(self, data, status=200):
        self.send_response(status)
        self._send_cors_headers()
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

def run_server():
    init_db()
    server = HTTPServer(('0.0.0.0', PORT), StockApiHandler)
    print(f"🚀 SQLite Stock API Server running on http://0.0.0.0:{PORT}")
    server.serve_forever()

if __name__ == '__main__':
    run_server()
