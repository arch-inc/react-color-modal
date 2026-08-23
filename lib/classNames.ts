export function classNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(" ");
}
