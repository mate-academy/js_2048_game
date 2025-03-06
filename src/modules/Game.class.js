'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    // eslint-disable-next-line no-console
    if (initialState) {
      this.initialState = initialState;
      this.board = JSON.parse(JSON.stringify(initialState));
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.gameIsStarted = false;
    this.mergedTiles = [];
    this.mergedTilesValues = [];

    this.cellState = this.createCellState(initialState);
  }

  moveLeft() {
    if (!this.gameIsStarted || !this.canMoveLeft()) {
      return;
    }

    this.moveCells(this.board);

    const { cell, randomValue } = this.newTile();

    return this.slideTiles(this.cellState).finally(() => {
      if (cell) {
        cell.tile = new Tile(cell, randomValue);
      }
    });
  }
  moveRight() {
    if (!this.gameIsStarted || !this.canMoveRight()) {
      return;
    }

    const reversedState = this.getReversed(this.board);

    const board = this.moveCells(reversedState);

    this.board = this.getReversed(board);

    const { cell, randomValue } = this.newTile();

    return this.slideTiles(
      this.cellState.map((row) => [...row].reverse()),
    ).finally(() => {
      if (cell) {
        cell.tile = new Tile(cell, randomValue);
      }
    });
  }
  moveUp() {
    if (!this.gameIsStarted || !this.canMoveUp()) {
      return;
    }

    const stateByColumn = this.getElementsByColumn(this.board);

    const board = this.moveCells(stateByColumn);

    this.board = this.getElementsByColumn(board);

    const { cell, randomValue } = this.newTile();

    return this.slideTiles(this.cellsByColumn).finally(() => {
      if (cell) {
        cell.tile = new Tile(cell, randomValue);
      }
    });
  }
  moveDown() {
    if (!this.gameIsStarted || !this.canMoveDown()) {
      return;
    }

    const stateByColumn = this.getElementsByColumn(this.board);
    const reversedState = this.getReversed(stateByColumn);

    const board = this.moveCells(reversedState);

    const revertReverseState = this.getReversed(board);

    this.board = this.getElementsByColumn(revertReverseState);

    const { cell, randomValue } = this.newTile();

    return this.slideTiles(
      this.cellsByColumn.map((column) => [...column].reverse()),
    ).finally(() => {
      if (cell) {
        cell.tile = new Tile(cell, randomValue);
      }
    });
  }

  /**
   * @returns {number}
   */
  getScore() {
    const score = this.mergedTilesValues.reduce((sum, cell) => {
      return sum + cell;
    }, 0);

    return score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    if (this.isWinner()) {
      return 'win';
    }

    if (this.gameIsStarted && this.noMovesPossible) {
      return 'lose';
    }

    if (this.gameIsStarted) {
      return 'playing';
    }

    return 'idle';
  }

  /**
   * Starts the game.
   */
  start() {
    const { cell, randomValue } = this.newTile();

    if (cell) {
      cell.tile = new Tile(cell, randomValue);
    }

    const { cell: cell2, randomValue: randomValue2 } = this.newTile();

    if (cell2) {
      cell2.tile = new Tile(cell2, randomValue2);
    }

    this.gameIsStarted = true;
  }

  /**
   * Resets the game.
   */
  restart() {
    if (this.initialState) {
      this.board = JSON.parse(JSON.stringify(this.initialState));
    } else {
      this.board.forEach((row) => {
        for (let i = 0; i < row.length; i++) {
          const cell = row[i];

          if (cell) {
            row[i] = 0;
          }
        }
      });
    }

    this.mergedTiles = [];
    this.mergedTilesValues = [];
    this.gameIsStarted = false;

    if (this.cellState) {
      this.cellState.forEach((row) => {
        for (let i = 0; i < row.length; i++) {
          const cell = row[i];

          if (cell.tile) {
            cell.tile.remove();
            cell.tile = null;
          }

          if (cell.mergeTile) {
            cell.mergeTile.remove();
            cell.tile = null;
          }
        }
      });
    }

    this.cellState = this.createCellState(this.initialState);
  }

  createCellState(initialState = []) {
    const cellState = document.querySelectorAll('.field-row');

    return [...cellState].map((row, y) => {
      const cells = [...row.children];
      const updatedRow = [];

      for (let x = 0; x < cells.length; x++) {
        const cell = cells[x];
        const newCell = new Cell(cell, x, y);

        if (initialState.length > 0) {
          const initialRow = initialState[y];
          const initialValue = initialRow[x];

          if (initialValue !== 0) {
            const tile = new Tile(newCell, initialValue);

            newCell.tile = tile;
          }
        }

        updatedRow.push(newCell);
      }

      return updatedRow;
    });
  }

  get randomCell() {
    const randomCells = [];

    this.board.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (!row[x] || row[x] === 0) {
          randomCells.push([x, y]);
        }
      }
    });

    if (randomCells.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * randomCells.length);

    return randomCells[index];
  }

  newTile() {
    const randomCell = this.randomCell;

    if (!randomCell) {
      return;
    }

    const [x, y] = randomCell;
    const randomValue = Math.random() <= 0.1 ? 4 : 2;

    this.board[y][x] = randomValue;

    let cell;

    if (this.cellState[y]) {
      cell = this.cellState[y][x];
    }

    return { cell, randomValue };
  }

  getCoords(cell) {
    const x = +cell.dataset.x;
    const y = +cell.dataset.y;

    return { x, y };
  }

  moveCells(board) {
    this.mergedTiles = [];

    for (let y = 0; y < board.length; y++) {
      const boardRow = board[y];

      for (let x = 1; x < boardRow.length; x++) {
        const cell = boardRow[x];

        if (cell === 0) {
          continue;
        }

        let lastValidIndex;

        for (let i = x - 1; i >= 0; i--) {
          const moveToCell = boardRow[i];

          const isCellMerged =
            this.mergedTiles.length > 0
              ? this.mergedTiles.find(([x1, y1]) => i === x1 && y === y1)
              : false;

          if (!this.canCellAcceptTile(moveToCell, cell, isCellMerged)) {
            break;
          }
          lastValidIndex = i;
        }

        if (lastValidIndex || lastValidIndex === 0) {
          if (boardRow[lastValidIndex] === boardRow[x]) {
            this.mergedTiles.push([lastValidIndex, y]);
            boardRow[lastValidIndex] = boardRow[x] * 2;
            this.mergedTilesValues.push(boardRow[x] * 2);
          }

          if (boardRow[lastValidIndex] === 0) {
            boardRow[lastValidIndex] = boardRow[x];
          }

          boardRow[x] = 0;
        }
      }
    }

    return board;
  }

  canCellAcceptTile(targetCell, tile, isCellMerged) {
    return !targetCell || (targetCell === tile && !isCellMerged);
  }

  get cellsByColumn() {
    const board = this.cellState;
    const newBoard = [];

    for (let y = 0; y < board.length; y++) {
      const column = board.map((row) => row[y]);

      newBoard.push(column);
    }

    return newBoard;
  }

  get tableByColumn() {
    const board = this.cellState;
    const newBoard = [];

    for (let y = 0; y < board.length; y++) {
      const column = board.map((row) => row[y]);

      newBoard.push(column);
    }

    return newBoard;
  }

  slideTiles(group) {
    return Promise.all(
      group.flatMap((cells) => {
        const promises = [];

        for (let x = 1; x < cells.length; x++) {
          const cellTile = cells[x].tile;
          const currentCell = cells[x];

          if (!cellTile) {
            continue;
          }

          let lastValidCell;

          for (let i = x - 1; i >= 0; i--) {
            const moveToCell = cells[i];

            if (!moveToCell.canAcceptTile(cellTile)) {
              break;
            }

            lastValidCell = moveToCell;
          }

          if (lastValidCell) {
            if (lastValidCell.tile) {
              promises.push(cellTile.waitForTransition());

              if (!lastValidCell.mergeTile) {
                lastValidCell.mergeTile = cellTile;
              }
            } else {
              lastValidCell.tile = cellTile;
              promises.push(cellTile.waitForTransition());
            }

            currentCell.tile = null;
          }
        }

        return promises;
      }),
    );
  }

  canMove(group) {
    return group.some((row, y) => {
      return row.some((cell, index) => {
        if (index === 0) {
          return false;
        }

        if (cell === 0) {
          return false;
        }

        return this.canCellAcceptTile(row[index - 1], cell, false);
      });
    });
  }

  getElementsByColumn(group) {
    const newBoard = [];

    for (let y = 0; y < group.length; y++) {
      const column = group.map((row) => row[y]);

      newBoard.push(column);
    }

    return newBoard;
  }

  getReversed(group) {
    return group.map((column) => [...column].reverse());
  }

  canMoveLeft() {
    return this.canMove(this.board);
  }
  canMoveRight() {
    const reversed = this.getReversed(this.board);

    return this.canMove(reversed);
  }
  canMoveUp() {
    const stateByColumn = this.getElementsByColumn(this.board);

    return this.canMove(stateByColumn);
  }

  canMoveDown() {
    const stateByColumn = this.getElementsByColumn(this.board);
    const reversed = this.getReversed(stateByColumn);

    return this.canMove(reversed);
  }

  get noMovesPossible() {
    return (
      !this.canMoveDown() &&
      !this.canMoveUp() &&
      !this.canMoveLeft() &&
      !this.canMoveRight()
    );
  }

  isWinner() {
    return this.mergedTilesValues.some((cell) => cell === 2048);
  }
}

