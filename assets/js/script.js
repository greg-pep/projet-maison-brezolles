document.addEventListener("DOMContentLoaded", () => {
  fetch('menu.html')
    .then(r => {
      if (!r.ok) throw new Error('Impossible de charger le menu');
      return r.text();
    })
    .then(html => {
      document.getElementById('menu-placeholder').innerHTML = html;
      initSubmenuToggle();
      initOutsideClickToClose();
      initCloseButton();
      initModalMedia();
      initVideoHover();
      highlightActiveLink();
      initScrollObserver();
      initStickyNav();
      initAccordion(); 
    })
    .catch(console.error);

  function initSubmenuToggle() {
    const items = document.querySelectorAll('#main-nav .menu > li');
    items.forEach(li => {
      const link1 = li.querySelector(':scope > a');
      if (!link1) return;
      link1.addEventListener('click', e => {
        if (window.innerWidth >= 600) return;
        e.preventDefault();
        e.stopPropagation();
        items.forEach(other => other.classList.remove('open'));
        li.classList.toggle('open');
        updateCloseButton();
      });
    });
  }

  function initOutsideClickToClose() {
    document.addEventListener('click', e => {
      const nav = document.getElementById('main-nav');
      if (!nav.contains(e.target)) {
        document.querySelectorAll('#main-nav .menu > li.open')
          .forEach(li => li.classList.remove('open'));
        updateCloseButton();
      }
    });
  }

  function initCloseButton() {
    const closeBtn = document.querySelector('.submenu-close-button');
    if (!closeBtn) return;
    closeBtn.addEventListener('click', () => {
      document.querySelectorAll('#main-nav .menu > li.open')
        .forEach(li => li.classList.remove('open'));
      updateCloseButton();
    });
    updateCloseButton();
  }

  function updateCloseButton() {
    const btn = document.querySelector('.submenu-close-button');
    if (!btn) return;
    const anyOpen = !!document.querySelector('#main-nav .menu > li.open');
    btn.classList.toggle('visible', anyOpen);
  }

  function initModalMedia() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <span class="close">&times;</span>
      <div class="modal-content-wrapper"></div>
    `;
    document.body.appendChild(modal);

    const wrapper = modal.querySelector('.modal-content-wrapper');
    const closeBtn = modal.querySelector('.close');

    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => {
        wrapper.innerHTML = `<img class="modal-content" src="${img.src}" alt="">`;
        modal.style.display = 'block';
      });
    });

    document.querySelectorAll('.video-thumb video').forEach(video => {
      video.addEventListener('click', () => {
        wrapper.innerHTML = `<video class="modal-content" src="${video.src}" controls autoplay></video>`;
        modal.style.display = 'block';
      });
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      wrapper.innerHTML = '';
    });
    window.addEventListener('click', e => {
      if (e.target === modal) {
        modal.style.display = 'none';
        wrapper.innerHTML = '';
      }
    });
  }

  function initVideoHover() {
    document.querySelectorAll('.video-thumb video').forEach(video => {
      video.addEventListener('mouseenter', () => video.play());
      video.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    });
  }

  function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop().replace(/\.html$/, '');
    const currentHash = window.location.hash;
    // clear
    document.querySelectorAll('#main-nav a.active').forEach(a => a.classList.remove('active'));
    // for each link
    document.querySelectorAll('#main-nav a').forEach(a => {
      try {
        const url = new URL(a.getAttribute('href'), window.location.origin);
        const linkPath = url.pathname.split('/').pop().replace(/\.html$/, '');
        const linkHash = url.hash;
        if (linkPath === currentPath && (linkHash === currentHash || (!linkHash && !currentHash))) {
          a.classList.add('active');
          // if submenu item, mark its parent
          const sub = a.closest('ul.submenu');
          if (sub) {
            const parentLi = sub.closest('li');
            const parentLink = parentLi.querySelector(':scope > a');
            parentLink?.classList.add('active');
          }
        }
      } catch {}
    });
  }

  function initScrollObserver() {
    const sections = document.querySelectorAll('main section[id]');
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        const a = document.querySelector(`#main-nav ul.submenu a[href$="#${id}"]`);
        if (a) {
          document.querySelectorAll('#main-nav a.active').forEach(x => x.classList.remove('active'));
          a.classList.add('active');
          const parentLi = a.closest('ul.submenu').closest('li');
          parentLi.querySelector(':scope > a')?.classList.add('active');
        }
      });
    }, { rootMargin: '0px 0px -80% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  function initStickyNav() {
    const nav = document.getElementById('main-nav');
    const offset = nav.offsetTop;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('sticky', window.pageYOffset >= offset);
    });
  }

  function initAccordion() {
    const wrapper = document.querySelector('.project-wrapper');
    const btn = wrapper.querySelector('.button-accordion');
    btn.addEventListener('click', () => {
      const isOpen = wrapper.classList.toggle('collapsed');
      btn.setAttribute('aria-expanded', !isOpen);
      btn.setAttribute('aria-label', isOpen ? 'Ouvrir le projet' : 'Fermer le projet');
    });
  }
});
