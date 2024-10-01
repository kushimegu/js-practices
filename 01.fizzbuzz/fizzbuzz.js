#!/usr/bin/env node

for (let number = 1; number <= 20; number++) {
  if (number % 3 === 0 && number % 5 === 0) {
    console.log("Fizzbuzz");
  } else if (number % 3 === 0) {
    console.log("Fizz");
  } else if (number % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(number.toString());
  }
}
