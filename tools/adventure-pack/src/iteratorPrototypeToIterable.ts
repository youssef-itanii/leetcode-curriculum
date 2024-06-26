/**
 * @adventure
 * {"name": "Iterator.prototype.toIterable"}
 */

import "./functionReturnThis";

import { iteratorPrototype } from "./iteratorPrototype";

declare global {
  interface Iterator<T> {
    toIterable(): IterableIterator<T>;
  }
}

iteratorPrototype.toIterable = function <T>(
  this: Iterator<T>,
): IterableIterator<T> {
  (this as unknown as Record<string | symbol, unknown>)[Symbol.iterator] ??=
    Function.returnThis;
  return this as unknown as IterableIterator<T>;
};
