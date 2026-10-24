import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import App from "@/App";
import { CURIOSIDADES } from "@/lib/curiosidades";
import { STORY_BLOCKS } from "@/lib/leyenda-actualizada";
import { LEYENDA_REAL, LEYENDA_TIMELINE } from "@/lib/leyenda-real";

/**
 * Component/integration coverage for the single-page Charro Negro site.
 * The 3D canvas is stubbed out because jsdom has no WebGL context; the
 * surrounding page structure, content and navigation are exercised for real.
 * The page now includes the visitor's recording section, so the identity and
 * query providers it depends on are supplied here and the platform actor is a
 * local mock that reports no stored recording.
 */
vi.mock("@/components/charro/CharroScene", () => ({
  CharroScene: () => <div data-ocid="charro.canvas" />,
}));

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({
    actor: {
      getRecording: () => Promise.resolve(null),
      uploadRecording: vi.fn(),
      clearRecording: vi.fn(),
    },
    isFetching: false,
  }),
  useInternetIdentity: () => ({
    isAuthenticated: false,
    login: vi.fn(),
    isLoggingIn: false,
  }),
}));

function renderApp() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(<App />, { wrapper });
}

describe("Charro Negro page", () => {
  it("renders the hero with the legend title and a graphic representation", () => {
    renderApp();

    expect(
      screen.getByRole("heading", { level: 1, name: /El Charro Negro/i }),
    ).toBeInTheDocument();
    // At least one graphic representation of the character in the hero.
    expect(
      screen.getByRole("img", { name: /Silueta del Charro Negro/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Explorar la leyenda/i }),
    ).toHaveAttribute("href", "#leyenda-real");
  });

  it("exposes the three navigable sections in the header and footer", () => {
    renderApp();

    const header = screen.getByTestId("site.header");
    const nav = within(header).getByRole("navigation", { name: "Secciones" });
    for (const label of [
      "Leyenda Real",
      "Leyenda Actualizada",
      "Curiosidades",
    ]) {
      expect(
        within(nav).getByRole("link", { name: label }),
      ).toBeInTheDocument();
    }

    const footer = screen.getByTestId("site.footer");
    const footerNav = within(footer).getByRole("navigation", {
      name: "Apartados de la leyenda",
    });
    for (const label of [
      "Leyenda Real",
      "Leyenda Actualizada",
      "Curiosidades",
    ]) {
      expect(
        within(footerNav).getByRole("link", { name: new RegExp(label) }),
      ).toBeInTheDocument();
    }
  });

  it("renders the Leyenda Real story and a timeline with at least five milestones", () => {
    renderApp();

    const section = screen.getByTestId("leyenda_real.section");
    expect(
      within(section).getByRole("heading", { name: "Leyenda Real" }),
    ).toBeInTheDocument();

    // Every chapter of the original legend is present.
    for (const chapter of LEYENDA_REAL) {
      expect(within(section).getByText(chapter.title)).toBeInTheDocument();
    }

    const timeline = within(section).getByTestId("leyenda_real.timeline");
    const items = within(timeline).getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(5);
    expect(items.length).toBe(LEYENDA_TIMELINE.length);
  });

  it("renders the Kevin story as a live chat with dialogue, comments and the bank notification", () => {
    renderApp();

    const section = screen.getByTestId("leyenda_actualizada.section");
    expect(
      within(section).getByRole("heading", { name: "Leyenda Actualizada" }),
    ).toBeInTheDocument();

    const panel = within(section).getByTestId("leyenda_actualizada.chat_panel");
    // The story is reproduced block for block.
    for (const block of STORY_BLOCKS) {
      expect(within(panel).getByText(block.text)).toBeInTheDocument();
    }
    // The Banco Azteca notification is rendered as its own beat.
    expect(within(panel).getByText("Banco Azteca")).toBeInTheDocument();
  });

  it("renders at least six curiosity cards, each with a title", () => {
    renderApp();

    const section = screen.getByTestId("curiosidades.section");
    expect(
      within(section).getByRole("heading", { name: "Curiosidades" }),
    ).toBeInTheDocument();

    const cards = within(section).getAllByRole("article");
    expect(cards.length).toBeGreaterThanOrEqual(6);
    expect(cards.length).toBe(CURIOSIDADES.length);
    for (const item of CURIOSIDADES) {
      expect(within(section).getByText(item.title)).toBeInTheDocument();
    }
  });
});
