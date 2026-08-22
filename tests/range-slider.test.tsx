import { fireEvent, render } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { HueSlider } from "../lib/HueSlider";

test("HueSlider responds immediately to accessible keyboard input", () => {
  const onHueChange = vi.fn();
  const { getByRole, unmount } = render(
    <HueSlider hue={120} onHueChange={onHueChange} />,
  );
  const slider = getByRole("slider", { name: "Hue" });

  fireEvent.keyDown(slider, { key: "ArrowRight" });
  expect(onHueChange).toHaveBeenCalledWith(121);

  fireEvent.keyDown(slider, { key: "Home" });
  expect(onHueChange).toHaveBeenCalledWith(0);
  unmount();
});

test("HueSlider coalesces pointer moves to one update per animation frame", () => {
  const callbacks: FrameRequestCallback[] = [];
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callbacks.push(callback);
    return callbacks.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  const onHueChange = vi.fn();
  const { getByRole, unmount } = render(
    <HueSlider hue={120} onHueChange={onHueChange} />,
  );
  const slider = getByRole("slider", { name: "Hue" }) as HTMLDivElement;
  const getBounds = vi.fn(
    () => ({ left: 0, top: 0, width: 360, height: 20 }) as DOMRect,
  );
  slider.getBoundingClientRect = getBounds;

  fireEvent.pointerDown(slider, {
    pointerId: 1,
    pointerType: "mouse",
    button: 0,
    clientX: 10,
  });
  fireEvent.pointerMove(slider, { pointerId: 1, clientX: 100 });
  fireEvent.pointerMove(slider, { pointerId: 1, clientX: 240 });

  expect(onHueChange).toHaveBeenCalledTimes(1);
  expect(callbacks).toHaveLength(1);
  callbacks[0](0);
  expect(onHueChange).toHaveBeenLastCalledWith(239);
  expect(getBounds).toHaveBeenCalledTimes(1);
  unmount();
  vi.unstubAllGlobals();
});
