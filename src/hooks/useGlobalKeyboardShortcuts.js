// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function useGlobalKeyboardShortcuts() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key !== "Escape") return;

//       // لو المستخدم بيكتب
//       const tag = document.activeElement?.tagName;

//       if (
//         tag === "INPUT" ||
//         tag === "TEXTAREA" ||
//         document.activeElement?.isContentEditable
//       ) {
//         return;
//       }

//       // ======== أولاً ========
//       // لو فيه Bootstrap Modal مفتوح
//       const modal = document.querySelector(".modal.show");

//       if (modal) {
//         const closeBtn =
//           modal.querySelector('[data-bs-dismiss="modal"]') ||
//           modal.querySelector(".btn-close");

//         if (closeBtn) {
//           closeBtn.click();
//           return;
//         }
//       }

//       // ======== ثانياً ========
//       // لو مفيش Modal اعمل Back

//       if (window.history.length > 1) {
//         navigate(-1);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () =>
//       window.removeEventListener("keydown", handleKeyDown);
//   }, [navigate, location]);
// }


//hooks/useGlobalKeyboardShortcuts.js
//here's a custom React hook that listens for global keyboard shortcuts, specifically the "Escape" key. When the "Escape" key is pressed, it first checks if the user is typing in an input field, textarea, or content-editable element. If not, it attempts to close any open Bootstrap modal. If no modal is open, it navigates back in the browser history.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { closeTopOverlay } from "../helpers/keyboardActions";

export default function useGlobalKeyboardShortcuts() {

  const navigate = useNavigate();

  useEffect(() => {

    const handleKeyDown = (e) => {

      if (e.key !== "Escape") return;

      // أولاً: لو فيه Overlay مفتوح اقفله
if (closeTopOverlay()) {
  return;
}

// بعد كده شوف هل المستخدم بيكتب
const active = document.activeElement;

if (
  active?.tagName === "INPUT" ||
  active?.tagName === "TEXTAREA" ||
  active?.isContentEditable
) {
  return;
}

// أخيراً: لو مفيش Overlay اعمل Back
if (window.history.length > 1) {
  navigate(-1);
}


    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);

  }, [navigate]);

}