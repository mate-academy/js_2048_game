const getRandomNumber = (min, max) =>
  Math.floor(min + Math.random() * (max + 1 - min));

const filterZero = (values) => values.filter((value) => value !== 0);

const canShift = (grid) => {
  return grid.some((row) => {
    return row.some((cell, index) => {
      if (index === 0) {
        return false;
      }

      if (cell === 0) {
        return false;
      }

      const targetCell = row[index - 1];

      return targetCell === 0 || targetCell === cell;
    });
  });
};

class Game {
  constructor() {
    this.gameData = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.isEndGame = false;
    this.isWin = false;
    this.canShiftUp = true;
    this.canShiftDown = true;
    this.canShiftLeft = true;
    this.canShiftRight = true;
  }

  initGame() {
    const firstFieldData = this.restartGameField();
    const secondFieldData = this.restartGameField();

    return {
      firstFieldData, secondFieldData,
    };
  }

  generateNewTile() {
    return getRandomNumber(0, 9) < 6 ? 2 : 4;
  }

  restartGameField() {
    const coords = {
      x: getRandomNumber(0, 3),
      y: getRandomNumber(0, 3),
    };

    const fieldValue = this.generateNewTile();

    if (this.gameData[coords.x][coords.y] > 0) {
      coords.x = getRandomNumber(0, 3);
      coords.y = getRandomNumber(0, 3);
    }

    this.gameData[coords.y][coords.x] = fieldValue;

    return {
      coords, fieldValue,
    };
  }

  resetGameData() {
    this.gameData = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.isEndGame = false;
    this.isWin = false;
    this.canShiftUp = true;
    this.canShiftDown = true;
    this.canShiftLeft = true;
    this.canShiftRight = true;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let y = 0; y < this.gameData.length; y++) {
      const row = this.gameData[y];

      for (let x = 0; x < row.length; x++) {
        if (this.gameData[y][x] === 0) {
          emptyCells.push({
            y, x,
          });
        }
      }
    }

    return emptyCells;
  }

  getRandomEmptyCell() {
    const emptyCells = this.getEmptyCells();
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  addNewValue() {
    const emptyCells = this.getRandomEmptyCell();

    if (!emptyCells) {
      return;
    }

    const { y, x } = emptyCells;
    const newValue = this.generateNewTile();

    this.gameData[y][x] = newValue;
  }

  mergedCells(cells) {
    const filterCells = filterZero(cells);

    for (let index = 0; index < filterCells.length - 1; index++) {
      const value = filterCells[index];
      const nextValue = filterCells[index + 1];

      if (value === nextValue) {
        const newValue = value + nextValue;

        filterCells[index] = newValue;
        filterCells[index + 1] = 0;

        this.score += newValue;

        if (newValue === 2048) {
          this.isWin = true;
        }
      }
    }

    const values = filterZero(filterCells);

    if (values.length !== 4) {
      for (let index = values.length; index < 4; index++) {
        values.push(0);
      }
    }

    return values;
  }

  getColumns() {
    const columns = [];

    for (let y = 0; y < this.gameData.length; y++) {
      const row = this.gameData[y];
      const column = [];

      for (let x = 0; x < row.length; x++) {
        column.push(this.gameData[x][y]);
      }

      columns.push(column);
    }

    return columns;
  }

  shiftUp() {
    const columns = this.getColumns();

    this.canShiftUp = canShift(columns);

    if (!this.canShiftUp) {
      return;
    }

    for (let x = 0; x < columns.length; x++) {
      const column = this.mergedCells(columns[x]);

      for (let y = 0; y < column.length; y++) {
        this.gameData[y][x] = column[y];
      }
    }

    this.addNewValue();
  }

  shiftDown() {
    const columns = this.getColumns().map((row) => row.reverse());

    this.canShiftDown = canShift(columns);

    if (!this.canShiftDown) {
      return;
    }

    for (let x = 0; x < columns.length; x++) {
      const column = this.mergedCells(columns[x]).reverse();

      for (let y = 0; y < column.length; y++) {
        this.gameData[y][x] = column[y];
      }
    }

    this.addNewValue();
  }

  shiftLeft() {
    this.canShiftLeft = canShift(this.gameData);

    if (!this.canShiftLeft) {
      return;
    }

    for (let y = 0; y < this.gameData.length; y++) {
      this.gameData[y] = this.mergedCells(this.gameData[y]);
    }

    this.addNewValue();
  }

  shiftRight() {
    const reverseGameData = this.gameData.map((row) => row.reverse());

    this.canShiftRight = canShift(reverseGameData);

    if (!this.canShiftRight) {
      return;
    }

    for (let y = 0; y < this.gameData.length; y++) {
      this.gameData[y] = this.mergedCells(this.gameData[y].reverse()).reverse();
    }

    this.addNewValue();
  }
}

export default Game;
