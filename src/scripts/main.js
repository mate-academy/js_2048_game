'use strict';

const hidden = 'hidden';
const start = 'start';
const directions = {
  up: 0,
  right: 1,
  down: 2,
  left: 3,
};

class Cell {
  constructor(x, y) {
    this.value = null;
    this.x = x;
    this.y = y;
  }
}

function getRandomInteger(maxValue) {
  return Math.floor(Math.random() * (maxValue + 1));
}

class GameField {
  constructor() {
    this.gameStarted = false;
    this.gameWon = false;
    this.gameLose = false;
    this.cells = [];
    this.score = document.getElementsByClassName('game-score')[0];
    this.score.textContent = 0;
    this.moveUpPossible = true;
    this.moveDownPossible = true;
    this.moveLeftPossible = true;
    this.moveRightPossible = true;
    this.hasEmptyCells = true;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.cells.push(new Cell(j, i));
      }
    }
  }

  getCell(x, y) {
    return this.cells.find(cell => cell.x === x && cell.y === y);
  }

  setUIValue(cell) {
    const fieldCellText = 'field-cell';
    const fieldRow = `.field-row:nth-of-type(${cell.y + 1})`;
    const fieldCell = `.${fieldCellText}:nth-of-type(${cell.x + 1})`;
    const cellUI = document.querySelector(`${fieldRow} > ${fieldCell}`);
    const previousValue = cellUI.textContent;
    const newValue = cell.value;

    cellUI.textContent = newValue;

    const classList = cellUI.classList;

    classList.remove(`${fieldCellText}--${previousValue}`);
    classList.add(`${fieldCellText}--${newValue}`);
  }

  insertRandomNumber() {
    const emptyCells = this.cells.filter(cell => cell.value === null);
    const randomEmptyIndex = getRandomInteger(emptyCells.length - 1);
    const randomEmptyCell = emptyCells[randomEmptyIndex];
    const randomNumber = getRandomInteger(10) < 10 ? 2 : 4;

    if (randomEmptyCell) {
      randomEmptyCell.value = randomNumber;
      this.setUIValue(randomEmptyCell);
    }
  }

  showCells(upCell, cell) {
    this.setUIValue(upCell);
    this.setUIValue(cell);
  }

  addPoints(points) {
    this.score.textContent = Number(this.score.textContent) + points;

    if (points === 2048) {
      messagWin.classList.remove(hidden);
      this.gameWon = true;
    }
  }

  hasNeighbourTheSameValue(cell, neighbourX, neighbourY) {
    const neighbour = this.getCell(neighbourX, neighbourY);

    return neighbour && neighbour.value === cell.value;
  }

  existsEmptyCell() {
    const emptyCells = this.cells.filter(cell => cell.value === null);

    return emptyCells.length > 0;
  }

  isMovePossible(direction) {
    let neighbourX;
    let neighbourY;

    for (const cell of this.cells) {
      switch (direction) {
        case directions.up:
          neighbourX = cell.x;
          neighbourY = cell.y - 1;
          break;
        case direction.right:
          neighbourX = cell.x + 1;
          neighbourY = cell.y;
          break;
        case direction.bottom:
          neighbourX = cell.x;
          neighbourY = cell.y + 1;
          break;
        default:
          neighbourX = cell.x - 1;
          neighbourY = cell.y;
      }

      if (this.hasNeighbourTheSameValue(cell, neighbourX, neighbourY)) {
        return true;
      }
    }

    return false;
  }

  isNextMovePossible() {
    this.hasEmptyCells = this.existsEmptyCell();
    this.moveUpPossible = this.isMovePossible(directions.up);
    this.moveRightPossible = this.isMovePossible(directions.right);
    this.moveDownPossible = this.isMovePossible(directions.down);
    this.moveLeftPossible = this.isMovePossible(directions.left);

    return this.hasEmptyCells || this.moveUpPossible || this.moveRightPossible
      || this.moveDownPossible || this.moveLeftPossible;
  }

  moveUp() {
    for (let x = 0; x < 4; x++) {
      for (let y = 1; y < 4; y++) {
        const cell = this.getCell(x, y);
        const cellValue = cell.value;

        if (cellValue !== null) {
          let upCellY = y - 1;

          while (upCellY > 0 && this.getCell(x, upCellY).value === null) {
            upCellY--;
          }

          let upCell = this.getCell(x, upCellY);
          const upCellValue = upCell.value;

          if (upCellValue === null) {
            upCell.value = cellValue;
            cell.value = null;
            this.showCells(upCell, cell);
          } else if (upCellValue === cellValue) {
            upCell.value += cellValue;
            this.addPoints(2 * cellValue);
            cell.value = null;
            this.showCells(upCell, cell);
          } else if (upCellValue !== cellValue && y - upCellY > 1) {
            upCell = this.getCell(x, upCellY + 1);
            upCell.value = cellValue;
            cell.value = null;
            this.showCells(upCell, cell);
          }
        }
      }
    }
  }

  moveDown() {
    for (let x = 0; x < 4; x++) {
      for (let y = 2; y >= 0; y--) {
        const cell = this.getCell(x, y);
        const cellValue = cell.value;

        if (cellValue !== null) {
          let downCellY = y + 1;

          while (downCellY < 3 && this.getCell(x, downCellY).value === null) {
            downCellY++;
          }

          let downCell = this.getCell(x, downCellY);
          const downCellValue = downCell.value;

          if (downCellValue === null) {
            downCell.value = cellValue;
            cell.value = null;
            this.showCells(downCell, cell);
          } else if (downCellValue === cellValue) {
            downCell.value += cellValue;
            this.addPoints(2 * cellValue);
            cell.value = null;
            this.showCells(downCell, cell);
          } else if (downCellValue !== cellValue && downCellY - y > 1) {
            downCell = this.getCell(x, downCellY - 1);
            downCell.value = cellValue;
            cell.value = null;
            this.showCells(downCell, cell);
          }
        }
      }
    }
  }

  moveLeft() {
    for (let y = 0; y < 4; y++) {
      const mergedCells = [];

      for (let x = 1; x < 4; x++) {
        const cell = this.getCell(x, y);
        const cellValue = cell.value;

        if (cellValue !== null) {
          let leftCellX = x - 1;

          while (leftCellX > 0 && this.getCell(leftCellX, y).value === null) {
            leftCellX--;
          }

          if (this.getCell(leftCellX, y).value === cellValue
            && mergedCells.includes(this.getCell(leftCellX, y))) {
            leftCellX++;
          }

          let leftCell = this.getCell(leftCellX, y);
          const leftCellValue = leftCell.value;

          if (leftCellValue === null) {
            leftCell.value = cellValue;
            cell.value = null;
            this.showCells(leftCell, cell);
          } else if (leftCellValue === cellValue) {
            leftCell.value += cellValue;
            this.addPoints(2 * cellValue);
            cell.value = null;
            this.showCells(leftCell, cell);
            mergedCells.push(leftCell);
          } else if (leftCellValue !== cellValue && x - leftCellX > 1) {
            leftCell = this.getCell(leftCellX + 1, y);
            leftCell.value = cellValue;
            cell.value = null;
            this.showCells(leftCell, cell);
          }
        }
      }
    }
  }

  moveRight() {
    for (let y = 0; y < 4; y++) {
      const mergedCells = [];

      for (let x = 2; x >= 0; x--) {
        const cell = this.getCell(x, y);
        const cellValue = cell.value;

        if (cellValue !== null) {
          let rightCellX = x + 1;

          while (rightCellX < 3 && this.getCell(rightCellX, y).value === null) {
            rightCellX++;
          }

          if (this.getCell(rightCellX, y).value === cellValue
            && mergedCells.includes(this.getCell(rightCellX, y))) {
            rightCellX--;
          }

          let rightCell = this.getCell(rightCellX, y);
          const rightCellValue = rightCell.value;

          if (rightCellValue === null) {
            rightCell.value = cellValue;
            cell.value = null;
            this.showCells(rightCell, cell);
          } else if (rightCellValue === cellValue) {
            rightCell.value += cellValue;
            this.addPoints(2 * cellValue);
            cell.value = null;
            this.showCells(rightCell, cell);
            mergedCells.push(rightCell);
          } else if (rightCellValue !== cellValue && rightCellX - x > 1) {
            rightCell = this.getCell(rightCellX - 1, y);
            rightCell.value = cellValue;
            cell.value = null;
            this.showCells(rightCell, cell);
          }
        }
      }
    }
  }

  reset() {
    this.cells = this.cells.map(cell => {
      cell.value = null;
      this.setUIValue(cell);

      return cell;
    });

    this.hasEmptyCells = true;
    this.moveDownPossible = true;
    this.moveLeftPossible = true;
    this.moveLeftPossible = true;
    this.moveUpPossible = true;
  }
}

