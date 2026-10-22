(function () {
  "use strict";

  var page = document.body.getAttribute("data-page") || "home";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var LANG_KEY = "site-lang";
  var lang = "en";
  var isPreview = false;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Pick the current language from a {en, fa} value; plain strings pass through.
  function t(v) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return v[lang] != null && String(v[lang]).trim() !== "" ? v[lang] : (v.en != null ? v.en : "");
    }
    return v == null ? "" : v;
  }
  function T(v) { return esc(t(v)); }
  function lines(v) {
    return String(t(v) || "").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function linkOr(u) { return u && String(u).trim() ? String(u).trim() : "#"; }
  function ui(key) { var c = window.SITE_CONTENT; return t(c.ui && c.ui[key]); }

  var BUBBLE_SLOTS = [
    { top: 0, start: 262, tail: 13 },
    { top: 71, start: 33, tail: 117 },
    { top: 191, start: 275, tail: 13 },
    { top: 265, start: 40, tail: 63 }
  ];
  var COLORS = ["blue", "purple", "orange", "green"];

  /* ---------- language ---------- */
  function pickLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "fa" || q === "en") return q;
    try { var s = localStorage.getItem(LANG_KEY); if (s === "fa" || s === "en") return s; } catch (e) {}
    var c = window.SITE_CONTENT || {};
    return (c.site && c.site.defaultLanguage) || "en";
  }
  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }

  /* ---------- shared pieces ---------- */
  function socials(c, extra) {
    var s = c.social || {}, ic = s.icons || {};
    function icon(k) { return esc(ic[k] || "assets/icons/" + k + ".svg"); }
    return '<div class="socials ' + (extra || "") + '">' +
      '<a href="' + esc(linkOr(s.linkedin)) + '" aria-label="LinkedIn" target="_blank" rel="noopener"><img class="icon-linkedin" src="' + icon("linkedin") + '" alt=""></a>' +
      '<a href="' + esc(linkOr(s.behance)) + '" aria-label="Behance" target="_blank" rel="noopener"><img src="' + icon("behance") + '" alt=""></a>' +
      '<a href="' + esc(linkOr(s.dribbble)) + '" aria-label="Dribbble" target="_blank" rel="noopener"><img src="' + icon("dribbble") + '" alt=""></a>' +
      "</div>";
  }

  function header(c) {
    var logo;
    if (page === "about") {
      var parts = String(t(c.site.logoAbout)).split(" ");
      logo = esc(parts.shift()) + (parts.length ? ' <span class="logo__light">' + esc(parts.join(" ")) + "</span>" : "");
    } else {
      logo = T(c.site.logoHome);
    }
    var n = c.nav || {};
    var other = lang === "fa" ? "en" : "fa";
    return '<div class="site-header__inner">' +
      '<a href="index.html" class="logo">' + logo + "</a>" +
      '<div class="header-right"><nav class="nav" aria-label="Main">' +
      '<a href="index.html"' + (page === "home" ? ' aria-current="page"' : "") + ">" + T(n.home) + "</a>" +
      '<a href="about.html"' + (page === "about" ? ' aria-current="page"' : "") + ">" + T(n.about) + "</a>" +
      '<a href="index.html#projects">' + T(n.caseStudies) + "</a>" +
      '<a href="index.html#illustrations" data-nav="illustrations">' + T(n.illustrations) + "</a>" +
      "</nav>" +
      '<button type="button" class="lang-toggle" data-lang="' + other + '" lang="' + other + '" aria-label="' + (other === "fa" ? "فارسی" : "English") + '">' + (other === "fa" ? "فا" : "EN") + "</button>" +
      socials(c, "socials--header") + "</div></div>";
  }

  function cvButton(c, cls) {
    var cv = c.site && c.site.cv;
    if (!cv) return "";
    return '<a class="cv-btn ' + (cls || "") + '" href="' + esc(cv) + '" download target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10"/></svg>' +
      esc(ui("downloadCv")) + "</a>";
  }

  function footer(c) {
    var email = c.site.email || "";
    return '<div class="blob blob--purple" style="left:7%;top:-20px;width:179px;height:157px"></div>' +
      '<div class="blob blob--blue" style="left:12%;top:231px;width:185px;height:158px"></div>' +
      '<div class="blob blob--blue" style="left:2%;top:163px;width:185px;height:158px"></div>' +
      '<div class="blob blob--orange" style="left:0;top:29px;width:186px;height:158px"></div>' +
      '<div class="blob blob--purple" style="right:5%;top:-9px;width:179px;height:157px"></div>' +
      '<div class="blob blob--blue" style="right:10%;top:242px;width:185px;height:158px"></div>' +
      '<div class="blob blob--blue" style="right:-1%;top:174px;width:185px;height:158px"></div>' +
      '<div class="blob blob--orange" style="right:-3%;top:40px;width:186px;height:158px"></div>' +
      '<div class="site-footer__inner">' +
      "<h2>" + T(c.contactTitle) + "</h2>" +
      '<div class="email-row"><a class="email" dir="ltr" href="mailto:' + esc(email) + '">' + esc(email) + "</a>" +
      '<button type="button" class="copy-btn" data-copy="' + esc(email) + '">' + esc(ui("copy")) + "</button></div>" +
      cvButton(c, "cv-btn--dark") +
      socials(c) + "</div>";
  }

  /* ---------- home ---------- */
  function home(c) {
    var h = c.hero || {};
    var title = lines(h.title).map(esc).join("<br>");
    var desc = lines(h.description).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var bubbles = (h.bubbles || []).slice(0, 4).map(function (b, i) {
      var s = BUBBLE_SLOTS[i];
      var color = COLORS.indexOf(b.color) > -1 ? b.color : COLORS[i];
      return '<span class="bubble-wrap" data-depth="' + (0.6 + i * 0.25) + '" style="top:' + s.top + "px;inset-inline-start:" + s.start + "px;--i:" + i + '">' +
        '<span class="bubble bubble--' + color + '" style="--tail:' + s.tail + 'px">' + T(b.text) + "</span></span>";
    }).join("");

    var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
    var projects = (c.projects || []).map(function (p, i) {
      var open = hasCase(p);
      var meta = [t(p.company), t(p.year)].filter(Boolean).map(esc).join(" · ");
      var tags = lines(p.tags).map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("");
      // The title carries the action; its ::after stretches over the whole card.
      var titleInner = open
        ? '<button type="button" class="cs-open" data-case="' + i + '">' + T(p.title) + "</button>"
        : p.link ? '<a class="cs-open" href="' + esc(p.link) + '" target="_blank" rel="noopener">' + T(p.title) + "</a>"
        : T(p.title);
      var side = (open || p.link)
        ? '<span class="cs-arrow" aria-hidden="true">' + ARROW + "</span>"
        : (ui("soon") ? '<span class="cs-soon">' + esc(ui("soon")) + "</span>" : "");
      return '<article class="cs-card' + (open || p.link ? " is-clickable" : "") + '" style="--accent:' + accentOf(p) + '">' +
        '<div class="cs-media">' +
          '<div class="cs-shot">' + (p.image ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">' : "") + "</div>" +
          (p.logo ? '<div class="cs-logo"><img src="' + esc(p.logo) + '" alt="' + esc(t(p.company)) + '"></div>' : "") +
        "</div>" +
        '<div class="cs-body">' +
          (meta ? '<div class="cs-meta">' + meta + "</div>" : "") +
          '<div class="cs-title-row"><h3 class="cs-title">' + titleInner + "</h3>" + side + "</div>" +
          '<p class="cs-desc">' + T(p.description) + "</p>" +
          (tags ? '<div class="cs-tags">' + tags + "</div>" : "") +
        "</div></article>";
    }).join("");

    var illus = (c.illustrations || []).map(function (it, i) {
      return '<button type="button" class="illu glass" data-index="' + i + '" style="--n:' + (i % 3) + '">' +
        '<span class="illu__frame"><img src="' + esc(it.image) + '" alt="' + T(it.title) + '" loading="lazy"></span>' +
        '<span class="illu__title">' + T(it.title) + "</span></button>";
    }).join("");

    var services = (c.services || []).map(function (s) {
      return '<div class="service glass"><h3>' + T(s.title) + "</h3><p>" + T(s.text) + "</p></div>";
    }).join("");

    return '<section class="hero">' +
      '<div class="blob blob--blue" style="left:27%;top:-36px;width:185px;height:158px"></div>' +
      '<div class="blob blob--orange" style="left:38.5%;top:-36px;width:186px;height:158px"></div>' +
      '<div class="blob blob--purple" style="left:48.6%;top:-52px;width:179px;height:157px"></div>' +
      '<div class="blob blob--blue" style="left:60.4%;top:-36px;width:185px;height:158px"></div>' +
      '<div class="container hero__inner"><div class="hero__text">' +
      '<h1 class="hero__title reveal" style="--d:0">' + title + "</h1>" +
      '<div class="hero__desc reveal" style="--d:1">' + desc + "</div>" +
      '<div class="hero__actions reveal" style="--d:2">' +
      '<a href="#projects" class="btn btn--dark">' + T(h.primaryButton) + "</a>" +
      '<a href="about.html" class="btn btn--glass">' + T(h.secondaryButton) + "</a></div></div>" +
      '<div class="bubbles">' + bubbles + "</div></div></section>" +

      '<section class="projects" id="projects"><div class="container">' +
      '<div class="section-head"><h2 class="section-title">' + T(c.projectsTitle) + "</h2>" +
      (t(c.projectsIntro) ? '<p class="section-intro">' + T(c.projectsIntro) + "</p>" : "") + "</div>" +
      '<div class="project-list">' + projects + "</div></div></section>" +

      (illus ? '<section class="illustrations" id="illustrations"><div class="container">' +
        '<div class="section-head"><h2 class="section-title">' + T(c.illustrationsTitle) + "</h2>" +
        (t(c.illustrationsIntro) ? '<p class="section-intro">' + T(c.illustrationsIntro) + "</p>" : "") + "</div>" +
        '<div class="illu-grid">' + illus + "</div></div></section>" : "") +

      '<section class="services"><div class="container">' +
      '<h2 class="section-title">' + T(c.servicesTitle) + "</h2>" +
      '<div class="services__grid">' + services + "</div></div></section>" +

      '<dialog class="case-modal" id="case-modal" aria-labelledby="cm-title">' +
      '<div class="cm-bar"><span class="cm-bar-title" aria-hidden="true"></span>' +
      '<button type="button" class="cm-close" aria-label="' + esc(ui("close")) + '">' +
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg></button></div>' +
      '<div class="cm-scroll"><article class="cm-content"></article></div></dialog>' +
      '<dialog class="lightbox" id="lightbox" aria-label="' + T(c.illustrationsTitle) + '">' +
      '<button type="button" class="lb-btn lb-close" aria-label="' + esc(ui("close")) + '">✕</button>' +
      '<button type="button" class="lb-btn lb-prev" aria-label="Previous">‹</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-btn lb-next" aria-label="Next">›</button></dialog>';
  }

  /* ---------- case study modal ---------- */
  function accentOf(p) { return /^#[0-9a-f]{3,8}$/i.test(p.accent || "") ? p.accent : "#007fff"; }
  function blockHasContent(b) {
    return !!(b && (t(b.body) || t(b.metrics) || (b.images || []).some(function (im) { return im && im.image; })));
  }
  function hasCase(p) {
    var cs = p && p.caseStudy;
    return !!(cs && (cs.blocks || []).some(blockHasContent));
  }
  function richText(v) {
    var out = "", list = [];
    function flush() { if (list.length) { out += "<ul>" + list.join("") + "</ul>"; list = []; } }
    lines(v).forEach(function (l) {
      if (/^[-•]\s+/.test(l)) { list.push("<li>" + esc(l.replace(/^[-•]\s+/, "")) + "</li>"); return; }
      flush();
      if (l.indexOf("> ") === 0) out += "<blockquote>" + esc(l.slice(2)) + "</blockquote>";
      else if (l.indexOf("# ") === 0) out += "<h4>" + esc(l.slice(2)) + "</h4>";
      else out += "<p>" + esc(l) + "</p>";
    });
    flush();
    return out;
  }
  function caseHTML(c, i) {
    var p = c.projects[i], cs = p.caseStudy || {};
    var facts = [["role", "caseRole"], ["timeline", "caseTimeline"], ["team", "caseTeam"], ["tools", "caseTools"]]
      .filter(function (f) { return t(cs[f[0]]); })
      .map(function (f) { return "<div><dt>" + esc(ui(f[1])) + "</dt><dd>" + T(cs[f[0]]) + "</dd></div>"; }).join("");
    var cover = cs.cover || p.image;
    var meta = [t(p.company), t(p.year)].filter(Boolean).map(esc).join(" · ");
    var blocks = (cs.blocks || []).filter(blockHasContent).map(function (b) {
      var metrics = lines(b.metrics).map(function (l) {
        var parts = l.split("|");
        return '<div class="cm-metric"><strong>' + esc(parts[0].trim()) + "</strong><span>" + esc((parts[1] || "").trim()) + "</span></div>";
      }).join("");
      var imgs = (b.images || []).filter(function (im) { return im && im.image; });
      var gallery = imgs.map(function (im) {
        return '<figure><img src="' + esc(im.image) + '" alt="' + T(im.caption) + '" loading="lazy">' +
          (t(im.caption) ? "<figcaption>" + T(im.caption) + "</figcaption>" : "") + "</figure>";
      }).join("");
      return '<section class="cm-block"><h3>' + T(b.title) + '</h3><div class="cm-block-body">' +
        richText(b.body) +
        (metrics ? '<div class="cm-metrics">' + metrics + "</div>" : "") +
        (gallery ? '<div class="cm-gallery' + (imgs.length > 1 ? " is-grid" : "") + '">' + gallery + "</div>" : "") +
        "</div></section>";
    }).join("");
    var next = -1;
    for (var k = 1; k < c.projects.length; k++) {
      var j = (i + k) % c.projects.length;
      if (hasCase(c.projects[j])) { next = j; break; }
    }
    return '<header class="cm-hero">' +
        (meta ? '<div class="cs-meta">' + meta + "</div>" : "") +
        '<h2 id="cm-title">' + T(p.title) + "</h2>" +
        '<p class="cm-summary">' + (t(cs.summary) ? T(cs.summary) : T(p.description)) + "</p>" +
        (facts ? '<dl class="cm-facts">' + facts + "</dl>" : "") +
      "</header>" +
      (cover ? '<div class="cm-cover"><img src="' + esc(cover) + '" alt=""></div>' : "") +
      blocks +
      (next > -1 ? '<button type="button" class="cm-next" data-case="' + next + '"><span>' + esc(ui("nextCase")) + "</span><strong>" + T(c.projects[next].title) + "</strong></button>" : "");
  }

  var openCaseIndex = -1;
  function openCase(i, keepScroll) {
    var c = window.SITE_CONTENT, dlg = document.getElementById("case-modal");
    if (!dlg || !c.projects || !c.projects[i] || !hasCase(c.projects[i])) return;
    var scroller = dlg.querySelector(".cm-scroll");
    var y = keepScroll ? scroller.scrollTop : 0;
    dlg.style.setProperty("--accent", accentOf(c.projects[i]));
    dlg.querySelector(".cm-content").innerHTML = caseHTML(c, i);
    dlg.querySelector(".cm-bar-title").textContent = t(c.projects[i].title);
    // images not uploaded yet: drop them instead of showing empty frames
    dlg.querySelectorAll(".cm-cover img, .cm-gallery img").forEach(function (img) {
      var box = img.closest(".cm-cover, figure");
      var probe = new Image();
      probe.onerror = function () { if (box) box.remove(); };
      probe.src = img.src;
    });
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add("cm-open");
    scroller.scrollTop = y;
    openCaseIndex = i;
    if (!isPreview && location.hash !== "#case-" + (i + 1)) history.replaceState(null, "", "#case-" + (i + 1));
  }
  function closeCase() {
    var dlg = document.getElementById("case-modal");
    if (dlg && dlg.open) dlg.close();
  }
  function onCaseClosed() {
    openCaseIndex = -1;
    document.documentElement.classList.remove("cm-open");
    if (!isPreview && /^#case-\d+$/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  }

  /* ---------- about ---------- */
  var COLLAPSE_AFTER = 3;

  function itemList(v, id) {
    var all = lines(v).map(function (l) {
      return l.indexOf("# ") === 0 ? '<p class="medium subhead">' + esc(l.slice(2)) + "</p>" : "<p>" + esc(l) + "</p>";
    });
    // With sub-headings, show the first group; otherwise the first few lines.
    var raw = lines(v), cut = COLLAPSE_AFTER;
    var heads = raw.reduce(function (acc, l, i) { if (l.indexOf("# ") === 0) acc.push(i); return acc; }, []);
    if (heads.length > 1 && heads[0] === 0) cut = heads[1];
    if (all.length <= cut + 1) return all.join("");
    var hidden = raw.slice(cut).filter(function (l) { return l.indexOf("# ") !== 0; }).length;
    return all.slice(0, cut).join("") +
      '<div class="more" id="' + id + '" hidden>' + all.slice(cut).join("") + "</div>" +
      '<button type="button" class="more-btn" aria-expanded="false" aria-controls="' + id + '" data-count="' + hidden + '">' +
      esc(ui("showMore")) + " (" + hidden + ")</button>";
  }

  function logoImg(e) {
    if (!e.logo) return "<div></div>";
    return '<div class="tl-logo"><img src="' + esc(e.logo) + '" alt="' + T(e.company) + '" style="height:' + (Number(e.logoHeight) || 50) + 'px"></div>';
  }
  function dateCol(e) {
    return '<div class="tl-date"><span>' + T(e.date) + "</span><span>" + T(e.type) + "</span></div>";
  }
  function roleHead(e) {
    return '<div class="tl-head"><h3 class="tl-role">' + T(e.role) + '</h3><span class="tl-company" style="color:' + esc(e.companyColor || "#007fff") + '">' + T(e.company) + "</span></div>";
  }

  function about(c) {
    var a = c.about || {};
    var text = lines(a.text).map(esc).join("<br>");
    var stats = (a.stats || []).map(function (s) {
      return '<div class="stat"><span>' + T(s.label) + '</span><strong class="count" data-value="' + esc(s.value) + '">' + esc(s.value) + "</strong></div>";
    }).join("");

    var skills = (c.skills || []).map(function (s) {
      return '<div class="tl-item"><span class="skill-label">' + T(s.label) + '</span><p class="skill-value">' + T(s.value) + "</p></div>";
    }).join("");

    var exp = (c.experience || []).map(function (e, i) {
      var body = "";
      if (t(e.intro)) body += "<p>" + T(e.intro) + '</p><p class="gap"></p>';
      if (t(e.listTitle)) body += "<p><strong>" + T(e.listTitle) + "</strong></p>";
      body += itemList(e.items, "exp-more-" + i);
      return '<div class="tl-item">' + dateCol(e) + '<div class="tl-body">' + roleHead(e) +
        '<div class="tl-text">' + body + "</div></div>" + logoImg(e) + "</div>";
    }).join("");

    var free = (c.freelance || []).map(function (e, i) {
      var subs = (e.projects || []).map(function (p, j) {
        return '<div class="sub-project"><h4>' + T(p.name) + "</h4>" +
          (t(p.description) ? "<p>" + T(p.description) + "</p>" : "") + '<p class="gap"></p>' +
          (t(p.role) ? '<p><span class="medium">' + esc(ui("myRole")) + "</span> " + T(p.role) + "</p>" : "") +
          '<p class="medium">' + esc(ui("accomplishments")) + "</p>" + itemList(p.items, "free-more-" + i + "-" + j) + "</div>";
      }).join("");
      return '<div class="tl-item">' + dateCol(e) + '<div class="tl-body">' + roleHead(e) +
        '<div class="tl-text">' + subs + "</div></div>" + logoImg(e) + "</div>";
    }).join("");

    var side = "";
    [["blue", 0, 185, 215], ["orange", 167, 186, 215], ["purple", 312, 179, 214], ["blue", 482, 185, 215]].forEach(function (b) {
      side += '<div class="blob blob--' + b[0] + '" style="left:-50px;top:' + b[1] + "px;width:" + b[2] + "px;height:" + b[3] + 'px"></div>';
      side += '<div class="blob blob--' + b[0] + '" style="right:-50px;top:' + b[1] + "px;width:" + b[2] + "px;height:" + b[3] + 'px"></div>';
    });
    return side + '<section class="about-card glass reveal" style="--d:0"><div class="about-card__top">' +
      (a.photo ? '<div class="about-card__photo"><img src="' + esc(a.photo) + '" alt="' + T(c.site.logoAbout) + '"></div>' : "") +
      '<div class="about-card__text"><h1>' + T(a.title) + "</h1><p>" + text + "</p>" + cvButton(c) + "</div></div>" +
      '<div class="stats">' + stats + "</div></section>" +
      '<div class="container">' +
      '<section class="skills"><h2 class="block-title">' + T(c.skillsTitle) + '</h2><div class="timeline">' + skills + "</div></section>" +
      '<section class="experience"><h2 class="block-title">' + T(c.experienceTitle) + '</h2><div class="timeline">' + exp + "</div></section>" +
      '<section class="freelance"><h2 class="block-title">' + T(c.freelanceTitle) + '</h2><div class="timeline">' + free + "</div></section>" +
      "</div>";
  }

  /* ---------- render ---------- */
  function render(animateCounts) {
    var c = window.SITE_CONTENT;
    if (!c) return;
    applyLang();
    document.title = page === "about" ? (t(c.about.title) + " — " + t(c.site.logoAbout)) : t(c.site.pageTitle);
    document.getElementById("site-header").innerHTML = header(c);
    document.getElementById("site-main").innerHTML = page === "about" ? about(c) : home(c);
    document.getElementById("site-footer").innerHTML = footer(c);
    markMissingImages();
    if (animateCounts) countUp();
    onScroll();
    var dlg = document.getElementById("case-modal");
    if (dlg) dlg.addEventListener("close", onCaseClosed);
    if (openCaseIndex > -1) { var keep = openCaseIndex; openCaseIndex = -1; openCase(keep, false); }
  }

  // Sections without real content stay hidden: missing illustrations, icons not uploaded yet.
  function markMissingImages() {
    document.querySelectorAll(".illu img").forEach(function (img) {
      var btn = img.closest(".illu");
      function miss() { btn.classList.add("is-missing"); syncIllustrations(); }
      if (!img.getAttribute("src")) { miss(); return; }
      // lazy images never load off-screen, so probe each file directly
      var probe = new Image();
      probe.onerror = miss;
      probe.src = img.src;
    });
    document.querySelectorAll(".socials img").forEach(function (img) {
      function miss() { var a = img.closest("a"); if (a) a.hidden = true; }
      if (img.complete && img.naturalWidth === 0) miss();
      img.addEventListener("error", miss);
    });
    syncIllustrations();
  }
  function syncIllustrations() {
    var tiles = document.querySelectorAll(".illu");
    var shown = document.querySelectorAll(".illu:not(.is-missing)").length;
    var empty = tiles.length === 0 || shown === 0;
    var sec = document.getElementById("illustrations");
    if (sec) sec.hidden = empty;
    document.querySelectorAll('[data-nav="illustrations"]').forEach(function (a) { a.hidden = empty; });
  }

  /* ---------- interactions ---------- */
  function onScroll() {
    var hdr = document.getElementById("site-header");
    hdr.classList.toggle("is-scrolled", window.scrollY > 8);
    var vh = window.innerHeight;
    document.querySelectorAll(".timeline").forEach(function (tl) {
      var r = tl.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
      tl.style.setProperty("--progress", p);
      tl.querySelectorAll(".tl-item").forEach(function (item) {
        item.classList.toggle("is-active", item.getBoundingClientRect().top < vh * 0.6);
      });
    });
  }

  function countUp() {
    if (reduceMotion) return;
    document.querySelectorAll(".count").forEach(function (el) {
      var m = el.getAttribute("data-value").match(/^(\D*)(\d+)(\D*)$/);
      if (!m) return;
      var target = +m[2], start = null;
      function step(ts) {
        if (!start) start = ts;
        var k = Math.min(1, (ts - start) / 1100);
        el.textContent = m[1] + Math.round(target * (1 - Math.pow(1 - k, 3))) + m[3];
        if (k < 1) requestAnimationFrame(step);
      }
      el.textContent = m[1] + "0" + m[3];
      setTimeout(function () { requestAnimationFrame(step); }, 350);
    });
  }

  // Lightbox
  var lbIndex = 0;
  function lbItems() {
    return Array.prototype.slice.call(document.querySelectorAll(".illu:not(.is-missing)"));
  }
  function lbShow(btn) {
    var dlg = document.getElementById("lightbox");
    if (!dlg || !btn) return;
    var items = lbItems();
    lbIndex = items.indexOf(btn);
    var img = btn.querySelector("img");
    dlg.querySelector("figure img").src = img.src;
    dlg.querySelector("figure img").alt = img.alt;
    dlg.querySelector("figcaption").textContent = btn.querySelector(".illu__title").textContent;
    dlg.querySelector(".lb-prev").hidden = dlg.querySelector(".lb-next").hidden = items.length < 2;
    if (!dlg.open) dlg.showModal();
  }
  function lbStep(d) {
    var items = lbItems();
    if (!items.length) return;
    lbShow(items[(lbIndex + d + items.length) % items.length]);
  }

  document.addEventListener("error", function (e) {
    var el = e.target;
    if (el && el.tagName === "IMG" && !el.closest(".illu")) el.classList.add("img-missing");
  }, true);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  document.addEventListener("click", function (e) {
    var tgl = e.target.closest(".lang-toggle");
    if (tgl) {
      lang = tgl.getAttribute("data-lang");
      try { localStorage.setItem(LANG_KEY, lang); } catch (err) {}
      if (!isPreview) {
        var u = new URL(location.href);
        if (u.searchParams.has("lang")) { u.searchParams.set("lang", lang); history.replaceState(null, "", u); }
      }
      render(false);
      return;
    }
    var more = e.target.closest(".more-btn");
    if (more) {
      var box = document.getElementById(more.getAttribute("aria-controls"));
      var open = more.getAttribute("aria-expanded") === "true";
      box.hidden = open;
      more.setAttribute("aria-expanded", String(!open));
      more.textContent = open ? ui("showMore") + " (" + more.getAttribute("data-count") + ")" : ui("showLess");
      onScroll();
      return;
    }
    var copy = e.target.closest(".copy-btn");
    if (copy) {
      var text = copy.getAttribute("data-copy");
      var done = function () {
        copy.textContent = ui("copied");
        copy.classList.add("is-done");
        setTimeout(function () { copy.textContent = ui("copy"); copy.classList.remove("is-done"); }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
      return;
    }
    var opener = e.target.closest("[data-case]");
    if (opener) { openCase(+opener.getAttribute("data-case")); if (opener.classList.contains("cm-next")) document.querySelector("#case-modal .cm-scroll").scrollTop = 0; return; }
    if (e.target.closest(".cm-close")) { closeCase(); return; }
    var cm = e.target.closest(".case-modal");
    if (cm && e.target === cm) { closeCase(); return; }

    var illu = e.target.closest(".illu");
    if (illu && !illu.classList.contains("is-missing")) { lbShow(illu); return; }

    var dlg = e.target.closest(".lightbox");
    if (dlg) {
      if (e.target.closest(".lb-close") || e.target === dlg) { dlg.close(); return; }
      var rtl = lang === "fa";
      if (e.target.closest(".lb-next")) lbStep(rtl ? -1 : 1);
      if (e.target.closest(".lb-prev")) lbStep(rtl ? 1 : -1);
    }
  });

  document.addEventListener("keydown", function (e) {
    var dlg = document.getElementById("lightbox");
    if (!dlg || !dlg.open) return;
    if (e.key === "ArrowRight") lbStep(1);
    if (e.key === "ArrowLeft") lbStep(-1);
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (err) { /* ignore */ }
    ta.remove();
  }

  // Bubbles lean gently toward the cursor
  if (!reduceMotion) {
    document.addEventListener("mousemove", function (e) {
      var wrap = document.querySelector(".bubbles");
      if (!wrap || window.innerWidth < 960) return;
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      wrap.querySelectorAll(".bubble-wrap").forEach(function (b) {
        var d = +b.getAttribute("data-depth") || 1;
        b.style.transform = "translate(" + (x * 10 * d).toFixed(1) + "px," + (y * 8 * d).toFixed(1) + "px)";
      });
    });
  }

  // Live preview from admin.html
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "preview-content") {
      isPreview = true;
      window.SITE_CONTENT = e.data.content;
      if (e.data.lang) lang = e.data.lang;
      document.documentElement.classList.add("is-preview");
      var dlg = document.getElementById("case-modal");
      var y = dlg && dlg.open ? dlg.querySelector(".cm-scroll").scrollTop : 0;
      render(false);
      dlg = document.getElementById("case-modal");
      if (dlg && dlg.open) dlg.querySelector(".cm-scroll").scrollTop = y;
    }
    if (e.data && e.data.type === "open-case") {
      if (e.data.index === -1) closeCase(); else openCase(e.data.index);
    }
  });

  lang = pickLang();
  render(true);
  var deep = /^#case-(\d+)$/.exec(location.hash);
  if (deep) openCase(+deep[1] - 1);
  if (window.parent !== window) window.parent.postMessage({ type: "preview-ready" }, "*");
})();
