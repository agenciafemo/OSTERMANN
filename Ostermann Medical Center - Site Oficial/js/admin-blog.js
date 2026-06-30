(function () {
  const STORAGE_KEY = "ostermann_blog_posts";
  const SESSION_KEY = "ostermann_blog_admin";
  const ADMIN_HASH = "641fc124213db9aff3448f4f3e2e04ba696728c39a17f6b6b2d1da4dd33480c6";
  let posts = [];

  async function hashInput(value) {
    const encoded = new TextEncoder().encode(value);
    const buffer = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function slugify(value) {
    return (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function splitList(value) {
    return (value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }

  function loadPosts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    posts = stored ? JSON.parse(stored) : (window.OSTERMANN_BLOG_POSTS || []);
  }

  function savePosts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function showApp() {
    $("[data-login-screen]").classList.add("hidden");
    $("[data-admin-app]").classList.remove("hidden");
    renderAll();
  }

  function showLogin() {
    $("[data-login-screen]").classList.remove("hidden");
    $("[data-admin-app]").classList.add("hidden");
  }

  function setPanel(name) {
    $$("[data-panel]").forEach((panel) => panel.classList.toggle("hidden", panel.dataset.panel !== name));
    $$("[data-admin-tab]").forEach((button) => button.classList.toggle("active", button.dataset.adminTab === name));
  }

  function getSeoScore(post) {
    const checks = [
      {
        label: "Meta title com ate 60 caracteres",
        ok: (post.metaTitle || "").length > 0 && (post.metaTitle || "").length <= 60
      },
      {
        label: "Meta description entre 140 e 160 caracteres",
        ok: (post.metaDescription || "").length >= 140 && (post.metaDescription || "").length <= 160
      },
      {
        label: "Palavra-chave principal no titulo",
        ok: normalize(post.title).includes(normalize(post.primaryKeyword))
      },
      {
        label: "Palavra-chave principal na meta description",
        ok: normalize(post.metaDescription).includes(normalize(post.primaryKeyword))
      },
      {
        label: "URL curta com palavra-chave",
        ok: post.slug && post.slug.length <= 80 && normalize(post.slug).includes(normalize(post.primaryKeyword).split(" ")[0])
      },
      {
        label: "Imagem com alt text",
        ok: Boolean(post.image && post.imageAlt)
      },
      {
        label: "Conteudo com H2 ou H3",
        ok: /<h2|<h3/i.test(post.contentHtml || post.content?.join("") || "")
      },
      {
        label: "Links internos no conteudo",
        ok: /href=["'](\.\.\/|\/blog|blog\/)/i.test(post.contentHtml || post.content?.join("") || "")
      }
    ];
    const total = checks.filter((check) => check.ok).length;
    return { checks, total, percent: Math.round((total / checks.length) * 100) };
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function renderStats() {
    const now = today();
    $("[data-stat-total]").textContent = posts.length;
    $("[data-stat-published]").textContent = posts.filter((post) => post.status === "published").length;
    $("[data-stat-drafts]").textContent = posts.filter((post) => post.status === "draft").length;
    $("[data-stat-scheduled]").textContent = posts.filter((post) => post.status === "scheduled" || post.publishedAt > now).length;
  }

  function renderDashboard() {
    const target = $("[data-dashboard-posts]");
    target.innerHTML = posts.slice(0, 5).map((post) => {
      const score = getSeoScore(post);
      return `<tr><td>${post.title}</td><td>${statusLabel(post.status)}</td><td>${post.category || "-"}</td><td>${score.percent}%</td></tr>`;
    }).join("");
  }

  function renderTable() {
    const target = $("[data-posts-table]");
    target.innerHTML = posts.map((post) => `
      <tr>
        <td><strong>${post.title}</strong><br><span style="color: var(--muted-foreground);">${post.excerpt || ""}</span></td>
        <td>${post.slug}</td>
        <td>${statusLabel(post.status)}</td>
        <td>${post.category || "-"}</td>
        <td>${post.publishedAt || "-"}</td>
        <td>
          <div class="admin-actions">
            <button class="admin-btn secondary" type="button" data-edit="${post.id}">Editar</button>
            <button class="admin-btn secondary" type="button" data-preview="${post.id}">Previa</button>
            <button class="admin-btn danger" type="button" data-delete="${post.id}">Excluir</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  function statusLabel(status) {
    const labels = {
      published: "Publicado",
      draft: "Rascunho",
      scheduled: "Agendado"
    };
    return `<span class="status-pill ${status}">${labels[status] || status || "Rascunho"}</span>`;
  }

  function renderTaxonomies() {
    const categories = [...new Set(posts.map((post) => post.category).filter(Boolean))];
    const tags = [...new Set(posts.flatMap((post) => post.tags || []))];
    $("[data-admin-categories]").innerHTML = categories.map((item) => `<span class="chip">${item}</span>`).join("");
    $("[data-admin-tags]").innerHTML = tags.map((item) => `<span class="chip">${item}</span>`).join("");
  }

  function renderSeoMeter(post) {
    const target = $("[data-seo-meter]");
    const score = getSeoScore(post);
    target.innerHTML = `
      <div class="seo-check ${score.percent >= 75 ? "ok" : "warn"}"><strong>SEO: ${score.percent}%</strong> ${score.percent >= 75 ? "Bom" : "Precisa melhorar"}</div>
      ${score.checks.map((check) => `<div class="seo-check ${check.ok ? "ok" : "warn"}">${check.ok ? "OK" : "Ajustar"} - ${check.label}</div>`).join("")}
    `;
  }

  function renderAll() {
    renderStats();
    renderDashboard();
    renderTable();
    renderTaxonomies();
    renderSeoMeter(readForm());
  }

  function blankPost() {
    return {
      id: "post-" + Date.now(),
      title: "",
      slug: "",
      excerpt: "",
      image: "../assets/blog/imagem-destacada.jpg",
      imageAlt: "",
      category: "",
      tags: [],
      author: "Ostermann Medical Center",
      status: "draft",
      publishedAt: today(),
      updatedAt: today(),
      readTime: 4,
      views: 0,
      metaTitle: "",
      metaDescription: "",
      primaryKeyword: "",
      secondaryKeywords: [],
      related: [],
      contentHtml: "<p>Escreva o primeiro paragrafo com a palavra-chave principal.</p><h2>Subtitulo com palavra-chave</h2><p>Desenvolva o conteudo com clareza e links internos.</p>"
    };
  }

  function fillForm(post) {
    const form = $("[data-post-form]");
    $$("[data-field]", form).forEach((field) => {
      const key = field.dataset.field;
      if (Array.isArray(post[key])) {
        field.value = post[key].join(", ");
      } else {
        field.value = post[key] || "";
      }
    });
    $("[data-rich-editor]").innerHTML = post.contentHtml || (post.content || []).join("");
    renderSeoMeter(readForm());
  }

  function readForm() {
    const post = {};
    $$("[data-field]", $("[data-post-form]")).forEach((field) => {
      post[field.dataset.field] = field.value.trim();
    });
    post.tags = splitList(post.tags);
    post.secondaryKeywords = splitList(post.secondaryKeywords);
    post.related = splitList(post.related);
    post.contentHtml = $("[data-rich-editor]")?.innerHTML || "";
    post.readTime = Math.max(1, Math.ceil((post.contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length || 1) / 180));
    post.url = `/blog/${post.slug}`;
    return post;
  }

  function saveForm(status) {
    const post = readForm();
    const categoryError = $("[data-category-error]");
    if (!post.category) {
      if (categoryError) categoryError.classList.remove("hidden");
      $("[data-category-select]")?.focus();
      return;
    }
    if (categoryError) categoryError.classList.add("hidden");
    if (status) post.status = status;
    if (!post.id) post.id = "post-" + Date.now();
    if (!post.slug) post.slug = slugify(post.title);
    if (!post.updatedAt) post.updatedAt = today();
    const index = posts.findIndex((item) => item.id === post.id);
    if (index >= 0) posts[index] = { ...posts[index], ...post };
    else posts.unshift(post);
    savePosts();
    renderAll();
    setPanel("posts");
  }

  function editPost(id) {
    const post = posts.find((item) => item.id === id);
    if (!post) return;
    fillForm({ ...post, contentHtml: post.contentHtml || (post.content || []).join("") });
    setPanel("editor");
  }

  function deletePost(id) {
    if (!confirm("Excluir este post do armazenamento local?")) return;
    posts = posts.filter((post) => post.id !== id);
    savePosts();
    renderAll();
  }

  function previewPost(id) {
    const post = id ? posts.find((item) => item.id === id) : readForm();
    if (!post) return;
    const preview = window.open("", "_blank");
    preview.document.write(`
      <!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${post.title}</title>
      <style>
        body{margin:0;padding:32px;font-family:Inter,Arial,sans-serif;color:#1a1a1a;background:#fff;line-height:1.7}
        article{max-width:760px;margin:auto}
        h1,h2{font-family:Georgia,serif;color:#1a3a52;line-height:1.12}
        h1{font-size:44px;margin:0 0 16px}
        h2{font-size:30px;margin:32px 0 12px}
        h3{color:#1a3a52;margin:28px 0 10px}
        p{color:#5f6875;font-size:17px}
        a{color:#0b9aa0;font-weight:700}
      </style></head>
      <body><article><h1>${post.title}</h1><p>${post.excerpt || ""}</p>${post.contentHtml || (post.content || []).join("")}</article></body></html>
    `);
    preview.document.close();
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportJs() {
    const lines = posts.map((post) => {
      const p = { ...post };
      if (p.contentHtml) {
        p.content = p.contentHtml.match(/<[^>]+>[^<]*<\/[^>]+>|<[^>]+\/>/g) || [p.contentHtml];
        delete p.contentHtml;
      }
      return "  " + JSON.stringify(p, null, 2).replace(/\n/g, "\n  ");
    });
    downloadFile("blog-posts.js", `window.OSTERMANN_BLOG_POSTS = [\n${lines.join(",\n")}\n];\n`, "text/javascript");
  }

  function exportJson() {
    downloadFile("blog-posts-export.json", JSON.stringify(posts, null, 2), "application/json");
  }

  function exportSitemap() {
    const urls = ["/", "/blog/", ...posts.filter((post) => post.status === "published").map((post) => `/blog/${post.slug}/`)];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${today()}</lastmod><changefreq>weekly</changefreq><priority>${url === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}\n</urlset>\n`;
    downloadFile("sitemap.xml", xml, "application/xml");
  }

  function initEvents() {
    $("[data-login-form]").addEventListener("submit", async (event) => {
      event.preventDefault();
      const digest = await hashInput($("#admin-password").value);
      if (digest === ADMIN_HASH) {
        sessionStorage.setItem(SESSION_KEY, "1");
        showApp();
      } else {
        $("[data-login-error]").classList.remove("hidden");
      }
    });

    $$("[data-admin-tab]").forEach((button) => {
      button.addEventListener("click", () => setPanel(button.dataset.adminTab));
    });

    $("[data-logout]").addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      showLogin();
    });

    $("[data-new-post]").addEventListener("click", () => {
      fillForm(blankPost());
      setPanel("editor");
    });

    $("[data-post-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      saveForm();
    });

    $("[data-save-draft]").addEventListener("click", () => saveForm("draft"));
    $("[data-preview-post]").addEventListener("click", () => previewPost());
    $("[data-export-js]").addEventListener("click", exportJs);
    $("[data-export-json]").addEventListener("click", exportJson);
    $("[data-export-sitemap]").addEventListener("click", exportSitemap);

    document.addEventListener("click", (event) => {
      const edit = event.target.closest("[data-edit]");
      const remove = event.target.closest("[data-delete]");
      const preview = event.target.closest("[data-preview]");
      const command = event.target.closest("[data-command]");

      if (edit) editPost(edit.dataset.edit);
      if (remove) deletePost(remove.dataset.delete);
      if (preview) previewPost(preview.dataset.preview);
      if (command) {
        const value = command.dataset.value;
        if (command.dataset.command === "createLink") {
          const href = prompt("URL do link");
          if (href) document.execCommand("createLink", false, href);
        } else {
          document.execCommand(command.dataset.command, false, value || null);
        }
      }
    });

    $("[data-field='title']").addEventListener("input", (event) => {
      const slugField = $("[data-field='slug']");
      if (!slugField.value) slugField.value = slugify(event.target.value);
      renderSeoMeter(readForm());
    });

    $$("[data-field]").forEach((field) => field.addEventListener("input", () => renderSeoMeter(readForm())));
    $("[data-rich-editor]").addEventListener("input", () => renderSeoMeter(readForm()));

    $("[data-image-upload]").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        $("[data-field='image']").value = reader.result;
        renderSeoMeter(readForm());
      };
      reader.readAsDataURL(file);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
    initEvents();
    fillForm(blankPost());
    if (sessionStorage.getItem(SESSION_KEY)) showApp();
    else showLogin();
  });
})();
