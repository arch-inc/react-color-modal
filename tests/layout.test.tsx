import { fireEvent, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import tinycolor from "tinycolor2";
import { describe, expect, test, vi } from "vitest";

import { ColorPanel } from "../lib/ColorPanel";
import { SaturationBrightnessPanel } from "../lib/SaturationBrightnessPanel";
import { calculateSaturationBrightness } from "../lib/SaturationBrightnessEventHandler";

describe("SaturationBrightnessPanel", () => {
  test("is intrinsically square without a zero-height first render", () => {
    const sheet = new ServerStyleSheet();
    const html = renderToString(
      sheet.collectStyles(
        <SaturationBrightnessPanel hsv={{ h: 0, s: 0.5, v: 0.5 }} />,
      ),
    );
    const css = sheet.getStyleTags();
    sheet.seal();

    expect(html).not.toContain("height:0px");
    expect(css).toContain("aspect-ratio:1/1");
  });

  test("uses current layout bounds and clamps every edge", () => {
    const rect = { left: 20, top: 10, width: 200, height: 100 };
    expect(calculateSaturationBrightness({ x: 20, y: 110 }, rect)).toEqual({
      x: 0,
      y: 0,
    });
    expect(calculateSaturationBrightness({ x: 220, y: 10 }, rect)).toEqual({
      x: 1,
      y: 1,
    });
    expect(calculateSaturationBrightness({ x: -50, y: -50 }, rect)).toEqual({
      x: 0,
      y: 1,
    });
  });

  test("updates immediately from a pointer gesture", () => {
    const onColorUpdate = vi.fn();
    const { container } = render(
      <SaturationBrightnessPanel
        hsv={{ h: 0, s: 0.5, v: 0.5 }}
        onColorUpdate={onColorUpdate}
      />,
    );
    const panel = container.querySelector(".sb-panel") as HTMLDivElement;
    panel.getBoundingClientRect = () =>
      ({ left: 10, top: 20, width: 200, height: 200 }) as DOMRect;

    fireEvent.pointerDown(panel, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientX: 110,
      clientY: 70,
    });

    expect(onColorUpdate).toHaveBeenCalledWith(0.5, 0.75);
  });

  test("coalesces pointer moves to one update per animation frame", () => {
    const callbacks: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callbacks.push(callback);
      return callbacks.length;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const onColorUpdate = vi.fn();
    const { container, unmount } = render(
      <SaturationBrightnessPanel
        hsv={{ h: 0, s: 0.5, v: 0.5 }}
        onColorUpdate={onColorUpdate}
      />,
    );
    const panel = container.querySelector(".sb-panel") as HTMLDivElement;
    const getBounds = vi.fn(
      () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect,
    );
    panel.getBoundingClientRect = getBounds;

    fireEvent.pointerDown(panel, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientX: 10,
      clientY: 90,
    });
    fireEvent.pointerMove(panel, { pointerId: 1, clientX: 20, clientY: 80 });
    fireEvent.pointerMove(panel, { pointerId: 1, clientX: 80, clientY: 20 });

    expect(onColorUpdate).toHaveBeenCalledTimes(1);
    expect(callbacks).toHaveLength(1);
    callbacks[0](0);
    expect(onColorUpdate).toHaveBeenLastCalledWith(0.8, 0.8);
    expect(getBounds).toHaveBeenCalledTimes(1);
    unmount();
    vi.unstubAllGlobals();
  });
});

test("ColorPanel exposes a semantic, stable footer and swatch", () => {
  const { container, getByRole } = render(
    <ColorPanel color={tinycolor("#336699")} />,
  );

  expect(container.querySelector('[data-slot="footer"]')).not.toBeNull();
  expect(container.querySelector('[data-slot="swatch"]')).not.toBeNull();
  expect(
    getByRole("button", { name: "Change color text format" }),
  ).toBeTruthy();
});
