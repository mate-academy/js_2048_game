'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

// class Game {
//   constructor() {
//     this.state = [
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//     ];

//     this.score = 0;
//     this.firstMoveMade = false;
//     this.gameOver = false;

//     this.startMessage = document.querySelector('.message-start');
//     this.winMessage = document.querySelector('.message-win');
//     this.loseMessage = document.querySelector('.message-lose');
//     this.buttonStart = document.querySelector('.start');
//     this.scoreDisplay = document.querySelector('.game-score');

//     this.buttonStart.addEventListener('click', () => this.start());
//   }

//   handler() {
//     document.addEventListener('keydown', (e) => this.handleKeydown(e));
//   }
//   handleKeydown(e) {
//     if (this.gameOver) {
//       return;
//     }

//     if (e.key === 'ArrowLeft') {
//       this.moveLeft();
//     } else if (e.key === 'ArrowRight') {
//       this.moveRight();
//     } else if (e.key === 'ArrowUp') {
//       this.moveUp();
//     } else if (e.key === 'ArrowDown') {
//       this.moveDown();
//     }

//     if (!this.firstMoveMade) {
//       this.firstMoveMade = true;
//       this.buttonStart.textContent = 'Restart';
//     }

//     this.checkWin();
//     this.checkGameOver();
//   }

//   generateNumber() {
//     const randomValue = Math.random();

//     return randomValue < 0.9 ? 2 : 4;
//   }

//   pushGenerateNumber() {
//     const availableIndexes = [[], [], [], []];

//     this.state.forEach((array, i) => {
//       array.forEach((number, index) => {
//         if (!number) {
//           availableIndexes[i].push(index);
//         }
//       });
//     });

//     const availableArray = [];

//     availableIndexes.forEach((arr, index) => {
//       if (arr.length) {
//         availableArray.push(index);
//       }
//     });

//     const array = this.getRandomElement(availableArray);

//     const number = this.getRandomElement(availableIndexes[array]);

//     this.state[array][number] = this.generateNumber();
//     this.render();
//   }

//   getRandomElement(arr) {
//     const randomIndex = Math.floor(Math.random() * arr.length);

//     return arr[randomIndex];
//   }

//   init() {
//     this.pushGenerateNumber();
//     this.pushGenerateNumber();
//     this.render();
//   }

//   moveLeft() {
//     this.state = this.state.map((arr) => this.merge(arr, 0));

//     this.init();
//   }

//   moveRight() {
//     this.state = this.state.map((arr) => this.merge(arr, 1));

//     this.init();
//   }

//   rotateMatrix(arr, clockwise) {
//     if (clockwise) {
//       return arr.map((_, colIndex) => {
//         return arr.map((row) => row[colIndex]).reverse();
//       });
//     } else {
//       return arr.map((_, colIndex) => {
//         return arr.map((row) => row[row.length - 1 - colIndex]);
//       });
//     }
//   }

//   moveUp() {
//     this.state = this.rotateMatrix(this.state, 1);
//     this.state = this.state.map((arr) => this.merge(arr, 1));
//     this.state = this.rotateMatrix(this.state, 0);

//     this.init();
//   }

//   moveDown() {
//     this.state = this.rotateMatrix(this.state, 1);
//     this.state = this.state.map((arr) => this.merge(arr, 0));
//     this.state = this.rotateMatrix(this.state, 0);

//     this.init();
//   }

//   merge(arr, direction) {
//     const input = direction ? arr.reverse() : arr;
//     const result = input
//       .filter((item) => item)
//       .reduce((acc, item, idx) => {
//         if (acc[idx - 1] === item) {
//           acc[acc.length - 1] += item;
//           this.score += acc[acc.length - 1];
//         } else {
//           acc.push(item);
//         }

//         return acc;
//       }, []);

//     const resLength = result.length;

//     result.length = arr.length;
//     result.fill(0, resLength, result.length);

//     return direction ? result.reverse() : result;
//   }

