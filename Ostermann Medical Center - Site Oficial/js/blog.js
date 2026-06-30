(function () {
  const FIXED_CATEGORIES = [
    {
      name: "Metabolismo",
      tag: "Energia",
      wave: "M0,60 L50,60 L62,25 L74,75 L86,15 L98,60 L150,60 L162,30 L174,70 L186,20 L198,60 L280,60 L330,60 L342,25 L354,75 L366,15 L378,60 L430,60 L442,30 L454,70 L466,20 L478,60 L560,60"
    },
    {
      name: "Longevidade",
      tag: "Tempo",
      wave: "M0,60 C35,60 35,35 70,35 C105,35 105,60 140,60 C175,60 175,35 210,35 C245,35 245,60 280,60 C315,60 315,35 350,35 C385,35 385,60 420,60 C455,60 455,35 490,35 C525,35 525,60 560,60"
    },
    {
      name: "Saúde Digestiva",
      tag: "Equilíbrio",
      wave: "M0,55 C20,40 30,70 45,55 C60,40 75,68 95,50 C115,32 130,65 150,55 C170,45 185,62 205,50 C225,38 245,58 280,55 C300,40 310,70 325,55 C340,40 355,68 375,50 C395,32 410,65 430,55 C450,45 465,62 485,50 C505,38 525,58 560,55"
    },
    {
      name: "Guias Completos",
      tag: "Referência",
      wave: "M0,60 L120,60 C140,60 145,30 165,30 C185,30 190,60 210,60 L280,60 L400,60 C420,60 425,30 445,30 C465,30 470,60 490,60 L560,60"
    }
  ];

  const today = new Date().toISOString().split("T")[0];
  const stored = localStorage.getItem("ostermann_blog_posts");
  const allPosts = stored ? JSON.parse(stored) : (window.OSTERMANN_BLOG_POSTS || []);
  const posts = allPosts.filter(
    (post) => post.status !== "draft" && post.publishedAt <= today
  );
  const state = {
    query: "",
    category: "Todos",
    tag: "Todas"
  };

  function formatDate(value) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date(value + "T12:00:00"));
  }

  function normalize(value) {
    return (value || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function postUrl(post) {
    const inPostFolder = /\/blog\/[^/]+\/?$/.test(window.location.pathname.replace(/index\.html$/, ""));
    return inPostFolder ? `../${post.slug}/` : `${post.slug}/`;
  }

  function assetUrl(path) {
    const inPostFolder = /\/blog\/[^/]+\/?$/.test(window.location.pathname.replace(/index\.html$/, ""));
    return inPostFolder ? path.replace("../assets/", "../../assets/") : path;
  }

  function getFilteredPosts() {
    return posts.filter((post) => {
      const haystack = normalize([
        post.title,
        post.excerpt,
        post.category,
        post.primaryKeyword,
        (post.secondaryKeywords || []).join(" "),
        post.tags.join(" "),
        (post.content || []).join(" ")
      ].join(" "));
      const matchesQuery = !state.query || haystack.includes(normalize(state.query));
      const matchesCategory = state.category === "Todos" || post.category === state.category;
      const matchesTag = state.tag === "Todas" || post.tags.includes(state.tag);
      return matchesQuery && matchesCategory && matchesTag;
    });
  }

  function createPostCard(post, featured) {
    const heading = featured ? "h2" : "h3";
    return `
      <article class="post-card ${featured ? "featured-post" : ""}">
        <a class="post-card-media" href="${postUrl(post)}" aria-label="${post.title}">
          <img src="${assetUrl(post.image)}" alt="${post.imageAlt}" loading="lazy">
        </a>
        <div class="post-card-body">
          <span class="post-category">${post.category}</span>
          <div class="post-meta">
            <span>${formatDate(post.publishedAt)}</span>
            <span>${post.readTime} min de leitura</span>
            <span>${post.author}</span>
          </div>
          <${heading}>${post.title}</${heading}>
          <p>${post.excerpt}</p>
          <a class="post-card-link" href="${postUrl(post)}">Ler artigo</a>
        </div>
      </article>
    `;
  }

  function renderPosts() {
    const target = document.querySelector("[data-blog-posts]");
    const empty = document.querySelector("[data-blog-empty]");
    if (!target) return;

    const filtered = getFilteredPosts();
    target.innerHTML = filtered.map((post, index) => createPostCard(post, index === 0)).join("");
    if (empty) empty.classList.toggle("hidden", filtered.length > 0);
  }

  function renderMiniPosts(selector, sourcePosts) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.innerHTML = sourcePosts.map((post) => `
      <a href="${postUrl(post)}">
        <strong>${post.title}</strong>
        <span>${post.category} · ${post.readTime} min</span>
      </a>
    `).join("");
  }

  function renderCategoryTiles() {
    const target = document.querySelector("[data-category-tiles]");
    if (!target) return;

    target.innerHTML = FIXED_CATEGORIES.map(({ name, tag, wave }) => `
      <button class="category-tile ${state.category === name ? "active" : ""}" data-category="${name}">
        <svg class="ct-wave-svg" viewBox="0 0 560 86" preserveAspectRatio="none" aria-hidden="true">
          <path class="ct-wave-path" pathLength="1000" d="${wave}"/>
          <path class="ct-wave-glow" pathLength="1000" d="${wave}"/>
        </svg>
        <div class="ct-body">
          <span class="ct-tag">${tag}</span>
          <span class="ct-name">${name}</span>
        </div>
        <div class="ct-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </div>
      </button>
    `).join("");
  }

  function initSearch() {
    const form = document.querySelector("[data-blog-search]");
    const input = document.querySelector("[data-blog-search-input]");
    if (!form || !input) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      state.query = input.value.trim();
      renderPosts();
    });

    input.addEventListener("input", () => {
      state.query = input.value.trim();
      renderPosts();
    });
  }

  function initFilters() {
    document.addEventListener("click", (event) => {
      const categoryButton = event.target.closest("[data-category]");

      if (categoryButton) {
        const clicked = categoryButton.dataset.category;
        state.category = state.category === clicked ? "Todos" : clicked;
        renderCategoryTiles();
        renderPosts();
      }
    });
  }

  function initShareButtons() {
    document.querySelectorAll("[data-copy-url]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          button.textContent = "Link copiado";
        } catch (error) {
          button.textContent = "Copie pela barra";
        }
      });
    });
  }

  function initBlog() {
    renderCategoryTiles();
    renderPosts();
    renderMiniPosts("[data-recent-posts]", posts.slice().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 4));
    renderMiniPosts("[data-recommended-posts]", posts.slice().sort((a, b) => b.views - a.views).slice(0, 4));
    initSearch();
    initFilters();
    initShareButtons();
  }

  document.addEventListener("DOMContentLoaded", initBlog);
})();
