'use strict';

class Game {
  constructor() {
    this.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.score = 0;

    this.updateScore();
    this.addNumber();
    this.addNumber();
  }

  addNumber() {
    let randomPosition;
    let positionNumberArr;
    let newNumber;
    let emptyCells = 0;
    const lastCell = [];

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] === 0) {
          emptyCells++;
          lastCell[0] = [i, j];
        }
      }
    }

    if (emptyCells > 1) {
      do {
        randomPosition = getRandomPosition();
        positionNumberArr = Math.floor(randomPosition / 4);
        newNumber = getRandomNumber();
      } while (this.grid[positionNumberArr][randomPosition % 4] !== 0);

      this.grid[positionNumberArr][randomPosition % 4] = newNumber;

      this.updateGrid();
    }

    if (emptyCells === 1) {
      this.grid[lastCell[0][0]][lastCell[0][1]] = getRandomNumber();
      this.updateGrid();
    } else {
      this.checkGameStatus();
    }
  }

  copyGrid() {
    return this.grid.map(row => row.slice());
  }

  isGridEqual(grid1, grid2) {
    for (let i = 0; i < grid1.length; i++) {
      for (let j = 0; j < grid1[i].length; j++) {
        if (grid1[i][j] !== grid2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  action(direction) {
    const originalGrid = this.copyGrid();

    this.move(direction);
    this.mergeNumber(direction);

    const gridChanged = !this.isGridEqual(originalGrid, this.grid);

    this.updateScore();
    this.move(direction);

    if (gridChanged) {
      this.addNumber();
    }
    this.checkGameStatus();
  }

  move(direction) {
    switch (true) {
      case direction === 'up':
        this.moveUp();
        break;

      case direction === 'down':
        this.moveDown();
        break;

      case direction === 'left':
        this.moveLeft();
        break;

      case direction === 'right':
        this.moveRight();
        break;
    }
  }

  mergeNumber(direction) {
    switch (true) {
      case direction === 'up':
        this.mergeUp();
        break;

      case direction === 'down':
        this.mergeDown();
        break;

      case direction === 'left':
        this.mergeLeft();
        break;

      case direction === 'right':
        this.mergeRight();
        break;
    }
  }

  updateGrid() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const cellValue = this.grid[i][j];
        const cellId = `field-cell-${i * 4 + j}`;
        const cellElement = document.getElementById(cellId);

        cellElement.className = 'field-cell';

        if (cellValue !== 0) {
          cellElement.classList.add(`field-cell--${cellValue}`);
          cellElement.innerText = cellValue;
        } else {
          cellElement.innerText = '';
        }
      }
    }
  }

  updateScore() {
    const element = document.getElementById('game-score');

    element.innerText = this.score;
  }

  mergeRight() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = this.grid[i].length - 1; j >= 0; j--) {
        if (this.grid[i][j] !== 0) {
          const currentCell = this.grid[i][j];
          const nextCell = this.grid[i][j - 1];

          if (currentCell === nextCell) {
            this.grid[i][j] *= 2;
            this.grid[i][j - 1] = 0;
            this.score += this.grid[i][j];
          }
        }
      }
    }
    this.updateGrid();
  }

  mergeLeft() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j <= this.grid[i].length - 1; j++) {
        if (this.grid[i][j] !== 0) {
          const currentCell = this.grid[i][j];
          const nextCell = this.grid[i][j + 1];

          if (currentCell === nextCell) {
            this.grid[i][j] *= 2;
            this.grid[i][j + 1] = 0;
            this.score += this.grid[i][j];
          }
        }
      }
    }
    this.updateGrid();
  }

  mergeDown() {
    for (let i = this.grid.length - 1; i >= 1; i--) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] !== 0) {
          const currentCell = this.grid[i][j];
          const nextCell = this.grid[i - 1][j];

          if (currentCell === nextCell) {
            this.grid[i][j] *= 2;
            this.grid[i - 1][j] = 0;
            this.score += this.grid[i][j];
          }
        }
      }
    }
    this.updateGrid();
  }

  mergeUp() {
    for (let i = 0; i < this.grid.length - 1; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] !== 0) {
          const currentCell = this.grid[i][j];
          const nextCell = this.grid[i + 1][j];

          if (currentCell === nextCell) {
            this.grid[i][j] *= 2;
            this.grid[i + 1][j] = 0;
            this.score += this.grid[i][j];
          }
        }
      }
    }
    this.updateGrid();
  }

  moveUp() {
    for (let j = 0; j < this.grid[0].length; j++) {
      for (let i = 1; i < this.grid.length; i++) {
        if (this.grid[i][j] !== 0) {
          for (let k = i; k > 0; k--) {
            if (this.grid[k - 1][j] === 0) {
              this.grid[k - 1][j] = this.grid[k][j];
              this.grid[k][j] = 0;
            } else {
              break;
            }
          }
        }
      }
    }
  }

  moveDown() {
    for (let j = 0; j < this.grid[0].length; j++) {
      for (let i = this.grid.length - 2; i >= 0; i--) {
        if (this.grid[i][j] !== 0) {
          for (let k = i; k < this.grid.length - 1; k++) {
            if (this.grid[k + 1][j] === 0) {
              this.grid[k + 1][j] = this.grid[k][j];
              this.grid[k][j] = 0;
            } else {
              break;
            }
          }
        }
      }
    }
  }

  moveLeft() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 1; j < this.grid.length; j++) {
        if (this.grid[i][j] !== 0) {
          for (let k = j; k > 0; k--) {
            if (this.grid[i][k - 1] === 0) {
              this.grid[i][k - 1] = this.grid[i][k];
              this.grid[i][k] = 0;
            } else {
              break;
            }
          }
        }
      }
    }
  }

  moveRight() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = this.grid.length - 2; j >= 0; j--) {
        if (this.grid[i][j] !== 0) {
          for (let k = j; k < this.grid.length - 1; k++) {
            if (this.grid[i][k + 1] === 0) {
              this.grid[i][k + 1] = this.grid[i][k];
              this.grid[i][k] = 0;
            } else {
              break;
            }
          }
        }
      }
    }
  }

  checkGameStatus() {
    if (this.grid.flat().includes(2048)) {
      const winMessage = document.querySelector('.message-win');

      this.hideMessage();

      winMessage.classList.remove('hidden');
    } else {
      const movesAvailable = this.areMovesAvailable();

      if (!movesAvailable) {
        const loseMessage = document.querySelector('.message-lose');

        this.hideMessage();

        loseMessage.classList.remove('hidden');
      }
    }
  }

  areMovesAvailable() {
    for (const row of this.grid) {
      if (row.includes(0)) {
        return true;
      }
    }

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length - 1; j++) {
        const horizontalMerge = this.grid[i][j] === this.grid[i][j + 1];
        const verticalMerge = this.grid[j][i] === this.grid[j + 1][i];

        if (horizontalMerge || verticalMerge) {
          return true;
        }
      }
    }

    return false;
  }

  hideMessage() {
    const winMessage = document.querySelector('.message-win');
    const startMessage = document.querySelector('.message-start');
    const loseMessage = document.querySelector('.message-lose');

    const arrMessages = [winMessage, startMessage, loseMessage];

    for (let i = 0; i < arrMessages.length; i++) {
      if (!arrMessages[i].classList.contains('hidden')) {
        arrMessages[i].classList.add('hidden');
      }
    }
  }
}

const startButton = document.getElementById('button-start');

let game2048;

startButton.addEventListener('click', function() {
  game2048 = new Game();
  game2048.hideMessage();

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';
});

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', event => {
  switch (true) {
    case event.key === 'ArrowUp':
      game2048.action('up');
      break;

    case event.key === 'ArrowDown':
      game2048.action('down');
      break;

    case event.key === 'ArrowLeft':
      game2048.action('left');
      break;

    case event.key === 'ArrowRight':
      game2048.action('right');
      break;
  }
});

function getRandomPosition() {
  return Math.floor(Math.random() * 15) + 0;
}

function getRandomNumber() {
  const randomNumber = Math.floor(Math.random() * 10) + 1;

  return (randomNumber <= 9) ? 2 : 4;
}
