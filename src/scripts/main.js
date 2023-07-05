/* eslint-disable max-len */
'use strict';

class Cell {
  constructor(value) {
    this.value = value;
  }
}

class GameField {
  constructor() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  addCell(cell, row, column) {
    this.field = this.field.map((fRow, indexfRow) => {
      if (indexfRow === row) {
        return fRow.map((fCol, indexFCol) => (indexFCol === column)
          ? cell.value
          : fCol
        );
      }

      return fRow;
    });
  }
}

class GameManager {
  constructor() {
    this.field = new GameField();
    this.score = 0;
    this.start = false;
    this.win = false;
    this.lose = false;
    this.restart = false;
    this.prevField = [];
  }

  createNewCell() {
    const emptySpots = this.checkEmptySpots();

    if (emptySpots.length === 0) {
      this.checkLose();

      return;
    }

    const randomIndex = Math.floor(Math.random() * emptySpots.length);
    const [rowIndex, columnIndex] = emptySpots[randomIndex];
    const startValue = () => (Math.floor(Math.random() * 11) >= 9) ? 4 : 2;
    const newCell = new Cell(startValue());

    if (this.start) {
      this.field.addCell(newCell, rowIndex, columnIndex);
    }
  }

  checkEmptySpots() {
    const emptySpots = [];

    this.field.field.forEach((row, iRow) => {
      row.forEach((col, iCol) => {
        if (col === 0) {
          emptySpots.push([iRow, iCol]);
        }
      });
    });

    return emptySpots;
  }

  makeStep(strategy) {
    this.prevField = JSON.parse(JSON.stringify(this.field.field));
    strategy.move();
    this.checkWin();
  }

  updateScore(newValue) {
    this.score += newValue;
  }

  checkLose() {
    if (this.checkEmptySpots().length === 0) {
      const lose = this.field.field.some((row, iRow) => {
        return !row.some((col, iCol) => iCol < 3
          && (col === this.field.field[iRow][iCol + 1]
          || this.field.field[iCol][iRow]
              === this.field.field[iCol + 1][iRow]));
      });

      this.lose = lose;
      this.start = !lose;
    }
  }

  checkWin() {
    const win = this.field.field.some(row => {
      return row.some(cell => cell === 2048);
    });

    this.win = win;
    this.start = !win;
  }

  restartGame() {
    this.field = new GameField();
    this.score = 0;
    this.start = true;
    this.win = false;
    this.lose = false;
    this.restart = true;
    this.prevField = [];
  }
}

class UpMovement {
  constructor(currentGame) {
    this.currentGame = currentGame;
    this.field = this.currentGame.field.field;
  }

  move() {
    this.moveAndMerge();
    this.fillEmptySpaces();
  }

  moveAndMerge() {
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        let nextRow = row + 1;

        while (nextRow <= 3 && this.field[nextRow][col] === 0) {
          nextRow++;
        }

        if (nextRow <= 3 && this.field[row][col] === this.field[nextRow][col]) {
          this.field[row][col] *= 2;
          this.field[nextRow][col] = 0;
          this.currentGame.updateScore(this.field[row][col]);
        }
      }
    }
  }

  fillEmptySpaces() {
    for (let col = 0; col < 4; col++) {
      let nextRow = 0;

      for (let row = 0; row < 4; row++) {
        if (this.field[row][col] !== 0) {
          this.field[nextRow][col] = this.field[row][col];
          nextRow++;
        }
      }

      while (nextRow < 4) {
        this.field[nextRow][col] = 0;
        nextRow++;
      }
    }
  }
}

class DownMovement {
  constructor(currentGame) {
    this.currentGame = currentGame;
    this.field = this.currentGame.field.field;
  }

  move() {
    this.moveAndMerge();
    this.fillEmptySpaces();
  }

  moveAndMerge() {
    for (let iCol = 0; iCol < 4; iCol++) {
      for (let iRow = 3; iRow >= 1; iRow--) {
        let next = iRow - 1;

        while (next >= 0 && this.field[next][iCol] === 0) {
          next--;
        }

        if (next >= 0 && this.field[iRow][iCol] === this.field[next][iCol]) {
          this.field[iRow][iCol] *= 2;
          this.field[next][iCol] = 0;
          this.currentGame.updateScore(this.field[iRow][iCol]);
        }
      }
    }
  }

  fillEmptySpaces() {
    for (let iCol = 0; iCol < 4; iCol++) {
      let next = 3;

      for (let iRow = 3; iRow >= 0; iRow--) {
        if (this.field[iRow][iCol] !== 0) {
          this.field[next][iCol] = this.field[iRow][iCol];
          next--;
        }
      }

      while (next >= 0) {
        this.field[next][iCol] = 0;
        next--;
      }
    }
  }
}

class RightMovement {
  constructor(currentGame) {
    this.currentGame = currentGame;
    this.field = this.currentGame.field.field;
  }

  move() {
    this.moveAndMerge();
    this.fillEmptySpaces();
  }

  moveAndMerge() {
    for (let iRow = 0; iRow < 4; iRow++) {
      for (let iCol = 3; iCol >= 1; iCol--) {
        let next = iCol - 1;

        while (next >= 0 && this.field[iRow][next] === 0) {
          next--;
        }

        if (next >= 0 && this.field[iRow][iCol] === this.field[iRow][next]) {
          this.field[iRow][iCol] *= 2;
          this.field[iRow][next] = 0;
          this.currentGame.updateScore(this.field[iRow][iCol]);
        }
      }
    }
  }

