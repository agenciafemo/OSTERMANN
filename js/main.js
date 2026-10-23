// ==========================================
// SCROLL PROGRESS BAR
// ==========================================

function updateScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');
  if (!scrollProgress) return;

  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;
  const progress = (scrolled / totalHeight) * 100;

  scrollProgress.style.width = progress + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ==========================================
// BACK TO TOP BUTTON
// ==========================================

function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

initBackToTop();

// ==========================================
// ACTIVE NAVIGATION LINK
// ==========================================

function initNavigation() {
  const navLinks = document.querySelectorAll('nav a[href]');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    let href = link.getAttribute('href');

    // Comparar com a página atual
    if (href === currentPage ||
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', initNavigation);

// ==========================================
// SCROLL REVEAL ANIMATION
// ==========================================

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1
  });

  reveals.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', initScrollReveal);

// ==========================================
// FAQ ACCORDION
// ==========================================

function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    header.addEventListener('click', () => {
      // Fechar outros items
      accordionItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          other.querySelector('.accordion-content').style.maxHeight = '0px';
        }
      });

      // Toggle item atual
      item.classList.toggle('active');

      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0px';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initAccordion);

// ==========================================
// SMOOTH SCROLL PARA ÂNCORAS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==========================================
// MOBILE MENU
// Cria o botão ☰ no header de todas as páginas; o CSS só o exibe até 768px
// ==========================================

function initMobileMenu() {
  const header = document.querySelector('header');
  const headerContent = header && header.querySelector('.header-content');
  const nav = header && header.querySelector('nav');
  const navList = nav && nav.querySelector('ul');

  if (!headerContent || !navList) return;

  // Leva o botão "Agendar consulta" do header para dentro do menu aberto
  const headerCta = headerContent.querySelector(':scope > .btn');
  if (headerCta) {
    const item = document.createElement('li');
    item.className = 'nav-cta-item';
    const cta = document.createElement('a');
    cta.href = headerCta.getAttribute('href');
    cta.className = 'btn btn-primary nav-cta';
    cta.textContent = headerCta.textContent.trim();
    item.appendChild(cta);
    navList.appendChild(item);
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'menu-toggle';
  toggle.setAttribute('aria-label', 'Abrir menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  headerContent.insertBefore(toggle, nav);

  const setOpen = (open) => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  toggle.addEventListener('click', () => setOpen(!header.classList.contains('menu-open')));
  navList.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

document.addEventListener('DOMContentLoaded', initMobileMenu);

// ==========================================
// FORM HANDLING (CTA)
// ==========================================

function initForms() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Obrigado! Em breve nossa equipe entrará em contato com você.');
      form.reset();
    });
  });
}

document.addEventListener('DOMContentLoaded', initForms);

// ==========================================
// PASSO 04: CONEXÕES DINÂMICAS ENTRE CARDS
// ==========================================

function initTechConnections() {
  const cardTech1 = document.querySelector('.card-tech-1');
  const cardTech2 = document.querySelector('.card-tech-2');
  const cardTech3 = document.querySelector('.card-tech-3');
  const cardTech4 = document.querySelector('.card-tech-4');

  const line12 = document.querySelector('.line-1-2');
  const line34 = document.querySelector('.line-3-4');
  const line13 = document.querySelector('.line-1-3');
  const line24 = document.querySelector('.line-2-4');

  if (!cardTech1 || !line12) return;

  // Card 1 - destaca line-1-2 e line-1-3
  cardTech1.addEventListener('mouseenter', () => {
    line12?.classList.add('active');
    line13?.classList.add('active');
  });
  cardTech1.addEventListener('mouseleave', () => {
    line12?.classList.remove('active');
    line13?.classList.remove('active');
  });

  // Card 2 - destaca line-1-2 e line-2-4
  cardTech2.addEventListener('mouseenter', () => {
    line12?.classList.add('active');
    line24?.classList.add('active');
  });
  cardTech2.addEventListener('mouseleave', () => {
    line12?.classList.remove('active');
    line24?.classList.remove('active');
  });

  // Card 3 - destaca line-1-3 e line-3-4
  cardTech3.addEventListener('mouseenter', () => {
    line13?.classList.add('active');
    line34?.classList.add('active');
  });
  cardTech3.addEventListener('mouseleave', () => {
    line13?.classList.remove('active');
    line34?.classList.remove('active');
  });

  // Card 4 - destaca line-2-4 e line-3-4
  cardTech4.addEventListener('mouseenter', () => {
    line24?.classList.add('active');
    line34?.classList.add('active');
  });
  cardTech4.addEventListener('mouseleave', () => {
    line24?.classList.remove('active');
    line34?.classList.remove('active');
  });
}

document.addEventListener('DOMContentLoaded', initTechConnections);

