/* Custom, hand-built case study layouts.
   A project uses one by setting  caseStudy.layout = "<name>"  in content.js.
   Each layout is a fixed-width artboard (built 1:1 from Figma) that main.js
   scales to the modal's width. */
(function () {
  var L = (window.CASE_LAYOUTS = window.CASE_LAYOUTS || {});

  /* ---------- Online Gholak (Mahak) — Figma: HERA-Brands, node 6834:115697 ---------- */
  var A = "assets/projects/gholak/";
  var TXT = {
    fa: {
      title: "قلک آنلاین",
      team: "تیم ما",
      zahra: "زهرا عرفاتی", zahraRole: "طراح محصول و تصویرساز",
      parsa: "پارسا حسین زاده", parsaRole: "طراح محصول و مدیر پروژه",
      brief: "بریف پروژه",
      goalLabel: "هدف پروژه:",
      goal: "پروژه طراحی اپلیکیشن قلک آنلاین با هدف افزایش کمک‌های مردمی و ایجاد درآمدزایی از محصول فیزیکی قلک موسسه خیریه محک انجام شد. با توجه به روند دیجیتالی شدن جهان و کاهش استفاده از پول فیزیکی، این اپلیکیشن به عنوان یک راهکار نوین برای تسهیل فرآیند کمک‌های مردمی به کار گرفته شد. هدف این بود که کاربران بتوانند به سادگی و از طریق درگاه‌های آنلاین و بازی، به خیریه محک کمک کنند.",
      audienceLabel: "مخاطبان هدف:",
      audience: "جامعه هدف این اپلیکیشن شامل بزرگسالانی نظیر خانواده‌های بیماران سرطانی، مردم عادی و خیرین است. با توجه به اینکه موسسه محک یک بیمارستان کودکان است، طراحی ظاهر اپلیکیشن به صورت بازی‌مانند انجام شد تا هم کودکان و هم بزرگسالان بتوانند از آن استفاده کنند.",
      challengeLabel: "چالش ما:",
      challenge: "یکی از چالش‌های اصلی در ابتدای پروژه، کاهش کمک‌های مالی از طریق قلک‌های فیزیکی و انجام کمک‌ها به صورت سنتی بود. هدف این بود که محصولی طراحی شود که علاوه بر حفظ حس نوستالژی استفاده از قلک فیزیکی، تجربه‌ای مشابه انداختن پول در قلک را نیز برای کاربران ایجاد کند.",
      ideation: "ایده پردازی و طراحی اولیه",
      wireframes: "وایرفریم",
      character: "طراحی نهایی کاراکتر و فضا",
      ui: "رابط کاربری",
      thanks: "سپاس از توجه شما"
    },
    en: {
      title: "Online Gholak",
      team: "Our team",
      zahra: "Zahra Arafati", zahraRole: "Product designer & illustrator",
      parsa: "Parsa Hosseinzadeh", parsaRole: "Product designer & PM",
      brief: "Project brief",
      goalLabel: "Project goal:",
      goal: "The Online Gholak app was designed to grow public donations and to create revenue from Mahak charity’s physical piggy bank (gholak). As the world goes digital and people carry less cash, the app became a new way to make giving easier: anyone can donate to Mahak simply, through online payment and play.",
      audienceLabel: "Target audience:",
      audience: "The app is for adults — families of children with cancer, the general public and donors. Because Mahak is a children’s hospital, the app was given a playful, game-like look so both children and adults can use it.",
      challengeLabel: "Our challenge:",
      challenge: "At the start, donations through physical piggy banks and traditional channels were falling. The goal was a product that keeps the nostalgia of a real piggy bank while recreating the feeling of dropping a coin into it.",
      ideation: "Ideation & early sketches",
      wireframes: "Wireframes",
      character: "Final character & world design",
      ui: "User interface",
      thanks: "Thanks for your attention"
    }
  };

  L.gholak = {
    width: 721,
    height: 5285,
    html: function (lang) {
      var s = TXT[lang] || TXT.fa, dir = lang === "fa" ? "rtl" : "ltr";
      function img(src, cls) { return '<img src="' + A + src + '" alt="" class="' + (cls || "") + '" loading="lazy" decoding="async">'; }
      function phone(name, x, y, h, shadow, inner) {
        return '<div class="gk-phone' + (shadow ? " has-shadow" : "") + '" style="left:' + x + "px;top:" + y + "px;height:" + h + 'px">' +
          (inner || img(name + ".webp", "gk-cover")) + "</div>";
      }
      function cloud(x, y, w, h) {
        return '<div class="gk-crop" style="left:' + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + 'px">' +
          '<img src="' + A + 'character-4.webp" alt="" loading="lazy" style="left:0;top:-17.54%;width:100%;height:148.25%"></div>';
      }
      function member(x, w, nameX, roleX, name, role, ringX, extra) {
        return '<div class="gk-member" style="left:' + x + "px;width:" + w + 'px">' +
          '<p class="gk-name" style="left:' + nameX + 'px">' + name + "</p>" +
          '<p class="gk-role" style="left:' + roleX + 'px">' + role + "</p>" +
          '<img src="' + A + 'avatar-ring.svg" alt="" class="gk-ring" style="left:' + ringX + 'px">' +
          '<img src="' + A + 'avatar-zahra.webp" alt="" class="gk-avatar" style="left:' + (ringX + 2) + 'px">' +
          (extra || "") + "</div>";
      }

      return '<div class="gk" lang="' + lang + '"><div class="gk-stage">' +

        /* frame 1: hero + team + brief (0–1195) */
        '<section class="gk-sec gk-bg-down" style="top:0;height:461px">' +
          '<img src="' + A + 'wave-top.svg" alt="" class="gk-abs" style="left:-31px;top:131.49px;width:772px;height:329.51px">' +
          '<h2 class="gk-title" id="cm-title"><img src="' + A + 'logo-fa.svg" alt="' + s.title + '" width="179" height="52"></h2>' +
          phone("gholak", 291, 60, 303, true) +
          phone("gholak3", -29, 60, 303, true) +
          phone("ghollak", 451, 92, 302.974) +
          phone("explore", 611, 60, 303, false, '<img src="' + A + 'explore.webp" alt="" class="gk-abs" style="left:0;top:.79%;width:100%;height:170.36%">') +
          phone("onboarding", 131, 92, 302.974) +
        "</section>" +
        '<img src="' + A + 'wave-brief.svg" alt="" class="gk-abs" style="left:0;top:905px;width:721px;height:290px">' +
        '<section class="gk-sec" style="top:460px;height:446px">' +
          '<img src="' + A + 'wave-team.svg" alt="" class="gk-abs gk-flip-y" style="left:0;top:-1px;width:721px;height:481px">' +
          '<h3 class="gk-h gk-h-18" style="left:614px;top:80px">' + s.team + "</h3>" +
          member(85, 217, 95.5, 66, s.zahra, s.zahraRole, 156) +
          member(415, 222, 82, 68.5, s.parsa, s.parsaRole, 161,
            '<img src="' + A + 'avatar-ring.svg" alt="" class="gk-ring" style="left:161px">' +
            '<div class="gk-parsa"><div class="gk-crop" style="left:1.934px;top:8.705px;width:57.066px;height:53.197px">' +
              '<img src="' + A + 'avatar-parsa.webp" alt="" style="left:0;top:-8.04%;width:100%;height:108.28%"></div></div>') +
        "</section>" +
        '<div class="gk-brief" dir="' + dir + '">' +
          '<h3 class="gk-brief-title">' + s.brief + "</h3>" +
          '<div class="gk-brief-body">' +
            "<p><b>" + s.goalLabel + "</b> " + s.goal + "</p>" +
            "<p><b>" + s.audienceLabel + "</b> " + s.audience + "</p>" +
            "<p><b>" + s.challengeLabel + "</b> " + s.challenge + "</p>" +
          "</div>" +
        "</div>" +

        /* frame 2: ideation & sketches (1195–1929) */
        '<section class="gk-sec gk-bg-up" style="top:1195px;height:734px">' +
          '<h3 class="gk-h gk-h-20" style="left:373px;top:0;width:210px">' + s.ideation + "</h3>" +
          '<div class="gk-card" style="left:54px;top:61px;width:189px;height:184px">' + img("character-1.webp", "gk-cover") + "</div>" +
          '<div class="gk-card" style="left:266px;top:61px;width:189px;height:184px">' + img("character-2.webp", "gk-cover") + "</div>" +
          '<div class="gk-card is-white" style="left:479px;top:61px;width:189px;height:184px">' + img("character-3.webp", "gk-cover") + "</div>" +
          '<div class="gk-card" style="left:54px;top:265px;width:614px;height:415px">' + img("sketches.webp", "gk-cover") + "</div>" +
        "</section>" +

        /* frame 3: wireframes (1928–2951) */
        '<div class="gk-abs" style="left:0;top:1928px;width:721px;height:1023px">' +
          '<section class="gk-sec gk-bg-down" style="top:0;height:1023px">' +
            '<img src="' + A + 'wave-long.svg" alt="" class="gk-abs" style="left:0;top:44.97px;width:721px;height:978.031px">' +
            '<h3 class="gk-h gk-h-20" style="left:361px;top:77px;width:210px">' + s.wireframes + "</h3>" +
          "</section>" +
          '<div class="gk-abs" style="left:19px;top:127px;width:683px;height:910px">' + img("wireframes.webp", "gk-cover") + "</div>" +
        "</div>" +

        /* frame 5: user interface (3928–4891) */
        '<section class="gk-sec gk-bg-up" style="top:3928px;height:963px">' +
          '<h3 class="gk-h gk-h-20" style="left:361px;top:52px;width:210px">' + s.ui + "</h3>" +
          '<div class="gk-abs" style="left:43px;top:113px;width:636px;height:798px">' + img("ui.webp", "gk-cover") + "</div>" +
        "</section>" +

        /* frame 6: thanks (4888–5285) */
        '<section class="gk-sec gk-bg-down" style="top:4888px;height:397px">' +
          '<h3 class="gk-h gk-h-25" style="left:378px;top:182px">' + s.thanks + "</h3>" +
          '<div class="gk-crop gk-flip-x" style="left:238px;top:182px;width:32px;height:32px">' +
            '<img src="' + A + 'heart.webp" alt="" loading="lazy" style="left:-3.65%;top:-3.09%;width:107.85%;height:107.54%"></div>' +
          '<div class="gk-crop" style="left:669px;top:20px;width:92px;height:92px">' +
            '<img src="' + A + 'img-7696.webp" alt="" loading="lazy" style="left:-12.25%;top:-18.87%;width:128.15%;height:128.15%"></div>' +
          cloud(42, 0, 164, 89) + cloud(-78, 55, 188, 127) + cloud(606, 66, 188, 127) +
        "</section>" +

        /* frame 4: final character & world (2937–3960, drawn on top like in Figma) */
        '<section class="gk-sec" style="top:2937px;height:1023px">' +
          '<img src="' + A + 'wave-long.svg" alt="" class="gk-abs gk-flip-y" style="left:0;top:0;width:721px;height:978.031px">' +
          '<div class="gk-final">' +
            '<h3 class="gk-final-title">' + s.character + "</h3>" +
            '<div class="gk-crop gk-final-img"><img src="' + A + 'colors-faces.webp" alt="" loading="lazy" style="left:-2.09%;top:-1.4%;width:103.29%;height:103.1%"></div>' +
          "</div>" +
        "</section>" +

      "</div></div>";
    }
  };
})();
