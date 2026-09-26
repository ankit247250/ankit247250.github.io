/* ============================================================
   Bansal International School — site behaviour
   ------------------------------------------------------------
   SCHOOL VIDEO:
   `videoUrl` below points at the school film on YouTube
   (https://youtu.be/lIr4FbOtliw). It plays in the lightbox
   when the "Play School Video" card under the hero is clicked.
   Swap it for either
     • a YouTube / Vimeo EMBED url, e.g.
         "https://www.youtube.com/embed/VIDEO_ID"
     • or a self-hosted file, e.g. "assets/video/school-video.mp4"
   Leave it empty and the player shows a friendly holding message.
   ============================================================ */
const SITE = {
  videoUrl: "https://www.youtube.com/embed/lIr4FbOtliw",   // Bansal International School film
  videoPoster: "assets/img/school-render.jpg"
};

document.documentElement.classList.remove("no-js");

/* ---------- Scroll reveal ---------- */
(function revealOnScroll () {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // gentle stagger for siblings entering together
      const delay = Math.min(i * 90, 360);
      window.setTimeout(() => entry.target.classList.add("is-in"), delay);
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  items.forEach(el => io.observe(el));
})();

/* ---------- Video lightbox ---------- */
(function videoLightbox () {
  const trigger  = document.getElementById("playVideo");
  const lightbox = document.getElementById("lightbox");
  const stage    = document.getElementById("lightboxStage");
  if (!trigger || !lightbox || !stage) return;

  let lastFocused = null;

  function buildPlayer () {
    stage.innerHTML = "";
    const url = (SITE.videoUrl || "").trim();

    if (!url) {
      const note = document.createElement("p");
      note.className = "lightbox__note";
      note.innerHTML = "The school film is being finalised.<br>Please check back soon.";
      stage.appendChild(note);
      return;
    }

    if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.poster = SITE.videoPoster;
      stage.appendChild(video);
      return;
    }

    const frame = document.createElement("iframe");
    frame.src = url + (url.includes("?") ? "&" : "?") + "autoplay=1&rel=0";
    frame.title = "Bansal International School video";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    frame.allowFullscreen = true;
    stage.appendChild(frame);
  }

  function open () {
    lastFocused = document.activeElement;
    buildPlayer();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox__close").focus();
  }

  function close () {
    lightbox.hidden = true;
    stage.innerHTML = "";                 // stops playback
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  trigger.addEventListener("click", open);

  lightbox.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) close();
    if (e.key !== "Tab" || lightbox.hidden) return;

    // simple focus trap
    const focusables = lightbox.querySelectorAll("button, iframe, video, [href]");
    if (!focusables.length) return;
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
