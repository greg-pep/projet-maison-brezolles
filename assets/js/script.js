// script.js
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
      initModalImages();
      highlightActiveLink();
      initScrollObserver();
      initStickyNav();
    })
    .catch(console.error);

  function initSubmenuToggle() {
    const items = document.querySelectorAll('#main-nav .menu > li');
    items.forEach(li => {
      const link1 = li.querySelector(':scope > a');
      if (!link1) return;
      link1.addEventListener('click', e => {
        if (window.innerWidth >= 600) return;    // only toggle under 600px
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
    const closeBtn = document.querySelector('.submenu-close-button');
    if (!closeBtn) return;
    const anyOpen = !!document.querySelector('#main-nav .menu > li.open');
    closeBtn.classList.toggle('visible', anyOpen);
  }

  function initModalImages() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <span class="close">&times;</span>
      <img class="modal-content" id="modal-img">
    `;
    document.body.appendChild(modal);
    const modalImg = modal.querySelector('#modal-img');
    const closeBtn = modal.querySelector('.close');
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
      });
    });
    closeBtn.onclick = () => modal.style.display = 'none';
    window.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  function highlightActiveLink() {
    const raw = window.location.pathname.split('/').pop().replace(/\.html$/, '');
    const currentHash = window.location.hash;
    document.querySelectorAll('#main-nav a.active')
      .forEach(a => a.classList.remove('active'));
    const subLinks = document.querySelectorAll('#main-nav ul.submenu a');
    for (const a of subLinks) {
      const [path, hash] = a.getAttribute('href').split('#');
      const name = path.replace(/\.html$/, '');
      const linkHash = hash ? `#${hash}` : '';
      if (name === raw && (linkHash === currentHash || linkHash === '')) {
        a.classList.add('active');
        const parentLi = a.closest('ul.submenu').closest('li');
        const parentLink = parentLi.querySelector(':scope > a');
        parentLink?.classList.add('active');
        break;
      }
    }
  }

  function initScrollObserver() {
    const sections = document.querySelectorAll('main section[id]');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        const a = document.querySelector(`#main-nav ul.submenu a[href$="#${id}"]`);
        if (a) {
          document.querySelectorAll('#main-nav a.active')
            .forEach(x => x.classList.remove('active'));
          a.classList.add('active');
          const parentLi = a.closest('ul.submenu').closest('li');
          parentLi.querySelector(':scope > a')?.classList.add('active');
        }
      });
    }, { rootMargin: '0px 0px -80% 0px' });
    sections.forEach(sec => observer.observe(sec));
  }

  function initStickyNav() {
    const nav = document.getElementById('main-nav');
    const offsetTop = nav.offsetTop;
    window.addEventListener('scroll', () => {
      if (window.pageYOffset >= offsetTop) nav.classList.add('sticky');
      else nav.classList.remove('sticky');
    });
  }
});
