export function debounce(cb:() => void | (()=>void), delay=10) {
  let cleanup: null | (()=>void) = null;
  const to = setTimeout(() => {
    cleanup = cb() ?? null;
  }, delay);
  return () => {
    clearTimeout(to);
    if (cleanup) {
      cleanup();
    }
  };
}

export function debouncedEffect(cb:() => void | (()=>void), delay=10) {
  return () => debounce(cb, delay);
}

export function daysSince(pastDate:Date) {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const pastDay = new Date(pastDate);
  pastDay.setHours(0);
  pastDay.setMinutes(0);
  pastDay.setSeconds(0);
  pastDay.setMilliseconds(0);

  return Math.round((today.getTime() - pastDay.getTime()) / (1000*60*60*24));
}

// https://stackoverflow.com/a/53758827/6669665
export function shuffle<T>(array:T[], seed:number) {
  let m = array.length, t, i;

  // While there remain elements to shuffle...
  while (m) {

    // Pick a remaining element…
    i = Math.floor(random(seed) * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed
  }

  return array;
}

function random(seed:number) {
  const x = Math.sin(seed++) * 10000; 
  return x - Math.floor(x);
}
