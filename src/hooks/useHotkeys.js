import { useEffect } from 'react';

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/**
 * Attaches a document-level keydown listener while `enabled`.
 * The handler gets the raw event and decides on preventDefault itself.
 * Events coming from text inputs are ignored.
 */
export function useHotkeys(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (isTypingTarget(e.target)) return;
      handler(e);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handler, enabled]);
}
