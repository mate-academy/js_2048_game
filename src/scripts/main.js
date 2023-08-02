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
    this.score = document.querySelector('.game-score');
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
    cell.value = null;
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

  shouldFindNextIndex(direction, nextCellIndex, x, y) {
    let limitCondition;

    if (direction === directions.up || direction === directions.left) {
      limitCondition = nextCellIndex > 0;
    } else {
      limitCondition = nextCellIndex < 3;
    }

    return limitCondition && this.getCell(x, y).value === null;
  }

  isMerged(nextCellIndex, y, cellValue, mergedCells) {
    const checkedCell = this.getCell(nextCellIndex, y);

    return checkedCell.value === cellValue
    && mergedCells.includes(checkedCell);
  }

  findNextCellIndex(direction, cellStartX, cellStartY, mergedCells) {
    let nextCellIndex;

    switch (direction) {
      case directions.up:
        nextCellIndex = cellStartY - 1;

        while (this.shouldFindNextIndex(
          direction,
          nextCellIndex,
          cellStartX,
          nextCellIndex
        )) {
          nextCellIndex--;
        }
        break;
      case directions.down:
        nextCellIndex = cellStartY + 1;

        while (this.shouldFindNextIndex(
          direction,
          nextCellIndex,
          cellStartX,
          nextCellIndex
        )) {
          nextCellIndex++;
        }
        break;
      case directions.left:
        nextCellIndex = cellStartX - 1;

        while (this.shouldFindNextIndex(
          direction,
          nextCellIndex,
          nextCellIndex,
          cellStartY,
        )) {
          nextCellIndex--;
        }

        if (this.isMerged(nextCellIndex, cellStartY, mergedCells)) {
          nextCellIndex++;
        }
        break;
      default:
        nextCellIndex = cellStartX + 1;

        while (this.shouldFindNextIndex(
          direction,
          nextCellIndex,
          nextCellIndex,
          cellStartY,
        )) {
          nextCellIndex++;
        }

        if (this.isMerged(nextCellIndex, cellStartY, mergedCells)) {
          nextCellIndex--;
        }
        break;
    }

    return nextCellIndex;
  }

  tryMove(direction, cellStartX, cellStartY, mergedCells) {
    const cell = this.getCell(cellStartX, cellStartY);
    const cellValue = cell.value;

    if (cellValue !== null) {
      const nextCellIndex = this.findNextCellIndex(
        direction,
        cellStartX,
        cellStartY,
        mergedCells
      );
      let nextCell;
      let areNotNeighbours;

      if (direction === directions.up || direction === directions.down) {
        nextCell = this.getCell(cellStartX, nextCellIndex);
        areNotNeighbours = Math.abs(cellStartY - nextCellIndex) > 1;
      } else {
        nextCell = this.getCell(nextCellIndex, cellStartY);
        areNotNeighbours = Math.abs(cellStartX - nextCellIndex) > 1;
      }

      const nextCellValue = nextCell.value;

      if (nextCellValue === null) {
        nextCell.value = cellValue;
        this.showCells(nextCell, cell);
      } else if (nextCellValue === cellValue) {
        nextCell.value += cellValue;
        this.addPoints(2 * cellValue);
        this.showCells(nextCell, cell);

        if (direction === directions.left || direction === directions.right) {
          mergedCells.push(nextCell);
        }
      } else if (nextCellValue !== cellValue && areNotNeighbours) {
        switch (direction) {
          case directions.up:
            nextCell = this.getCell(cellStartX, nextCellIndex + 1);
            break;
          case directions.down:
            nextCell = this.getCell(cellStartX, nextCellIndex - 1);
            break;
          case directions.left:
            nextCell = this.getCell(nextCellIndex + 1, cellStartY);
            break;
          default:
            nextCell = this.getCell(nextCellIndex - 1, cellStartY);
            break;
        }
        nextCell.value = cellValue;
        this.showCells(nextCell, cell);
      }
    }
  }

  moveUp() {
    for (let x = 0; x < 4; x++) {
      for (let y = 1; y < 4; y++) {
        this.tryMove(directions.up, x, y);
      }
    }
  }

  moveDown() {
    for (let x = 0; x < 4; x++) {
      for (let y = 2; y >= 0; y--) {
        this.tryMove(directions.down, x, y);
      }
    }
  }

  moveLeft() {
    for (let y = 0; y < 4; y++) {
      const mergedCells = [];

      for (let x = 1; x < 4; x++) {
        this.tryMove(directions.left, x, y, mergedCells);
      }
    }
  }

  moveRight() {
    for (let y = 0; y < 4; y++) {
      const mergedCells = [];

      for (let x = 2; x >= 0; x--) {
        this.tryMove(directions.right, x, y, mergedCells);
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

const buttonPlay = document.querySelector('.button');
const messagStart = document.querySelector('.message-start');
const messagWin = document.querySelector('.message-win');
const messagLose = document.querySelector('.message-lose');
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
