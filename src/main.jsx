
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3, Bot, Boxes, CalendarClock, CheckCircle2, ChevronRight,
  CircleDollarSign, Clapperboard, Facebook, Instagram, LayoutDashboard,
  Package, Plus, Send, Settings, ShoppingCart, Sparkles, Youtube,
  Menu, X, ShieldCheck, Clock3, PlugZap, TrendingUp, FileText, LogOut,
  Trash2
} from "lucide-react";
import { supabase } from "./lib/supabase.js";
import {
  getProducts,
  addProduct as saveProduct,
  deleteProduct as removeProduct
} from "./lib/products.js";
import "./style.css";

const navItems = [
  { id: "dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
  { id: "products", label: "Mahsulotlar", icon: Package },
  { id: "orders", label: "Buyurtmalar", icon: ShoppingCart },
  { id: "content", label: "AI kontent studiyasi", icon: Clapperboard },
  { id: "publishing", label: "Ijtimoiy tarmoqlar", icon: Send },
  { id: "analytics", label: "Savdo tahlili", icon: BarChart3 },
  { id: "settings", label: "Sozlamalar", icon: Settings }
];

function AuthGate() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setMessage(error.message);
        setSession(data?.session ?? null);
        setLoading(false);
      })
      .catch(error => {
        if (!alive) return;
        setMessage(error.message || "Sessiyani tekshirib bo‘lmadi.");
        setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password
        });

        if (error) throw error;

        if (data.session) {
          setMessage("Ro‘yxatdan o‘tish muvaffaqiyatli.");
        } else {
          setMode("login");
          setMessage(
            "Akkaunt yaratildi. Emailingizni tasdiqlang, so‘ng tizimga kiring."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message || "Xatolik yuz berdi.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="auth-screen">
        <div className="auth-card">ZICO AI SAVDO yuklanmoqda...</div>
      </div>
    );
  }

  if (session) {
    return (
      <DashboardApp
        key={session.user.id}
        user={session.user}
        onLogout={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) setMessage(error.message);
        }}
      />
    );
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <Sparkles size={24} />
        </div>

        <h1>ZICO AI SAVDO</h1>
        <p>
          {mode === "login"
            ? "Akkauntingizga kiring"
            : "Yangi akkaunt yarating"}
        </p>

        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email@example.com"
        />

        <label htmlFor="auth-password">Parol</label>
        <input
          id="auth-password"
          type="password"
          autoComplete={
            mode === "login" ? "current-password" : "new-password"
          }
          required
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Kamida 6 ta belgi"
        />

        {message && (
          <p className="auth-message" role="status">{message}</p>
        )}

        <button className="primary-btn full" type="submit" disabled={busy}>
          {busy
            ? "Kutilmoqda..."
            : mode === "login"
              ? "Tizimga kirish"
              : "Ro‘yxatdan o‘tish"}
        </button>

        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setMessage("");
          }}
        >
          {mode === "login"
            ? "Akkauntingiz yo‘qmi? Ro‘yxatdan o‘ting"
            : "Akkauntingiz bormi? Tizimga kiring"}
        </button>
      </form>
    </div>
  );
}

