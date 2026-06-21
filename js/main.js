/* ===== ASCEND — interactions ===== */

/* ---- per-retreat data: edit here, nothing else ---- */
const RETREATS = [
  // PLACEHOLDER: real dates + lengths
  { name: "Fall 2026", when: "Dates announced soon", status: "Applications open" },
];
const NEXT_RETREAT_LABEL = "Next retreat: Fall 2026";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = matchMedia("(max-width: 820px)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---- analytics (no-op until Plausible enabled) ---- */
function track(name, props) {
  if (window.plausible) plausible(name, props ? { props } : undefined);
}
$$("[data-event]").forEach(el =>
  el.addEventListener("click", () => track(el.dataset.event))
);

/* ---- retreat list render ---- */
$("#heroDate").textContent = NEXT_RETREAT_LABEL;
$("#retreatList").innerHTML = RETREATS.map(r => `
  <div class="retreat">
    <span class="retreat-name">${r.name}</span>
    <span class="retreat-when">${r.when}</span>
    <span class="retreat-status">${r.status}</span>
  </div>`).join("");

/* ---- hero video (lazy, poster paints first) ---- */
const heroVideo = $("#heroVideo");
const heroSrc = mobile ? "assets/video/hero-mobile.mp4" : "assets/video/hero-desktop.mp4";
if (!reduced && !(navigator.connection && navigator.connection.saveData)) {
  heroVideo.src = heroSrc;
  heroVideo.load();
  heroVideo.addEventListener("canplay", () => {
    heroVideo.classList.add("ready");
    heroVideo.play().catch(() => {});
  }, { once: true });
}

/* ---- film lightbox ---- */
const lightbox = $("#lightbox"), film = $("#filmPlayer");
lightbox.hidden = true;
$("#watchFilm").addEventListener("click", () => {
  lightbox.hidden = false;
  heroVideo.pause();
  film.play().catch(() => {});
});
function closeFilm() {
  film.pause();
  lightbox.hidden = true;
  if (heroVideo.classList.contains("ready")) heroVideo.play().catch(() => {});
}
$("#lightboxClose").addEventListener("click", closeFilm);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeFilm(); });
addEventListener("keydown", e => { if (e.key === "Escape" && !lightbox.hidden) closeFilm(); });

/* ---- nav state + sticky CTA ---- */
const nav = $("#nav"), sticky = $("#stickyCta"), hero = $("#basecamp"), summit = $("#summit");
let pastHero = false, atSummit = false;
new IntersectionObserver(([e]) => {
  pastHero = !e.isIntersecting;
  nav.classList.toggle("scrolled", pastHero);
  updateSticky();
}, { threshold: 0.05 }).observe(hero);
new IntersectionObserver(([e]) => { atSummit = e.isIntersecting; updateSticky(); }, { threshold: 0.15 }).observe(summit);
function updateSticky() { sticky.classList.toggle("show", pastHero && !atSummit); }

/* ---- light arc: body background follows the climb ---- */
const skySections = $$("[data-sky]");
skySections.forEach(sec => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) document.body.style.backgroundColor = sec.dataset.sky;
  }, { rootMargin: "-40% 0px -40% 0px" }).observe(sec);
});

/* ---- mountain navigator (desktop) ---- */
const waySections = $$("[data-way]");
const mtnPath = $("#mtnPath"), mtnDot = $("#mtnDot"), wayList = $("#waypoints");
if (mtnPath) {
  const len = mtnPath.getTotalLength();
  const svg = mtnPath.closest("svg");
  waySections.forEach((sec, i) => {
    const t = waySections.length === 1 ? 0 : i / (waySections.length - 1);
    const pt = mtnPath.getPointAtLength(len * (1 - t)); // bottom→top
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + sec.id;
    a.dataset.label = sec.dataset.way;
    a.setAttribute("aria-label", sec.dataset.way);
    // map SVG coords → CSS px inside the 64×240 box
    a.style.left = (pt.x / 80 * 64) + "px";
    a.style.top = (pt.y / 300 * 240) + "px";
    li.appendChild(a); wayList.appendChild(li);
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        $$("a", wayList).forEach(x => x.classList.remove("active"));
        a.classList.add("active");
        const d = mtnPath.getPointAtLength(len * (1 - t));
        mtnDot.setAttribute("cx", d.x); mtnDot.setAttribute("cy", d.y);
      }
    }, { rootMargin: "-45% 0px -45% 0px" }).observe(sec);
  });
  mtnDot.setAttribute("cx", mtnPath.getPointAtLength(len).x);
  mtnDot.setAttribute("cy", mtnPath.getPointAtLength(len).y);
}

/* ---- reveals + golden trail draw (GSAP if available) ---- */
if (!reduced && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  $$("[data-reveal]").forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 82%" }
    });
  });
  const trail = $("#trailPath");
  if (trail) {
    const tl = trail.getTotalLength();
    gsap.set(trail, { strokeDasharray: tl, strokeDashoffset: tl });
    gsap.to(trail, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: ".trail-wrap", start: "top 75%", end: "bottom 60%", scrub: 0.6 }
    });
  }
} else {
  $$("[data-reveal]").forEach(el => el.classList.add("in"));
}

/* ---- edge clip: load + play when visible, tap to toggle sound off/on stays muted ---- */
const edge = $(".phase-video");
if (edge) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !edge.src) {
      edge.src = edge.dataset.src;
      edge.play().catch(() => {});
    } else if (!e.isIntersecting && edge.src) {
      edge.pause();
    } else if (e.isIntersecting && edge.src) {
      edge.play().catch(() => {});
    }
  }, { threshold: 0.4 }).observe(edge);
}

/* ---- testimonial players ---- */
$$(".voice-play").forEach(btn => {
  btn.addEventListener("click", () => {
    const vid = document.createElement("video");
    vid.src = btn.dataset.video;
    vid.controls = true; vid.playsInline = true; vid.autoplay = true;
    $$(".voice video").forEach(v => { v.pause(); });
    btn.replaceWith(vid);
    track("testimonial-play");
  });
});

/* ---- forms ---- */
const PLACEHOLDER_ACTION = "FORMSPREE_ID_PLACEHOLDER";

const applyForm = $("#applyForm"), confirmation = $("#confirmation");
applyForm.addEventListener("submit", async e => {
  e.preventDefault();
  if (!applyForm.reportValidity()) return;
  track("form-submit");
  const done = () => {
    applyForm.hidden = true;
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };
  if (applyForm.action.includes(PLACEHOLDER_ACTION)) { done(); return; } // demo until Formspree ID set
  try {
    const res = await fetch(applyForm.action, {
      method: "POST", body: new FormData(applyForm), headers: { Accept: "application/json" }
    });
    if (res.ok) done(); else alert("Something went wrong — please try again.");
  } catch { alert("Something went wrong — please try again."); }
});
$$("#applyForm input, #applyForm textarea").forEach(f =>
  f.addEventListener("focus", () => track("form-start"), { once: true })
);

const listForm = $("#listForm"), listDone = $("#listDone");
listForm.addEventListener("submit", async e => {
  e.preventDefault();
  track("list-join");
  const finish = () => {
    $(".list-row", listForm).hidden = true;
    $(".list-lede", listForm).hidden = true;
    listDone.hidden = false;
  };
  if (listForm.action.includes(PLACEHOLDER_ACTION)) { finish(); return; }
  try {
    const res = await fetch(listForm.action, {
      method: "POST", body: new FormData(listForm), headers: { Accept: "application/json" }
    });
    if (res.ok) finish();
  } catch { /* quiet */ }
});
