import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { CharroScene } from "@/components/charro/CharroScene";
import { CHARRO_DETAILS } from "@/lib/charro-details";

/**
 * The 3D stage cannot run in jsdom (no WebGL), so the R3F canvas and the drei
 * helpers are replaced with plain DOM equivalents. Everything the user actually
 * interacts with — the hotspot markers, the quick-select legend and the detail
 * card — is the real component code.
 */
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  useFrame: () => {},
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
  Html: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe("Charro 3D scene", () => {
  it("renders a clickable hotspot for every character detail", () => {
    render(<CharroScene />);

    for (const detail of CHARRO_DETAILS) {
      expect(
        screen.getByTestId(`charro.hotspot.${detail.id}`),
      ).toBeInTheDocument();
    }
  });

  it("opens a detail card with the character's data when a hotspot is clicked", async () => {
    const user = userEvent.setup();
    render(<CharroScene />);

    const sombrero = CHARRO_DETAILS.find((d) => d.id === "sombrero");
    if (!sombrero) throw new Error("sombrero detail missing");

    await user.click(screen.getByTestId("charro.hotspot.sombrero"));

    const panel = screen.getByTestId("charro.detail_panel");
    expect(within(panel).getByText(sombrero.title)).toBeInTheDocument();
    expect(within(panel).getByText(sombrero.tagline)).toBeInTheDocument();
    for (const fact of sombrero.facts) {
      expect(within(panel).getByText(fact)).toBeInTheDocument();
    }
  });

  it("closes the detail card with its close button", async () => {
    const user = userEvent.setup();
    render(<CharroScene />);

    await user.click(screen.getByTestId("charro.hotspot.botas"));
    expect(screen.getByTestId("charro.detail_panel")).toBeInTheDocument();

    await user.click(screen.getByTestId("charro.detail_panel.close_button"));
    expect(screen.queryByTestId("charro.detail_panel")).not.toBeInTheDocument();
  });

  it("opens the same detail card from the quick-select legend", async () => {
    const user = userEvent.setup();
    render(<CharroScene />);

    const contrato = CHARRO_DETAILS.find((d) => d.id === "contrato");
    if (!contrato) throw new Error("contrato detail missing");

    await user.click(screen.getByTestId("charro.legend.contrato"));

    const panel = screen.getByTestId("charro.detail_panel");
    expect(within(panel).getByText(contrato.title)).toBeInTheDocument();
  });
});
