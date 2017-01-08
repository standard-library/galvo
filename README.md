# galvo

Acts as a "higher order stream" which manages a collection of stuff with a single "active" item. You might use it to coordinate a slideshow.

Implemented using Kefir.js.

## Installation

```shell
yarn add @standard-library/galvo
```

## Usage

```javascript
const slides = [1, 2, 3];
const advance = K.interval(3000).take(3);
const slideshow = galvo({ advance }, slides);

slideshow.current.log();
// => 1---2---3---1
slideshow.previous.log();
// => ----1---2---3
```
