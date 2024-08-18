export function debounce(cb:() => void, delay=10) {
  const to = setTimeout(cb, delay);
  return () => clearTimeout(to);
}

export function debouncedEffect(cb:() => void, delay=10) {
  return () => debounce(cb, delay);
}

export function daysSince(pastDate:Date) {
  return Math.round((new Date().getTime() - pastDate.getTime()) / (1000*60*60*24));
}
