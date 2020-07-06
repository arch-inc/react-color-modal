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
    if (typeof window === "undefined") {
      return;
    }

    const onResize = throttle(() => {
      if (ref.current) {
        const { clientWidth: width, clientHeight: height } = ref.current;
        setSize({ width, height });
      }
    }, 200);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ref.current]);

  return [size, ref];
}

export function throttle(
  f: (...args: any[]) => any,
  delay: number
): (...args: any[]) => any {
  let handler: any, args: IArguments;
  return function () {
    // update arguments
    args = arguments;

    // delay the function call
    if (handler) {
      return;
    }

    // call the function with the latest arguments
    handler = setTimeout(() => {
      f.apply(f, Array.prototype.slice.call(args));
      handler = null;
    }, delay);
  };
}
