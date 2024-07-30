// 'use strict';

// // const initialState = [
// //   [2, 0, 0, 0],
// //   [0, 4, 0, 0],
// //   [0, 0, 8, 0],
// //   [0, 0, 0, 16],
// // ];

// function getRandomBetweenTwoNumbers() {
//   return Math.random() < 0.9 ? 2 : 4;
// }

// function count(state) {
//   return state.flat().filter(n => !n).length;
// }

// function getRandomNumber(lengthFlattedArray) {
//   return Math.floor(Math.random() * lengthFlattedArray) + 1;
// }

// // function transposeState(state) {
// //   const numberOfArrayElements = count(state); // 12
// //   const randomNumber = getRandomNumber(numberOfArrayElements); // 1 - 12
// //   const result = [];
// //   let counter = 0;

// //   for (let col = 0; col < 4; col++) {
// //     result[col] = [];

// //     for (let row = 0; row < 4; row++) {
// //       if (state[row][col] === 0) {
// //         counter++;

// //         const startRandomValue = counter === randomNumber
// //           ? getRandomBetweenTwoNumbers() : 0;

// //         result[col].push(startRandomValue);
// //         continue;
// //       }
// //       result[col].push(state[row][col]);
// //     }
// //   }

// //   return result;
// // }
