// Database Saham IDX Utama & Analisis Fundamental/Teknikal
export const IDX_STOCKS = [
  {
    ticker: 'BBCA',
    name: 'Bank Central Asia Tbk',
    sector: 'Financials',
    subsector: 'Banking',
    price: 6500,
    change: 150,
    changePct: 2.36,
    marketCap: 1263000000000000, // 1.263 T
    marketCapTier: 'Big Cap (Blue Chip)',
    peRatio: 23.4,
    pbv: 4.82,
    pbvMean: 4.60,
    pbvMinus1SD: 4.10,
    pbvPlus1SD: 5.15,
    bvps: 2126,
    roe: 21.8,
    der: 4.2,
    dividendYield: 2.65,
    freeFloatPct: 45.1,
    freeFloatCategory: 'Tinggi (>40%)',
    freeFloatNotes: 'Likuiditas sangat tinggi, pergerakan stabil, favorit investor institusi asing dan dana pensiun.',
    sharesOutstanding: '123,28 Miliar',
    about: 'PT Bank Central Asia Tbk merupakan bank swasta terbesar di Indonesia dengan ekosistem digital banking dan CASA (dana murah) terkuat. Memiliki portofolio kredit korporasi dan konsumer yang sangat solid.',
    catalysts: [
      'Pertumbuhan laba bersih double digit didorong margin bunga bersih (NIM) dan ekspansi kredit berkualitas.',
      'Rasio CASA tetap kokoh di atas 80%, memberikan perlindungan margin saat suku bunga fluktuatif.',
      'Inflow dana asing konsisten di saham perbankan kapitalisasi besar.'
    ],
    risks: [
      'Valuasi PBV berada di atas rata-rata industri bank regional.',
      'Potensi perlambatan pertumbuhan kredit jika ekonomi domestik melandai.'
    ],
    recentNews: [
      {
        title: 'Laba Bersih BCA Tembus Rekor Baru, Kredit Konsumer dan Korporasi Tumbuh Pesat',
        source: 'Bisnis.com',
        time: '3 jam lalu',
        sentiment: 'Bullish',
        summary: 'BCA membukukan kenaikan laba bersih yang ditopang oleh efisiensi operasional dan pertumbuhan CASA yang dominan.'
      },
      {
        title: 'Asing Catatkan Net Buy Signifikan di Saham BBCA Menjelang Musim Dividen',
        source: 'Kontan',
        time: '8 jam lalu',
        sentiment: 'Bullish',
        summary: 'Investor institusi global memborong saham BBCA memanfaatkan penguatan IHSG dan proyeksi dividen interim.'
      },
      {
        title: 'BCA Perkuat Infrastruktur AI dan Cybersecurity untuk Lindungi Transaksi Nasabah',
        source: 'CNBC Indonesia',
        time: '1 hari lalu',
        sentiment: 'Netral',
        summary: 'Investasi belanja modal IT terus dipertahankan guna memperkuat ketahanan digital banking.'
      }
    ]
  },
  {
    ticker: 'BBRI',
    name: 'Bank Rakyat Indonesia (Persero) Tbk',
    sector: 'Financials',
    subsector: 'Banking',
    price: 3400,
    change: 80,
    changePct: 2.41,
    marketCap: 754000000000000,
    marketCapTier: 'Big Cap (Blue Chip)',
    peRatio: 12.6,
    pbv: 2.35,
    pbvMean: 2.60,
    pbvMinus1SD: 2.20,
    pbvPlus1SD: 3.00,
    bvps: 2119,
    roe: 18.9,
    der: 5.1,
    dividendYield: 6.80,
    freeFloatPct: 46.8,
    freeFloatCategory: 'Tinggi (>40%)',
    freeFloatNotes: 'Likuiditas sangat masif, menjadi acuan portofolio manajer investasi domestik dan global.',
    sharesOutstanding: '151,55 Miliar',
    about: 'PT Bank Rakyat Indonesia (Persero) Tbk adalah bank BUMN terbesar di Indonesia dengan fokus utama pada pembiayaan segmen Usaha Mikro, Kecil, dan Menengah (UMKM) melalui jaringan cabang terluas hingga pelosok negeri.',
    catalysts: [
      'Dividend yield tinggi (6-7%) yang menjadi penopang valuasi saham.',
      'Sinergi holding Ultra Mikro (Pegadaian & PNM) memperluas jangkauan nasabah baru.',
      'Valuasi PBV berada di bawah rata-rata historis 5 tahun (-1 SD area), menawarkan peluang akumulasi menarik.'
    ],
    risks: [
      'Peningkatan NPL/LAR pada segmen mikro yang memerlukan pencadangan (provisi) lebih tinggi.',
      'Tekanan suku bunga tinggi yang mempersempit margin bunga pinjaman mikro.'
    ],
    recentNews: [
      {
        title: 'BRI Catat Kualitas Aset Membaik Seiring Restrukturisasi Kredit UMKM Berjalan Mulus',
        source: 'Investor Daily',
        time: '2 jam lalu',
        sentiment: 'Bullish',
        summary: 'Manajemen optimistis rasio kredit bermasalah (NPL) terkendali dan biaya pencadangan mulai melandai.'
      },
      {
        title: 'Dividen Yield Menggiurkan, Saham BBRI Dilirik untuk Strategi Income Investing',
        source: 'EmitenNews',
        time: '5 jam lalu',
        sentiment: 'Bullish',
        summary: 'Dengan proyeksi payout ratio di atas 80%, BBRI tetap menjadi primadona pemburu dividen jumbo.'
      },
      {
        title: 'Bank Indonesia Pertahankan BI-Rate, Saham Perbankan BUMN Bergerak Konsolidasi',
        source: 'Bloomberg Technoz',
        time: '1 hari lalu',
        sentiment: 'Netral',
        summary: 'Kebijakan moneter yang ketat membuat investor mencermati laju biaya dana (Cost of Funds).'
      }
    ]
  },
  {
    ticker: 'BMRI',
    name: 'Bank Mandiri (Persero) Tbk',
    sector: 'Financials',
    subsector: 'Banking',
    price: 6850,
    change: 125,
    changePct: 1.86,
    marketCap: 639000000000000,
    marketCapTier: 'Big Cap (Blue Chip)',
    peRatio: 11.2,
    pbv: 2.18,
    pbvMean: 2.05,
    pbvMinus1SD: 1.75,
    pbvPlus1SD: 2.35,
    bvps: 3142,
    roe: 20.4,
    der: 5.6,
    dividendYield: 5.15,
    freeFloatPct: 40.0,
    freeFloatCategory: 'Tinggi (>40%)',
    freeFloatNotes: 'Saham beredar luas, likuiditas transaksi harian sangat aktif.',
    sharesOutstanding: '93,33 Miliar',
    about: 'PT Bank Mandiri (Persero) Tbk merupakan salah satu bank BUMN terbesar di Indonesia dengan kekuatan utama di segmen wholesale, korporasi, serta transformasi perbankan digital Livin dan Kopra.',
    catalysts: [
      'Pertumbuhan kredit korporasi dan komersial paling agresif di antara bank KBMI IV.',
      'SuperApp Livin by Mandiri mencatat transaksi masif yang mendongkrak pendapatan komisi (fee-based income).',
      'Kualitas aset terjaga dengan rasio NPL terendah dalam sejarah perseroan.'
    ],
    risks: [
      'Persaingan suku bunga dana pihak ketiga korporasi.',
      'Sensitivitas terhadap siklus ekonomi makro dan harga komoditas ekspor nasabah korporat.'
    ],
    recentNews: [
      {
        title: 'Bank Mandiri Cetak Rekor Transaksi Livin, Fee-Based Income Melejit',
        source: 'CNBC Indonesia',
        time: '4 jam lalu',
        sentiment: 'Bullish',
        summary: 'Digitalisasi masif berhasil menekan rasio biaya terhadap pendapatan (CIR) secara konsisten.'
      },
      {
        title: 'Penyaluran Kredit Korporasi BMRI Lampaui Target Kuartalan',
        source: 'Bisnis Indonesia',
        time: '7 jam lalu',
        sentiment: 'Bullish',
        summary: 'Sektor energi terbarukan, infrastruktur, dan hilirisasi menjadi pendorong utama kredit.'
      }
    ]
  },
  {
    ticker: 'TLKM',
    name: 'Telkom Indonesia (Persero) Tbk',
    sector: 'Telecommunication',
    subsector: 'Telecommunications Services',
    price: 2850,
    change: -30,
    changePct: -1.04,
    marketCap: 282000000000000,
    marketCapTier: 'Big Cap (Blue Chip)',
    peRatio: 11.8,
    pbv: 2.08,
    pbvMean: 2.85,
    pbvMinus1SD: 2.30,
    pbvPlus1SD: 3.40,
    bvps: 1370,
    roe: 17.5,
    der: 0.95,
    dividendYield: 5.80,
    freeFloatPct: 47.9,
    freeFloatCategory: 'Tinggi (>40%)',
    freeFloatNotes: 'Sangat likuid, kepemilikan ritel dan asing cukup berimbang.',
    sharesOutstanding: '99,06 Miliar',
    about: 'PT Telkom Indonesia (Persero) Tbk merupakan BUMN telekomunikasi dan jaringan digital terbesar di tanah air melalui Telkomsel, IndiHome, serta infrastruktur data center NeutraDC.',
    catalysts: [
      'Valuasi PBV berada di level deep discount historis 10 tahun (di bawah -1 SD).',
      'Integrasi IndiHome ke Telkomsel menciptakan sinergi Fixed Mobile Convergence (FMC) yang menekan churn rate.',
      'Monetisasi data center (NeutraDC) berpotensi mendatangkan valuasi baru (unlock value).'
    ],
    risks: [
      'Perang tarif seluler dan persaingan ketat dari operator kompetitor.',
      'Pertumbuhan belanja modal (capex) untuk infrastruktur 5G dan kabel fiber optik.'
    ],
    recentNews: [
      {
        title: 'Telkomsel Pacu Layanan FMC, ARPU Pelanggan Tunjukkan Tren Kenaikan',
        source: 'Kontan',
        time: '3 jam lalu',
        sentiment: 'Bullish',
        summary: 'Inisiatif paket internet bundling rumah dan seluler mulai menunjukkan efisiensi operasional.'
      },
      {
        title: 'NeutraDC Milik Telkom Rampungkan Ekspansi Data Center Tahap II di Cikarang',
        source: 'Detik Finance',
        time: '9 jam lalu',
        sentiment: 'Bullish',
        summary: 'Kapasitas data center siap menampung lonjakan komputasi kecerdasan buatan (AI) dari enterprise global.'
      },
      {
        title: 'Tekanan Arus Keluar Dana Asing di Sektor Telekomunikasi Berangsur Mereda',
        source: 'Bisnis.com',
        time: '1 hari lalu',
        sentiment: 'Netral',
        summary: 'Saham TLKM mulai menguji area support kuat setelah koreksi beberapa pekan terakhir.'
      }
    ]
  },
  {
    ticker: 'ASII',
    name: 'Astra International Tbk',
    sector: 'Consumer Discretionary & Industrials',
    subsector: 'Automotive & Heavy Equipment',
    price: 4890,
    change: 60,
    changePct: 1.24,
    marketCap: 198000000000000,
    marketCapTier: 'Big Cap (Blue Chip)',
    peRatio: 6.8,
    pbv: 0.95,
    pbvMean: 1.25,
    pbvMinus1SD: 1.05,
    pbvPlus1SD: 1.45,
    bvps: 5147,
    roe: 14.8,
    der: 0.42,
    dividendYield: 8.50,
    freeFloatPct: 49.9,
    freeFloatCategory: 'Tinggi (>40%)',
    freeFloatNotes: 'Saham konglomerasi terbesar di Indonesia dengan likuiditas harian sangat tinggi.',
    sharesOutstanding: '40,48 Miliar',
    about: 'PT Astra International Tbk adalah konglomerasi terkemuka dengan 7 lini bisnis utama: otomotif (Toyota, Daihatsu, Honda), jasa keuangan, alat berat & pertambangan (United Tractors), agribisnis, infrastruktur, IT, dan properti.',
    catalysts: [
      'Valuasi PBV berada di bawah 1.0x (harga saham lebih murah daripada nilai buku bersih asetnya).',
      'Dividend yield sangat tinggi (8-9%), salah satu yang paling royal di IHSG.',
      'Kontribusi laba yang sangat kuat dari lini bisnis pertambangan & kontraktor emas/batu bara melalui UNTR.'
    ],
    risks: [
      'Penurunan penjualan mobil nasional dan ancaman penetrasi mobil listrik (EV) merek asal Tiongkok.',
      'Normalisasi harga komoditas batu bara yang mempengaruhi permintaan alat berat Komatsu.'
    ],
    recentNews: [
      {
        title: 'Astra Siapkan Peluncuran Berbagai Lini Mobil Hybrid Baru untuk Perkuat Pangsa Pasar Otomotif',
        source: 'Oto.com',
        time: '5 jam lalu',
        sentiment: 'Bullish',
        summary: 'Manajemen menilai mobil hybrid lebih sesuai dengan kesiapan infrastruktur pengisian daya di Indonesia saat ini.'
      },
      {
        title: 'Anak Usaha Astra (UNTR) Pacu Diversifikasi ke Tambang Emas dan Nikel',
        source: 'CNBC Indonesia',
        time: '12 jam lalu',
        sentiment: 'Bullish',
        summary: 'Langkah akuisisi aset mineral strategis mengimbangi normalisasi pendapatan dari sektor batu bara termal.'
      }
    ]
  },
  {
    ticker: 'GOTO',
    name: 'GoTo Gojek Tokopedia Tbk',
    sector: 'Technology',
    subsector: 'Internet & Direct Marketing',
    price: 54,
    change: 1,
    changePct: 1.89,
    marketCap: 64800000000000,
    marketCapTier: 'Mid Cap (Tech Growth)',
    peRatio: -14.2,
    pbv: 1.72,
    pbvMean: 2.40,
    pbvMinus1SD: 1.40,
    pbvPlus1SD: 3.40,
    bvps: 31.4,
    roe: -11.2,
    der: 0.18,
    dividendYield: 0.0,
    freeFloatPct: 78.4,
    freeFloatCategory: 'Sangat Tinggi (>75%)',
    freeFloatNotes: 'Porsi saham publik sangat dominan. Volume transaksi harian raksasa namun fluktuasi harga per tick (Rp1) bernilai persentase tinggi.',
    sharesOutstanding: '1.200 Miliar',
    about: 'PT GoTo Gojek Tokopedia Tbk adalah ekosistem digital terintegrasi di Indonesia yang mencakup on-demand services (Gojek) dan financial technology (GoPay), serta kemitraan strategis dengan TikTok e-commerce.',
    catalysts: [
      'Segmen On-Demand Service (Gojek) dan GoPay telah mencapai adjusted EBITDA positif.',
      'Integrasi sistem pembayaran GoPay di dalam platform belanja TikTok Shop meningkatkan volume transaksi (GTV).',
      'Beban operasional dan bakar uang (cash burn) telah terpangkas signifikan.'
    ],
    risks: [
      'Persaingan ketat di industri ride-hailing dan delivery dari kompetitor seperti Grab dan Shopee.',
      'Free float yang sangat tinggi membuat saham rentan tekanan jual masif jika sentimen tech global melemah.'
    ],
    recentNews: [
      {
        title: 'GoPay Catat Peningkatan Pengguna Aktif Bulanan Pasca Integrasi TikTok Shop',
        source: 'Tech in Asia',
        time: '6 jam lalu',
        sentiment: 'Bullish',
        summary: 'Volume pembayaran merchant dan transaksi peer-to-peer mencatatkan pertumbuhan dua digit kuartal ini.'
      },
      {
        title: 'Saham Sektor Teknologi Bergerak Rebound Ditopang Harapan Pelonggaran Kebijakan Suku Bunga',
        source: 'Bisnis.com',
        time: '10 jam lalu',
        sentiment: 'Netral',
        summary: 'GOTO memimpin volume perdagangan saham domestik dengan aktivitas spekulatif yang tinggi.'
      }
    ]
  },
  {
    ticker: 'AMMN',
    name: 'Amman Mineral Internasional Tbk',
    sector: 'Basic Materials',
    subsector: 'Metals & Mining',
    price: 7425,
    change: 175,
    changePct: 2.41,
    marketCap: 538000000000000,
    marketCapTier: 'Big Cap (Growth Mining)',
    peRatio: 28.5,
    pbv: 5.65,
    pbvMean: 5.20,
    pbvMinus1SD: 4.10,
    pbvPlus1SD: 6.30,
    bvps: 1314,
    roe: 22.4,
    der: 0.65,
    dividendYield: 1.20,
    freeFloatPct: 17.3,
    freeFloatCategory: 'Rendah - Menengah (15% - 20%)',
    freeFloatNotes: 'Sebagian besar saham dikuasai pengendali strategis. Pergerakan harga cenderung terarah dan responsif terhadap dorongan volume besar.',
    sharesOutstanding: '72,50 Miliar',
    about: 'PT Amman Mineral Internasional Tbk mengoperasikan tambang tembaga dan emas Batu Hijau di Sumbawa Barat, tambang tembaga-emas terbesar kedua di Indonesia dengan cadangan terbukti yang melimpah.',
    catalysts: [
      'Fasilitas smelter tembaga baru telah mulai beroperasi komersial penuh, mendukung ekspor katoda tembaga.',
      'Tren permintaan tembaga dunia meningkat pesat akibat transisi kendaraan listrik dan infrastruktur AI data center.',
      'Harga komoditas emas global mencatat rekor tertinggi, mendongkrak margin keuntungan secara substansial.'
    ],
    risks: [
      'Regulasi kuota ekspor dan bea keluar konsentrat tembaga dari pemerintah.',
      'Valuasi kelipatan PBV yang tergolong premium dibandingkan emiten tambang lainnya.'
    ],
    recentNews: [
      {
        title: 'Harga Emas dan Tembaga Dunia Melambung, AMMN Proyeksikan Lonjakan Margin Bersih',
        source: 'Bloomberg Technoz',
        time: '2 jam lalu',
        sentiment: 'Bullish',
        summary: 'Kombinasi harga jual rata-rata (ASP) yang tinggi dan efisiensi tambang Batu Hijau memacu kinerja keuangan.'
      },
      {
        title: 'Smelter Amman Mineral Resmi Beroperasi, Siap Pasok Kebutuhan Katoda Tembaga Nasional',
        source: 'Kontan',
        time: '14 jam lalu',
        sentiment: 'Bullish',
        summary: 'Proses hilirisasi tembaga selesai tepat waktu dengan kapasitas olahan konsentrasi tinggi.'
      }
    ]
  },
  {
    ticker: 'BREN',
    name: 'Barito Renewables Energy Tbk',
    sector: 'Utilities',
    subsector: 'Renewable Energy',
    price: 3110,
    change: -460,
    changePct: -12.89,
    marketCap: 822000000000000,
    marketCapTier: 'Mega Cap (Green Energy)',
    peRatio: 412.0,
    pbv: 114.2,
    pbvMean: 95.0,
    pbvMinus1SD: 65.0,
    pbvPlus1SD: 130.0,
    bvps: 53.8,
    roe: 28.5,
    der: 2.8,
    dividendYield: 0.45,
    freeFloatPct: 11.6,
    freeFloatCategory: 'Sangat Rendah (<15%)',
    freeFloatNotes: 'Free float sangat kecil (tight float). Pergerakan harga sangat volatil dan memiliki bobot indeks yang masif terhadap IHSG.',
    sharesOutstanding: '133,78 Miliar',
    about: 'PT Barito Renewables Energy Tbk (bagian dari Grup Barito Pacific) adalah produsen energi panas bumi (geothermal) terbesar di Indonesia melalui kepemilikan aset Star Energy Geothermal.',
    catalysts: [
      'Peningkatan kapasitas pembangkit listrik tenaga panas bumi (PLTP) Salak, Wayang Windu, dan Darajat.',
      'Kontrak pasokan listrik jangka panjang (take-or-pay) dalam denominasi USD dengan PT PLN (Persero).',
      'Ekspansi ke sektor energi baru terbarukan tenaga angin (wind power).'
    ],
    risks: [
      'Valuasi PER dan PBV yang luar biasa tinggi (extreme multiple valuation).',
      'Isu aturan batas minimal free float bursa serta evaluasi berkala indeks global seperti FTSE / MSCI.'
    ],
    recentNews: [
      {
        title: 'Star Energy Geothermal Pacu Eksplorasi Sumur Baru Guna Tingkatkan Kapasitas Pembangkit',
        source: 'Bisnis Indonesia',
        time: '4 jam lalu',
        sentiment: 'Bullish',
        summary: 'Perseroan berkomitmen memperbesar bauran energi hijau untuk mendukung target net-zero emission Indonesia.'
      },
      {
        title: 'Volatilitas Saham Konglomerasi Energi Hijau Pengaruhi Laju Indeks Harga Saham Gabungan',
        source: 'CNBC Indonesia',
        time: '8 jam lalu',
        sentiment: 'Waspada / Netral',
        summary: 'Analis mengingatkan pelaku pasar untuk mencermati rasio valuasi fundamental di tengah volatilitas harga.'
      }
    ]
  },
  {
    ticker: 'ADRO',
    name: 'Adaro Energy Indonesia Tbk',
    sector: 'Energy',
    subsector: 'Coal & Energy Transition',
    price: 3560,
    change: 40,
    changePct: 1.14,
    marketCap: 113800000000000,
    marketCapTier: 'Big Cap (High Dividend)',
    peRatio: 4.8,
    pbv: 0.88,
    pbvMean: 1.15,
    pbvMinus1SD: 0.90,
    pbvPlus1SD: 1.40,
    bvps: 4045,
    roe: 19.5,
    der: 0.28,
    dividendYield: 14.2,
    freeFloatPct: 41.2,
    freeFloatCategory: 'Tinggi (>40%)',
    freeFloatNotes: 'Likuiditas sangat lancar, salah satu saham komoditas terpopuler dengan neraca kas kasat mata yang sangat tebal.',
    sharesOutstanding: '31,98 Miliar',
    about: 'PT Adaro Energy Indonesia Tbk adalah produsen batu bara termal dan metalurgi terbesar di Indonesia yang sedang bertransformasi mengembangkan proyek smelter aluminium hijau dan PLTA di Kalimantan Utara.',
    catalysts: [
      'Valuasi PBV di bawah 1.0x (diskon) dan PER single-digit (4-5x) yang sangat murah.',
      'Dividen yield historis sangat tinggi (12-15%) didukung posisi net cash yang kokoh.',
      'Proyek hilirisasi smelter aluminium hijau mulai menghasilkan nilai tambah jangka panjang.'
    ],
    risks: [
      'Penurunan harga acuan batu bara Newcastle global.',
      'Sentimen ESG global yang membatasi pendanaan perbankan internasional terhadap proyek berbasis energi fosil.'
    ],
    recentNews: [
      {
        title: 'Adaro Percepat Pembangunan Kawasan Industri Hijau dan Smelter Aluminium di Kaltara',
        source: 'Investor Daily',
        time: '3 jam lalu',
        sentiment: 'Bullish',
        summary: 'Transformasi menuju green business terus digenjot dengan pembiayaan internal perseroan yang sehat.'
      },
      {
        title: 'Harga Batu Bara Menguat Menjelang Musim Dingin, Emiten Tambang Nikmati Penguatan Margin',
        source: 'Kontan',
        time: '11 jam lalu',
        sentiment: 'Bullish',
        summary: 'Kebutuhan pembangkit listrik di negara belahan utara meningkatkan permintaan pasokan batu bara termal.'
      }
    ]
  },
  {
    ticker: 'JGLE',
    name: 'Graha Andrasentra Propertindo Tbk',
    sector: 'Consumer Cyclicals',
    subsector: 'Tourism & Leisure',
    price: 74,
    change: 17,
    changePct: 29.82,
    marketCap: 1670000000000,
    marketCapTier: 'Small Cap',
    peRatio: 45.0,
    pbv: 1.25,
    pbvMean: 0.95,
    pbvMinus1SD: 0.65,
    pbvPlus1SD: 1.20,
    bvps: 59,
    roe: 2.8,
    der: 0.45,
    dividendYield: 0.0,
    freeFloatPct: 22.4,
    freeFloatCategory: 'Sedang (20% - 40%)',
    freeFloatNotes: 'Saham lapis tiga dengan pergerakan sangat spekulatif dan volatilitas harian tinggi.',
    sharesOutstanding: '22.58 Miliar',
    about: 'PT Graha Andrasentra Propertindo Tbk (JGLE) adalah pengembang dan pengelola kawasan wisata terpadu Jungleland Adventure Theme Park dan The Jungle Waterpark di Bogor.',
    catalysts: [
      'Lonjakan kunjungan wisatawan saat musim liburan sekolah dan akhir pekan.',
      'Potensi revitalisasi wahana hiburan dan optimalisasi aset lahan perseroan.'
    ],
    risks: [
      'Volatilitas harga ekstrem (lonjakan ARA mendadak yang rawan aksi guyur bandar).',
      'Fundamental margin laba bersih yang masih tipis.',
      'Risiko likuiditas pasca pesta kenaikan harga usai.'
    ],
    recentNews: [
      {
        title: 'Saham JGLE Melesat Menyentuh Auto Rejection Atas (ARA) Didorong Transaksi Spekulatif',
        source: 'Market Beat',
        time: '14 Sep 2026',
        sentiment: 'Waspada',
        summary: 'Lonjakan harga saham JGLE sebesar +29.82% diiringi transaksi besar di broker tertentu yang diwaspadai aksi distribusi lanjutan.'
      }
    ]
  },
  {
    ticker: 'ICBP',
    name: 'Indofood CBP Sukses Makmur Tbk',
    sector: 'Consumer Staples',
    subsector: 'Food & Beverage',
    price: 11600,
    change: 100,
    changePct: 0.87,
    marketCap: 135200000000000,
    marketCapTier: 'Big Cap (Defensive Blue Chip)',
    peRatio: 14.5,
    pbv: 2.75,
    pbvMean: 3.10,
    pbvMinus1SD: 2.65,
    pbvPlus1SD: 3.60,
    bvps: 4218,
    roe: 19.8,
    der: 0.85,
    dividendYield: 3.75,
    freeFloatPct: 19.5,
    freeFloatCategory: 'Rendah - Menengah (15% - 20%)',
    freeFloatNotes: 'Mayoritas saham dipegang PT Indofood Sukses Makmur (INDF). Pergerakan sangat defensif saat pasar sedang terkoreksi.',
    sharesOutstanding: '11,66 Miliar',
    about: 'PT Indofood CBP Sukses Makmur Tbk adalah produsen mie instan terbesar di dunia melalui merek ikonik Indomie, serta memproduksi dairy (Indomilk), snack, bumbu makanan, dan minuman kemasan dengan penetrasi global di Timur Tengah, Afrika, dan Eropa.',
    catalysts: [
      'Brand equity Indomie yang tak tertandingi dengan pricing power kuat (mampu menaikkan harga tanpa menurunkan permintaan).',
      'Pertumbuhan penjualan ekspor yang pesat dari pasar Pinehill (Timur Tengah & Afrika).',
      'Penurunan harga gandum dan kemasan karton global memperbaiki margin kotor produk.'
    ],
    risks: [
      'Fluktuasi nilai tukar Rupiah terhadap Dolar AS terkait utang obligasi valas Pinehill.',
      'Daya beli masyarakat kelas menengah-bawah terhadap produk makanan olahan sekunder.'
    ],
    recentNews: [
      {
        title: 'Indomie Perluas Pangsa Pasar Internasional, Ekspor ke Benua Afrika Catat Pertumbuhan Kuat',
        source: 'Bisnis.com',
        time: '5 jam lalu',
        sentiment: 'Bullish',
        summary: 'Penjualan segmen mie instan di pasar global menjadi motor pertumbuhan laba operasional ICBP.'
      },
      {
        title: 'Penurunan Biaya Bahan Baku Gandum Perlebar Margin Laba Kotor Indofood CBP',
        source: 'CNBC Indonesia',
        time: '1 hari lalu',
        sentiment: 'Bullish',
        summary: 'Normalisasi rantai pasok agrikultur global membawa angin segar bagi profitabilitas industri consumer goods.'
      }
    ]
  }
]

