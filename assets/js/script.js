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
      initModalMedia();
      initVideoHover();
      highlightActiveLink();
      initScrollObserver();
      initStickyNav();
      initAccordion();
      initEquipmentModals();
    })
    .catch(console.error);

  function initSubmenuToggle() {
    const items = document.querySelectorAll('#main-nav .menu > li');
    items.forEach(li => {
      const link1 = li.querySelector(':scope > a');
      if (!link1) return;
      link1.addEventListener('click', e => {
        if (window.innerWidth >= 600) return;
        e.preventDefault(); e.stopPropagation();
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

    function hide() {
      modal.style.display = 'none';
      wrapper.innerHTML = '';
    }

    closeBtn.addEventListener('click', hide);
    modal.addEventListener('click', e => {
      if (!e.target.closest('.modal-content-wrapper')) hide();
    });

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
    document.querySelectorAll('#main-nav a.active').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('#main-nav a').forEach(a => {
      try {
        const url = new URL(a.getAttribute('href'), window.location.origin);
        const linkPath = url.pathname.split('/').pop().replace(/\.html$/, '');
        const linkHash = url.hash;
        if (linkPath === currentPath && (linkHash === currentHash || (!linkHash && !currentHash))) {
          a.classList.add('active');
          const sub = a.closest('ul.submenu');
          if (sub) {
            const parentLi = sub.closest('li');
            parentLi.querySelector(':scope > a')?.classList.add('active');
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
        const a = document.querySelector(`#main-nav ul.submenu a[href$="#${entry.target.id}"]`);
        if (a) {
          document.querySelectorAll('#main-nav a.active').forEach(x => x.classList.remove('active'));
          a.classList.add('active');
          a.closest('ul.submenu').closest('li')
           .querySelector(':scope > a')?.classList.add('active');
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
    document.querySelectorAll('.project-wrapper').forEach(wrapper => {
      const btn = wrapper.querySelector('.button-accordion');
      wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Fermer le projet');
      btn.addEventListener('click', () => {
        const collapsed = wrapper.classList.toggle('collapsed');
        if (collapsed) {
          wrapper.style.maxHeight = '5rem';
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Ouvrir le projet');
        } else {
          wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
          btn.setAttribute('aria-label', 'Fermer le projet');
        }
      });
    });
  }

  function initEquipmentModals() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <span class="close">&times;</span>
      <div class="modal-content-wrapper"></div>
    `;
    document.body.appendChild(modal);
    const wrapper = modal.querySelector('.modal-content-wrapper');
    const closeBtn = modal.querySelector('.close');

    function hide() {
      modal.style.display = 'none';
      wrapper.innerHTML = '';
    }

    closeBtn.addEventListener('click', hide);
    modal.addEventListener('click', e => {
      if (!e.target.closest('.modal-content-wrapper')) hide();
    });

    document.querySelectorAll('.list-block-line').forEach(line => {
      const btn = line.querySelector('.button-equipment');
      const list = line.querySelector('ul.equipments-list');
      if (!btn || !list) return;
      list.style.display = 'none';
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        wrapper.innerHTML = '';
        const block = document.createElement('div');
        block.classList.add('content-block','equipment-block');
        const title = document.createElement('h3');
        title.className = 'content-block-title';
        title.textContent = 'Matériels pour ce chantier';
        block.appendChild(title);
        // reconstruire chaque ligne
        list.querySelectorAll('li').forEach(rawItem => {
          const text = rawItem.querySelector('p')?.textContent||'';
          const link = rawItem.querySelector('a');
          const li = document.createElement('li');
          li.className = 'list-block-line';
          const divText = document.createElement('div');
          divText.className = 'list-block-text';
          const p = document.createElement('p');
          p.textContent = text;
          divText.appendChild(p);
          const divBtn = document.createElement('div');
          divBtn.className = 'list-block-btn';
          const a = document.createElement('a');
          a.className = 'link';
          a.href = link?.href||'#';
          a.textContent = link?.textContent||'';
          divBtn.appendChild(a);
          li.appendChild(divText);
          li.appendChild(divBtn);
          block.appendChild(li);
        });
        wrapper.appendChild(block);
        modal.style.display = 'block';
      });
    });
  }
});
