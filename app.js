/* ========= FM AFRO — App JS  ========= */

/* Add real stream URL later (mp3 / hls). Example: "https://yourstream.com/live.mp3" */
const STREAM_URL = "https://zenoplay.zenomedia.com/s/W5tELO";

/* =========================
   DATA SETS
========================= */
const upcomingEvents = [
  {
    title: "Anna Joyce",
    desc: "Diálogo sobre carreira, cultura e o futuro da música angolana.",
    date: "3 Abril 2026",
    image: "assets/Anna%20Joyce.webp",
  },
  {
    title: "Bonga",
    desc: "Conversa sobre música, identidade e trajetória artística.",
    date: "18 Maio 2026",
    image: "assets/Bonga.jpg",
  },
  {
    title: "Conversa Especial com Artista Angolano",
    desc: "Uma conversa íntima sobre carreira, inspiração e identidade cultural.",
    date: "3 Abril 2026",
    image: "assets/event-1.jpg",
  },
];

const pastEvents = [
  {
    title: "Convidado: Paulo Flores",
    date: "Novembro 2025",
    image: "assets/paulo-flores.jpg",
  },
  {
    title: "Convidado: Carlos Burity",
    date: "Agosto 2025",
    image: "assets/Carlos-burity.jpg",
  },
];

const programs = [
  { name: "Afro Morning", type: "Música", time: "Seg–Sex • 07:00–10:00", desc: "Começa o dia com afro vibes, novidades e energia." },
  { name: "Vozes da Comunidade", type: "Conversa", time: "Qua • 18:00–19:00", desc: "Conversas com jovens, criadores e líderes comunitários." },
  { name: "Cultura em Foco", type: "Cultura", time: "Sáb • 15:00–16:30", desc: "Arte, história, moda e identidade afro em destaque." },
  { name: "Afro Charts", type: "Música", time: "Dom • 17:00–18:30", desc: "Os hits mais pedidos e os sons que estão a dominar." },
  { name: "Entrevistas FM Afro", type: "Conversa", time: "Sex • 20:00–21:00", desc: "Artistas, produtores e personalidades em entrevista." },
  { name: "Noite Afro", type: "Música", time: "Seg–Dom • 22:00–00:00", desc: "Set noturno com sons afro, R&B e fusões modernas." },
];

const news = [
  { category:"FM Afro", title:"Novo programa estreia na FM Afro", date:"10 Março 2025", excerpt:"A FM Afro lança um novo programa semanal dedicado à música e cultura africana.", image:"assets/news-1.jpg", featured:true },
  { category:"Artistas", title:"Artistas angolanos ganham mais espaço na rádio", date:"10 Março 2025", excerpt:"Mais talento local e mais visibilidade para vozes emergentes.", image:"assets/news-2.jpg", featured:true },
  { category:"Comunidade", title:"FM Afro reforça ligação com a comunidade", date:"5 Março 2025", excerpt:"Iniciativas culturais e conversas que aproximam a música da comunidade.", image:"assets/news-3.jpg", featured:true },
  { category:"Música", title:"Novo talento angolano em destaque na FM Afro", date:"12 Março 2025", excerpt:"A FM Afro continua a apoiar artistas emergentes que representam a nova geração.", image:"assets/news-4.jpg" },
  { category:"Cultura", title:"Cultura afro ganha mais espaço na programação", date:"8 Março 2025", excerpt:"Novos conteúdos reforçam a identidade e diversidade cultural.", image:"assets/news-5.jpg" },
  { category:"FM Afro", title:"FM Afro participa em iniciativas culturais", date:"2 Março 2025", excerpt:"A rádio marca presença em ações que unem música, comunidade e impacto social.", image:"assets/news-6.jpg" },
];

/* =========================
   HELPERS
========================= */
const qs = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];

const escapeHtml = (str) => String(str ?? "")
  .replaceAll("&","&amp;")
  .replaceAll("<","&lt;")
  .replaceAll(">","&gt;")
  .replaceAll('"',"&quot;")
  .replaceAll("'","&#039;");

  // Normalizes strings 
