import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

// Generated components expose `data-ocid` hooks; use them as the test-id
// attribute so semantic queries can fall back to a stable selector.
configure({ testIdAttribute: "data-ocid" });

// Vitest globals are off, so Testing Library's automatic cleanup is not
// registered; without this each render accumulates in the same document.
afterEach(cleanup);

// jsdom implements neither of these browser APIs, and the page's scroll-reveal
// and active-section logic depend on them. Stub them so components mount.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly scrollMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (!("IntersectionObserver" in window)) {
  (
    window as unknown as { IntersectionObserver: typeof IntersectionObserver }
  ).IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
