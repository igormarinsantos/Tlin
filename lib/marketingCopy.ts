/** Keeps marketing headings and supporting copy visually open ended. */
export function withoutClosingPeriod(copy: string) {
  return copy.replace(/\.(?=\s*$)/, "");
}
