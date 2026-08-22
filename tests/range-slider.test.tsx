import { fireEvent, render } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { HueSlider } from "../lib/HueSlider";

test("HueSlider responds immediately to accessible keyboard input", () => {
  const onHueChange = vi.fn();
  const { getByRole } = render(
    <HueSlider hue={120} onHueChange={onHueChange} />,
  );
  const slider = getByRole("slider", { name: "Hue" });

  fireEvent.keyDown(slider, { key: "ArrowRight" });
  expect(onHueChange).toHaveBeenCalledWith(121);

  fireEvent.keyDown(slider, { key: "Home" });
  expect(onHueChange).toHaveBeenCalledWith(0);
});
