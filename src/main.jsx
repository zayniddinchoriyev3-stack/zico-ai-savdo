import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3, Bot, Boxes, CalendarClock, CheckCircle2, ChevronRight,
  CircleDollarSign, Clapperboard, Facebook, Instagram, LayoutDashboard,
  Package, Plus, Send, Settings, ShoppingCart, Sparkles, Youtube,
  Menu, X, ShieldCheck, Clock3, PlugZap, TrendingUp, FileText
} from "lucide-react";
import "./style.css";

const navItems = [
  { id: "dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
  { id: "products", label: "Mahsulotlar", icon: Package },
  { id: "orders", label: "Buyurtmalar", icon: ShoppingCart },
  { id: "content", label: "AI kontent studiyasi", icon: Clapperboard },
  { id: "publishing", label: "Ijtimoiy tarmoqlar", icon: Send },
  { id: "analytics", label: "Savdo tahlili", icon: BarChart3 },
  { id: "settings", label: "Sozlamalar", icon: Settings },
];

function App() {
  const [active, setActive] = useState("dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [publishMode, setPublishMode] = useState("both");
  const [connected, setConnected] = useState({ instagram: false, facebook: false, youtube: false });
  const [posts, setPosts] = useState([
    { id: 1, title: "Yangi mahsulot taqdimoti", platform: "Instagram", date: "Bugun, 18:30", status: "Tasdiq kutilmoqda" },
    { id: 2, title: "Mahsulot haqida qisqa video", platform: "YouTube", date: "Ertaga, 12:00", status: "Rejalashtirilgan (demo)" },
  ]);
  const [notice, setNotice] = useState("");
  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([
    { id: 1, name: "Simsiz quloqchin", cost: 85000, price: 129000, stock: 18 },
    { id: 2, name: "Telefon g‘ilofi", cost: 18000, price: 35000, stock: 42 },
  ]);
  const [contentTopic, setContentTopic] = useState("Yangi mahsulotni tanishtirish");
  const [generated, setGenerated] = useState(false);

  const money = (n) => new Intl.NumberFormat("uz-UZ").format(n) + " so‘m";
  const totalStock = useMemo(() => products.reduce((s, p) => s + p.stock, 0), [products]);

  function addProduct(e) {
    e.preventDefault();
    if (!productName.trim()) return;
    setProducts([...products, { id: Date.now(), name: productName.trim(), cost: 0, price: 0, stock: 0 }]);
    setProductName("");
    setNotice("Mahsulot demo ro‘yxatiga qo‘shildi.");
  }
  function addDraft() {
    const item = { id: Date.now(), title: contentTopic || "Yangi kontent", platform: "Tanlanmagan", date: "Vaqt belgilanmagan", status: "Qoralama" };
    setPosts([item, ...posts]);
    setGenerated(false);
    setNotice("Kontent qoralamasi ro‘yxatga qo‘shildi.");
  }
  function publishAction(post) {
    const status = publishMode === "approve" ? "Tasdiq kutilmoqda" : publishMode === "auto" ? "Avtomatik nashr navbatida (demo)" : "Tasdiq kutilmoqda / avtomatik navbat (demo)";
    setPosts(posts.map(p => p.id === post.id ? { ...p, status } : p));
    setNotice("Demo holati yangilandi. Haqiqiy nashr uchun platforma API ulanishi kerak.");
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><Sparkles size={23} /></div>
        <div><strong>ZICO AI SAVDO</strong><small>ONLINE BUSINESS HUB</small></div>
        <button className="close-nav" onClick={() => setMobileNav(false)} aria-label="Yopish"><X size={20}/></button>
      </div>
      <div className="workspace"><div className="workspace-avatar">Z</div><div><b>ZICO Workspace</b><small>Demo loyiha</small></div><ChevronRight size={16}/></div>
      <div className="nav-caption">ASOSIY MENYU</div>
      <nav>{navItems.map(item => {
        const Icon = item.icon;
        return <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => {setActive(item.id); setMobileNav(false);}}>
          <Icon size={18}/><span>{item.label}</span>{item.id === "publishing" && <span className="nav-dot"/>}
        </button>;
      })}</nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><div className="upgrade-icon"><Bot size={18}/></div><b>AI yordamchi</b><p>Mahsulot, kontent va savdo bo‘yicha bitta markaz.</p><button onClick={() => setActive("content")}>Kontent yaratish <ChevronRight size={14}/></button></div>
        <div className="profile"><div className="profile-avatar">ZC</div><div><b>Biznes egasi</b><small>Mahalliy profil</small></div><Settings size={17}/></div>
      </div>
    </aside>

    {mobileNav && <div className="scrim" onClick={() => setMobileNav(false)} />}
    <main className="main">
      <header className="topbar">
        <button className="menu-btn" onClick={() => setMobileNav(true)} aria-label="Menyuni ochish"><Menu/></button>
        <div className="breadcrumb">ZICO Workspace <ChevronRight size={15}/> <b>{navItems.find(n => n.id === active)?.label}</b></div>
        <div className="top-actions"><span className="status-pill"><span/> Demo rejim</span><button className="icon-btn" onClick={() => setActive("settings")} aria-label="Sozlamalar"><Settings size={18}/></button><div className="top-avatar">Z</div></div>
      </header>

      {notice && <div className="notice"><CheckCircle2 size={17}/>{notice}<button onClick={() => setNotice("")}><X size={15}/></button></div>}

      {active === "dashboard" && <Dashboard products={products} posts={posts} totalStock={totalStock} money={money} setActive={setActive}/>}
      {active === "products" && <section className="page">
        <PageHeading eyebrow="SAVDO BOSHQARUVI" title="Mahsulotlar" description="Mahsulotlar, tannarx, sotuv narxi va qoldiqni bir joyda kuzating."/>
        <form className="add-product" onSubmit={addProduct}><input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Yangi mahsulot nomi..." aria-label="Mahsulot nomi"/><button className="primary-btn" type="submit"><Plus size={17}/> Mahsulot qo‘shish</button></form>
        <div className="table-card"><div className="table-head"><h3>Mahsulotlar ro‘yxati</h3><span>{products.length} ta mahsulot</span></div><div className="responsive-table"><table><thead><tr><th>Mahsulot</th><th>Tannarx</th><th>Sotuv narxi</th><th>Qoldiq</th><th>Taxminiy foyda/dona</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td><div className="product-cell"><div className="product-icon"><Package size={17}/></div><b>{p.name}</b></div></td><td>{money(p.cost)}</td><td>{money(p.price)}</td><td><span className="stock">{p.stock} dona</span></td><td className="profit">{money(p.price-p.cost)}</td></tr>)}</tbody></table></div></div>
        <p className="hint">Eslatma: bu boshlang‘ich demo. Mahsulotlarni tahrirlash, import va real ombor sinxronizatsiyasi keyingi bosqichda qo‘shiladi.</p>
      </section>}
      {active === "orders" && <section className="page"><PageHeading eyebrow="BUYURTMALAR" title="Buyurtmalar markazi" description="Buyurtmalarni qabul qilish, holatini o‘zgartirish va yetkazib berishni boshqarish."/><div className="empty-state"><div className="empty-icon"><ShoppingCart size={28}/></div><h3>Buyurtmalar moduli tayyorlanmoqda</h3><p>Keyingi bosqichda buyurtma qo‘shish, mijoz ma’lumotlari, to‘lov va yetkazish holatlari kiritiladi.</p><button className="secondary-btn" onClick={() => setNotice("Buyurtmalar moduli keyingi bosqich rejasiga kiritildi.")}>Rejaga kiritilgan</button></div></section>}
      {active === "content" && <section className="page">
        <PageHeading eyebrow="AI CONTENT STUDIO" title="Kontent va video studiyasi" description="Mahsulot yoki kampaniya mavzusidan ijtimoiy tarmoqlar uchun kontent tayyorlash."/>
        <div className="content-layout"><div className="panel content-form"><div className="panel-title"><div className="panel-icon purple"><Sparkles size={19}/></div><div><h3>Kontent g‘oyasi</h3><p>Qisqa ma’lumotdan boshlang</p></div></div><label>Kontent mavzusi</label><textarea value={contentTopic} onChange={e => setContentTopic(e.target.value)} rows={3} placeholder="Masalan: yangi mahsulot chegirmasi"/><label>Format</label><div className="format-options"><button className="format active"><Clapperboard size={17}/> Qisqa video</button><button className="format"><FileText size={17}/> Post matni</button></div><label>Platformalar</label><div className="platform-checks"><span><Instagram size={17}/> Instagram</span><span><Facebook size={17}/> Facebook</span><span><Youtube size={17}/> YouTube</span></div><button className="primary-btn full" onClick={() => setGenerated(true)}><Sparkles size={17}/> AI kontent rejasini tayyorlash</button><p className="hint">Hozircha interfeys demo rejimida; haqiqiy AI generatsiyasi uchun AI xizmat API kaliti ulanadi.</p></div>
        <div className="panel preview-panel"><div className="preview-label"><span className="live-dot"/> NATIJA KO‘RINISHI</div>{generated ? <><div className="generated-badge"><CheckCircle2 size={16}/> Kontent rejasi tayyor (demo)</div><h2>{contentTopic || "Mahsulot taqdimoti"}</h2><p>“Siz izlagan qulaylik endi yanada yaqin! Mahsulotimiz bilan tanishing, batafsil ma’lumot olish uchun bizga yozing.”</p><div className="hashtags">#ZICOSavdo #YangiMahsulot #AqlliSavdo</div><div className="preview-actions"><button className="secondary-btn" onClick={addDraft}>Qoralamaga saqlash</button><button className="primary-btn" onClick={() => setActive("publishing")}>Nashrga o‘tish <ChevronRight size={16}/></button></div></> : <div className="preview-empty"><div className="video-placeholder"><Clapperboard size={36}/><span>VIDEO PREVIEW</span></div><h3>Kontentingiz shu yerda ko‘rinadi</h3><p>Mavzuni kiriting va “AI kontent rejasini tayyorlash” tugmasini bosing.</p></div>}</div></div>
      </section>}
      {active === "publishing" && <section className="page">
        <PageHeading eyebrow="SOCIAL PUBLISHING CENTER" title="Ijtimoiy tarmoqlarda nashr" description="Instagram, Facebook va YouTube kontentini bitta markazdan rejalashtirish."/>
        <div className="integration-notice"><div className="notice-shield"><ShieldCheck size={22}/></div><div><b>Rasmiy ulanish talab qilinadi</b><p>Haqiqiy nashr uchun har bir platformaga ruxsatli hisobni ulash, server va rasmiy API sozlamalari kerak. Quyidagi tugmalar hozircha demo holatini ko‘rsatadi.</p></div></div>
        <div className="platform-grid">
          <PlatformCard name="Instagram" detail="Reels, video va postlar" icon={<Instagram size={23}/>} connected={connected.instagram} onClick={() => {setConnected({...connected, instagram: !connected.instagram});setNotice("Instagram demo ulanish holati o‘zgardi. Bu haqiqiy akkauntni ulamaydi.");}} color="pink"/>
          <PlatformCard name="Facebook" detail="Sahifa postlari va Reels" icon={<Facebook size={23}/>} connected={connected.facebook} onClick={() => {setConnected({...connected, facebook: !connected.facebook});setNotice("Facebook demo ulanish holati o‘zgardi. Bu haqiqiy akkauntni ulamaydi.");}} color="blue"/>
          <PlatformCard name="YouTube" detail="Shorts va video yuklash" icon={<Youtube size={23}/>} connected={connected.youtube} onClick={() => {setConnected({...connected, youtube: !connected.youtube});setNotice("YouTube demo ulanish holati o‘zgardi. Bu haqiqiy akkauntni ulamaydi.");}} color="red"/>
        </div>
        <div className="panel mode-panel"><div className="section-title"><div><h3>Nashr rejimini tanlang</h3><p>Ikki rejim ham loyihaga kiritilgan. Istalgan payt rejimni almashtirish mumkin.</p></div><span className="both-badge"><CheckCircle2 size={15}/> Ikkala rejim yoqilgan</span></div>
          <div className="mode-grid">
            <button className={`mode-card ${publishMode === "approve" ? "selected" : ""}`} onClick={() => setPublishMode("approve")}><div className="mode-top"><div className="mode-icon amber"><ShieldCheck size={21}/></div><span className="radio-mark">{publishMode === "approve" && <span/>}</span></div><h4>Tasdiqlab nashr qilish</h4><p>AI kontentni tayyorlaydi. Siz tekshirib, “Nashr qilish”ni tasdiqlaysiz.</p><div className="mode-tag">Ko‘proq nazorat</div></button>
            <button className={`mode-card ${publishMode === "auto" ? "selected" : ""}`} onClick={() => setPublishMode("auto")}><div className="mode-top"><div className="mode-icon green"><Clock3 size={21}/></div><span className="radio-mark">{publishMode === "auto" && <span/>}</span></div><h4>Avtomatik nashr</h4><p>Oldindan tasdiqlangan jadval bo‘yicha kontent avtomatik navbatga qo‘yiladi.</p><div className="mode-tag">Jadval asosida</div></button>
            <button className={`mode-card ${publishMode === "both" ? "selected" : ""}`} onClick={() => setPublishMode("both")}><div className="mode-top"><div className="mode-icon purple"><CalendarClock size={21}/></div><span className="radio-mark">{publishMode === "both" && <span/>}</span></div><h4>Ikkala rejim</h4><p>Har bir post uchun qo‘lda tasdiqlash yoki avtomatik jadvalni tanlang.</p><div className="mode-tag">Tavsiya etiladi</div></button>
          </div>
          <div className="selected-mode"><div><b>Faol tanlov:</b> {publishMode === "approve" ? "Tasdiqlab nashr qilish" : publishMode === "auto" ? "Avtomatik nashr" : "Ikkala rejim" }<p>Bu tanlov hozircha demo interfeysida saqlanadi.</p></div><button className="primary-btn" onClick={() => setNotice("Nashr rejimi demo interfeysida saqlandi. Haqiqiy avtomatik nashr uchun backend va rasmiy API kerak.")}>Tanlovni saqlash <CheckCircle2 size={16}/></button></div>
        </div>
        <div className="table-card posts-card"><div className="table-head"><div><h3>Kontent nashri navbati</h3><p>Qoralama, tasdiq va rejalashtirilgan kontent</p></div><button className="secondary-btn" onClick={() => setActive("content")}><Plus size={16}/> Kontent yaratish</button></div><div className="responsive-table"><table><thead><tr><th>Kontent</th><th>Platforma</th><th>Vaqt</th><th>Holat</th><th>Amal</th></tr></thead><tbody>{posts.map(post=><tr key={post.id}><td><b>{post.title}</b></td><td>{post.platform}</td><td>{post.date}</td><td><span className={`post-status ${post.status.includes("Tasdiq") ? "waiting" : post.status.includes("navbat") ? "queued" : "draft"}`}>{post.status}</span></td><td><button className="small-action" onClick={() => publishAction(post)}>{publishMode === "approve" ? "Tasdiq holati" : publishMode === "auto" ? "Navbatga qo‘yish" : "Rejimni qo‘llash"}</button></td></tr>)}</tbody></table></div></div>
        <p className="hint"><b>Muhim:</b> “Avtomatik nashr” hozircha interfeysdagi demo. Real avtomatlashtirish uchun backend server, xavfsiz token saqlash, platforma ruxsatlari, media saqlash va nashr jadvali xizmati ulanadi.</p>
      </section>}
      {active === "analytics" && <section className="page"><PageHeading eyebrow="BIZNES ANALITIKA" title="Savdo tahlili" description="Daromad, xarajat, foyda va kontent natijalarini kuzatish uchun markaziy hisobot."/><div className="metric-grid"><Metric title="Jami mahsulotlar" value={products.length} note="Demo katalog" icon={<Boxes/>}/><Metric title="Ombordagi birliklar" value={totalStock} note="Kiritilgan qoldiq" icon={<Package/>}/><Metric title="Kontent rejalari" value={posts.length} note="Nashr navbati" icon={<Clapperboard/>}/><Metric title="Ulangan platformalar" value={Object.values(connected).filter(Boolean).length} note="Demo holat" icon={<PlugZap/>}/></div><div className="panel analytics-placeholder"><TrendingUp size={30}/><h3>Moliyaviy hisobotlar keyingi bosqichda</h3><p>Haqiqiy buyurtmalar va xarajatlar kiritilgach, tushum, sof foyda, reklama xarajati va kontent samaradorligi hisoblanadi.</p></div></section>}
      {active === "settings" && <section className="page"><PageHeading eyebrow="LOYIHA SOZLAMALARI" title="Sozlamalar" description="ZICO AI SAVDO ning dastlabki konfiguratsiyasi."/><div className="settings-grid"><div className="panel"><div className="panel-title"><div className="panel-icon purple"><Bot size={20}/></div><div><h3>AI xizmatlari</h3><p>Matn, video va tahlil generatsiyasi</p></div></div><div className="setting-row"><span>AI provayderi</span><b>Hali ulanmagan</b></div><div className="setting-row"><span>API kaliti</span><b>Sozlanmagan</b></div><p className="hint">API kalitlarini faqat server tomonida saqlash kerak; ularni ochiq frontend kodiga yozmang.</p></div><div className="panel"><div className="panel-title"><div className="panel-icon blue"><PlugZap size={20}/></div><div><h3>Platforma integratsiyalari</h3><p>Ijtimoiy tarmoq hisoblari</p></div></div>{["Instagram","Facebook","YouTube"].map(x=><div className="setting-row" key={x}><span>{x}</span><b className="muted">OAuth/API sozlanmagan</b></div>)}<button className="secondary-btn full" onClick={() => setActive("publishing")}>Nashr markazini ochish <ChevronRight size={16}/></button></div></div></section>}
      <footer className="footer"><span>© 2026 ZICO AI SAVDO</span><span>Biznesni bir joydan boshqarish <span className="footer-dot">•</span> Boshlang‘ich demo</span></footer>
    </main>
  </div>;
}

function PageHeading({ eyebrow, title, description }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><div className="heading-decoration"><Sparkles size={22}/><span>AI POWERED</span></div></div>;
}
function Metric({title, value, note, icon}) {
  return <div className="metric-card"><div className="metric-top"><span>{title}</span><div className="metric-icon">{icon}</div></div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></div>;
}
function Dashboard({products, posts, totalStock, money, setActive}) {
  const value = products.reduce((s,p)=>s+p.price*p.stock,0);
  return <section className="page dashboard-page">
    <div className="welcome-banner"><div className="welcome-copy"><div className="welcome-label"><Sparkles size={14}/> AI BUSINESS PLATFORM</div><h1>Biznesingizni aqlliroq boshqaring.</h1><p>Mahsulotlar, buyurtmalar, kontent va ijtimoiy tarmoqlar — barchasi bitta boshqaruv markazida.</p><button className="welcome-btn" onClick={() => setActive("publishing")}>Nashr markazini ochish <ChevronRight size={16}/></button></div><div className="welcome-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="ai-orb"><Bot size={53}/></div><div className="floating-card float-one"><TrendingUp size={16}/> <span>AI insights</span></div><div className="floating-card float-two"><Clapperboard size={16}/> <span>Social studio</span></div></div></div>
    <div className="section-title dashboard-title"><div><h2>Biznes ko‘rsatkichlari</h2><p>Demo ma’lumotlar asosidagi umumiy ko‘rinish</p></div><span className="date-label">Bugungi holat</span></div>
    <div className="metric-grid"><Metric title="Mahsulotlar" value={products.length} note="Katalogdagi mahsulot" icon={<Package/>}/><Metric title="Ombor qiymati" value={money(value)} note={`${totalStock} dona mahsulot`} icon={<CircleDollarSign/>}/><Metric title="Kontent navbati" value={posts.length} note="Qoralama va reja" icon={<Clapperboard/>}/><Metric title="Buyurtmalar" value="—" note="Modul hali ulanmagan" icon={<ShoppingCart/>}/></div>
    <div className="dashboard-lower"><div className="panel quick-panel"><div className="section-title"><div><h3>Tezkor amallar</h3><p>Kerakli bo‘limga tez o‘ting</p></div></div><div className="quick-actions"><button onClick={() => setActive("products")}><div className="quick-icon blue"><Plus size={19}/></div><span><b>Mahsulot qo‘shish</b><small>Katalogni yangilash</small></span><ChevronRight size={17}/></button><button onClick={() => setActive("content")}><div className="quick-icon purple"><Sparkles size={19}/></div><span><b>AI kontent yaratish</b><small>Post va video g‘oyasi</small></span><ChevronRight size={17}/></button><button onClick={() => setActive("publishing")}><div className="quick-icon green"><Send size={19}/></div><span><b>Ijtimoiy tarmoqlarda nashr</b><small>Tasdiq yoki avtomatik rejim</small></span><ChevronRight size={17}/></button></div></div>
    <div className="panel queue-panel"><div className="section-title"><div><h3>Oxirgi kontentlar</h3><p>Nashr navbatidan</p></div><button className="text-btn" onClick={() => setActive("publishing")}>Barchasi <ChevronRight size={14}/></button></div>{posts.slice(0,3).map(p=><div className="queue-row" key={p.id}><div className="queue-icon"><Clapperboard size={17}/></div><div className="queue-info"><b>{p.title}</b><small>{p.platform} · {p.date}</small></div><span className="queue-state">{p.status}</span></div>)}</div></div>
  </section>;
}
function PlatformCard({name, detail, icon, connected, onClick, color}) {
  return <div className="platform-card"><div className={`platform-icon ${color}`}>{icon}</div><div className="platform-info"><h3>{name}</h3><p>{detail}</p></div><span className={`connection ${connected ? "connected" : ""}`}><span/>{connected ? "Demo ulangan" : "Ulanmagan"}</span><button className={connected ? "disconnect-btn" : "connect-btn"} onClick={onClick}>{connected ? "Uzish" : "Ulash"}</button></div>;
}

createRoot(document.getElementById("root")).render(<App />);