function norm(str){
  return String(str ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); 
}


/* =========================
   BASIC UI
========================= */
function setYear(){
  const el = qs("#year");
  if(el) el.textContent = new Date().getFullYear();
}

function setActiveNav(){
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  qsa(".nav-link").forEach(a=>{
    const href = (a.getAttribute("href")||"").toLowerCase();
    if(href === file) a.classList.add("active");
  });
}

function setupBurger(){
  const burger = qs("[data-burger]");
  const mobile = qs("[data-mobile-nav]");
  if(!burger || !mobile) return;

  burger.addEventListener("click", ()=>{
    mobile.classList.toggle("open");
    burger.setAttribute("aria-expanded", mobile.classList.contains("open") ? "true" : "false");
  });

  qsa("a", mobile).forEach(a=> a.addEventListener("click", ()=>{
    mobile.classList.remove("open");
    burger.setAttribute("aria-expanded","false");
  }));
}

/* =========================
   MODAL (single source of truth)
========================= */
function setupModal(){
  const modal = qs("[data-modal]");
  const close = qs("[data-modal-close]");
  const body = qs("[data-modal-body]");
  if(!modal || !close || !body) return;

  function open(html){
    body.innerHTML = html;
    modal.setAttribute("aria-hidden","false");
  }
  function hide(){
    modal.setAttribute("aria-hidden","true");
    body.innerHTML = ""; // stops YouTube playback
  }

  close.addEventListener("click", hide);
  modal.addEventListener("click", (e)=>{ if(e.target === modal) hide(); });
  document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") hide(); });

  window.__fmOpenModal = open;
  window.__fmCloseModal = hide;
}

function setupModalOpens(){
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-open]");
    if(!btn || !window.__fmOpenModal) return;

    const title = btn.dataset.title || "";
    const desc  = btn.dataset.desc  || "";
    const date  = btn.dataset.date  || "";
    const extra = btn.dataset.extra || "";

    window.__fmOpenModal(`
      <h3 class="h3">${escapeHtml(title)}</h3>
      ${extra ? `<div class="mt"><span class="tag">${escapeHtml(extra)}</span></div>` : ""}
      ${date ? `<div class="meta mt">${escapeHtml(date)}</div>` : ""}
      ${desc ? `<p class="mt">${escapeHtml(desc)}</p>` : ""}
    `);
  });
}

/* =========================
   RADIO PLAY
========================= */
function setupRadioPlay(){
  const btn = qs("[data-radio-play]");
  const audio = qs("[data-radio-audio]");
  if(!btn || !audio) return;

  if(STREAM_URL) audio.src = STREAM_URL;

  btn.addEventListener("click", async ()=>{
    if(!STREAM_URL){
      btn.textContent = btn.textContent.trim() === "▶" ? "❚❚" : "▶";
      return;
    }

    try{
      if(audio.paused){
        await audio.play();
        btn.textContent = "❚❚";
      }else{
        audio.pause();
        btn.textContent = "▶";
      }
    }catch(err){
      console.error("Radio playback failed:", err);
      btn.textContent = "▶";
    }
  });
}

/* =========================
   HITS DA SEMANA (YouTube in modal)
========================= */
function setupHitsDaSemanaYouTube(){
  const buttons = qsa("[data-hit-youtube]");
  if(!buttons.length) return;

  buttons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const embed = btn.dataset.embed;
      if(!embed || !window.__fmOpenModal) return;

      const src = `${embed}?autoplay=1&rel=0`;

      window.__fmOpenModal(`
        <div class="yt-wrap">
          <iframe
            src="${src}"
            title="YouTube player"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      `);
    });
  });
}

