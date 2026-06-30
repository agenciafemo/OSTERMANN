(function () {
  var CONSENT_KEY = "ostermann_cookie_consent";

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  function removeBanner(banner) {
    banner.style.transform = "translateY(100%)";
    banner.style.opacity = "0";
    setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 400);
  }

  function buildBanner() {
    var privacyBase = (function () {
      var depth = (window.location.pathname.match(/\//g) || []).length - 1;
      var prefix = "";
      for (var i = 0; i < depth; i++) prefix += "../";
      return prefix;
    })();

    var banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Aviso de cookies");
    banner.innerHTML =
      '<div class="cookie-inner">' +
        '<p class="cookie-text">Usamos cookies para melhorar sua experiência de navegação. Ao continuar, você concorda com nossa <a href="' + privacyBase + 'pages/privacidade.html">Política de Privacidade</a>.</p>' +
        '<div class="cookie-actions">' +
          '<button class="cookie-btn cookie-accept" type="button">Aceitar todos</button>' +
          '<button class="cookie-btn cookie-reject" type="button">Apenas essenciais</button>' +
        '</div>' +
      '</div>';

    banner.querySelector(".cookie-accept").addEventListener("click", function () {
      setConsent("all");
      removeBanner(banner);
    });

    banner.querySelector(".cookie-reject").addEventListener("click", function () {
      setConsent("essential");
      removeBanner(banner);
    });

    return banner;
  }

  function injectStyles() {
    var style = document.createElement("style");
    style.textContent =
      "#cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;" +
      "background:#1a3a52;color:#fff;padding:1rem 1.5rem;" +
      "box-shadow:0 -4px 24px rgba(0,0,0,.18);" +
      "transform:translateY(0);opacity:1;" +
      "transition:transform .4s ease,opacity .4s ease;}" +
      ".cookie-inner{max-width:1200px;margin:0 auto;" +
      "display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;}" +
      ".cookie-text{margin:0;font-size:.9rem;line-height:1.6;flex:1;min-width:220px;}" +
      ".cookie-text a{color:#0b9aa0;text-decoration:underline;}" +
      ".cookie-actions{display:flex;gap:.75rem;flex-shrink:0;}" +
      ".cookie-btn{padding:.55rem 1.2rem;border-radius:.5rem;border:none;" +
      "font-size:.85rem;font-weight:600;cursor:pointer;transition:opacity .2s;}" +
      ".cookie-btn:hover{opacity:.85;}" +
      ".cookie-accept{background:#0b9aa0;color:#fff;}" +
      ".cookie-reject{background:rgba(255,255,255,.12);color:#fff;}";
    document.head.appendChild(style);
  }

  function init() {
    if (getConsent()) return;
    injectStyles();
    var banner = buildBanner();
    document.body.appendChild(banner);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
