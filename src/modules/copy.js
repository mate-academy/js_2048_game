// constructor() {
//   this.directions = {
//     right: 'right',
//     left: 'left',
//     up: 'up',
//     down: 'down',
//   };

//   this.startBoard = [
//     [2, 0, 0, 0],
//     [0, 0, 0, 0],
//     [0, 0, 0, 0],
//     [0, 0, 0, 0],
//   ];

//   this.state = initialState;
//   this.board = initialBoard;
//   this.cells = [...document.querySelectorAll('.field-cell')];
//   this.startButton = document.querySelector('.start');
//   this.restartButton = document.querySelector('.restart');
//   this.lastRandomZeroIndex = 0;
//   this.score = 0;
//   // eslint-disable-next-line no-console
//   // console.log(initialState);

//   // function that go trough the board and apply callback to each cell
//   // and return array after applying
//   this.goThroughCells = function (array, callback) {
//     return [...array].map((row) => {
//       return row.map((cell, cellIndex) => {
//         return callback(cell, cellIndex);
//       });
//     });
//   };

//   // function that choise in which cell will put new number
//   this.getRandomZeroIndex = (zeros) => {
//     let randomNumber = 1;

//     const getRandomNumber = () => Math.floor(Math.random() * zeros + 1);

//     if (zeros !== 1) {
//       do {
//         randomNumber = getRandomNumber();
//       } while (randomNumber === this.lastRandomZeroIndex);
//     }

//     this.lastRandomZeroIndex = randomNumber;

//     return randomNumber;
//   };

//   // function that choise between 2 and 4 with some probability
//   this.getNumberToAdd = (ProbabilityOfFour) => {
//     const random = Math.random() * 100 + 1;

//     return random < ProbabilityOfFour ? 4 : 2;
//   };

//   // function that put new number to the board, return new board
//   this.addNumberToRandomZeroIndex = function (board) {
//     let zerosAmount = 0;

//     const numberToAdd = this.getNumberToAdd(10);

//     this.goThroughCells(board, (value) => {
//       return value === 0 ? zerosAmount++ : null;
//     });

//     const randomIndex = this.getRandomZeroIndex(zerosAmount);
//     let indexCounter = 0;

//     const boardWithNewNumber = this.goThroughCells(board, (value) => {
//       if (value === 0) {
//         indexCounter++;
//       }

//       return randomIndex === indexCounter && value === 0
//         ? numberToAdd
//         : value;
//     });

//     return boardWithNewNumber;
//   };

//   // function that convert array to the html-table and show it on the page
//   this.displayBoard = function () {
//     this.board.forEach((row, rowIndex) => {
//       const cellIndexCoefficient = rowIndex * 4;

//       row.forEach((cell, cellIndex) => {
//         const cellElement = this.cells[cellIndex + cellIndexCoefficient];
//         const value = cell !== 0 ? cell : '';
//         const cellClassName =
//           cell === 0 ? 'field-cell' : `field-cell field-cell--${cell}`;

//           cellElement.textContent = value;
//           console.log(value);
//         cellElement.className = cellClassName;
//       });
//     });
//   };

//   // function that moves numbers into the table (array)
//   this.moveValues = function (direction) {
//     function turnDirection(arr) {
//       return arr[0].map((_n, rowIndex) => arr.map((num) => num[rowIndex]));
//     }

//     const isVertical =
//       direction === this.directions.up || direction === this.directions.down;
//     const isRightDownDirection =
//       direction === this.directions.right ||
//       direction === this.directions.down;

//     const arrayToMove = isVertical ? turnDirection(this.board) : this.board;

//     const movedArray = arrayToMove.map((row) => {
//       const values = isRightDownDirection
//         ? row.filter((cell) => cell !== 0).reverse()
//         : row.filter((cell) => cell !== 0);

//       for (let i = 0; i < values.length; i++) {
//         if (values[i] === values[i + 1]) {
//           values[i] *= 2;
//           values[i + 1] = 0;

//           this.updateScore += values[i];
//         }
//       }

//       const mergedValues = isRightDownDirection
//         ? values.filter((cell) => cell !== 0).reverse()
//         : values.filter((cell) => cell !== 0);

//       const zeros = new Array(4 - mergedValues.length).fill(0);

//       return isRightDownDirection
//         ? [...zeros, ...mergedValues]
//         : [...mergedValues, ...zeros];
//     });

//     this.updateBoard = isVertical ? turnDirection(movedArray) : movedArray;
//   };

//   this.displayScore = function () {
//     const gameScore = document.querySelector('.game-score');

//     gameScore.textContent = this.score;
//   };

//   this.displayBoard();
// };
