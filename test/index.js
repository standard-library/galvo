import test from "tape";
import { Kefir as K } from "kefir";

import galvo from "..";

test('default item', (t) => {
  const slideshow = galvo({}, ["a", "b", "c"]);

  slideshow.current.onValue(function (item) {
    t.equal("a", item);
    t.end();
  });
});

test('default index', (t) => {
  const slideshow = galvo({}, ["a", "b", "c"]);

  slideshow.currentIndex.onValue(function (index) {
    t.equal(0, index);
    t.end();
  });
});

test('advances', (t) => {
  const slideshow = galvo({
    advance: K.sequentially(1, [true])
  }, ["a", "b", "c"]);

  assert_values(["a", "b"], slideshow.current, t);
});

test('recedes', (t) => {
  const slideshow = galvo({
    index: K.constant(1),
    recede: K.sequentially(1, [true])
  }, ["a", "b", "c"]);

  assert_values(["b", "a"], slideshow.current, t);
});

test('providing index as constant stream', (t) => {
  const slideshow = galvo({
    index: K.constant(1)
  }, ["a", "b", "c"]);

  slideshow.currentIndex.onValue(function (index) {
    t.equal(1, index);
    t.end();
  });
});

test('previousIndex emits after second slide', (t) => {
  const slideshow = galvo({
    advance: K.sequentially(1, [true])
  }, ["a", "b", "c"]);

  slideshow.previousIndex.onValue(function (index) {
    t.equal(0, index);
    t.end();
  });
});

test('previous emits after second slide', (t) => {
  const slideshow = galvo({
    advance: K.sequentially(1, [true])
  }, ["a", "b", "c"]);

  slideshow.previous.onValue(function (item) {
    t.equal("a", item);
    t.end();
  });
});

test('wraps current to origin at end of sequence', (t) => {
  const slideshow = galvo({
    index: K.constant(2),
    advance: K.sequentially(1, [true])
  }, ["a", "b", "c"]);

  assert_values(["c", "a"], slideshow.current, t);
});

test('wraps current to origin at end of sequence twice', (t) => {
  const slideshow = galvo({
    advance: K.sequentially(1, [true, true, true, true])
  }, ["a", "b"]);

  assert_values(["a", "b", "a", "b", "a"], slideshow.current, t);
});

test('wraps current to origin at end of sequence twice in reverse', (t) => {
  const slideshow = galvo({
    recede: K.sequentially(1, [true, true, true, true])
  }, ["a", "b"]);

  assert_values(["a", "b", "a", "b", "a"], slideshow.current, t);
});

test('wraps current to end at beginning of sequence', (t) => {
  const slideshow = galvo({
    recede: K.sequentially(1, [true])
  }, ["a", "b", "c"]);

  assert_values(["a", "c"], slideshow.current, t);
});

test('follows arbitrary index stream', (t) => {
  const slideshow = galvo({
    index: K.sequentially(1, [1, 2, 1, 3])
  }, ["a", "b", "c"]);

  assert_values([0, 1, 2, 1, 0], slideshow.currentIndex, t);
});

function assert_values(values, stream, t) {
  stream
    .take(values.length)
    .scan((returns, v) => returns.concat(v), [])
    .skip(values.length - 1)
    .onValue(function (final) {
      t.same(values, final);
      t.end();
    });
}
