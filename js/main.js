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
// MOBILE MENU (Opcional para futuros)
// ==========================================

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  // Fechar ao clicar em um link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
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