// ==========================================
// CARROSSEL DE DEPOIMENTOS
// ==========================================

function initCarousel() {
  const carousel = document.querySelector('.depoimentos-carousel');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (!carousel || !prevBtn || !nextBtn) {
    return;
  }


  prevBtn.onclick = function() {
    carousel.scrollLeft -= 350;
  };

  nextBtn.onclick = function() {
    carousel.scrollLeft += 350;
  };

  // Hover effects nas setas
  prevBtn.onmouseenter = function() {
    this.style.background = 'rgba(11, 154, 160, 0.1)';
    this.style.borderColor = 'rgba(11, 154, 160, 0.4)';
  };
  prevBtn.onmouseleave = function() {
    this.style.background = 'white';
    this.style.borderColor = 'rgba(11, 154, 160, 0.2)';
  };

  nextBtn.onmouseenter = function() {
    this.style.background = 'rgba(11, 154, 160, 0.1)';
    this.style.borderColor = 'rgba(11, 154, 160, 0.4)';
  };
  nextBtn.onmouseleave = function() {
    this.style.background = 'white';
    this.style.borderColor = 'rgba(11, 154, 160, 0.2)';
  };
}

document.addEventListener('DOMContentLoaded', initCarousel);


// ==========================================
// CHAT DE UNIDADES
// ==========================================

function getUnitChatGreeting(date = new Date()) {
  const hour = Number(new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: 'numeric',
    hourCycle: 'h23'
  }).format(date));

  if (hour >= 5 && hour < 12) return 'bom dia';
  if (hour >= 12 && hour < 18) return 'boa tarde';
  return 'boa noite';
}

function getUnitChatWhatsAppUrl(unit, date = new Date()) {
  const message = `Olá, ${getUnitChatGreeting(date)}! Tudo bem? Vim pelo site da Ostermann Medical Center e gostaria de agendar uma avaliação na unidade de ${unit.name}.`;
  return `https://wa.me/${unit.phone}?text=${encodeURIComponent(message)}`;
}

