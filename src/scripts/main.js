'use strict';

const gameField = document.getElementById('gameArea');

class Game {
  constructor() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.isGameOver = false;
    this.totalValue = 0;
  }

  startGame() {
    this.clearField();
    this.putRandomNumber();
    this.putRandomNumber();
    this.countTotalValue();
    this.reRender();
  }

  clearField() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        this.field[row][col] = 0;
      }
    }
  }

  putRandomNumber() {
    if (this.isFieldFull()) {
      return;
    }

    let complete = false;

    while (!complete) {
      const xAxis = Math.floor(Math.random() * 4);
      const yAxis = Math.floor(Math.random() * 4);
      const randomValue = Math.random() < 0.9 ? 2 : 4;

      if (this.field[xAxis][yAxis] === 0) {
        this.field[xAxis][yAxis] = randomValue;
        complete = true;
      }
    }
  }

  reRender() {
    gameField.innerHTML = '';

    const newFieldRows = this.field.map((row) => {
      const newFieldCells = row.map((value) => {
        if (value !== 0) {
          return `<td class="field-cell field-cell--${value}">${value}</td>`;
        } else {
          return '<td class="field-cell"></td>';
        }
      });

      return `<tr class="field-row">${newFieldCells.join('')}</tr>`;
    });

    gameField.innerHTML = newFieldRows.join('');
  }

  goUp() {
    for (let col = 0; col < 4; col++) {
      for (let row = 1; row < 4; row++) {
        if (this.field[row][col] !== 0) {
          let newRow = row;

          while (newRow > 0
            && (this.field[newRow - 1][col] === 0
              || this.field[newRow - 1][col] === this.field[newRow][col])) {
            if (this.field[newRow - 1][col] === this.field[newRow][col]) {
              this.field[newRow - 1][col] *= 2;
              this.field[newRow][col] = 0;
            } else if (this.field[newRow - 1][col] === 0) {
              this.field[newRow - 1][col] = this.field[newRow][col];
              this.field[newRow][col] = 0;
            }
            newRow--;
          }
        }
      }
    }
    this.putRandomNumber();
  }

  goDown() {
    for (let col = 0; col < 4; col++) {
      for (let row = 2; row >= 0; row--) {
        if (this.field[row][col] !== 0) {
          let newRow = row;

          while (newRow < 3
            && (this.field[newRow + 1][col] === 0
              || this.field[newRow + 1][col] === this.field[newRow][col])) {
            if (this.field[newRow + 1][col] === this.field[newRow][col]) {
              this.field[newRow + 1][col] *= 2;
              this.field[newRow][col] = 0;
            } else if (this.field[newRow + 1][col] === 0) {
              this.field[newRow + 1][col] = this.field[newRow][col];
              this.field[newRow][col] = 0;
            }
            newRow++;
          }
        }
      }
    }
    this.putRandomNumber();
  }

  goLeft() {
    for (let row = 0; row < 4; row++) {
      for (let col = 1; col < 4; col++) {
        if (this.field[row][col] !== 0) {
          let newCol = col;

          while (newCol > 0
            && (this.field[row][newCol - 1] === 0
              || this.field[row][newCol - 1] === this.field[row][newCol])) {
            if (this.field[row][newCol - 1] === this.field[row][newCol]) {
              this.field[row][newCol - 1] *= 2;
              this.field[row][newCol] = 0;
            } else if (this.field[row][newCol - 1] === 0) {
              this.field[row][newCol - 1] = this.field[row][newCol];
              this.field[row][newCol] = 0;
            }
            newCol--;
          }
        }
      }
    }
    this.putRandomNumber();
  }

  goRight() {
    for (let row = 0; row < 4; row++) {
      for (let col = 2; col >= 0; col--) {
        if (this.field[row][col] !== 0) {
          let newCol = col;

          while (newCol < 3
            && (this.field[row][newCol + 1] === 0
              || this.field[row][newCol + 1] === this.field[row][newCol])) {
            if (this.field[row][newCol + 1] === this.field[row][newCol]) {
              this.field[row][newCol + 1] *= 2;
              this.field[row][newCol] = 0;
            } else if (this.field[row][newCol + 1] === 0) {
              this.field[row][newCol + 1] = this.field[row][newCol];
              this.field[row][newCol] = 0;
            }
            newCol++;
          }
        }
      }
    }
    this.putRandomNumber();
  }

  isGameOverMethod() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.field[row][col] === this.field[row][col + 1]) {
          return false;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.field[row][col] === this.field[row + 1][col]) {
          return false;
        }
      }
    }

    this.isGameOver = true;
  }

  countTotalValue() {
    let totalValue = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        totalValue += this.field[row][col];
      }
    }

    this.totalValue = totalValue;
  }

  isFieldFull() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          return false;
        }
      }
    }

    return true;
  }

  has2048Value() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }
}

const game = new Game();

const scoreBoard = document.getElementById('gameScore');
const startButton = document.getElementById('buttonStart');

const startMessage = document.getElementById('startMessage');
const winMessage = document.getElementById('winMessage');
const lostMessage = document.getElementById('loseMessage');

startButton.onclick = () => {
  game.startGame();

  startMessage.classList.add('hidden');
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';

  document.addEventListener('keydown', handleKeyPress);

  scoreBoard.innerText = game.totalValue;
};

function handleKeyPress(keyEvent) {
  switch (keyEvent.key) {
    case 'ArrowUp':
      game.goUp();
      break;
    case 'ArrowDown':
      game.goDown();
      break;
    case 'ArrowLeft':
      game.goLeft();
      break;
    case 'ArrowRight':
      game.goRight();
      break;
  }

  game.reRender();
  game.countTotalValue();
  game.isGameOverMethod();

  if (game.has2048Value()) {
    winMessage.classList.remove('hidden');
  }

  if (game.isGameOver) {
    document.removeEventListener('keydown', handleKeyPress);
    lostMessage.classList.remove('hidden');
  }

  scoreBoard.innerText = game.totalValue;
}