/* =========================
   COOKIE BANNER
========================= */
function setupCookieBanner(){
  const KEY = "fmafro_cookie_consent"; // "accepted" | "declined"
  const banner = qs("#cookieBanner");
  const btnAccept = qs("#cookieAccept");
  const btnDecline = qs("#cookieDecline");

  if(!banner || !btnAccept || !btnDecline) return;

  const saved = localStorage.getItem(KEY);
  if(saved === "accepted" || saved === "declined") return;

  banner.hidden = false;

  const hide = ()=> { banner.hidden = true; };

  btnAccept.addEventListener("click", ()=>{
    localStorage.setItem(KEY, "accepted");
    hide();
  });

  btnDecline.addEventListener("click", ()=>{
    localStorage.setItem(KEY, "declined");
    hide();
  });
}

/* =========================
   NEWSLETTER POPUP
   - Pops on scroll
   - Keeps popping after close
   - Stops forever only after subscribing
========================= */
function setupNewsletter(){
  const popup  = qs("#newsletterPopup");
  const close  = qs("#newsletterClose");
  const form   = qs("#newsletter-form");
  const result = qs("#newsletter-result");

  if(!popup) return;

  const KEY_SUB = "fmafro_newsletter_subscribed"; // "1" when subscribed
  if(localStorage.getItem(KEY_SUB) === "1") return;

  let cooldown = false;

  function show(){
    if(localStorage.getItem(KEY_SUB) === "1") return;
    popup.classList.add("show");
  }

  function hide(){
    popup.classList.remove("show");
  }

  function setCooldown(){
    cooldown = true;
    setTimeout(()=>{ cooldown = false; }, 1500);
  }

  if(close){
    close.addEventListener("click", ()=>{
      hide();
      setCooldown();
    });
  }

  function onScroll(){
    if(localStorage.getItem(KEY_SUB) === "1") return;
    if(cooldown) return;

    if(window.scrollY > 300){
      show();
      setCooldown();
    }
  }
  window.addEventListener("scroll", onScroll, { passive:true });

  if(form && result){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();

      const consent = qs("#newsletterConsent");
      if(consent && !consent.checked){
        result.textContent = "Por favor, aceita os Termos e a Política de Privacidade para subscrever.";
        return;
      }

      result.textContent = "✅ Subscrição efetuada com sucesso!";
      localStorage.setItem(KEY_SUB, "1"); // stop forever after subscribe
      form.reset();
      setTimeout(()=>{ hide(); }, 900);
    });
  }

  // optional initial show
  setTimeout(show, 1800);
}

/* =========================
   CONTACT PAGE TABS + JUMP
========================= */
function setupContactTabs(){
  const tabsWrap = qs("[data-tabs]");
  if(!tabsWrap) return;

  const tabs = qsa(".tab", tabsWrap);
  const panels = qsa("[data-panel]");

  function show(name){
    tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
    panels.forEach(p => { p.hidden = (p.dataset.panel !== name); });
  }

  tabsWrap.addEventListener("click", (e)=>{
    const btn = e.target.closest(".tab");
    if(!btn) return;
    show(btn.dataset.tab);
  });

  const active = tabs.find(t => t.classList.contains("active"))?.dataset.tab || "fala";
  show(active);
}

function setupJumpButtons(){
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-jump]");
    if(!btn) return;
    const id = btn.dataset.jump;
    const target = document.getElementById(id);
    if(target) target.scrollIntoView({ behavior:"smooth", block:"start" });
  });
}

/* =========================
   TEMPLATES + RENDERS
========================= */
function newsTile(n){
  return `
    <article class="card tile yellow">
      <img class="tileImg" src="${n.image}" alt="" onerror="this.style.display='none'">
      <div class="tileBody">
        <span class="tag">${escapeHtml(n.category)}</span>
        <h3 class="h3" style="margin-top:10px">${escapeHtml(n.title)}</h3>
        <div class="meta">${escapeHtml(n.date)}</div>
        <p class="sub" style="margin-top:10px">${escapeHtml(n.excerpt)}</p>
        <button class="btn secondary small mt" type="button"
          data-open="news"
          data-title="${escapeHtml(n.title)}"
          data-desc="${escapeHtml(n.excerpt)}"
          data-date="${escapeHtml(n.date)}"
          data-extra="${escapeHtml(n.category)}">
          Ler mais
        </button>
      </div>
    </article>
  `;
}