//   checkWin() {
//     for (const row of this.state) {
//       if (row.includes(2048)) {
//         this.showMessage(this.winMessage);
//         this.gameOver = true;

//         return true;
//       }
//     }

//     return false;
//   }

//   checkGameOver() {
//     for (const row of this.state) {
//       if (row.includes(0)) {
//         return false;
//       }
//     }

//     for (let i = 0; i < this.state.length; i++) {
//       for (let j = 0; j < this.state[i].length; j++) {
//         if (
//           (i < this.state.length - 1 &&
//             this.state[i][j] === this.state[i + 1][j]) ||
//           (j < this.state[i].length - 1 &&
//             this.state[i][j] === this.state[i][j + 1])
//         ) {
//           return false;
//         }
//       }
//     }

//     this.showMessage(this.loseMessage);
//     this.gameOver = true;

//     return true;
//   }

//   showMessage(messageElement) {
//     this.startMessage.classList.add('hidden');
//     this.winMessage.classList.add('hidden');
//     this.loseMessage.classList.add('hidden');
//     messageElement.classList.remove('hidden');
//   }

//   getState() {}
//   getScore() {}
//   getStatus() {}
//   start() {
//     this.state = [
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//     ];
//     this.score = 0;
//     this.firstMoveMade = false;
//     this.gameOver = false;

//     this.scoreDisplay.textContent = this.score;
//     this.showMessage(this.startMessage);
//     this.buttonStart.textContent = 'Start';
//     this.init();
//   }
//   restart() {}
//   render() {
//     const tbody = document.querySelector('tbody');

//     this.state.forEach((row) => {
//       const tr = document.querySelector('tr');

//       row.forEach((cell) => {
//         const td = document.querySelector('td');

//         td.textContent = cell || '';
//         tr.appendChild(td);

//         if (!cell) {
//           td.className = 'field-cell';
//         }
//         td.classList.add(`field-cell--${cell}`);
//       });
//       tbody.appendChild(tr);
//     });

//     this.scoreDisplay.textContent = this.score;
//   }
// }

// const game = new Game();

// game.init();
// game.handler();

'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
function updateTable(state) {
  const fieldRows = document.querySelectorAll('.field-row');

  fieldRows.forEach((rowElement, rowIndex) => {
    const rowState = state[rowIndex];

    rowState.forEach((cellState, columnIndex) => {
      const cellElement = rowElement.children[columnIndex];

      cellElement.className = `field-cell field-cell--${cellState}`;
      cellElement.innerText = cellState > 0 ? cellState : '';

      if (cellState > 0) {
        cellElement.classList.add('merge');

        setTimeout(() => cellElement.classList.remove('merge'), 600);
      }
    });
  });
}

function updateScore(score) {
  document.querySelector('.game-score').innerText = score;
}

function updateButton(firstMoveMade) {
  if (firstMoveMade) {
    button.className = 'button restart';
    button.innerText = 'Restart';
  } else {
    button.className = 'button start';
    button.innerText = 'Start';
  }
}

function updateMessage(gameStatus) {
  const messageClasses = {
    idle: 'message-start',
    win: 'message-win',
    lose: 'message-lose',
  };

  document.querySelectorAll('.message').forEach((message) => {
    message.classList.add('hidden');
  });

  const messageClass = messageClasses[gameStatus];

  if (messageClass) {
    document.querySelector(`.${messageClass}`).classList.remove('hidden');
  }
}

function update() {
  updateTable(game.getState());
  updateScore(game.getScore());
  updateButton(game.getFirstMoveMade());
  updateMessage(game.getStatus());
}

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  switch (button.innerText) {
    case 'Start':
      game.start();
      break;
    case 'Restart':
      game.restart();
  }

  update();
});

document.addEventListener('keydown', (e) => {
  const actions = {
    ArrowUp: () => game.moveUp(),
    ArrowRight: () => game.moveRight(),
    ArrowDown: () => game.moveDown(),
    ArrowLeft: () => game.moveLeft(),
  };

  const action = actions[e.key];

  if (action) {
    e.preventDefault();
    action();
  }

  update();
});