class Cell {
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.cellElement = cellElement;
    this.x = x;
    this.y = y;
  }

  set tile(value) {
    this.#tile = value;

    if (!value) {
      return;
    }

    this.tile.x = +this.x;
    this.tile.y = +this.y;
  }

  get tile() {
    return this.#tile;
  }
  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;

    if (!value) {
      return;
    }

    this.#mergeTile.x = this.x;
    this.#mergeTile.y = this.y;
  }

  canAcceptTile(tile) {
    return !this.tile || (this.tile.value === tile.value && !this.mergeTile);
  }

  mergeTiles() {
    if (!this.tile || !this.#mergeTile) {
      return;
    }

    this.tile.value = +this.tile.value + +this.#mergeTile.value;

    this.#mergeTile.remove();
    this.#mergeTile = null;
  }
}

class Tile {
  #x;
  #y;
  #value;

  constructor(parentElement, initValue) {
    const newTile = document.createElement('div');
    const { cellElement, x, y } = parentElement;

    newTile.style.setProperty('--coord-y', y);
    newTile.style.setProperty('--coord-x', x);
    newTile.textContent = initValue;

    newTile.className = `field-cell game-cell field-cell--${initValue}`;
    this.tileElement = newTile;
    this.#x = x;
    this.#y = y;
    this.#value = +initValue;
    cellElement.append(newTile);
  }

  set x(coordX) {
    this.#x = +coordX;
    this.tileElement.style.setProperty('--coord-x', +coordX);
  }

  get x() {
    return this.#x;
  }

  set y(coordY) {
    this.#y = +coordY;
    this.tileElement.style.setProperty('--coord-y', +coordY);
  }

  get y() {
    return this.#y;
  }

  set value(value1) {
    if (value1) {
      this.#value = +value1;
      this.tileElement.textContent = value1.toString();
      this.tileElement.className = `field-cell game-cell field-cell--${value1}`;
    }
  }

  get value() {
    return this.#value;
  }

  remove() {
    this.tileElement.remove();
  }

  waitForTransition() {
    return new Promise((resolve) => {
      this.tileElement.addEventListener('transitionend', resolve, {
        once: true,
      });
    });
  }
}

module.exports = Game;
