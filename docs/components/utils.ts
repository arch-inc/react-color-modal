import { useRef, useState, useEffect, MutableRefObject } from "react";

export interface Size {
  width: number;
  height: number;
}

export function useResize<E extends HTMLElement>(): [
  Size,
  MutableRefObject<E>
] {
  const ref = useRef<E>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!window) {
      return;
    }

    const onResize = () => {
      if (ref.current) {
        const { clientWidth: width, clientHeight: height } = ref.current;
        setSize({ width, height });
      }
      timeoutId = null;
    };

    // throttling
    let timeoutId = null;
    const onRawResize = () => {
      if (timeoutId) {
        return;
      }
      timeoutId = setTimeout(onResize, 200);
    };
    window.addEventListener("resize", onRawResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onRawResize);
    };
  }, [ref.current]);

  return [size, ref];
}
