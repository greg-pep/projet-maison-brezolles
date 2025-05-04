document.addEventListener("DOMContentLoaded", () => {
    // 1. Charger et injecter le menu HTML
    fetch('menu.html')
      .then(response => {
        if (!response.ok) throw new Error('Impossible de charger le menu');
        return response.text();
      })
      .then(html => {
        document.getElementById('menu-placeholder').innerHTML = html;
        initHoverSubmenu();
        initModalImages();
        highlightActiveLink();
        initScrollObserver();
        initStickyNav();
      })
      .catch(console.error);
  
    // Hover pour ouvrir/fermer les sous-menus
    function initHoverSubmenu() {
      document.querySelectorAll('#main-nav .menu > li').forEach(li => {
        const submenu = li.querySelector('.submenu');
        if (!submenu) return;
        li.addEventListener('mouseenter', () => submenu.classList.add('open'));
        li.addEventListener('mouseleave', () => submenu.classList.remove('open'));
      });
    }
  
    // Lightbox pour images
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
      window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
    }
  
    // Applique la classe active sur le <a> correspondant à la page courante
    function highlightActiveLink() {
      // Récupère le nom de base de la page sans extension
      const raw = window.location.pathname.split('/').pop();
      const currentName = raw.replace(/\.html$/, '');
      const currentHash = window.location.hash;
  
      // Nettoyage
      document.querySelectorAll('#main-nav a.active').forEach(a => a.classList.remove('active'));
  
      // Recherche du lien correspondant
      document.querySelectorAll('#main-nav a').forEach(a => {
        const url = new URL(a.href, window.location.origin);
        const linkRaw = url.pathname.split('/').pop().replace(/\.html$/, '');
        const linkHash = url.hash;
  
        if (linkRaw === currentName && (linkHash === currentHash || linkHash === '')) {
          a.classList.add('active');
        }
      });
    }
  
    // Observer pour ancres internes
    function initScrollObserver() {
      const sections = document.querySelectorAll('main section[id]');
      if (!('IntersectionObserver' in window)) return;
  
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const a = document.querySelector(`#main-nav a[href$="#${id}"]`);
            if (a) {
              document.querySelectorAll('#main-nav a.active').forEach(x => x.classList.remove('active'));
              a.classList.add('active');
            }
          }
        });
      }, { rootMargin: '0px 0px -80% 0px' });
  
      sections.forEach(sec => observer.observe(sec));
    }
  
    // Sticky pour nav
    function initStickyNav() {
      const nav = document.getElementById('main-nav');
      const offsetTop = nav.offsetTop;
      window.addEventListener('scroll', () => {
        if (window.pageYOffset >= offsetTop) nav.classList.add('sticky');
        else nav.classList.remove('sticky');
      });
    }
  });
  