function initUnitChat() {
  if (document.getElementById('unit-chat')) return;

  const units = [
    { name: 'Criciúma', phone: '554891391742' },
    { name: 'Garopaba', phone: '554891124064' },
    { name: 'Jaguaruna', phone: '5548996639300' },
    { name: 'Araranguá', phone: '554899390892' }
  ];
  const chat = document.createElement('div');
  chat.id = 'unit-chat';
  chat.className = 'unit-chat';
  chat.innerHTML = `
    <section id="unit-chat-panel" class="unit-chat-panel" role="dialog" aria-labelledby="unit-chat-title" hidden>
      <div class="unit-chat-header">
        <span class="unit-chat-avatar" aria-hidden="true">O</span>
        <div>
          <h2 id="unit-chat-title">Ostermann Medical Center</h2>
          <p>Atendimento pelo WhatsApp</p>
        </div>
        <button type="button" class="unit-chat-close" aria-label="Fechar chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>
        </button>
      </div>
      <div class="unit-chat-body">
        <div class="unit-chat-messages" role="log" aria-label="Mensagens da Ostermann" aria-live="polite" aria-relevant="additions text">
          <div class="unit-chat-message" hidden><p class="unit-chat-greeting"></p></div>
          <div class="unit-chat-message" hidden><p>Que bom ter você aqui!</p></div>
          <div class="unit-chat-message" hidden><p>Em qual unidade você prefere ser atendido?</p></div>
        </div>
        <div class="unit-chat-typing" role="status" aria-label="Digitando" hidden>
          <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
        </div>
        <div class="unit-chat-options" aria-label="Escolha uma unidade" hidden></div>
        <p class="unit-chat-note" hidden>Escolha sua unidade para conversar pelo WhatsApp.</p>
      </div>
    </section>
    <button type="button" class="unit-chat-launcher" aria-label="Abrir chat de unidades: 1 mensagem não lida" aria-expanded="false" aria-controls="unit-chat-panel" hidden>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></svg>
      <span class="unit-chat-badge" aria-hidden="true">1</span>
    </button>
    <span class="unit-chat-announcement" role="status" aria-live="polite"></span>`;

  const options = chat.querySelector('.unit-chat-options');
  units.forEach(unit => {
    const link = document.createElement('a');
    link.className = 'unit-chat-option';
    link.href = getUnitChatWhatsAppUrl(unit);
    link.addEventListener('click', () => {
      link.href = getUnitChatWhatsAppUrl(unit);
    });
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Ostermann ${unit.name}: conversar pelo WhatsApp`);
    link.innerHTML = `<span>Ostermann ${unit.name}</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>`;
    options.appendChild(link);
  });

  const launcher = chat.querySelector('.unit-chat-launcher');
  const panel = chat.querySelector('.unit-chat-panel');
  const closeButton = chat.querySelector('.unit-chat-close');
  const badge = chat.querySelector('.unit-chat-badge');
  const announcement = chat.querySelector('.unit-chat-announcement');
  const messages = chat.querySelectorAll('.unit-chat-message');
  const typing = chat.querySelector('.unit-chat-typing');
  const note = chat.querySelector('.unit-chat-note');
  const typingDelays = [400, 500, 650];
  let nextMessage = 0;
  let messageTimer = null;
  let optionsTimer = null;
  let panelResize = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const entranceEasing = 'cubic-bezier(0.22, 1, 0.36, 1)';

  function animateEntry(element, delay = 0) {
    if (reducedMotion.matches || typeof element.animate !== 'function') return;
    element.animate([
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 340, delay, easing: entranceEasing, fill: 'backwards' });
  }

  function updateChatLayout(update) {
    const previousHeight = panel.getBoundingClientRect().height;
    if (panelResize) panelResize.cancel();
    panelResize = null;
    panel.classList.remove('is-resizing');
    update();
    const nextHeight = panel.getBoundingClientRect().height;
    if (reducedMotion.matches || typeof panel.animate !== 'function' || previousHeight === nextHeight) return;
    panel.classList.add('is-resizing');
    const animation = panel.animate([
      { height: previousHeight + 'px' },
      { height: nextHeight + 'px' }
    ], { duration: 380, easing: entranceEasing });
    panelResize = animation;
    animation.onfinish = () => {
      if (panelResize !== animation) return;
      panelResize = null;
      panel.classList.remove('is-resizing');
    };
  }

  function scheduleOptions() {
    if (!options.hidden || optionsTimer !== null) return;
    optionsTimer = window.setTimeout(() => {
      optionsTimer = null;
      if (panel.hidden) return;
      updateChatLayout(() => {
        options.hidden = false;
        note.hidden = false;
      });
      options.querySelectorAll('a').forEach((link, index) => animateEntry(link, index * 70));
      animateEntry(note, 240);
    }, reducedMotion.matches ? 0 : 180);
  }

  function continueConversation() {
    if (nextMessage === messages.length) {
      scheduleOptions();
      return;
    }
    if (messageTimer !== null) return;
    updateChatLayout(() => { typing.hidden = false; });
    messageTimer = window.setTimeout(() => {
      messageTimer = null;
      if (panel.hidden) return;
      const message = messages[nextMessage];
      updateChatLayout(() => {
        message.hidden = false;
        nextMessage += 1;
        if (nextMessage === messages.length) typing.hidden = true;
      });
      animateEntry(message);
      if (nextMessage === messages.length) scheduleOptions();
      else continueConversation();
    }, typingDelays[nextMessage]);
  }

  function closeChat() {
    window.clearTimeout(messageTimer);
    window.clearTimeout(optionsTimer);
    messageTimer = null;
    optionsTimer = null;
    if (panelResize) panelResize.cancel();
    panelResize = null;
    panel.classList.remove('is-resizing');
    typing.hidden = true;
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Abrir chat de unidades');
    launcher.focus({ preventScroll: true });
  }

  function openChat(moveFocus = false) {
    const now = new Date();
    chat.querySelector('.unit-chat-greeting').textContent = `Olá, ${getUnitChatGreeting(now)}! Tudo bem?`;
    options.querySelectorAll('a').forEach((link, index) => {
      link.href = getUnitChatWhatsAppUrl(units[index], now);
    });
    panel.hidden = false;
    badge.hidden = true;
    announcement.textContent = '';
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Fechar chat de unidades');
    continueConversation();
    if (moveFocus) closeButton.focus({ preventScroll: true });
  }

  launcher.addEventListener('click', () => {
    if (panel.hidden) openChat(true);
    else closeChat();
  });
  closeButton.addEventListener('click', closeChat);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) closeChat();
  });

  const hero = document.querySelector('main .hero')?.closest('section')
    || document.querySelector('main .blog-hero, main .post-hero, main > section');

  const header = document.querySelector('header');
  let pastHero = false;

  function revealChat() {
    const visibleTop = Math.max(0, header?.getBoundingClientRect().bottom || 0);
    const reachedNextSection = window.scrollY > 0
      && (!hero || hero.getBoundingClientRect().bottom <= visibleTop);
    if (!reachedNextSection) {
      pastHero = false;
      return;
    }
    if (pastHero) return;
    pastHero = true;
    const firstReveal = launcher.hidden;
    launcher.hidden = false;
    document.body.classList.add('unit-chat-visible');
    if (firstReveal) animateEntry(launcher);
    if (panel.hidden) openChat();
  }

  document.body.appendChild(chat);
  document.body.classList.add('unit-chat-ready');
  window.addEventListener('scroll', revealChat, { passive: true });
  revealChat();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUnitChat);
} else {
  initUnitChat();
}

