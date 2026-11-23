/* Shared navigation and dialog accessibility. */
(() => {
  const nav = document.getElementById('mainNav');
  const toggle = nav?.querySelector('.nav-toggle');
  const setOpen = (open) => {
    nav.classList.toggle('nav--open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  if (toggle) {
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('nav--open')));
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a') && !event.target.closest('.dropdown-toggle')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('nav--open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    matchMedia('(max-width: 1100px)').addEventListener('change', () => setOpen(false));
  }

  const backdrop = document.getElementById('listingModal');
  if (!backdrop) return;
  let opener;
  const page = document.querySelector(".page");
  const openListing = window.openListingModal;
  const closeListing = window.closeListingModal;
  window.openListingModal = (type) => {
    opener = document.activeElement;
    openListing(type);
    document.body.classList.add('modal-open');
    if (page) page.inert = true;
  };
  window.closeListingModal = () => {
    const wasOpen = backdrop.classList.contains('open');
    closeListing();
    document.body.classList.remove('modal-open');
    if (page) page.inert = false;
    if (wasOpen && opener?.isConnected) opener.focus();
  };
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !backdrop.classList.contains('open')) return;
    const controls = Array.from(backdrop.querySelectorAll('button, input:not([type="hidden"]), select, textarea, a[href], [tabindex="0"]')).filter(el => !el.disabled && el.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || !backdrop.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !backdrop.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  });
})();


// Native iframe lazy loading can fetch several screens ahead on mobile.
// Load the player only as it approaches the viewport, without requiring a click.
(() => {
  const frames = document.querySelectorAll('iframe[data-video-src]');
  const load = (frame) => {
    if (!frame.dataset.videoSrc) return;
    frame.src = frame.dataset.videoSrc;
    delete frame.dataset.videoSrc;
  };
  if (!('IntersectionObserver' in window)) {
    frames.forEach(load);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      load(target);
      observer.unobserve(target);
    });
  }, { rootMargin: '150px 0px' });
  frames.forEach((frame) => observer.observe(frame));
})();
