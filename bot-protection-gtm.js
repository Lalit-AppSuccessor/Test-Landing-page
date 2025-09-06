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

  function detectDevice() {
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );
    const isSmallScreen = window.innerWidth <= 770;
    console.log(navigator.userAgent, window.innerWidth);
    if (isMobileUA || isSmallScreen) {
      return "mobile";
    }
    return "pc";
  }

  // Cursor tracker
  function useCursorTracker() {
    let lastX1 = [];
    let lastY1 = [];

    device = detectDevice();

    // Detect mouse movement (quantity-based)
    window.addEventListener("mousemove", (e) => {
      if (lastX1.length > 150 || lastY1.length > 150) {
        humanMouseDetected = true;
      }
      lastX1.push(e.clientX);
      lastY1.push(e.clientY);
      mouseDetected = true;
    });

    // Detect human-like movement (variance-based)
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
          cursor = true; // same as React effect
          console.log("Human Detected");
        }
      }

      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
  }

  // Track engaged time (8s)
  setTimeout(() => {
    timer = true;
  }, 8000);

  // Track scroll depth (50%)
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

  // Polling effect (replaces useEffect watching dependencies)
  const interval = setInterval(() => {
    if (
      device === "pc" &&
      mouseDetected &&
      humanMouseDetected &&
      cursor &&
      timer &&
      !fired
    ) {
      gtmInject(gtmId);
      console.log("PC detected");
      fired = true;
      clearInterval(interval);
    } else if (
      device === "mobile" &&
      !humanMouseDetected &&
      timer &&
      scroll &&
      !fired
    ) {
      gtmInject(gtmId);
      console.log("Mobile detected");
      fired = true;
      clearInterval(interval);
    }
    console.log(cursor, mouseDetected, humanMouseDetected, timer);
  }, 500);

  // Inject GTM
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

    console.log("gtm injected");
  }

  // Run cursor tracking
  useCursorTracker();
})();