function guestCard(e){
  return `
    <article class="guestCard">
      <img class="guestImg" src="${e.image}" alt="" onerror="this.style.display='none'">
      <div class="guestBody">
        <h3 class="guestName">${escapeHtml(e.title)}</h3>
        <p class="guestDesc">${escapeHtml(e.desc)}</p>
        <div class="guestDate">${escapeHtml(e.date)}</div>
        <div class="guestBtnWrap">
          <button class="btn guestBtn" type="button"
            data-open="event"
            data-title="${escapeHtml(e.title)}"
            data-desc="${escapeHtml(e.desc)}"
            data-date="${escapeHtml(e.date)}">
            Ver Detalhes
          </button>
        </div>
      </div>
    </article>
  `;
}

function pastRow(e){
  const name = (e.title || "").replace("Convidado:","").trim();
  return `
    <article class="pastCard">
      <img class="pastImg" src="${e.image}" alt="" onerror="this.style.display='none'">
      <div class="pastMeta">
        <div class="pastLabel">Convidado:</div>
        <div class="pastName">${escapeHtml(name)}</div>
        <div class="pastDate">${escapeHtml(e.date)}</div>
      </div>
    </article>
  `;
}

function renderHome(){
  const homeEvents = qs("#home-events");
  if(homeEvents){
    const list = upcomingEvents.slice(0,3);
    homeEvents.innerHTML = list.map((e,i)=>`
      <div class="mini-card" style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div>
          <div class="h3" style="margin:0">${i+1} — ${escapeHtml(e.title)}</div>
          <div class="meta">${escapeHtml(e.date)}</div>
        </div>
        <button class="btn small" type="button"
          data-open="event"
          data-title="${escapeHtml(e.title)}"
          data-desc="${escapeHtml(e.desc)}"
          data-date="${escapeHtml(e.date)}">Ver</button>
      </div>
    `).join("");
  }

  const homeNews = qs("#home-news");
  if(homeNews){
    homeNews.innerHTML = news.slice(0,3).map(newsTile).join("");
  }
}

function renderPrograms(){
  const grid = qs("#programs-grid");
  if(!grid) return;

  let currentFilter = "Todos";
  let query = "";

  function draw(){
    const filtered = programs.filter(p=>{
      const byType = (currentFilter === "Todos") || (p.type === currentFilter);
      const byQuery = !query || (p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
      return byType && byQuery;
    });

    grid.innerHTML = filtered.map(p=>`
      <article class="card pad yellow">
        <span class="tag">${escapeHtml(p.type)}</span>
        <h3 class="h3" style="margin-top:10px">${escapeHtml(p.name)}</h3>
        <div class="meta">${escapeHtml(p.time)}</div>
        <p class="sub" style="margin-top:10px">${escapeHtml(p.desc)}</p>
        <button class="btn secondary small mt" type="button"
          data-open="program"
          data-title="${escapeHtml(p.name)}"
          data-desc="${escapeHtml(p.desc)}"
          data-date="${escapeHtml(p.time)}"
          data-extra="${escapeHtml(p.type)}">Ver detalhes</button>
      </article>
    `).join("");
  }

  qsa("[data-program-filter]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      qsa("[data-program-filter]").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.programFilter;
      draw();
    });
  });

  const search = qs("#program-search");
  if(search){
    search.addEventListener("input", ()=>{
      query = (search.value||"").trim().toLowerCase();
      draw();
    });
  }

  const defaultBtn = qs('[data-program-filter="Todos"]');
  if(defaultBtn) defaultBtn.classList.add("active");

  draw();
}

function renderEvents(){
  const grid = qs("#events-grid");
  const past = qs("#past-events-grid");

  if(grid) grid.innerHTML = upcomingEvents.slice(0,2).map(guestCard).join("");
  if(past) past.innerHTML = pastEvents.slice(0,2).map(pastRow).join("");
}

