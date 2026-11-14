/* ================================================================
       PERSONALIZE THESE VALUES BEFORE SHARING THE INVITATION
       Include the event's UTC offset, e.g. India: +05:30.
       ================================================================ */
    const WEDDING_DATE = "2026-11-25T21:30:00+05:30"; // Wedding date and time in India Standard Time.
    const EVENT_TIME_ZONE = "Asia/Kolkata"; // Keep this aligned with the event's local time zone.
    const VENUE = "Dwaraka Tirumala, Andhra Pradesh";
    const GOOGLE_MAPS_URL = "https://share.google/h0EywuwyLOZexLkQ1";
    const LUNCH_VENUE = "Gopinadhapatnam";
    const LUNCH_MAPS_URL = "https://maps.app.goo.gl/WRSdkGC2mhPDMd9V7";
    const AUTO_SECONDS = 20;
    const AUTO_MS = AUTO_SECONDS * 1000;

    const screens = [...document.querySelectorAll(".screen")];
    const progress = document.getElementById("globalProgress");
    const playBtn = document.getElementById("playBtn");
    const music = document.getElementById("weddingMusic");
    const musicBtn = document.getElementById("musicBtn");
    document.querySelectorAll(".portrait img").forEach(image => {
      const showImage = () => image.closest(".portrait").classList.add("has-image");
      const showFallback = () => {
        image.hidden = true;
        const fallback = image.closest(".portrait").querySelector(".portrait-placeholder small");
        if (fallback) fallback.textContent = "Portrait could not be loaded";
      };
      image.addEventListener("load", showImage);
      image.addEventListener("error", showFallback);
      if (image.complete) {
        if (image.naturalWidth > 0) showImage();
        else showFallback();
      }
    });
    let currentPage = 1;
    let autoPlay = true;
    let autoTimer = null;
    let tickTimer = null;
    let timerDeadline = 0;
    let timerPage = 0;
    let remainingMs = AUTO_MS;
    let pausedForVisibility = false;
    let pendingPetals = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Keep ambient decoration static and bounded instead of creating effects on an interval.
    const dustLayer = document.getElementById("dustLayer");
    for (let i = 0; i < 16; i++) {
      const dot = document.createElement("i");
      dot.className = "dust";
      dot.style.left = Math.random() * 100 + "vw";
      dot.style.top = Math.random() * 100 + "vh";
      dot.style.animationDelay = (Math.random() * 3) + "s";
      dustLayer.appendChild(dot);
    }

    // Petals are created only after a guest action and are capped to avoid DOM buildup.
    function createPetal(burst = false) {
      if (document.querySelectorAll(".petal").length >= 24) return;
      const petal = document.createElement("span");
      const symbols = ["✿", "❀", "✾", "✽"];
      petal.className = "petal";
      petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.fontSize = (10 + Math.random() * 13) + "px";
      petal.style.color = Math.random() > .5 ? "#E9A0A0" : "#E8C86A";
      petal.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");
      petal.style.setProperty("--spin", (Math.random() * 600 - 300) + "deg");
      petal.style.animationDuration = (burst ? 2.2 : 7 + Math.random() * 7) + "s";
      document.body.appendChild(petal);
      setTimeout(() => petal.remove(), burst ? 2400 : 15000);
    }
    function showerPetals(amount = 18) {
      if (reducedMotion) return;
      const current = document.querySelectorAll(".petal").length;
      const count = Math.min(24 - current - pendingPetals, Math.max(0, Math.floor(amount)));
      for (let i = 0; i < count; i++) {
        pendingPetals++;
        setTimeout(() => {
          pendingPetals--;
          createPetal(true);
        }, i * 45);
      }
    }

    function updateNavigation() {
      progress.style.width = (currentPage / screens.length * 100) + "%";
      progress.parentElement.setAttribute("aria-valuenow", currentPage);
      document.getElementById("pageControls").classList.toggle("hide", currentPage === 1 || currentPage === screens.length);
      document.getElementById("prevBtn").disabled = currentPage === 1;
      document.getElementById("prevBtn").style.opacity = currentPage === 1 ? ".35" : "1";
      document.getElementById("nextBtn").disabled = currentPage === screens.length;
      document.getElementById("nextBtn").style.opacity = currentPage === screens.length ? ".35" : "1";
    }

    function updateTimerDisplay(ms, page = currentPage, updateBar = true) {
      const left = Math.max(0, Math.ceil(ms / 1000));
      const fill = document.getElementById("timer" + page);
      const seconds = document.getElementById("seconds" + page);
      const copy = document.getElementById("timerCopy" + page);
      if (seconds) seconds.textContent = left;
      if (copy) {
        const destination = page === 2 ? "the groom's story" : "wedding details";
        copy.textContent = autoPlay ? "Moving to " + destination : "Automatic advance is paused";
      }
      if (fill && updateBar) {
        fill.style.transition = "none";
        fill.style.transform = "scaleX(" + Math.max(0, Math.min(1, ms / AUTO_MS)) + ")";
      }
    }

    function stopAutoTimer(preserveRemaining = false) {
      const previousPage = timerPage;
      if (autoTimer !== null) {
        if (preserveRemaining) remainingMs = Math.max(0, timerDeadline - performance.now());
        clearTimeout(autoTimer);
      }
      if (tickTimer !== null) clearInterval(tickTimer);
      const previousFill = document.getElementById("timer" + previousPage);
      if (previousFill) {
        previousFill.style.transition = "none";
        previousFill.style.transform = "scaleX(" + Math.max(0, Math.min(1, remainingMs / AUTO_MS)) + ")";
      }
      autoTimer = null;
      tickTimer = null;
      timerDeadline = 0;
      timerPage = 0;
    }

    function startAutoTimer(ms = AUTO_SECONDS * 1000) {
      stopAutoTimer();
      if (currentPage !== 2 && currentPage !== 3) return;
      remainingMs = Math.max(0, Math.min(AUTO_MS, ms));
      if (!autoPlay) {
        updateTimerDisplay(remainingMs);
        return;
      }
      timerDeadline = performance.now() + remainingMs;
      timerPage = currentPage;
      updateTimerDisplay(remainingMs);
      const fill = document.getElementById("timer" + timerPage);
      requestAnimationFrame(() => {
        if (fill && autoTimer !== null && currentPage === timerPage && autoPlay) {
          fill.style.transition = "transform " + remainingMs + "ms linear";
          fill.style.transform = "scaleX(0)";
        }
      });
      tickTimer = setInterval(() => {
        if (currentPage !== timerPage || autoTimer === null) return;
        remainingMs = Math.max(0, timerDeadline - performance.now());
        updateTimerDisplay(remainingMs, currentPage, false);
      }, 250);
      autoTimer = setTimeout(() => {
        autoTimer = null;
        if (tickTimer !== null) clearInterval(tickTimer);
        tickTimer = null;
        const destination = timerPage + 1;
        timerPage = 0;
        remainingMs = 0;
        if (autoPlay && currentPage === destination - 1) goTo(destination);
      }, remainingMs);
    }

    function goTo(page, moveFocus = false) {
      const target = Math.max(1, Math.min(screens.length, page));
      if (target === currentPage) return;
      stopAutoTimer();
      currentPage = target;
      remainingMs = AUTO_MS;
      screens.forEach((screen, index) => {
        const active = index === target - 1;
        screen.classList.toggle("active", active);
        screen.setAttribute("aria-hidden", String(!active));
        screen.toggleAttribute("inert", !active);
        if (active) {
          screen.scrollTop = 0;
          if (moveFocus) screen.focus({ preventScroll: true });
        }
      });
      updateNavigation();
      if (target === 2 || target === 3) startAutoTimer(AUTO_MS);
      else {
        updateTimerDisplay(AUTO_MS, 2);
        updateTimerDisplay(AUTO_MS, 3);
      }
    }

    document.getElementById("openInvitation").addEventListener("click", () => {
      showerPetals(45);
      goTo(2, true);
    });
    document.getElementById("prevBtn").addEventListener("click", () => goTo(currentPage - 1, true));
    document.getElementById("nextBtn").addEventListener("click", () => goTo(currentPage + 1, true));
    document.querySelectorAll("[data-goto]").forEach(btn => btn.addEventListener("click", () => goTo(Number(btn.dataset.goto), true)));
    document.getElementById("replayBtn").addEventListener("click", () => {
      autoPlay = true;
      updatePlayButton();
      goTo(1, true);
      showerPetals(18);
    });

    function updatePlayButton() {
      playBtn.innerHTML = autoPlay ? "Ⅱ <span class='hidden sm:inline'>Pause</span>" : "▶ <span class='hidden sm:inline'>Resume</span>";
      playBtn.setAttribute("aria-label", autoPlay ? "Pause automatic page advance" : "Resume automatic page advance");
      playBtn.setAttribute("aria-pressed", String(!autoPlay));
    }

    playBtn.addEventListener("click", () => {
      if (autoPlay) {
        stopAutoTimer(true);
        autoPlay = false;
        updateTimerDisplay(remainingMs);
      } else {
        autoPlay = true;
        if (currentPage === 2 || currentPage === 3) startAutoTimer(remainingMs);
      }
      updatePlayButton();
    });

    musicBtn.addEventListener("click", async () => {
      if (music.paused) {
        const source = music.querySelector("source");
        if (source && source.getAttribute("src").startsWith("YOUR-LICENSED-")) {
          musicBtn.title = "Add a valid, licensed MP3 file beside this HTML to enable music.";
          document.getElementById("musicStatus").textContent = "Music is not configured. Add a valid, licensed MP3 file beside this HTML.";
          return;
        }
        try {
          await music.play();
          document.getElementById("musicStatus").textContent = "Wedding music is playing.";
        } catch (error) {
          musicBtn.title = "Audio could not be played. Add a valid, licensed MP3 file beside this HTML.";
          document.getElementById("musicStatus").textContent = "Music is unavailable. Add a valid, licensed MP3 file beside this HTML.";
        }
      } else {
        music.pause();
        document.getElementById("musicStatus").textContent = "Wedding music paused.";
      }
    });
    music.addEventListener("play", () => {
      musicBtn.textContent = "♫";
      musicBtn.setAttribute("aria-label", "Pause wedding music");
      musicBtn.setAttribute("aria-pressed", "true");
    });
    music.addEventListener("pause", () => {
      musicBtn.textContent = "♪";
      musicBtn.setAttribute("aria-label", "Play wedding music");
      musicBtn.setAttribute("aria-pressed", "false");
    });
    music.addEventListener("error", () => {
      music.pause();
      musicBtn.textContent = "♪";
      musicBtn.setAttribute("aria-label", "Play wedding music");
      musicBtn.setAttribute("aria-pressed", "false");
      musicBtn.title = "Audio could not be loaded. Add a valid, licensed MP3 file beside this HTML.";
      document.getElementById("musicStatus").textContent = "Music could not be loaded. Add a valid, licensed MP3 file beside this HTML.";
    });

    document.addEventListener("keydown", event => {
      const element = event.target;
      const typing = element instanceof HTMLElement &&
        (element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName));
      if (typing) return;
      if (event.key === "ArrowRight") { event.preventDefault(); goTo(currentPage + 1, true); }
      if (event.key === "ArrowLeft") { event.preventDefault(); goTo(currentPage - 1, true); }
      if (event.key === "Escape" && !music.paused) music.pause();
    });

    // The explicit offset keeps the countdown accurate for guests in other time zones.
    function updateCountdown() {
      const target = new Date(WEDDING_DATE).getTime();
      const diff = target - Date.now();
      if (!Number.isFinite(target)) {
        document.getElementById("countdown").setAttribute("aria-label", "Wedding date is not configured");
        return;
      }
      if (diff <= 0) {
        ["days","hours","minutes","seconds"].forEach(id => document.getElementById(id).textContent = "00");
        document.getElementById("countdown").setAttribute("aria-label", "The wedding day has arrived");
        return;
      }
      document.getElementById("days").textContent = Math.floor(diff / 86400000);
      document.getElementById("hours").textContent = String(Math.floor(diff / 3600000) % 24).padStart(2,"0");
      document.getElementById("minutes").textContent = String(Math.floor(diff / 60000) % 60).padStart(2,"0");
      document.getElementById("seconds").textContent = String(Math.floor(diff / 1000) % 60).padStart(2,"0");
    }

    function calendarDate(date) {
      return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    }

    document.getElementById("mapsLink").href = GOOGLE_MAPS_URL;
    document.getElementById("lunchMapsLink").href = LUNCH_MAPS_URL;
    document.getElementById("closingWeddingMap").href = GOOGLE_MAPS_URL;
    document.getElementById("closingLunchMap").href = LUNCH_MAPS_URL;
    const eventStart = new Date(WEDDING_DATE);
    if (Number.isFinite(eventStart.getTime())) {
      const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);
      const eventDateFormat = new Intl.DateTimeFormat("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: EVENT_TIME_ZONE
      });
      const eventTimeFormat = new Intl.DateTimeFormat("en-US", {
        hour: "numeric", minute: "2-digit", hour12: true, timeZone: EVENT_TIME_ZONE
      });
      const displayedEventDate = eventDateFormat.format(eventStart);
      const displayedEventTime = eventTimeFormat.format(eventStart);
      document.getElementById("eventDate").textContent = displayedEventDate;
      document.getElementById("eventTime").textContent = displayedEventTime;
      document.getElementById("closingEventDate").textContent = displayedEventDate;
      document.getElementById("closingLunchDate").textContent = displayedEventDate;
      document.getElementById("closingEventTime").textContent = displayedEventTime;
      const calendarParams = new URLSearchParams({
        action: "TEMPLATE",
        text: "Gudla's Wedding",
        dates: calendarDate(eventStart) + "/" + calendarDate(eventEnd),
        details: "Wedding ceremony and celebration with Gudla's family. Muhurtham at " + eventTimeFormat.format(eventStart) +
          " IST. Family lunch is on 25 November afternoon at " + LUNCH_VENUE + ".",
        location: VENUE
      });
      document.getElementById("calendarLink").href = "https://calendar.google.com/calendar/render?" + calendarParams.toString();
    } else {
      document.getElementById("calendarLink").hidden = true;
    }
    const hostedUrl = /^https?:$/.test(window.location.protocol) ? window.location.href : "";
    const formattedEventDate = Number.isFinite(eventStart.getTime())
      ? new Intl.DateTimeFormat("en-IN", {
          weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: EVENT_TIME_ZONE
        }).format(eventStart)
      : "the date to be confirmed";
    const shareText = "You are warmly invited to Gudla's wedding on " + formattedEventDate + " at " +
      (Number.isFinite(eventStart.getTime())
        ? new Intl.DateTimeFormat("en-US", {
            hour: "numeric", minute: "2-digit", hour12: true, timeZone: EVENT_TIME_ZONE
          }).format(eventStart)
        : "the time to be confirmed") + " IST at " + VENUE +
      ". Lunch follows on 25 November afternoon at " + LUNCH_VENUE + ": " + LUNCH_MAPS_URL + "." +
      (hostedUrl ? " Invitation: " + hostedUrl : "");
    document.getElementById("shareLink").href = "https://wa.me/?text=" + encodeURIComponent(shareText);
    updateCountdown();
    setInterval(updateCountdown, 1000);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && autoTimer !== null) {
        stopAutoTimer(true);
        pausedForVisibility = true;
      } else if (!document.hidden && pausedForVisibility) {
        pausedForVisibility = false;
        if (autoPlay && (currentPage === 2 || currentPage === 3)) startAutoTimer(remainingMs);
      }
    });

    updateNavigation();
    updatePlayButton();
