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
      this.board = initialState;
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.gameIsStarted = false;

    this.tableCells = [...document.querySelectorAll('.field-row')].map(
      (row, y) => {
        const newRow = [...row.children];

        for (let x = 0; x < newRow.length; x++) {
          const cell = newRow[x];

          cell.setAttribute('data-column', x);
          cell.setAttribute('data-row', y);
        }

        return newRow;
      },
    );

    if (initialState) {
      for (let y = 0; y < initialState.length; y++) {
        const row = initialState[y];

        for (let x = 0; x < row.length; x++) {
          const value = row[x];

          if (value) {
            this.createTile(x, y, value);
          }
        }
      }
    }
  }

  moveLeft() {
    if (!this.gameIsStarted) {
      return;
    }
    this.moveTiles({ board: this.board, table: this.tableCells });
    this.newTile();
  }
  moveRight() {}
  moveUp() {}
  moveDown() {}

  /**
   * @returns {number}
   */
  getScore() {}

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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    this.newTile();
    this.newTile();
    this.gameIsStarted = true;
  }

  /**
   * Resets the game.
   */
  restart() {}

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

    const cell = this.createTile(x, y, randomValue);

    return cell;
  }

  createTile(column, row, initValue) {
    const cellRow = this.tableCells[row];

    if (!cellRow) {
      return;
    }

    const cell = this.tableCells[row][column];

    const newTile = document.createElement('div');

    newTile.style.setProperty('--coord-y', row);
    newTile.style.setProperty('--coord-x', column);
    newTile.textContent = initValue;

    newTile.className = `field-cell game-cell field-cell--${initValue}`;
    cell.append(newTile);

    return cell;
  }

  getCoords(cell) {
    const x = +cell.dataset.x;
    const y = +cell.dataset.y;

    return { x, y };
  }

  moveTiles(group) {
    const { board, table } = group;

    for (let y = 0; y < board.length; y++) {
      const boardRow = board[y];
      const tableRow = table[y];

      if (!tableRow) {
        continue;
      }

      for (let x = 1; x < boardRow.length; x++) {
        const cell = boardRow[x];
        const tableCell = tableRow[x];

        if (cell === 0) {
          continue;
        }

        let lastValidIndex;

        for (let i = x - 1; i >= 0; i--) {
          const prevCell = boardRow[i];
          const prevTableCell = tableRow[i];
          const isMerged = prevTableCell.getAttribute('data-merged');

          if (!this.canCellAcceptTile(prevCell, cell, isMerged)) {
            break;
          }
          lastValidIndex = i;
        }

        if (lastValidIndex || lastValidIndex === 0) {
          this.mergeTiles(tableRow[lastValidIndex], tableCell);

          if (boardRow[lastValidIndex] === boardRow[x]) {
            boardRow[lastValidIndex] = boardRow[x] * 2;
          }

          if (boardRow[lastValidIndex] === 0) {
            boardRow[lastValidIndex] = boardRow[x];
          }

          boardRow[x] = 0;
        }
      }
    }
  }

  canCellAcceptTile(targetCell, tile, isMerged) {
    return !targetCell || (targetCell === tile && !isMerged);
  }

  mergeTiles(targetCell, currentCell) {
    const isMerged = targetCell.getAttribute('data-merged');
    const currentTile = currentCell.firstElementChild;
    const targetTile = targetCell.firstElementChild;

    if (isMerged || !currentTile) {
      return;
    }

    const x = targetCell.getAttribute('data-column');
    const y = targetCell.getAttribute('data-row');

    const value = +currentTile.innerText;

    currentTile.style.setProperty('--coord-y', y);
    currentTile.style.setProperty('--coord-x', x);

    if (targetTile && value === +targetTile.innerText && value !== 0) {
      currentTile.addEventListener(
        'transitionend',
        () => {
          targetTile.innerText = this.board[y][x];
          currentCell.removeChild(currentTile);
          targetCell.setAttribute('data-merged', 'true');
        },
        { once: true },
      );
    } else {
      currentTile.addEventListener(
        'transitionend',
        () => {
          targetCell.append(currentTile);
        },
        { once: true },
      );
    }
  }
}

module.exports = Game;