function renderNews(){
  const featured = qs("#featured-news");
  const grid = qs("#news-grid");
  const tabsWrap = qs('.tabs[aria-label="Categorias de notícias"]') || qs(".tabs");
  const tabs = qsa("[data-news-filter]");

 
  if(!featured && !grid) return;

  // ---------- Featured render ----------
  if(featured){
    const featuredItems = news.filter(n => n.featured).slice(0,3);

    if(featuredItems.length){
      const main = featuredItems[0];
      const side = featuredItems.slice(1);

      featured.innerHTML = `
        <article class="card tile yellow">
          <img class="tileImg" src="${main.image}" alt="" onerror="this.style.display='none'">
          <div class="tileBody">
            <span class="tag">Destaque</span>
            <h3 class="h3" style="margin-top:10px">${escapeHtml(main.title)}</h3>
            <p class="sub">${escapeHtml(main.excerpt)}</p>
            <div class="meta">${escapeHtml(main.date)}</div>
            <button class="btn small mt" type="button"
              data-open="news"
              data-title="${escapeHtml(main.title)}"
              data-desc="${escapeHtml(main.excerpt)}"
              data-date="${escapeHtml(main.date)}"
              data-extra="${escapeHtml(main.category)}">Ler mais</button>
          </div>
        </article>

        <div class="grid" style="gap:12px">
          ${side.map(n=>`
            <article class="card pad yellow">
              <span class="tag">${escapeHtml(n.category)}</span>
              <h3 class="h3" style="margin-top:10px">${escapeHtml(n.title)}</h3>
              <div class="meta">${escapeHtml(n.date)}</div>
              <button class="btn secondary small mt" type="button"
                data-open="news"
                data-title="${escapeHtml(n.title)}"
                data-desc="${escapeHtml(n.excerpt)}"
                data-date="${escapeHtml(n.date)}"
                data-extra="${escapeHtml(n.category)}">Ler mais</button>
            </article>
          `).join("")}
        </div>
      `;
    }else{
      featured.innerHTML = `<p class="sub muted">Sem destaques no momento.</p>`;
    }
  }

  // ---------- Filtering (normalized) ----------
  let current = "Todas"; // raw label

  // Skeleton loader (shown before real news renders)
if (grid) {
  grid.innerHTML = Array.from({ length: 20 })
    .map(() => `<div class="skeleton"></div>`)
    .join("");
}

  function setActive(rawFilter){
    const nFilter = norm(rawFilter);
    tabs.forEach(b => b.classList.toggle("active", norm(b.dataset.newsFilter) === nFilter));
  }

  function draw(){
    if(!grid) return;

    const nFilter = norm(current);

    const list = news
      .filter(n => n.featured !== true) // never show featured in grid
      .filter(n => {
        if(nFilter === norm("Todas")) return true;
        return norm(n.category) === nFilter;
      });

    grid.innerHTML = list.length
      ? list.map(newsTile).join("")
      : `<p class="sub muted">Sem notícias nesta categoria.</p>`;
  }

  // Default active tab (works even if HTML forgot "active")
  const defaultBtn = tabs.find(b => norm(b.dataset.newsFilter) === norm("Todas")) || tabs[0];
  if(defaultBtn){
    current = defaultBtn.dataset.newsFilter || "Todas";
    setActive(current);
  }

  // Event delegation + bind once
  if(tabsWrap && !tabsWrap.dataset.boundNewsTabs){
    tabsWrap.dataset.boundNewsTabs = "1";

    tabsWrap.addEventListener("click", (e)=>{
      const btn = e.target.closest("[data-news-filter]");
      if(!btn) return;

      current = btn.dataset.newsFilter || "Todas";
      setActive(current);
      draw();
    });
  }

  draw();
}


/* =========================
   INIT (ONE DOMContentLoaded ONLY)
========================= */
document.addEventListener("DOMContentLoaded", ()=>{
  setYear();
  setActiveNav();
  setupBurger();

  setupModal();
  setupModalOpens();

  setupRadioPlay();
  setupHitsDaSemanaYouTube();

  setupCookieBanner();
  setupNewsletter();

  setupContactTabs();
  setupJumpButtons();


  renderHome();
  renderPrograms();
  renderEvents();
  renderNews();

  renderCidadeNaoDorme();
  
  setupTeamCarousel();


});

