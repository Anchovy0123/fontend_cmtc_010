'use client';

import Swal from 'sweetalert2';

const inertState = {
  targets: new Set(),
  ariaHidden: new Map(),
};

const isInertable = (el) => {
  if (!(el instanceof HTMLElement)) return false;
  if (el.classList.contains('swal2-container')) return false;
  const tag = el.tagName;
  if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK') return false;
  return true;
};

const applyInert = () => {
  if (typeof document === 'undefined') return;
  const elements = Array.from(document.body.children).filter(isInertable);
  elements.forEach((el) => {
    if (el.hasAttribute('aria-hidden')) {
      inertState.ariaHidden.set(el, el.getAttribute('aria-hidden'));
    }
    // Replace aria-hidden to avoid hidden focused children warnings.
    el.removeAttribute('aria-hidden');
    el.setAttribute('inert', '');
    inertState.targets.add(el);
  });
};

const restoreInert = () => {
  inertState.targets.forEach((el) => {
    el.removeAttribute('inert');
    if (inertState.ariaHidden.has(el)) {
      const value = inertState.ariaHidden.get(el);
      if (value === null) {
        el.removeAttribute('aria-hidden');
      } else {
        el.setAttribute('aria-hidden', value);
      }
    }
  });
  inertState.targets.clear();
  inertState.ariaHidden.clear();
};

const focusPopup = (popup) => {
  if (!popup) return;
  if (!popup.hasAttribute('tabindex')) {
    popup.setAttribute('tabindex', '-1');
  }
  popup.focus({ preventScroll: true });
};

const baseFire = Swal.fire.bind(Swal);

Swal.fire = (options, ...args) => {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    return baseFire(options, ...args);
  }

  const { didOpen, didClose, ...rest } = options;
  const shouldInert = !rest.toast;
  return baseFire({
    ...rest,
    didOpen: (popup) => {
      if (shouldInert) {
        applyInert();
        focusPopup(popup || Swal.getPopup());
      }
      if (typeof didOpen === 'function') didOpen(popup);
    },
    didClose: (popup) => {
      if (shouldInert) restoreInert();
      if (typeof didClose === 'function') didClose(popup);
    },
  });
};

export default Swal;
