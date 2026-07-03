//helpers/keyboardActions.js
//this function closes the topmost overlay (modal, offcanvas, or dropdown) if it is open. It returns true if an overlay was closed, and false otherwise.

import { useEffect } from "react";


let customCloseHandler = null;

export function registerOverlay(handler) {
  customCloseHandler = handler;
}

export function unregisterOverlay() {
  customCloseHandler = null;
}

export function closeTopOverlay() {

  // React overlays
  if (customCloseHandler) {
    customCloseHandler();
    return true;
  }

  // Bootstrap Modal
  const modal = document.querySelector(".modal.show");

  if (modal) {
    const closeBtn =
      modal.querySelector('[data-bs-dismiss="modal"]') ||
      modal.querySelector(".btn-close");

    if (closeBtn) {
      closeBtn.click();
      return true;
    }
  }

  // Bootstrap Offcanvas
  const offcanvas = document.querySelector(".offcanvas.show");

  if (offcanvas) {
    const closeBtn =
      offcanvas.querySelector('[data-bs-dismiss="offcanvas"]') ||
      offcanvas.querySelector(".btn-close");

    if (closeBtn) {
      closeBtn.click();
      return true;
    }
  }

  // Dropdown
  const dropdown = document.querySelector(".dropdown-menu.show");

  if (dropdown) {
    document.body.click();
    return true;
  }

  return false;
}

export function useRegisterOverlay(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    registerOverlay(onClose);

    return () => {
      unregisterOverlay();
    };
  }, [isOpen, onClose]);
}

// export function closeTopOverlay() {

//   // Bootstrap Modal
//   const modal = document.querySelector(".modal.show");

//   if (modal) {
//     const closeBtn =
//       modal.querySelector('[data-bs-dismiss="modal"]') ||
//       modal.querySelector(".btn-close");

//     if (closeBtn) {
//       closeBtn.click();
//       return true;
//     }
//   }

//   // Bootstrap Offcanvas
//   const offcanvas = document.querySelector(".offcanvas.show");

//   if (offcanvas) {
//     const closeBtn =
//       offcanvas.querySelector('[data-bs-dismiss="offcanvas"]') ||
//       offcanvas.querySelector(".btn-close");

//     if (closeBtn) {
//       closeBtn.click();
//       return true;
//     }
//   }

//   // Dropdown
//   const dropdown = document.querySelector(".dropdown-menu.show");

//   if (dropdown) {
//     document.body.click();
//     return true;
//   }

//   return false;
// }