function setupScrollReveal(){
  const items = document.querySelectorAll("#featured-news .card, #news-grid .card");
  if(!items.length) return;

  items.forEach((el, i) => {
    el.classList.add("reveal");
    el.setAttribute("data-delay", String((i % 5) + 1));
  });

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
}

document.addEventListener("DOMContentLoaded", setupScrollReveal);

/* =========================
   A CIDADE NÃO DORME — DATA
   
========================= */
const cidadeNaoDorme = [
  {
    title: "AFROMANIA — COM BRUNO JORGE FEIJÓ [FRICKY]",
    text:
      "AFROMANIA é o programa dirigido às inventivas Placas onde os jovens falam e recitam os versos que reflectem os seus linguajares cheios de códigos, visões de ruptura, versos duros, de fé e com predominância do Drill, vulgo brokas. O programa AFROMANIA incluirá outras tendências rítmicas de várias origens geográficas e a nossa Diáspora terá espaço...",
    horario: "Horário: sábados 09h00–13h00 • domingos 10h00–13h00",
    poster: "assets/Bruno-Jorge.png"
  },
  {
    title: "MANHÃ AFRO — COM MÁRIO SANTOS",
    text:
      "Manhã Afro é o programa que traz para os ouvintes as melhores músicas de dança para começar o seu dia cheio de energia à vida. Apresentado por Mário Santos, o ouvinte desfruta de uma selecção eclética de géneros musicais africanos e de nossas diásporas...",
    horario: "Horário: dias úteis • 08h00–13h00",
    poster: "assets/Mario-Santos.png"
  },
  {
    title: "ÁFRICA NO CORAÇÃO — COM CARINA SOUSA",
    text:
      "África no Coração é um programa – até pela hora de café – que deixa a conversa muito mais concentrada nas perguntas que puxam pelo verbo dos nossos ouvintes. O diálogo & a música na mais perfeita simbiose entre a harmonia musical e o “querer” e o “ser” dos ouvintes...",
    horario: "Horário: 13h00–17h00",
    poster: "assets/Carina-Sousa.png"
  },
  {
    title: "AO CAIR DA TARDE — COM KILO KILO",
    text:
      "Ao Cair da Tarde é mais do que um programa de rádio... destaque para rubricas, momentos especiais, e uma panorâmica das dinâmicas do dia. Ideal para acompanhar o regresso a casa com música e conversa.",
    horario: "Horário: 18h00–22h00",
    poster: "assets/Kilo-Kilo.png"
  },
];

/* =========================
   A CIDADE NÃO DORME — RENDER + ANIMATION
========================= */
function renderCidadeNaoDorme(){
  const root = qs("[data-city-slider]");
  const track = qs("[data-city-track]");
  const nextBtn = qs("[data-city-next]");
  if(!root || !track || !nextBtn) return;

  // Build slides
  track.innerHTML = cidadeNaoDorme.map((s, idx)=>`
    <article class="citySlide ${idx === 0 ? "is-active" : ""}" data-city-slide="${idx}">
      <div class="cityLeft">
        <h3 class="cityKicker">${escapeHtml(s.title)}</h3>
        <p class="cityText">${escapeHtml(s.text)}</p>
        <div class="cityHorario">${escapeHtml(s.horario)}</div>
      </div>
      <div class="cityRight">
        <img class="cityPoster" src="${s.poster}" alt="${escapeHtml(s.title)}"
          onerror="this.style.display='none'">
      </div>
    </article>
  `).join("");

  const slides = qsa("[data-city-slide]", track);
  let i = 0;

  function show(index){
    slides.forEach(el => el.classList.remove("is-active"));
    slides[index].classList.add("is-active");
  }

  nextBtn.addEventListener("click", ()=>{
    i = (i + 1) % slides.length;
    show(i);
  });
}


/* ========= END FM AFRO — App JS ========= */
