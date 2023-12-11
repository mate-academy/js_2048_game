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

  move(direction) {
    const isVertical = direction === 'up' || direction === 'down';
    const step = direction === 'up' || direction === 'left' ? -1 : 1;

    for (let i = isVertical ? 1 : 0; isVertical
      ? i < 4 : i < 3; isVertical ? i++ : i++) {
      for (let j = isVertical ? 0 : 1; isVertical
        ? j < 4 : j < 3; isVertical ? j++ : j++) {
        const row = isVertical ? i : j;
        const col = isVertical ? j : i;

        if (this.field[row][col] !== 0) {
          let newRowOrCol = isVertical ? row + step : row;
          let newColOrRow = isVertical ? col : col + step;

          while (
            newRowOrCol >= 0
            && newRowOrCol < 4
            && newColOrRow >= 0
            && newColOrRow < 4
            && (this.field[newRowOrCol][newColOrRow] === 0
              || this.field[newRowOrCol][newColOrRow] === this.field[row][col])
          ) {
            if (this.field[newRowOrCol][newColOrRow] === this.field[row][col]) {
              if (this.field[newRowOrCol][newColOrRow] !== 0) {
                this.field[newRowOrCol][newColOrRow] *= 2;
                this.field[row][col] = 0;
              }
            } else if (this.field[newRowOrCol][newColOrRow] === 0) {
              this.field[newRowOrCol][newColOrRow] = this.field[row][col];
              this.field[row][col] = 0;
            }
            newRowOrCol += isVertical ? step : 0;
            newColOrRow += isVertical ? 0 : step;
          }
        }
      }
    }

    this.putRandomNumber();
  }

  goUp() {
    this.move('up');
  }

  goDown() {
    this.move('down');
  }

  goLeft() {
    this.move('left');
  }

  goRight() {
    this.move('right');
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