function DashboardApp({ user, onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [contentTopic, setContentTopic] = useState(
    "Yangi mahsulotni tanishtirish"
  );
  const [generated, setGenerated] = useState(false);
  const [publishMode, setPublishMode] = useState("both");
  const [connected, setConnected] = useState({
    instagram: false,
    facebook: false,
    youtube: false
  });
  const [posts, setPosts] = useState([
    {
      id: "demo-1",
      title: "Yangi mahsulot taqdimoti",
      platform: "Instagram",
      date: "Bugun, 18:30",
      status: "Tasdiq kutilmoqda"
    },
    {
      id: "demo-2",
      title: "Mahsulot haqida qisqa video",
      platform: "YouTube",
      date: "Ertaga, 12:00",
      status: "Rejalashtirilgan (demo)"
    }
  ]);

  const money = n =>
    new Intl.NumberFormat("uz-UZ").format(Number(n) || 0) + " so‘m";

  const totalStock = useMemo(
    () => products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0),
    [products]
  );

  async function loadProducts() {
    setProductsLoading(true);

    try {
      const data = await getProducts();

      setProducts((data || []).map(p => ({
        ...p,
        cost: Number(p.cost) || 0,
        price: Number(p.price) || 0,
        stock: Number(p.stock) || 0
      })));
    } catch (error) {
      setNotice("Mahsulotlarni yuklashda xatolik: " + error.message);
    } finally {
      setProductsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function addProduct(e) {
    e.preventDefault();

    if (!productName.trim()) {
      setNotice("Mahsulot nomini kiriting.");
      return;
    }

    setSavingProduct(true);

    try {
      const saved = await saveProduct({
        name: productName.trim(),
        description: "",
        price: Number(productPrice) || 0,
        stock: Number(productStock) || 0
      });

      setProducts(previous => [
        {
          ...saved,
          cost: Number(saved.cost) || 0,
          price: Number(saved.price) || 0,
          stock: Number(saved.stock) || 0
        },
        ...previous
      ]);

      setProductName("");
      setProductPrice("");
      setProductStock("");
      setNotice("Mahsulot bazaga saqlandi.");
    } catch (error) {
      setNotice("Saqlashda xatolik: " + error.message);
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleDeleteProduct(product) {
    if (!window.confirm(`“${product.name}” o‘chirilsinmi?`)) return;

    try {
      await removeProduct(product.id);
      setProducts(previous => previous.filter(p => p.id !== product.id));
      setNotice("Mahsulot bazadan o‘chirildi.");
    } catch (error) {
      setNotice("O‘chirishda xatolik: " + error.message);
    }
  }

  function addDraft() {
    setPosts(previous => [
      {
        id: `draft-${Date.now()}`,
        title: contentTopic || "Yangi kontent",
        platform: "Tanlanmagan",
        date: "Vaqt belgilanmagan",
        status: "Qoralama"
      },
      ...previous
    ]);
    setGenerated(false);
    setNotice("Qoralama demo ro‘yxatiga qo‘shildi.");
  }

  function publishAction(post) {
    const status =
      publishMode === "approve"
        ? "Tasdiq kutilmoqda"
        : publishMode === "auto"
          ? "Avtomatik nashr navbatida (demo)"
          : "Tasdiq kutilmoqda / avtomatik navbat (demo)";

    setPosts(previous =>
      previous.map(p => p.id === post.id ? { ...p, status } : p)
    );

    setNotice("Demo holati yangilandi. Haqiqiy nashr uchun API kerak.");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={23} /></div>
          <div>
            <strong>ZICO AI SAVDO</strong>
            <small>ONLINE BUSINESS HUB</small>
          </div>
          <button
            className="close-nav"
            onClick={() => setMobileNav(false)}
            aria-label="Yopish"
          >
            <X size={20} />
          </button>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">Z</div>
          <div>
            <b>ZICO Workspace</b>
            <small>{user.email}</small>
          </div>
          <ChevronRight size={16} />
        </div>

        <div className="nav-caption">ASOSIY MENYU</div>
        <nav>
          {navItems.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${active === item.id ? "active" : ""}`}
                onClick={() => {
                  setActive(item.id);
                  setMobileNav(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.id === "publishing" && <span className="nav-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Bot size={18} /></div>
            <b>AI yordamchi</b>
            <p>Mahsulot, kontent va savdo bo‘yicha bitta markaz.</p>
            <button onClick={() => setActive("content")}>
              Kontent yaratish <ChevronRight size={14} />
            </button>
          </div>
          <div className="profile">
            <div className="profile-avatar">ZC</div>
            <div>
              <b>Biznes egasi</b>
              <small>Akkaunt faol</small>
            </div>
            <button className="logout-mini" onClick={onLogout} title="Chiqish">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {mobileNav && (
        <div className="scrim" onClick={() => setMobileNav(false)} />
      )}

      <main className="main">
        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() => setMobileNav(true)}
            aria-label="Menyuni ochish"
          >
            <Menu />
          </button>

          <div className="breadcrumb">
            ZICO Workspace <ChevronRight size={15} />
            <b>{navItems.find(n => n.id === active)?.label}</b>
          </div>

          <div className="top-actions">
            <span className="status-pill"><span /> Akkaunt ulangan</span>
            <button
              className="icon-btn"
              onClick={() => setActive("settings")}
              aria-label="Sozlamalar"
            >
              <Settings size={18} />
            </button>
            <button
              className="icon-btn"
              onClick={onLogout}
              aria-label="Tizimdan chiqish"
              title="Tizimdan chiqish"
            >
              <LogOut size={18} />
            </button>
            <div className="top-avatar">Z</div>
          </div>
        </header>

        {notice && (
          <div className="notice">
            <CheckCircle2 size={17} />
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Xabarni yopish">
              <X size={15} />
            </button>
          </div>
        )}

        {active === "dashboard" && (
          <Dashboard
            products={products}
            posts={posts}
            totalStock={totalStock}
            money={money}
            setActive={setActive}
          />
        )}

        {active === "products" && (
          <section className="page">
            <PageHeading
              eyebrow="SAVDO BOSHQARUVI"
              title="Mahsulotlar"
              description="Mahsulotlarni bazada saqlang, narx va ombor qoldig‘ini kuzating."
            />

            <form className="add-product" onSubmit={addProduct}>
              <input
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="Mahsulot nomi..."
                aria-label="Mahsulot nomi"
                required
              />
              <input
                value={productPrice}
                onChange={e => setProductPrice(e.target.value)}
                placeholder="Sotuv narxi (so‘m)"
                aria-label="Sotuv narxi"
                type="number"
                min="0"
              />
              <input
                value={productStock}
                onChange={e => setProductStock(e.target.value)}
                placeholder="Qoldiq (dona)"
                aria-label="Qoldiq"
                type="number"
                min="0"
              />
              <button className="primary-btn" type="submit" disabled={savingProduct}>
                <Plus size={17} />
                {savingProduct ? "Saqlanmoqda..." : "Mahsulot qo‘shish"}
              </button>
            </form>

            <div className="table-card">
              <div className="table-head">
                <h3>Mahsulotlar ro‘yxati</h3>
                <span>{products.length} ta mahsulot</span>
              </div>

              {productsLoading ? (
                <p className="hint">Mahsulotlar yuklanmoqda...</p>
              ) : (
                <div className="responsive-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Mahsulot</th>
                        <th>Tannarx</th>
                        <th>Sotuv narxi</th>
                        <th>Qoldiq</th>
                        <th>Taxminiy foyda/dona</th>
                        <th>Amal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="6">
                            Hozircha mahsulot yo‘q. Yuqoridagi shakl orqali qo‘shing.
                          </td>
                        </tr>
                      ) : products.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="product-cell">
                              <div className="product-icon"><Package size={17} /></div>
                              <b>{p.name}</b>
                            </div>
                          </td>
                          <td>{money(p.cost)}</td>
                          <td>{money(p.price)}</td>
                          <td><span className="stock">{p.stock} dona</span></td>
                          <td className="profit">{money(p.price - p.cost)}</td>
                          <td>
                            <button
                              type="button"
                              className="small-action"
                              onClick={() => handleDeleteProduct(p)}
                              title="O‘chirish"
                            >
                              <Trash2 size={15} /> O‘chirish
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <p className="hint">
              Mahsulotlar sizning akkauntingizga tegishli tarzda saqlanadi.
              Tannarx ustuni bazada bo‘lmasa, 0 so‘m ko‘rsatiladi.
            </p>
          </section>
        )}

        {active === "orders" && (
          <section className="page">
            <PageHeading
              eyebrow="BUYURTMALAR"
              title="Buyurtmalar markazi"
              description="Buyurtmalar, mijozlar, to‘lov va yetkazib berishni boshqarish."
            />
            <div className="empty-state">
              <div className="empty-icon"><ShoppingCart size={28} /></div>
              <h3>Buyurtmalar moduli tayyorlanmoqda</h3>
              <p>Buyurtmalar bazasi keyingi bosqichda ulanadi.</p>
              <button
                className="secondary-btn"
                onClick={() => setNotice("Buyurtmalar moduli keyingi bosqichga qoldirildi.")}
              >
                Rejaga kiritilgan
              </button>
            </div>
          </section>
        )}

        {active === "content" && (
          <section className="page">
            <PageHeading
              eyebrow="AI CONTENT STUDIO"
              title="Kontent va video studiyasi"
              description="Mahsulot yoki kampaniya mavzusidan kontent rejasini tayyorlash."
            />
            <div className="content-layout">
              <div className="panel content-form">
                <div className="panel-title">
                  <div className="panel-icon purple"><Sparkles size={19} /></div>
                  <div>
                    <h3>Kontent g‘oyasi</h3>
                    <p>Qisqa ma’lumotdan boshlang</p>
                  </div>
                </div>

                <label>Kontent mavzusi</label>
                <textarea
                  value={contentTopic}
                  onChange={e => setContentTopic(e.target.value)}
                  rows={3}
                  placeholder="Masalan: yangi mahsulot chegirmasi"
                />

                <label>Format</label>
                <div className="format-options">
                  <button type="button" className="format active">
                    <Clapperboard size={17} /> Qisqa video
                  </button>
                  <button type="button" className="format">
                    <FileText size={17} /> Post matni
                  </button>
                </div>

                <label>Platformalar</label>
                <div className="platform-checks">
                  <span><Instagram size={17} /> Instagram</span>
                  <span><Facebook size={17} /> Facebook</span>
                  <span><Youtube size={17} /> YouTube</span>
                </div>

                <button
                  className="primary-btn full"
                  onClick={() => setGenerated(true)}
                >
                  <Sparkles size={17} /> AI kontent rejasini tayyorlash
                </button>
                <p className="hint">
                  Hozircha demo. Haqiqiy AI generatsiyasi uchun AI API ulanishi kerak.
                </p>
              </div>

              <div className="panel preview-panel">
                <div className="preview-label">
                  <span className="live-dot" /> NATIJA KO‘RINISHI
                </div>
                {generated ? (
                  <>
                    <div className="generated-badge">
                      <CheckCircle2 size={16} /> Kontent rejasi tayyor (demo)
                    </div>
                    <h2>{contentTopic || "Mahsulot taqdimoti"}</h2>
                    <p>
                      “Siz izlagan qulaylik endi yanada yaqin! Mahsulotimiz
                      bilan tanishing, batafsil ma’lumot olish uchun bizga yozing.”
                    </p>
                    <div className="hashtags">
                      #ZICOSavdo #YangiMahsulot #AqlliSavdo
                    </div>
                    <div className="preview-actions">
                      <button className="secondary-btn" onClick={addDraft}>
                        Qoralamaga saqlash
                      </button>
                      <button
                        className="primary-btn"
                        onClick={() => setActive("publishing")}
                      >
                        Nashrga o‘tish <ChevronRight size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="preview-empty">
                    <div className="video-placeholder">
                      <Clapperboard size={36} />
                      <span>VIDEO PREVIEW</span>
                    </div>
                    <h3>Kontentingiz shu yerda ko‘rinadi</h3>
                    <p>Mavzuni kiriting va kontent rejasini tayyorlash tugmasini bosing.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {active === "publishing" && (
          <section className="page">
            <PageHeading
              eyebrow="SOCIAL PUBLISHING CENTER"
              title="Ijtimoiy tarmoqlarda nashr"
              description="Instagram, Facebook va YouTube kontentini rejalashtirish."
            />

            <div className="integration-notice">
              <div className="notice-shield"><ShieldCheck size={22} /></div>
              <div>
                <b>Rasmiy ulanish talab qilinadi</b>
                <p>
                  Haqiqiy nashr uchun platforma ruxsatlari, backend va rasmiy API kerak.
                  Quyidagi tugmalar faqat demo holatini ko‘rsatadi.
                </p>
              </div>
            </div>

            <div className="platform-grid">
              <PlatformCard
                name="Instagram"
                detail="Reels, video va postlar"
                icon={<Instagram size={23} />}
                connected={connected.instagram}
                color="pink"
                onClick={() => {
                  setConnected(v => ({ ...v, instagram: !v.instagram }));
                  setNotice("Instagram demo holati o‘zgardi. Haqiqiy akkaunt ulanmagan.");
                }}
              />
              <PlatformCard
                name="Facebook"
                detail="Sahifa postlari va Reels"
                icon={<Facebook size={23} />}
                connected={connected.facebook}
                color="blue"
                onClick={() => {
                  setConnected(v => ({ ...v, facebook: !v.facebook }));
                  setNotice("Facebook demo holati o‘zgardi. Haqiqiy akkaunt ulanmagan.");
                }}
              />
              <PlatformCard
                name="YouTube"
                detail="Shorts va video yuklash"
                icon={<Youtube size={23} />}
                connected={connected.youtube}
                color="red"
                onClick={() => {
                  setConnected(v => ({ ...v, youtube: !v.youtube }));
                  setNotice("YouTube demo holati o‘zgardi. Haqiqiy akkaunt ulanmagan.");
                }}
              />
            </div>

            <div className="panel mode-panel">
              <div className="section-title">
                <div>
                  <h3>Nashr rejimini tanlang</h3>
                  <p>Bu tanlov hozircha demo interfeysida ishlaydi.</p>
                </div>
                <span className="both-badge">
                  <CheckCircle2 size={15} /> Demo rejim
                </span>
              </div>

              <div className="mode-grid">
                {[
                  {
                    id: "approve",
                    title: "Tasdiqlab nashr qilish",
                    desc: "Kontentni tekshirib, qo‘lda tasdiqlash.",
                    icon: <ShieldCheck size={21} />,
                    color: "amber",
                    tag: "Ko‘proq nazorat"
                  },
                  {
                    id: "auto",
                    title: "Avtomatik nashr",
                    desc: "Kontentni jadval bo‘yicha navbatga qo‘yish.",
                    icon: <Clock3 size={21} />,
                    color: "green",
                    tag: "Jadval asosida"
                  },
                  {
                    id: "both",
                    title: "Ikkala rejim",
                    desc: "Har bir post uchun kerakli rejimni tanlash.",
                    icon: <CalendarClock size={21} />,
                    color: "purple",
                    tag: "Tavsiya etiladi"
                  }
                ].map(item => (
                  <button
                    key={item.id}
                    className={`mode-card ${publishMode === item.id ? "selected" : ""}`}
                    onClick={() => setPublishMode(item.id)}
                  >
                    <div className="mode-top">
                      <div className={`mode-icon ${item.color}`}>{item.icon}</div>
                      <span className="radio-mark">
                        {publishMode === item.id && <span />}
                      </span>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                    <div className="mode-tag">{item.tag}</div>
                  </button>
                ))}
              </div>

              <div className="selected-mode">
                <div>
                  <b>Faol tanlov:</b>{" "}
                  {publishMode === "approve"
                    ? "Tasdiqlab nashr qilish"
                    : publishMode === "auto"
                      ? "Avtomatik nashr"
                      : "Ikkala rejim"}
                  <p>Hozircha demo tanlovi.</p>
                </div>
                <button
                  className="primary-btn"
                  onClick={() => setNotice("Nashr rejimi demo interfeysida saqlandi.")}
                >
                  Tanlovni saqlash <CheckCircle2 size={16} />
                </button>
              </div>
            </div>

            <div className="table-card posts-card">
              <div className="table-head">
                <div>
                  <h3>Kontent nashri navbati</h3>
                  <p>Qoralama, tasdiq va rejalashtirilgan kontent</p>
                </div>
                <button className="secondary-btn" onClick={() => setActive("content")}>
                  <Plus size={16} /> Kontent yaratish
                </button>
              </div>
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>Kontent</th><th>Platforma</th><th>Vaqt</th>
                      <th>Holat</th><th>Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post.id}>
                        <td><b>{post.title}</b></td>
                        <td>{post.platform}</td>
                        <td>{post.date}</td>
                        <td>
                          <span className={`post-status ${
                            post.status.includes("Tasdiq")
                              ? "waiting"
                              : post.status.includes("navbat")
                                ? "queued"
                                : "draft"
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td>
                          <button className="small-action" onClick={() => publishAction(post)}>
                            {publishMode === "approve"
                              ? "Tasdiq holati"
                              : publishMode === "auto"
                                ? "Navbatga qo‘yish"
                                : "Rejimni qo‘llash"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="hint">
              Haqiqiy avtomatik nashr uchun backend, xavfsiz tokenlar va platforma API ruxsatlari kerak.
            </p>
          </section>
        )}

        {active === "analytics" && (
          <section className="page">
            <PageHeading
              eyebrow="BIZNES ANALITIKA"
              title="Savdo tahlili"
              description="Daromad, ombor va kontent ko‘rsatkichlarini kuzatish."
            />
            <div className="metric-grid">
              <Metric title="Jami mahsulotlar" value={products.length} note="Bazadagi katalog" icon={<Boxes />} />
              <Metric title="Ombordagi birliklar" value={totalStock} note="Kiritilgan qoldiq" icon={<Package />} />
              <Metric title="Kontent rejalari" value={posts.length} note="Demo nashr navbati" icon={<Clapperboard />} />
              <Metric title="Ulangan platformalar" value={Object.values(connected).filter(Boolean).length} note="Demo holat" icon={<PlugZap />} />
            </div>
            <div className="panel analytics-placeholder">
              <TrendingUp size={30} />
              <h3>Moliyaviy hisobotlar keyingi bosqichda</h3>
              <p>Haqiqiy buyurtmalar va xarajatlar kiritilgach, tushum va sof foyda hisoblanadi.</p>
            </div>
          </section>
        )}

        {active === "settings" && (
          <section className="page">
            <PageHeading
              eyebrow="LOYIHA SOZLAMALARI"
              title="Sozlamalar"
              description="ZICO AI SAVDO dastlabki konfiguratsiyasi."
            />
            <div className="settings-grid">
              <div className="panel">
                <div className="panel-title">
                  <div className="panel-icon purple"><Bot size={20} /></div>
                  <div><h3>AI xizmatlari</h3><p>Matn, video va tahlil generatsiyasi</p></div>
                </div>
                <div className="setting-row"><span>AI provayderi</span><b>Hali ulanmagan</b></div>
                <div className="setting-row"><span>API kaliti</span><b>Sozlanmagan</b></div>
                <p className="hint">API kalitlarini frontend kodida saqlamang.</p>
              </div>

              <div className="panel">
                <div className="panel-title">
                  <div className="panel-icon blue"><PlugZap size={20} /></div>
                  <div><h3>Platforma integratsiyalari</h3><p>Ijtimoiy tarmoq hisoblari</p></div>
                </div>
                {["Instagram", "Facebook", "YouTube"].map(name => (
                  <div className="setting-row" key={name}>
                    <span>{name}</span><b className="muted">OAuth/API sozlanmagan</b>
                  </div>
                ))}
                <button className="secondary-btn full" onClick={() => setActive("publishing")}>
                  Nashr markazini ochish <ChevronRight size={16} />
                </button>
                <button className="secondary-btn full" onClick={onLogout} style={{ marginTop: 10 }}>
                  <LogOut size={16} /> Tizimdan chiqish
                </button>
              </div>
            </div>
          </section>
        )}

        <footer className="footer">
          <span>© 2026 ZICO AI SAVDO</span>
          <span>
            Biznesni bir joydan boshqarish <span className="footer-dot">•</span> Mahsulotlar bazasi
          </span>
        </footer>
      </main>
    </div>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="heading-decoration">
        <Sparkles size={22} /><span>AI POWERED</span>
      </div>
    </div>
  );
}

function Metric({ title, value, note, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <div className="metric-icon">{icon}</div>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-note">{note}</div>
    </div>
  );
}

function Dashboard({ products, posts, totalStock, money, setActive }) {
  const value = products.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0),
    0
  );

  return (
    <section className="page dashboard-page">
      <div className="welcome-banner">
        <div className="welcome-copy">
          <div className="welcome-label"><Sparkles size={14} /> AI BUSINESS PLATFORM</div>
          <h1>Biznesingizni aqlliroq boshqaring.</h1>
          <p>Mahsulotlar, buyurtmalar, kontent va ijtimoiy tarmoqlar — barchasi bitta markazda.</p>
          <button className="welcome-btn" onClick={() => setActive("publishing")}>
            Nashr markazini ochish <ChevronRight size={16} />
          </button>
        </div>
        <div className="welcome-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="ai-orb"><Bot size={53} /></div>
          <div className="floating-card float-one"><TrendingUp size={16} /><span>AI insights</span></div>
          <div className="floating-card float-two"><Clapperboard size={16} /><span>Social studio</span></div>
        </div>
      </div>

      <div className="section-title dashboard-title">
        <div><h2>Biznes ko‘rsatkichlari</h2><p>Bazadagi mahsulotlar va demo kontentlar</p></div>
        <span className="date-label">Bugungi holat</span>
      </div>

      <div className="metric-grid">
        <Metric title="Mahsulotlar" value={products.length} note="Bazadagi mahsulotlar" icon={<Package />} />
        <Metric title="Ombor qiymati" value={money(value)} note={`${totalStock} dona mahsulot`} icon={<CircleDollarSign />} />
        <Metric title="Kontent navbati" value={posts.length} note="Demo qoralama va reja" icon={<Clapperboard />} />
        <Metric title="Buyurtmalar" value="—" note="Modul hali ulanmagan" icon={<ShoppingCart />} />
      </div>

      <div className="dashboard-lower">
        <div className="panel quick-panel">
          <div className="section-title">
            <div><h3>Tezkor amallar</h3><p>Kerakli bo‘limga tez o‘ting</p></div>
          </div>
          <div className="quick-actions">
            <button onClick={() => setActive("products")}>
              <div className="quick-icon blue"><Plus size={19} /></div>
              <span><b>Mahsulot qo‘shish</b><small>Katalogni yangilash</small></span>
              <ChevronRight size={17} />
            </button>
            <button onClick={() => setActive("content")}>
              <div className="quick-icon purple"><Sparkles size={19} /></div>
              <span><b>AI kontent yaratish</b><small>Post va video g‘oyasi</small></span>
              <ChevronRight size={17} />
            </button>
            <button onClick={() => setActive("publishing")}>
              <div className="quick-icon green"><Send size={19} /></div>
              <span><b>Ijtimoiy tarmoqlarda nashr</b><small>Tasdiq yoki avtomatik rejim</small></span>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div className="panel queue-panel">
          <div className="section-title">
            <div><h3>Oxirgi kontentlar</h3><p>Nashr navbatidan</p></div>
            <button className="text-btn" onClick={() => setActive("publishing")}>
              Barchasi <ChevronRight size={14} />
            </button>
          </div>
          {posts.slice(0, 3).map(p => (
            <div className="queue-row" key={p.id}>
              <div className="queue-icon"><Clapperboard size={17} /></div>
              <div className="queue-info">
                <b>{p.title}</b>
                <small>{p.platform} · {p.date}</small>
              </div>
              <span className="queue-state">{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformCard({ name, detail, icon, connected, onClick, color }) {
  return (
    <div className="platform-card">
      <div className={`platform-icon ${color}`}>{icon}</div>
      <div className="platform-info"><h3>{name}</h3><p>{detail}</p></div>
      <span className={`connection ${connected ? "connected" : ""}`}>
        <span />{connected ? "Demo ulangan" : "Ulanmagan"}
      </span>
      <button className={connected ? "disconnect-btn" : "connect-btn"} onClick={onClick}>
        {connected ? "Uzish" : "Ulash"}
      </button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<AuthGate />);
