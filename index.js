import { Kefir as K } from "kefir";

const NEVER = K.never();
const ZERO = K.constant(0);

const ADD1 = (x) => x + 1;
const SUBTRACT1 = (x) => x - 1;
const ALWAYS = (x) => () => x;

const delay = (n, s) => s.slidingWindow(n + 1, 2).map(([i, _]) => i);

function galvo({ advance = NEVER, recede = NEVER, index = ZERO } = {}, collection) {
  const length = collection.length;

  const nextT = advance.map(() => ADD1);
  const previousT = recede.map(() => SUBTRACT1);
  const indexT = index.map(ALWAYS);
  const transformations = K.merge([
    nextT,
    previousT,
    indexT
  ]);

  const currentIndex =
    transformations
      .scan((i, transform) => transform(i), 0)
      .map((i) => (i + length) % length);

  const current = currentIndex.map((i) => collection[i]);

  const previousIndex = delay(1, currentIndex);
  const previous = delay(1, current);

  return {
    current,
    currentIndex,
    previous,
    previousIndex
  }
}

module.exports = galvo;
