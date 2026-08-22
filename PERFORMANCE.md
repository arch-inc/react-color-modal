# Performance notes

## Pointer-drag update scheduling

Last verified: 2026-08-22

`ColorPanel` keeps pointer-down and pointer-up updates synchronous. Intermediate
pointer moves are coalesced to the latest browser sample and delivered at most
once per animation frame. A panel's layout bounds are measured once at the
start of a drag and reused until the gesture ends.

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
paced real pointer gesture is bounded to one update per display frame rather
than one update per raw pointer event. Unit tests additionally verify immediate
pointer-down feedback, latest-sample delivery, and one bounds measurement per
gesture for both the saturation/brightness panel and hue slider.
