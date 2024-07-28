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
    this.cellState = document.querySelectorAll('.field-row');

    this.cellState = [...this.cellState].map((row, y) => {
      const initialRow = initialState[y];
      const cells = [...row.children];

      for (let x = 0; x < cells.length; x++) {
        const initialCell = initialRow[x];

        if (initialCell !== 0) {
          const tile = this.createTile(initialCell, x, y);

          cells[x].append(tile);
        }

        cells[x].setAttribute('data-x', x % 4);
        cells[x].setAttribute('data-y', y);
      }

      return cells;
    });
  }

  moveLeft() {
    return this.slideTiles(this.cellState);
  }
  moveRight() {
    return this.slideTiles(this.cellState.map((row) => [...row].reverse()));
  }
  moveUp() {
    this.slideTiles(this.cellsByColumn);
  }
  moveDown() {
    this.slideTiles(this.cellsByColumn.map((column) => [...column].reverse()));
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {
    const state = this.cellState.map((cells) => {
      const values = [];

      for (let i = 0; i < cells.length; i++) {
        if (!cells[i].firstElementChild) {
          values.push(0);
          continue;
        }

        const value = +cells[i].firstElementChild.innerText;

        values.push(value);
      }

      return values;
    });

    return state;
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

  get cellsByColumn() {
    const board = this.cellState;
    const newBoard = [];

    for (let y = 0; y < board.length; y++) {
      const column = board.map((row) => row[y]);

      newBoard.push(column);
    }

    return newBoard;
  }

  canCellAcceptTile(currCell, newTile) {
    if (!currCell.firstElementChild) {
      return true;
    }

    const newTileValue = +newTile.innerText;

    const currTileValue = +currCell.firstElementChild.innerText;
    const isMerged = Boolean(currCell.dataset.merged);

    return currTileValue === newTileValue && !isMerged;
  }

  canMergeTiles(targetCell, tile) {
    const isMerged = targetCell.getAttribute('data-merged');

    if (isMerged === 'true' || !targetCell.firstChild || !tile) {
      return false;
    }

    const tileValue = +tile.innerText;
    const targetCellValue = +targetCell.firstElementChild.innerText;

    if (tileValue !== targetCellValue) {
      return false;
    }

    return true;
  }

  mergeTiles(targetCell, tile) {
    const isMerged = targetCell.getAttribute('data-merged');

    if (isMerged === 'true' || !targetCell.firstChild || !tile) {
      return;
    }

    const tileValue = +tile.innerText;
    const targetCellValue = +targetCell.firstElementChild.innerText;

    if (tileValue !== targetCellValue) {
      return;
    }

    targetCell.setAttribute('data-merged', 'true');

    const newValue = targetCellValue * 2;

    tile.classList.remove(`field-cell--${tileValue}`);
    tile.classList.add(`field-cell--${newValue}`);
    tile.innerText = newValue;
    targetCell.replaceChildren(tile);
  }

  clearMergedTiles() {
    this.cellState.forEach((row) => {
      for (let i = 0; i < row.length; i++) {
        row[i].removeAttribute('data-merged');
      }
    });
  }

  slideTiles(group) {
    this.clearMergedTiles();

    return Promise.all(
      group.flatMap((cells) => {
        const promises = [];

        for (let i = 1; i < cells.length; i++) {
          const cellTile = cells[i].firstElementChild;

          if (!cellTile) {
            continue;
          }

          let lastValidCell;

          for (let j = i - 1; j >= 0; j--) {
            const moveToCell = cells[j];

            if (!this.canCellAcceptTile(moveToCell, cellTile)) {
              break;
            }

            lastValidCell = moveToCell;
          }

          if (lastValidCell != null) {
            const x = lastValidCell.dataset.x;
            const y = lastValidCell.dataset.y;

            if (lastValidCell.firstElementChild) {
              if (this.canMergeTiles(lastValidCell, cellTile)) {
                cellTile.style.setProperty('--coord-x', x);
                cellTile.style.setProperty('--coord-y', y);

                promises.push(
                  this.waitForTransition(cellTile).then(() => {
                    this.mergeTiles(lastValidCell, cellTile);

                    if (cells[i].firstElementChild) {
                      cells[i].firstElementChild.remove();
                    }
                  }),
                );
              }
            } else {
              cellTile.style.setProperty('--coord-x', x);
              cellTile.style.setProperty('--coord-y', y);

              promises.push(
                this.waitForTransition(cellTile).then(() => {
                  lastValidCell.append(cellTile);

                  if (cells[i].firstElementChild) {
                    cells[i].firstElementChild.remove();
                  }
                }),
              );
            }
          }
        }

        return promises;
      }),
    );
  }

  /**
   * Starts the game.
   */
  start() {}

  /**
   * Resets the game.
   */
  restart() {}

  newTile() {
    const initValue = Math.random() <= 0.1 ? 4 : 2;
    const emptyCell = this.randomEmptyCell();
    const x = emptyCell.dataset.x;
    const y = emptyCell.dataset.y;

    const gameCell = this.createTile(initValue, x, y);

    emptyCell.appendChild(gameCell);

    return gameCell;
  }

  get emptyCells() {
    const cells = [...this.cellState]
      .reduce((arr, row) => {
        return arr.concat(...row);
      }, [])
      .filter((cell) => cell.children.length === 0);

    return cells;
  }

  randomEmptyCell() {
    const emptyCells = this.emptyCells;
    const randomIndex = () => Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex()];

    return randomCell;
  }

  createTile(initValue, x, y) {
    const tile = document.createElement('div');

    tile.style.setProperty('--coord-y', y);
    tile.style.setProperty('--coord-x', x);

    tile.className = `field-cell game-cell field-cell--${initValue}`;
    tile.innerText = initValue;

    return tile;
  }

  waitForTransition(tile) {
    return new Promise((resolve) => {
      tile.addEventListener('transitionend', resolve, { once: true });
    });
  }
}

module.exports = Game;
