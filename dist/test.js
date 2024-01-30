"use strict";
const a = "a***abc";
const b = "abc";
const index = a.lastIndexOf('*');
console.log(index, 'index');
const sub = a.substring(index + 1, a.length);
console.log(sub, 'sub');
