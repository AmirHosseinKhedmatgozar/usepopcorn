import { useEffect } from "react";
export function useKey(key, action) {
  useEffect(
    function () {
      function callBack(e) {
        if (e.key === key) {
          action();
        }
      }
      document.addEventListener("keydown", callBack);
      return () => document.removeEventListener("keydown", callBack);
    },
    [action, key]
  );
}