function playGame() {
  const buttonClassList = buttonPlay.classList;
  const messageBottomClassList = messagStart.classList;

  if (buttonClassList.contains(start)) {
    buttonClassList.remove(start);
    buttonClassList.add('restart');
    buttonPlay.textContent = 'Restart';
    messageBottomClassList.add(hidden);
    gameField.gameStarted = true;
  } else {
    gameField.reset();
    gameField.score.textContent = 0;

    if (gameField.gameWon) {
      messagWin.classList.add(hidden);
      gameField.gameWon = false;
    } else if (gameField.gameLose) {
      gameField.gameLose = false;
      messagLose.classList.add(hidden);
    }
  }

  gameField.insertRandomNumber();
  gameField.insertRandomNumber();
}

const buttonPlay = document.getElementsByClassName('button')[0];
const messagStart = document.getElementsByClassName('message-start')[0];
const messagWin = document.getElementsByClassName('message-win')[0];
const messagLose = document.getElementsByClassName('message-lose')[0];
const gameField = new GameField();

buttonPlay.addEventListener('click', playGame);

document.addEventListener('keydown', e => {
  if (gameField.gameStarted && !gameField.gameWon && !gameField.gameLose) {
    switch (e.key) {
      case 'ArrowUp':
        if (gameField.hasEmptyCells || gameField.moveUpPossible) {
          gameField.moveUp();
        }
        break;
      case 'ArrowDown':
        if (gameField.hasEmptyCells || gameField.moveDownPossible) {
          gameField.moveDown();
        }
        break;
      case 'ArrowRight':
        if (gameField.hasEmptyCells || gameField.moveRightPossible) {
          gameField.moveRight();
        }
        break;
      default:
        if (gameField.hasEmptyCells || gameField.moveLeftPossible) {
          gameField.moveLeft();
        }
        break;
    }

    gameField.insertRandomNumber();

    if (!gameField.isNextMovePossible()) {
      messagLose.classList.remove(hidden);
      gameField.gameLose = true;
    }
  }
});
