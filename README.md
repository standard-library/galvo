# galvo

Acts as a "higher order stream" which manages a collection of stuff with a single "active" item. You might use it to coordinate a slideshow.

Implemented using Kefir.js.

## Installation

```shell
yarn add @standard-library/galvo
```

## Usage

```javascript
const items = ["a", "b", "c"];
const advance = K.interval(3000).take(3);
const slideshow = galvo({ advance }, items);

slideshow.current.log();
// => a---b---c---a
slideshow.previous.log();
// => ----a---b---c
```