  fillEmptySpaces() {
    for (let iRow = 0; iRow < 4; iRow++) {
      let next = 3;

      for (let iCol = 3; iCol >= 0; iCol--) {
        if (this.field[iRow][iCol] !== 0) {
          this.field[iRow][next] = this.field[iRow][iCol];
          next--;
        }
      }

      while (next >= 0) {
        this.field[iRow][next] = 0;
        next--;
      }
    }
  }
}

class LeftMovement {
  constructor(currentGame) {
    this.currentGame = currentGame;
    this.field = this.currentGame.field.field;
  }

  move() {
    this.moveAndMerge();
    this.fillEmptySpaces();
  }

  moveAndMerge() {
    for (let iRow = 0; iRow < 4; iRow++) {
      for (let iCol = 0; iCol < 4 - 1; iCol++) {
        let next = iCol + 1;

        while (next < 4 && this.field[iRow][next] === 0) {
          next++;
        }

        if (next < 4 && this.field[iRow][iCol] === this.field[iRow][next]) {
          this.field[iRow][iCol] *= 2;
          this.field[iRow][next] = 0;
          this.currentGame.updateScore(this.field[iRow][iCol]);
        }
      }
    }
  }

  fillEmptySpaces() {
    for (let iRow = 0; iRow < 4; iRow++) {
      let next = 0;

      for (let iCol = 0; iCol < 4; iCol++) {
        if (this.field[iRow][iCol] !== 0) {
          this.field[iRow][next] = this.field[iRow][iCol];
          next++;
        }
      }

      while (next < 4) {
        this.field[iRow][next] = 0;
        next++;
      }
    }
  }
}

class GameView {
  constructor(currentGame) {
    this.currentGame = currentGame;
    this.cellsFieldView = document.querySelector('.cells-field');
    this.gameScoreView = document.querySelector('.game-score');
    this.messageLose = document.querySelector('.message-lose');
    this.messageWin = document.querySelector('.message-win');
  }

  render() {
    const cellsView = Object.values(this.cellsFieldView.children);
    const fieldDate = Object.values(this.currentGame.field)[0];

    fieldDate.forEach((rowField, rowFieldIndex) => {
      rowField.forEach((colField, colFieldIndex) => {
        const cellDataValue = fieldDate[rowFieldIndex][colFieldIndex];
        const cellView = cellsView.find(cell => cell.className
          .includes(`cell-position--${rowFieldIndex}-${colFieldIndex}`));

        if (!cellView && colField !== 0) {
          this.cellsFieldView.insertAdjacentHTML('afterbegin', `
            <div
              class="cell cell--${colField} cell-position cell-position--${rowFieldIndex}-${colFieldIndex}"
            >
              ${colField}
            </div>
          `);
        }

        if (cellView && +cellView.textContent !== cellDataValue) {
          cellView.className = `cell cell--${cellDataValue} cell-position cell-position--${rowFieldIndex}-${colFieldIndex}`;
          cellView.textContent = cellDataValue;
        }

        if (cellView && !cellDataValue) {
          cellView.remove();
        }
      });
    });

    this.gameScoreView.textContent = this.currentGame.score;

    if (this.currentGame.lose) {
      this.messageLose.classList.remove('hidden');
      this.start = false;
    } else {
      this.messageLose.classList.add('hidden');
    }

    if (this.currentGame.win) {
      this.messageWin.classList.remove('hidden');
      this.start = false;
    } else {
      this.messageWin.classList.add('hidden');
    }
  }

  handleKeyPress(key) {
    switch (key) {
      case 'ArrowUp':
        this.currentGame.makeStep(new UpMovement(this.currentGame));
        break;
      case 'ArrowDown':
        this.currentGame.makeStep(new DownMovement(this.currentGame));
        break;
      case 'ArrowLeft':
        this.currentGame.makeStep(new LeftMovement(this.currentGame));
        break;
      case 'ArrowRight':
        this.currentGame.makeStep(new RightMovement(this.currentGame));
        break;

      default:
        break;
    }
  }
}

const gameManager = new GameManager();
const gameView = new GameView(gameManager);

const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');

startButton.addEventListener('click', () => {
  gameManager.start = true;

  if (startButton.textContent === 'Start') {
    messageStart.classList.add('hidden');
    startButton.classList.add('restart');
    startButton.classList.remove('start');
    startButton.textContent = 'Restart';

    gameManager.createNewCell();
    gameManager.createNewCell();
    gameView.render();
  } else {
    gameManager.restartGame();
    gameView.render();

    setTimeout(() => {
      gameManager.createNewCell();
      gameManager.createNewCell();
      gameView.render();
    }, 150);
  }
});

document.addEventListener('keyup', (e) => {
  if (gameManager.start
    && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
  ) {
    gameView.handleKeyPress(e.key);
    gameManager.checkLose();
    gameView.render();

    if (JSON.stringify(gameManager.prevField)
      !== JSON.stringify(gameManager.field.field)
    ) {
      setTimeout(() => {
        gameManager.createNewCell();
        gameView.render();
      }, 300);
    }
  }

  if (e.code === 'NumpadEnter' || e.code === 'Space') {
    e.preventDefault();
  }
});
