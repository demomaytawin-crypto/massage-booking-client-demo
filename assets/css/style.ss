:root{
      --primary:#8B5E3C; --secondary:#D4A373; --accent:#C9A227; --bg:#FFF8F0; --soft:#F7EBDD; --card:#FFFFFF;
      --text:#2B2520; --muted:#7B6B61; --border:#E8D8C5; --success:#2E7D32; --danger:#B3261E; --warning:#F9A825;
      --shadow:0 20px 55px rgba(74,50,30,.14); --radius:28px;
    }
    *{box-sizing:border-box}
    body{margin:0;font-family:'Kanit',sans-serif;background:
      radial-gradient(circle at 15% 10%, rgba(212,163,115,.25), transparent 28%),
      radial-gradient(circle at 88% 18%, rgba(201,162,39,.18), transparent 24%),
      linear-gradient(180deg,var(--bg),#fff);color:var(--text)}
    a{text-decoration:none;color:inherit}
    img{max-width:100%;display:block}
    .container{width:min(1180px,92vw);margin:auto}
    .topbar{position:sticky;top:0;z-index:100;background:rgba(255,248,240,.88);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
    .navwrap{height:76px;display:flex;align-items:center;justify-content:space-between}
    .brand{display:flex;align-items:center;gap:12px;font-weight:800;color:var(--primary)}
    .brand img{width:46px;height:46px;object-fit:contain;border-radius:14px;background:#fff;box-shadow:0 8px 22px rgba(0,0,0,.08)}
    .brand small{display:block;font-size:12px;color:var(--muted);font-weight:500}
    .nav{display:flex;align-items:center;gap:22px;font-weight:600;color:#4d4037}
    .nav a{font-size:15px}
    .hamb{display:none;border:0;background:var(--primary);color:#fff;border-radius:14px;padding:10px 14px;font-size:22px}
    .language-switcher{display:flex;align-items:center;gap:6px;background:#fff;border:1px solid var(--border);border-radius:999px;padding:6px 8px}
    .language-switcher button{border:0;background:transparent;color:var(--muted);font-family:inherit;font-weight:800;padding:6px 8px;border-radius:999px;cursor:pointer}
    .language-switcher button.active{background:var(--primary);color:#fff}
    .language-switcher select{border:0;background:transparent;font-family:inherit;font-weight:800;color:var(--primary);padding:4px}
    .btn{border:0;border-radius:999px;padding:13px 22px;background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;font-weight:700;box-shadow:0 12px 26px rgba(139,94,60,.25);cursor:pointer;font-family:inherit}
    .btn.secondary{background:#fff;color:var(--primary);border:1px solid var(--border);box-shadow:none}
    .btn.ghost{background:transparent;color:var(--primary);border:1px solid var(--primary);box-shadow:none}
    .btn.danger{background:var(--danger)}
    .btn:disabled{opacity:.55;cursor:not-allowed}
    .hero{position:relative;overflow:hidden;padding:70px 0 50px}
    .hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:center}
    .badge{display:inline-flex;gap:8px;align-items:center;background:#fff;border:1px solid var(--border);color:var(--primary);padding:9px 14px;border-radius:999px;font-size:14px;font-weight:700;margin-bottom:18px}
    h1{font-size:clamp(38px,5vw,72px);line-height:1.05;margin:0 0 18px;color:#3B2A20;letter-spacing:-1px}
    .lead{font-size:19px;line-height:1.75;color:var(--muted);margin:0 0 26px}
    .hero-actions{display:flex;gap:14px;flex-wrap:wrap}
    .hero-card{position:relative;border-radius:36px;overflow:hidden;background:#fff;box-shadow:var(--shadow);padding:16px}
    .hero-card .photo{height:520px;border-radius:28px;background:linear-gradient(135deg,rgba(139,94,60,.18),rgba(212,163,115,.28)),url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1100&q=80') center/cover}
    .floating{position:absolute;left:26px;bottom:28px;background:rgba(255,255,255,.94);border:1px solid var(--border);border-radius:24px;padding:18px;box-shadow:0 15px 35px rgba(0,0,0,.12);width:min(330px,80%)}
    .floating b{color:var(--primary)}
    .section{padding:74px 0}
    .section.soft{background:linear-gradient(180deg,rgba(247,235,221,.65),rgba(255,255,255,.8))}
    .section-head{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:28px}
    .eyebrow{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);font-weight:800}
    h2{font-size:clamp(28px,3.2vw,44px);line-height:1.2;margin:6px 0 8px;color:#3B2A20}
    .sub{color:var(--muted);line-height:1.7}
    .grid{display:grid;gap:20px}
    .grid.cards{grid-template-columns:repeat(3,1fr)}
    .card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 14px 35px rgba(74,50,30,.08);overflow:hidden}
    .card-body{padding:22px}
    .service-img,.branch-img,.gallery-img{height:210px;background:var(--soft) center/cover;border-radius:22px;margin:12px}
    .price{font-weight:800;color:var(--primary);font-size:22px}
    .meta{color:var(--muted);font-size:14px}
    .pill{display:inline-flex;padding:7px 11px;border-radius:999px;background:var(--soft);color:var(--primary);font-size:13px;font-weight:700;border:1px solid var(--border)}
    .features{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
    .feature{padding:24px;border-radius:26px;background:#fff;border:1px solid var(--border);box-shadow:0 12px 32px rgba(74,50,30,.07)}
    .feature .ico{font-size:30px;margin-bottom:12px}
    .branch-list{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
    .branch-card{display:grid;grid-template-columns:180px 1fr;background:#fff;border:1px solid var(--border);border-radius:28px;overflow:hidden;box-shadow:0 12px 32px rgba(74,50,30,.07)}
    .branch-card .branch-img{height:auto;margin:0;border-radius:0}
    .gallery-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
    .gallery-tile{height:210px;border-radius:24px;background:center/cover;box-shadow:0 12px 28px rgba(0,0,0,.1);cursor:pointer}
    .review-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .stars{color:#F5A623;font-size:18px;letter-spacing:2px}
    .promo{display:grid;grid-template-columns:1fr 1fr;gap:26px;align-items:center;background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;border-radius:36px;padding:32px;overflow:hidden}
    .promo .sub{color:rgba(255,255,255,.82)}
    .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
    .contact-box{background:#fff;border:1px solid var(--border);border-radius:28px;padding:26px;box-shadow:0 14px 35px rgba(74,50,30,.08)}
    .map{height:360px;border-radius:28px;background:linear-gradient(135deg,rgba(139,94,60,.12),rgba(212,163,115,.25)),url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=80') center/cover}
    .booking-panel{background:#fff;border:1px solid var(--border);border-radius:34px;box-shadow:var(--shadow);overflow:hidden}
    .steps{display:flex;gap:6px;padding:18px;background:var(--soft);overflow:auto}
    .step{min-width:max-content;padding:10px 14px;border-radius:999px;background:#fff;color:var(--muted);font-weight:700;font-size:13px;border:1px solid var(--border)}
    .step.active{background:var(--primary);color:#fff}
    .booking-content{padding:28px}
    .option-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .option{border:1px solid var(--border);border-radius:22px;padding:18px;background:#fff;cursor:pointer}
    .option.selected{border-color:var(--primary);box-shadow:0 0 0 4px rgba(139,94,60,.12)}
    .form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
    .field{display:flex;flex-direction:column;gap:7px}
    label{font-size:14px;font-weight:700;color:#4d4037}
    input,select,textarea{font-family:inherit;border:1px solid var(--border);border-radius:16px;padding:13px 14px;background:#fff;font-size:15px;color:var(--text)}
    textarea{min-height:100px;resize:vertical}
    .booking-nav{display:flex;justify-content:space-between;gap:12px;margin-top:22px}
    .status-card{display:none;background:#fff;border:1px solid var(--border);border-radius:28px;padding:24px;margin-top:18px}
    .footer{padding:48px 0;background:#34241d;color:#fff}
    .footer .sub{color:rgba(255,255,255,.72)}
    .float-actions{position:fixed;right:18px;bottom:18px;display:flex;flex-direction:column;gap:10px;z-index:110}
    .float-actions a,.float-actions button{border:0;border-radius:999px;padding:12px 16px;background:var(--primary);color:#fff;font-weight:800;box-shadow:0 12px 26px rgba(0,0,0,.18);cursor:pointer}
    .adminbar{display:none;position:fixed;left:16px;bottom:16px;z-index:120;background:#111;color:#fff;border-radius:20px;padding:12px;box-shadow:0 18px 45px rgba(0,0,0,.25)}
    .adminbar button{margin:3px;border:0;border-radius:999px;padding:8px 12px;background:#fff;color:#111;font-family:inherit;font-weight:700}
    .drawer{display:none;position:fixed;right:18px;top:90px;bottom:18px;width:min(420px,92vw);background:#fff;border:1px solid var(--border);border-radius:28px;box-shadow:var(--shadow);z-index:140;overflow:auto;padding:22px}
    .drawer.open{display:block}
    .toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111;color:#fff;padding:12px 18px;border-radius:999px;z-index:200;display:none}
    @media(max-width:900px){
      .nav{display:none;position:absolute;left:0;right:0;top:76px;background:#fff;flex-direction:column;padding:20px;border-bottom:1px solid var(--border)}
      .nav.open{display:flex}.hamb{display:block}
      .hero-grid,.promo,.contact-grid{grid-template-columns:1fr}
      .grid.cards,.features,.review-grid,.option-grid,.form-grid{grid-template-columns:1fr}
      .branch-list{grid-template-columns:1fr}
      .branch-card{grid-template-columns:1fr}
      .gallery-grid{grid-template-columns:repeat(2,1fr)}
      .hero-card .photo{height:380px}
      .section-head{display:block}
    }
  
    /* V5 customer page polish closer to proposal PDF */
    .v5-booking-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
    .v5-summary-box{background:var(--soft);border:1px solid var(--border);border-radius:18px;padding:12px}
    .v5-summary-box b{display:block;color:var(--primary)}
    .v5-trust{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:20px}
    .v5-trust .item{background:#fff;border:1px solid var(--border);border-radius:20px;padding:16px;box-shadow:0 10px 25px rgba(74,50,30,.06)}
    .v5-section-toolbar{display:none;position:absolute;right:18px;top:18px;z-index:5}
    [data-section]{position:relative}
    .adminbar.active ~ .v5-section-toolbar,.admin-only{transition:.2s}
    .payment-choice{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .payment-card{background:#fff;border:1px solid var(--border);border-radius:22px;padding:18px;cursor:pointer}
    .payment-card.selected{border-color:var(--primary);box-shadow:0 0 0 4px rgba(139,94,60,.12)}
    .qr-placeholder{width:240px;height:240px;border-radius:24px;background:repeating-linear-gradient(45deg,#fff,#fff 8px,var(--soft) 8px,var(--soft) 16px);border:1px solid var(--border);display:grid;place-items:center;color:var(--primary);font-weight:900}
    @media(max-width:900px){.v5-booking-summary,.v5-trust,.payment-choice{grid-template-columns:1fr}}

/* V6.1 performance: browser friendly paint */
img{content-visibility:auto}section{content-visibility:auto;contain-intrinsic-size:800px}.hero,.topbar{content-visibility:visible}