// Data Indeks IHSG (Historical & Realtime Simulation)
export const IHSG_DATA = {
  ticker: '^JKSE',
  name: 'Indeks Harga Saham Gabungan (IHSG)',
  price: 7325.40,
  change: 42.60,
  changePct: 0.58,
  high: 7348.15,
  low: 7298.30,
  volume: '18.42 Miliar Lembar',
  turnover: 'Rp 11.25 Triliun',
  status: 'Bullish Consolidation',
  foreignFlow: '+Rp 642 Miliar (Net Buy)',
  support1: 7280,
  support2: 7220,
  resistance1: 7360,
  resistance2: 7420,
  history7d: [
    { date: '08 Sep', price: 7215 },
    { date: '09 Sep', price: 7240 },
    { date: '10 Sep', price: 7230 },
    { date: '11 Sep', price: 7285 },
    { date: '12 Sep', price: 7295 },
    { date: '13 Sep', price: 7325 }
  ]
}

// Generator Titik Teknis & Kalkulator Posisi Entry Harga
export function calculateEntryPosition(stock) {
  const price = stock.price
  const high = Math.round(price * 1.018)
  const low = Math.round(price * 0.982)
  const close = price

  // Pivot Points Classic
  const pivot = Math.round((high + low + close) / 3)
  const s1 = Math.round(2 * pivot - high)
  const s2 = Math.round(pivot - (high - low))
  const r1 = Math.round(2 * pivot - low)
  const r2 = Math.round(pivot + (high - low))

  // Moving Averages
  const ma20 = Math.round(price * (stock.changePct >= 0 ? 0.985 : 1.015))
  const ma50 = Math.round(price * (stock.changePct >= 0 ? 0.965 : 1.035))
  const ma200 = Math.round(price * 0.93)

  // Indikator RSI
  let rsi = 54
  if (stock.changePct > 2) rsi = 68
  else if (stock.changePct > 0.5) rsi = 58
  else if (stock.changePct < -1.5) rsi = 38
  else if (stock.changePct < 0) rsi = 46

  // Valuasi PBV Band Status
  let pbvStatus = 'Fair Value'
  let pbvColor = '#B87333'
  let pbvDesc = 'Valuasi berada di sekitar rata-rata historis wajar.'

  if (stock.pbv <= stock.pbvMinus1SD) {
    pbvStatus = 'Undervalued / Diskon Kuat (-1 SD)'
    pbvColor = '#15803D'
    pbvDesc = `PBV saat ini (${stock.pbv}x) berada di bawah garis -1 Standar Deviasi (${stock.pbvMinus1SD}x), menawarkan peluang diskon yang sangat menarik untuk investasi jangka menengah-panjang.`
  } else if (stock.pbv >= stock.pbvPlus1SD) {
    pbvStatus = 'Overvalued / Premium (+1 SD)'
    pbvColor = '#B91C1C'
    pbvDesc = `PBV saat ini (${stock.pbv}x) berada di atas garis +1 Standar Deviasi (${stock.pbvPlus1SD}x), harga telah memperhitungkan ekspektasi tinggi. Waspadai aksi profit taking.`
  } else {
    pbvStatus = 'Fair Value (Rentang Wajar)'
    pbvColor = '#2563EB'
    pbvDesc = `PBV saat ini (${stock.pbv}x) mendekati nilai rata-rata historis (${stock.pbvMean}x), mencerminkan valuasi pasar yang rasional.`
  }

  // Free Float Analisis
  let ffLevel = 'Normal'
  let ffColor = '#2563EB'
  let ffRecommendation = ''

  if (stock.freeFloatPct >= 40) {
    ffLevel = 'Free Float Tinggi'
    ffColor = '#15803D'
    ffRecommendation = 'Likuiditas sangat berlimpah dan transparan. Pergerakan harga tidak mudah dimanipulasi pihak tertentu, sangat aman untuk sizing modal besar (swing / investing).'
  } else if (stock.freeFloatPct < 15) {
    ffLevel = 'Free Float Rendah (Tight Float)'
    ffColor = '#B91C1C'
    ffRecommendation = 'Jumlah saham beredar publik sangat minim. Saham sangat sensitif terhadap tarikan volume kecil dan rentan pergerakan liar/volatilitas tinggi. Wajib terapkan disiplin Stop Loss ketat.'
  } else {
    ffLevel = 'Free Float Sedang (Seimbang)'
    ffColor = '#B87333'
    ffRecommendation = 'Likuiditas harian stabil dan proporsional untuk trading harian maupun hold posisi beberapa pekan.'
  }

  // Kalkulasi Rekomendasi Posisi Entry
  const bowEntryMin = Math.round(s1 * 0.995)
  const bowEntryMax = Math.round(s1 * 1.008)
  const bowStopLoss = Math.round(s2 * 0.985)
  const bowTarget1 = r1
  const bowTarget2 = r2
  const riskBow = bowEntryMax - bowStopLoss
  const rewardBow = bowTarget1 - bowEntryMax
  const rrRatioBow = riskBow > 0 ? (rewardBow / riskBow).toFixed(1) : '2.1'

  const boEntry = Math.round(r1 * 1.005)
  const boStopLoss = Math.round(pivot * 0.99)
  const boTarget = r2
  const riskBo = boEntry - boStopLoss
  const rewardBo = boTarget - boEntry
  const rrRatioBo = riskBo > 0 ? (rewardBo / riskBo).toFixed(1) : '2.0'

  return {
    pivot,
    support1: s1,
    support2: s2,
    resistance1: r1,
    resistance2: r2,
    ma20,
    ma50,
    ma200,
    rsi,
    pbvStatus,
    pbvColor,
    pbvDesc,
    ffLevel,
    ffColor,
    ffRecommendation,
    // Alias praktis untuk tampilan Chart & Ringkasan Cepat
    entryBuyLow: bowEntryMin,
    entryBuyHigh: bowEntryMax,
    takeProfit1: bowTarget1,
    takeProfit2: bowTarget2,
    stopLoss: bowStopLoss,
    recommendations: [
      {
        strategy: 'Buy on Weakness (BoW) — Direkomendasikan',
        badge: 'Low Risk Accumulation',
        badgeClass: 'badge-green',
        entryRange: `${bowEntryMin.toLocaleString('id-ID')} – ${bowEntryMax.toLocaleString('id-ID')}`,
        entryIdeal: bowEntryMax,
        stopLoss: bowStopLoss,
        riskPoints: riskBow,
        riskPct: ((riskBow / bowEntryMax) * 100).toFixed(2),
        targetPrice1: bowTarget1,
        targetPrice2: bowTarget2,
        potentialGainPct: (((bowTarget1 - bowEntryMax) / bowEntryMax) * 100).toFixed(2),
        rrRatio: `1 : ${rrRatioBow}`,
        rationale: `Antisipasi pantulan teknikal (technical rebound) di area Support 1 (${s1.toLocaleString('id-ID')}) dengan batas risiko yang sangat terukur di bawah Support 2.`
      },
      {
        strategy: 'Breakout Momentum Buy',
        badge: 'High Momentum',
        badgeClass: 'badge-amber',
        entryRange: `Beli jika tembus & bertahan di atas ${boEntry.toLocaleString('id-ID')}`,
        entryIdeal: boEntry,
        stopLoss: boStopLoss,
        riskPoints: riskBo,
        riskPct: ((riskBo / boEntry) * 100).toFixed(2),
        targetPrice1: boTarget,
        targetPrice2: Math.round(r2 * 1.03),
        potentialGainPct: (((boTarget - boEntry) / boEntry) * 100).toFixed(2),
        rrRatio: `1 : ${rrRatioBo}`,
        rationale: `Konfirmasi breakout saat harga mampu menembus Resistance 1 (${r1.toLocaleString('id-ID')}) yang didukung kenaikan volume transaksi di atas rata-rata 20 hari.`
      }
    ]
  }
}

// Helper generator riwayat harga historis 30 hari untuk charting
export function generateStockHistory(basePrice, volatility = 0.015) {
  const points = []
  const now = new Date()
  let current = Math.round(basePrice * 0.94)

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    
    // Skip weekend
    if (d.getDay() === 0 || d.getDay() === 6) continue

    const dateStr = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    const changeFactor = 1 + (Math.random() * (volatility * 2) - (volatility * 0.92))
    current = Math.round(current * changeFactor)
    
    // Anchor last day to actual current price
    if (i === 0) current = basePrice

    points.push({
      date: dateStr,
      price: current,
      volume: Math.floor(Math.random() * 450000 + 150000)
    })
  }
  return points
}
