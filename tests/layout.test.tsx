import { act, fireEvent, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToString } from "react-dom/server";
import tinycolor from "tinycolor2";
import { describe, expect, test, vi } from "vitest";

import { ColorPanel } from "../lib/ColorPanel";
import { Cursor } from "../lib/Cursor";
import { InlineBox } from "../lib/InlineBox";
import { SaturationBrightnessPanel } from "../lib/SaturationBrightnessPanel";
import { calculateSaturationBrightness } from "../lib/SaturationBrightnessEventHandler";

const css = readFileSync(resolve("lib/styles.css"), "utf8");

test("cursor center remains aligned with the selected color at every edge", () => {
  const { container } = render(<Cursor x={1} y={0} />);
  const cursor = container.querySelector(".cursor") as HTMLDivElement;

  expect(cursor.style.left).toBe("100%");
  expect(cursor.style.top).toBe("0%");
});

describe("SaturationBrightnessPanel", () => {
  test("is intrinsically square without a zero-height first render", () => {
    const html = renderToString(
      <SaturationBrightnessPanel hsv={{ h: 0, s: 0.5, v: 0.5 }} />,
    );

    expect(html).not.toContain("height:0px");
    expect(html).toContain("rcm-sb-panel");
    expect(css).toMatch(/aspect-ratio:\s*1 \/ 1/);
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
    vi.spyOn(performance, "now").mockReturnValue(0);
    const callbacks: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callbacks.push(callback);
      return callbacks.length;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const onColorUpdate = vi.fn();
    const { container, rerender, unmount } = render(
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
    act(() => callbacks[0](16));
    const cursor = container.querySelector(".cursor") as HTMLDivElement;
    expect(cursor.style.left).toBe("80%");
    expect(parseFloat(cursor.style.top)).toBeCloseTo(20);
    expect(onColorUpdate).toHaveBeenCalledTimes(1);

    rerender(
      <SaturationBrightnessPanel
        hsv={{ h: 0, s: 0.1, v: 0.1 }}
        onColorUpdate={onColorUpdate}
      />,
    );
    expect(cursor.style.left).toBe("80%");
    expect(parseFloat(cursor.style.top)).toBeCloseTo(20);

    fireEvent.pointerMove(panel, { pointerId: 1, clientX: 60, clientY: 40 });
    act(() => callbacks[1](41));
    expect(onColorUpdate).toHaveBeenLastCalledWith(0.6, 0.6);
    expect(onColorUpdate).toHaveBeenCalledTimes(2);
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

test("structural spacing uses root-relative units without nesting font size", () => {
  renderToString(
    <>
      <ColorPanel color={tinycolor("#336699")} />
      <InlineBox />
    </>,
  );

  expect(css).toMatch(/padding:\s*1rem/);
  expect(css).toMatch(/margin-bottom:\s*1rem/);
  expect(css).toMatch(/margin-bottom:\s*0\.75rem/);
  expect(css).toContain("var(--color-panel-control-height, 2.208em)");
});

test("HorizontalColorPanel wraps instead of enforcing a desktop minimum", () => {
  expect(css).toMatch(/\.rcm-horizontal-panel\s*{[^}]*min-width:\s*0/s);
  expect(css).toMatch(
    /@media\s*\(max-width:\s*35\.25rem\)[\s\S]*\.rcm-horizontal-panel\s*{[^}]*flex-direction:\s*column/,
  );
  expect(css).not.toMatch(/min-width:\s*564px/);
});
