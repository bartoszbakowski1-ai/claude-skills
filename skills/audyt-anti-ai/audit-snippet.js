// audit-snippet.js - zbieracz sygnałów anti-AI-look dla skilla audyt-anti-ai.
// Wstrzykuj przez Playwright MCP: mcp__plugin_playwright_playwright__browser_evaluate
// z parametrem `function` = CAŁA poniższa funkcja (od "() => {" do zamykającego "}").
// Zwraca JSON z surowymi sygnałami. Interpretację (flagi, score) robi model wg SKILL.md.
// Nic nie wysyła na zewnątrz - tylko czyta DOM i computed styles bieżącej strony.

() => {
  const out = {
    url: location.href,
    title: document.title || null,
    fonts: {},
    color: {},
    images: {},
    typography: {},
    layout: {},
    motion: {},
    copy: {},
    samples: {}
  };

  const norm = (s) => (s || "").toString().trim();
  const firstFont = (ff) => norm(ff).split(",")[0].replace(/["']/g, "").trim();
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0";
  };

  // ---------- FONTY (pairing) ----------
  const bodyCS = getComputedStyle(document.body);
  const h = document.querySelector("h1, h2");
  const headingCS = h ? getComputedStyle(h) : bodyCS;
  out.fonts.body = firstFont(bodyCS.fontFamily);
  out.fonts.heading = firstFont(headingCS.fontFamily);
  out.fonts.samePairing = out.fonts.body.toLowerCase() === out.fonts.heading.toLowerCase();
  out.fonts.headingIsDefaultTell = /^(inter|geist|roboto|arial|system-ui|-apple-system|helvetica)$/i.test(out.fonts.heading);

  // ---------- KOLOR: tło + akcent ----------
  out.color.bodyBg = bodyCS.backgroundColor;
  const btn = document.querySelector("a[class*='bg-'], button, [role='button'], .btn, [class*='cta']");
  out.color.accentSample = btn ? getComputedStyle(btn).backgroundColor : null;

  // gradienty (fioletowo-niebieskie tell) - skanuj backgroundImage
  const gradWords = /(rgb\(1[23]\d|rgb\(1[0-9]\d,\s*\d+,\s*2[0-4]\d)|violet|purple|indigo|8b5cf6|7c3aed|6d28d9|a855f7|c084fc|818cf8|6366f1|4f46e5/i;
  let purpleGrad = 0, anyGrad = 0, gradientTextNodes = 0;
  const gradSamples = [];
  const all = Array.from(document.querySelectorAll("*")).slice(0, 4000);
  for (const el of all) {
    const cs = getComputedStyle(el);
    const bg = cs.backgroundImage || "";
    if (bg.includes("gradient")) {
      anyGrad++;
      // fiolet/indygo/blue: heurystyka po nazwie i typowych hexach tailwinda violet/indigo/blue
      if (/(violet|purple|indigo|fuchsia)/i.test(el.className || "") ||
          /#(8b5cf6|7c3aed|6d28d9|a855f7|c084fc|a78bfa|818cf8|6366f1|4f46e5|4338ca)/i.test(bg) ||
          /rgb\(\s*(1[0-4]\d|[6-9]\d),\s*\d{1,2},\s*(2[0-4]\d|1[5-9]\d)\s*\)/i.test(bg)) {
        purpleGrad++;
        if (gradSamples.length < 4) gradSamples.push(norm(el.className).slice(0, 80) || bg.slice(0, 80));
      }
    }
    // gradient text: bg-clip:text + transparent fill
    const clip = cs.webkitBackgroundClip || cs.backgroundClip || "";
    const fill = cs.webkitTextFillColor || "";
    if (clip.includes("text") && (fill === "rgba(0, 0, 0, 0)" || fill === "transparent" || cs.color === "rgba(0, 0, 0, 0)")) {
      gradientTextNodes++;
    }
  }
  out.color.gradientsTotal = anyGrad;
  out.color.purpleBlueGradients = purpleGrad;
  out.color.gradientTextNodes = gradientTextNodes;
  out.samples.purpleGradients = gradSamples;

  // ---------- OBRAZY: realne foto vs ikony/svg ----------
  let realPhotos = 0, svgIcons = 0, bgPhotos = 0;
  const imgs = Array.from(document.images || []);
  for (const im of imgs) {
    const src = (im.currentSrc || im.src || "").toLowerCase();
    const w = im.naturalWidth || im.width || 0;
    const hh = im.naturalHeight || im.height || 0;
    if (src.endsWith(".svg") || src.includes("data:image/svg") || (w > 0 && w <= 64 && hh > 0 && hh <= 64)) {
      svgIcons++;
    } else if (w >= 100 && hh >= 100) {
      realPhotos++;
    }
  }
  // tła-zdjęcia (background-image url, nie gradient)
  for (const el of all) {
    const bg = getComputedStyle(el).backgroundImage || "";
    if (bg.includes("url(") && !bg.includes("gradient") && !/\.svg/i.test(bg)) {
      const r = el.getBoundingClientRect();
      if (r.width >= 200 && r.height >= 150) bgPhotos++;
    }
  }
  out.images.realPhotos = realPhotos;
  out.images.backgroundPhotos = bgPhotos;
  out.images.realMediaTotal = realPhotos + bgPhotos + document.querySelectorAll("video").length;
  out.images.svgIconsInline = document.querySelectorAll("svg").length;
  out.images.imgSvgIcons = svgIcons;

  // ---------- TYPOGRAFIA nagłówków ----------
  const heads = Array.from(document.querySelectorAll("h1, h2, h3")).filter(vis).slice(0, 40);
  let tightTracking = 0, missingBalance = 0;
  const headSamples = [];
  for (const el of heads) {
    const cs = getComputedStyle(el);
    const ls = parseFloat(cs.letterSpacing);
    const fs = parseFloat(cs.fontSize);
    if (!isNaN(ls) && fs >= 24 && ls <= -0.5) tightTracking++;
    const wrap = cs.textWrap || cs.textWrapStyle || "";
    if (!/balance|pretty/i.test(wrap)) missingBalance++;
    if (headSamples.length < 5) headSamples.push({ tag: el.tagName, text: norm(el.textContent).slice(0, 60), letterSpacing: cs.letterSpacing, textWrap: wrap || "normal", fontSize: cs.fontSize });
  }
  out.typography.headingCount = heads.length;
  out.typography.tightTracking = tightTracking;
  out.typography.missingTextBalance = missingBalance;
  out.samples.headings = headSamples;

  // eyebrow/badge CAPSem nad nagłówkiem
  let capsBadges = 0;
  const capsSamples = [];
  const smalls = Array.from(document.querySelectorAll("span, p, div, small, a")).filter(vis).slice(0, 3000);
  for (const el of smalls) {
    const cs = getComputedStyle(el);
    const t = norm(el.textContent);
    if (!t || t.length > 40 || el.children.length > 0) continue;
    const fs = parseFloat(cs.fontSize);
    const ls = parseFloat(cs.letterSpacing);
    const upper = cs.textTransform === "uppercase" || (t === t.toUpperCase() && /[A-ZĄĆĘŁŃÓŚŹŻ]/.test(t));
    if (upper && fs <= 15 && (isNaN(ls) ? false : ls >= 0.5)) {
      capsBadges++;
      if (capsSamples.length < 5) capsSamples.push(t.slice(0, 40));
    }
  }
  out.typography.capsBadges = capsBadges;
  out.samples.capsBadges = capsSamples;

  // ---------- LAYOUT: wycentrowanie ----------
  const sections = Array.from(document.querySelectorAll("section, main > div, header")).filter(vis).slice(0, 60);
  let centered = 0;
  for (const el of sections) {
    if (getComputedStyle(el).textAlign === "center") centered++;
  }
  out.layout.sectionsChecked = sections.length;
  out.layout.centeredSections = centered;
  out.layout.centeredRatio = sections.length ? +(centered / sections.length).toFixed(2) : 0;
  // hero wysokość (pierwszy section/header)
  const hero = document.querySelector("header, main section, section");
  if (hero) {
    const r = hero.getBoundingClientRect();
    out.layout.heroHeightVh = Math.round((r.height / (window.innerHeight || 800)) * 100);
  }
  // identyczne karty: grid z powtarzalnymi dziećmi
  let repeatedCardGroups = 0;
  const grids = Array.from(document.querySelectorAll("*")).filter(el => {
    const d = getComputedStyle(el).display;
    return (d === "grid" || d === "flex") && el.children.length >= 3;
  }).slice(0, 200);
  for (const g of grids) {
    const kids = Array.from(g.children);
    const classes = kids.map(k => norm(k.className));
    const uniq = new Set(classes);
    if (kids.length >= 3 && uniq.size === 1) repeatedCardGroups++;
  }
  out.layout.identicalCardGroups = repeatedCardGroups;

  // ---------- RUCH: pętle ----------
  let loopAnim = 0;
  const loopSamples = [];
  for (const el of all) {
    const cs = getComputedStyle(el);
    const nm = cs.animationName || "";
    const it = cs.animationIterationCount || "";
    const cls = norm(el.className);
    if ((nm && nm !== "none" && /infinite/.test(it)) || /animate-(pulse|bounce|ping|spin)/.test(cls)) {
      loopAnim++;
      if (loopSamples.length < 4) loopSamples.push(cls.slice(0, 60) || nm);
    }
  }
  out.motion.loopingAnimations = loopAnim;
  out.samples.loopingAnimations = loopSamples;

  // ---------- COPY: em-dash, liczby, buzzwordy ----------
  const bodyText = norm(document.body.innerText).slice(0, 20000);
  out.copy.emDashCount = (bodyText.match(/[—–]/g) || []).length;
  out.copy.hasDigits = /\d/.test(bodyText);
  const buzz = /(elevate|unlock|unleash|supercharge|empower|seamless|revolutioniz|transform your|all-in-one|game-chang|next-level|cutting-edge|in today'?s fast-paced|build the future)/gi;
  out.copy.buzzwordHits = (bodyText.match(buzz) || []).slice(0, 10);
  // polskie ogonki obecne?
  out.copy.hasPolishDiacritics = /[ąćęłńóśźż]/i.test(bodyText);

  return out;
}
