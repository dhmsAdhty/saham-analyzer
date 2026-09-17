"""
Database Initialization & SQLite Management for Saham Analyzer
Mengelola tabel emiten BEI, harga realtime bursa, broker summary, dan sinyal teknikal.
"""
import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'stocks.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Tabel Saham (Master Emiten & Harga Pasar Live)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stocks (
            ticker TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            group_name TEXT,
            sector TEXT,
            subsector TEXT,
            price REAL NOT NULL,
            change REAL,
            change_pct REAL,
            open REAL,
            high REAL,
            low REAL,
            prev_close REAL,
            volume INTEGER,
            turnover REAL,
            market_cap REAL,
            pe_ratio REAL,
            pbv REAL,
            pbv_mean REAL,
            pbv_minus_1sd REAL,
            pbv_plus_1sd REAL,
            bvps REAL,
            roe REAL,
            der REAL,
            dividend_yield REAL,
            free_float_pct REAL,
            free_float_category TEXT,
            about TEXT,
            is_live INTEGER DEFAULT 1,
            updated_at TEXT
        )
    ''')

    # 2. Tabel Bandarmologi & Broker Summary
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bandarmology (
            ticker TEXT PRIMARY KEY,
            bandar_status TEXT,
            bandar_action TEXT,
            smart_money_score INTEGER,
            smart_money_phase TEXT,
            vwap REAL,
            net_top5_lot INTEGER,
            net_top5_val REAL,
            top1_buyer TEXT,
            top1_buyer_lot INTEGER,
            top1_seller TEXT,
            top1_seller_lot INTEGER,
            buyer_brokers_json TEXT,
            seller_brokers_json TEXT,
            updated_at TEXT,
            FOREIGN KEY (ticker) REFERENCES stocks (ticker)
        )
    ''')

    # 3. Tabel Sinyal Entry & Kalkulasi Resiko Fraksi BEI
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS trade_signals (
            ticker TEXT PRIMARY KEY,
            entry_low REAL,
            entry_high REAL,
            stop_loss REAL,
            take_profit_1 REAL,
            take_profit_2 REAL,
            pivot REAL,
            support_1 REAL,
            support_2 REAL,
            resistance_1 REAL,
            resistance_2 REAL,
            atr REAL,
            risk_points REAL,
            reward_points REAL,
            risk_reward_ratio TEXT,
            action_verdict TEXT,
            updated_at TEXT,
            FOREIGN KEY (ticker) REFERENCES stocks (ticker)
        )
    ''')

    # 4. Tabel Berita & Sentimen AI
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock_news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticker TEXT,
            title TEXT,
            publisher TEXT,
            published_at TEXT,
            sentiment TEXT,
            summary TEXT,
            FOREIGN KEY (ticker) REFERENCES stocks (ticker)
        )
    ''')

    # 5. Tabel Market Composite (IHSG)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS market_indices (
            ticker TEXT PRIMARY KEY,
            name TEXT,
            price REAL,
            change REAL,
            change_pct REAL,
            foreign_flow TEXT,
            support_1 REAL,
            support_2 REAL,
            resistance_1 REAL,
            resistance_2 REAL,
            status TEXT,
            updated_at TEXT
        )
    ''')

    conn.commit()
    conn.close()
    print("SQLite Database initialized successfully at:", DB_PATH)

if __name__ == '__main__':
    init_db()
