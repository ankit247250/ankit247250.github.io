/* ============================================================
   Bansal International School — site behaviour
   ------------------------------------------------------------
   SCHOOL VIDEO:
   `videoUrl` below points at the school film on YouTube
   (https://youtu.be/lIr4FbOtliw — "Introduction | Bansal International
   School | Kalali"). Clicking the "Play School Video" card below the hero
   swaps the poster for the real player, in place. No popup, nothing to
   get out of sync.

   Swap `videoUrl` for either
     • a YouTube / Vimeo EMBED url, e.g.
         "https://www.youtube-nocookie.com/embed/VIDEO_ID"
     • or a self-hosted file, e.g. "assets/video/school-video.mp4"
   Leave it empty and the card shows a friendly holding message.
   ============================================================ */
const SITE = {
  // privacy-enhanced mode — YouTube sets no cookies until playback starts
  videoUrl: "https://www.youtube-nocookie.com/embed/lIr4FbOtliw",
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

/* ---------- School film: plays in place, where the poster is ---------- */
(function schoolVideo () {
  const card    = document.getElementById("videoCard");
  const trigger = document.getElementById("playVideo");
  const stage   = document.getElementById("videoPlayer");
  if (!card || !trigger || !stage) return;

  let started = false;

  function buildPlayer () {
    const url = (SITE.videoUrl || "").trim();

    if (!url) {
      const note = document.createElement("p");
      note.className = "video-card__note";
      note.innerHTML = "The school film is being finalised.<br>Please check back soon.";
      stage.appendChild(note);
      return;
    }

    // self-hosted file?
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

    // YouTube / Vimeo embed
    const frame = document.createElement("iframe");
    frame.src = url + (url.includes("?") ? "&" : "?") +
                "autoplay=1&rel=0&playsinline=1&modestbranding=1";
    frame.title = "Introduction | Bansal International School, Kalali";
    frame.setAttribute("allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; " +
      "gyroscope; picture-in-picture; web-share");
    frame.setAttribute("allowfullscreen", "");
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    stage.appendChild(frame);
  }

  function start () {
    if (started) return;
    started = true;
    buildPlayer();
    card.classList.add("is-playing");           // poster out, player in
    trigger.setAttribute("aria-expanded", "true");
  }

  trigger.addEventListener("click", start);
})();
