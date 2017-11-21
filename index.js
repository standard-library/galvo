import { Kefir as K } from "kefir";

const NEVER = K.never();
const ZERO = K.constant(0);

const ADD1 = x => x + 1;
const SUBTRACT1 = x => x - 1;
const ALWAYS = x => () => x;

const delay = (n, s) => s.slidingWindow(n + 1, 2).map(([i, _]) => i);

/**
 * @typedef {Object} Galvo
 * @property {Kefir.Stream} current - Stream emitting the current item of the
 *   collection.
 * @property {Kefir.Stream} currentIndex - Stream emitting the index of the
 *   current item of the collection.
 * @property {Kefir.Stream} previous - Stream emitting the previous item of the
 *   collection.
 * @property {Kefir.Stream} previousIndex - Stream emitting the index of the
 *   previous item of the collection.
 */

/**
 * Uploads a file to an S3 bucket.
 * @param {Object} config
 * @param {Kefir.Stream} config.advance - A stream that emits a value whenever
 *   the index should advance one position. Defaults to never.
 * @param {Kefir.Stream} config.recede - A stream that emits a value whenever
 *   the index should recede one position. Defaults to never.
 * @param {Kefir.Stream} config.index  - A stream that emits an integers
 *   representing the current index. Defaults to emitting a single 0 index.
 * @param {Array} config
 * @returns {Galvo}
 * @example
 *
 *   const items = ["a", "b", "c"];
 *   const advance = Kefir.interval(3000).take(3);
 *   const cycle = galvo({ advance }, items);
 *
 *   cycle.current.log();
 *   // => a---b---c---a
 *   cycle.previous.log();
 *   // => ----a---b---c
 */
function galvo({ advance = NEVER, recede = NEVER, index = ZERO }, collection) {
  const length = collection.length;
  const applyT = (i, transform) => (transform(i) + length) % length;

  const nextT = advance.map(() => ADD1);
  const previousT = recede.map(() => SUBTRACT1);
  const indexT = index.map(ALWAYS);
  const transformations = K.merge([nextT, previousT, indexT]);

  const currentIndex = transformations.scan(applyT, 0).skipDuplicates();
  const current = currentIndex.map(i => collection[i]);

  const previousIndex = delay(1, currentIndex);
  const previous = delay(1, current);

  return {
    current,
    currentIndex,
    previous,
    previousIndex
  };
}

export default galvo;
