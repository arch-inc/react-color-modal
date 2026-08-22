# Performance notes

## Pointer-drag update scheduling

Last verified: 2026-08-22

`ColorPanel` keeps pointer-down and pointer-up updates synchronous. Intermediate
pointer moves are coalesced to the latest browser sample. Cursor and slider
feedback is rendered locally at most once per animation frame, while external
`onColorUpdate` callbacks are limited to 25 Hz. Pointer-up always flushes the
exact final value synchronously. A panel's layout bounds are measured once at
the start of a drag and reused until the gesture ends.

This prevents high-rate pointing devices from making React process updates
that cannot be displayed, while preserving immediate feedback and the exact
final value.

### Browser profile

The production demo was profiled in headless Chromium 140.0.7339.16 at
1280x1000. Each run dispatched a pointer-down, 1,000 pointer moves across the
saturation/brightness panel, and a pointer-up. The table reports the median of
five fresh-page runs from Chrome DevTools Protocol performance metrics.

| Metric | 0.0.17 | Optimized | Change |
| --- | ---: | ---: | ---: |
| Gesture elapsed time | 45.9 ms | 19.8 ms | -56.9% |
| Main-thread task time | 49.2 ms | 22.2 ms | -54.8% |
| Script time | 36.2 ms | 14.8 ms | -59.2% |

The synthetic burst intentionally represents a worst-case input backlog. A
paced real pointer gesture is bounded to one local update per display frame
rather than one update per raw pointer event.

A second profile compared the animation-frame external propagation in 0.0.18
with local animation-frame feedback plus 25 Hz external propagation. Each run
paced 240 pointer moves over approximately 1.1 seconds. The local cursor still
updated on every display frame.

| Metric | 0.0.18 | Local feedback / 25 Hz external | Change |
| --- | ---: | ---: | ---: |
| Main-thread task time | 267.3 ms | 158.5 ms | -40.7% |
| Script time | 139.2 ms | 74.9 ms | -46.2% |
| Observed panel DOM mutations | 2,452 | 922 | -62.4% |

Unit tests verify immediate pointer-down feedback, animation-frame local
feedback, controlled-prop isolation during a drag, 25 Hz external delivery,
exact pointer-up delivery, latest-sample delivery, and one bounds measurement
per gesture for both the saturation/brightness panel and hue slider.

## CSS unit policy

Structural spacing uses `rem`, so browser root-font accessibility settings are
respected without compounding a consumer's local panel `font-size`. Text and
form-control proportions use `em` intentionally, while one-pixel borders and
pointer geometry remain `px` for stable visual and hit-area dimensions.
Percentage values are reserved for fluid panel geometry and color positions.

The footer control height is a single `--color-panel-control-height` token.
`InlineBox` uses the same token when inherited and retains `2.208em` as its
standalone fallback. Fixed 256px geometry in `HorizontalColorPanel` remains
intentional because it defines that variant's visualization size rather than
typographic spacing. These choices preserve Griffith's compact local
`font-size`: structural gaps stay stable, while labeled controls still scale
with the panel typography.
