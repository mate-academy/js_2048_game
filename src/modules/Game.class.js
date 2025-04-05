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

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    boardElement = document.querySelector('.game-field'),
  ) {
    this.grid = initialState;
    this.boardElement = boardElement;
    this.emptyCells = [];
    this.scoreResult = 0;
  }

  isMove(totalStep, currentGrid) {
    let availableMove = totalStep;
    const grid = currentGrid;

    for (let row = 0; row < grid.length; row++) {
      let firstValue;

      for (let col = 0; col < grid.length; col++) {
        const cell = grid[row][col];

        if (cell !== 0) {
          if (firstValue === undefined) {
            firstValue = cell;
            continue;
          }
        }

        if (cell !== 0) {
          if (firstValue === cell) {
            availableMove++;
            continue;
          } else {
            firstValue = cell;
            continue;
          }
        }

        if (firstValue !== undefined) {
          if (cell === 0) {
            availableMove++;
            continue;
          }
        }
      }
    }

    return availableMove;
  }

  moveLeft() {
    let isMoveLeft = true;

    for (let row = 0; row < this.grid.length; row++) {
      this.grid[row].reverse();
    }

    if (this.isMove(0, this.grid) === 0) {
      isMoveLeft = false;
    }

    for (let row = 0; row < this.grid.length; row++) {
      this.grid[row].reverse();
    }

    if (isMoveLeft === false) {
      return;
    }

    const modifiedGrid = [];

    for (let row = 0; row < this.grid.length; row++) {
      const newGridRow = [];

      for (let col = 0; col < this.grid.length; col++) {
        const cell = this.grid[row][col];

        if (cell !== 0) {
          newGridRow.push(cell);
        }
      }

      for (let index = 0; index < newGridRow.length; index++) {
        if (newGridRow[index] === newGridRow[index + 1]) {
          newGridRow[index] = newGridRow[index] + newGridRow[index];
          this.scoreResult += newGridRow[index];
          newGridRow.splice(index + 1, 1);

          break;
        }
      }

      newGridRow.reverse();

      for (let lengthRow = newGridRow.length; lengthRow < 4; lengthRow++) {
        newGridRow.unshift(0);
      }

      newGridRow.reverse();
      modifiedGrid.push(newGridRow);
    }

    this.grid = modifiedGrid;
    this.start();
  }
  moveRight() {
    if (this.isMove(0, this.grid) === 0) {
      return;
    }

    const modifiedGrid = [];

    for (let row = 0; row < this.grid.length; row++) {
      const newGridRow = [];

      for (let col = 0; col < this.grid.length; col++) {
        if (this.grid[row][col] !== 0) {
          newGridRow.push(this.grid[row][col]);
        }
      }

      newGridRow.reverse();

      for (let index = 0; index < newGridRow.length; index++) {
        if (newGridRow[index] === newGridRow[index + 1]) {
          newGridRow[index] = newGridRow[index] + newGridRow[index];
          this.scoreResult += newGridRow[index];
          newGridRow.splice(index + 1, 1);

          break;
        }
      }

      newGridRow.reverse();

      for (let lengthRow = newGridRow.length; lengthRow < 4; lengthRow++) {
        newGridRow.unshift(0);
      }
      modifiedGrid.push(newGridRow);
    }

    this.grid = modifiedGrid;
    this.start();
  }
  moveUp() {
    const col0 = this.grid.map((row) => row[0]);
    const col1 = this.grid.map((row) => row[1]);
    const col2 = this.grid.map((row) => row[2]);
    const col3 = this.grid.map((row) => row[3]);

    const newGrid = [col0, col1, col2, col3];
    let isMoveUp = true;

    this.grid = newGrid;

    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = this.grid[i].reverse();
    }

    if (this.isMove(0, this.grid) === 0) {
      isMoveUp = false;
    }

    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i].reverse();
    }

    if (isMoveUp === false) {
      const resGrid = col0.map((_, i) => [col0[i], col1[i], col2[i], col3[i]]);

      this.grid = resGrid;

      return;
    }

    const modifiedGrid = [];

    for (let row = 0; row < newGrid.length; row++) {
      const newGridRow = [];

      for (let col = 0; col < newGrid.length; col++) {
        if (newGrid[row][col] !== 0) {
          newGridRow.push(newGrid[row][col]);
        }
      }

      for (let index = 0; index < newGridRow.length; index++) {
        if (newGridRow[index] === newGridRow[index + 1]) {
          newGridRow[index] = newGridRow[index] + newGridRow[index];
          this.scoreResult += newGridRow[index];
          newGridRow.splice(index + 1, 1);

          break;
        }
      }

      newGridRow.reverse();

      for (let lengthRow = newGridRow.length; lengthRow < 4; lengthRow++) {
        newGridRow.unshift(0);
      }

      newGridRow.reverse();
      modifiedGrid.push(newGridRow);
    }

    const row0 = modifiedGrid[0];
    const row1 = modifiedGrid[1];
    const row2 = modifiedGrid[2];
    const row3 = modifiedGrid[3];

    const result = row0.map((_, i) => [row0[i], row1[i], row2[i], row3[i]]);

    this.grid = result;
    this.start();
  }
  moveDown() {
    const col0 = this.grid.map((row) => row[0]);
    const col1 = this.grid.map((row) => row[1]);
    const col2 = this.grid.map((row) => row[2]);
    const col3 = this.grid.map((row) => row[3]);

    const newGrid = [col0, col1, col2, col3];

    this.grid = newGrid;

    if (this.isMove(0, this.grid) === 0) {
      const res = col0.map((_, i) => [col0[i], col1[i], col2[i], col3[i]]);

      this.grid = res;

      return;
    }

    const modifiedGrid = [];

    for (let row = 0; row < newGrid.length; row++) {
      const newGridRow = [];

      for (let col = 0; col < newGrid.length; col++) {
        if (newGrid[row][col] !== 0) {
          newGridRow.push(newGrid[row][col]);
        }
      }

      newGridRow.reverse();

      for (let index = 0; index < newGridRow.length; index++) {
        if (newGridRow[index] === newGridRow[index + 1]) {
          newGridRow[index] = newGridRow[index] + newGridRow[index];
          this.scoreResult += newGridRow[index];
          newGridRow.splice(index + 1, 1);

          break;
        }
      }

      newGridRow.reverse();

      for (let lengthRow = newGridRow.length; lengthRow < 4; lengthRow++) {
        newGridRow.unshift(0);
      }
      modifiedGrid.push(newGridRow);
    }

    const row0 = modifiedGrid[0];
    const row1 = modifiedGrid[1];
    const row2 = modifiedGrid[2];
    const row3 = modifiedGrid[3];

    const result = row0.map((_, i) => [row0[i], row1[i], row2[i], row3[i]]);

    this.grid = result;
    this.start();
  }

  /**
   * @returns {number}
   */
  getScore() {
    const score = document.querySelector('.game-score');

    score.textContent = this.scoreResult;
  }

  /**
   * @returns {number[][]}
   */
  getState() {}

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
    const win = document.querySelector('.message-win');
    const lose = document.querySelector('.message-lose');
    const noMoveGrid = this.grid.map((row) => [...row]);
    let cell2048 = 0;
    let counter1 = 0;
    let counter2 = 0;

    for (let row = 0; row < noMoveGrid.length; row++) {
      let cellRow;

      for (let col = 0; col < noMoveGrid.length; col++) {
        const cell = noMoveGrid[row][col];

        if (cell !== 0) {
          if (cellRow !== cell) {
            cellRow = cell;
            counter1++;
          }
        }
      }
    }

    const column0 = noMoveGrid.map((row) => row[0]);
    const column1 = noMoveGrid.map((row) => row[1]);
    const column2 = noMoveGrid.map((row) => row[2]);
    const column3 = noMoveGrid.map((row) => row[3]);

    const nwGrid = [column0, column1, column2, column3];

    for (let row = 0; row < nwGrid.length; row++) {
      let cell;

      for (let col = 0; col < nwGrid.length; col++) {
        if (nwGrid[row][col] !== 0) {
          if (cell !== nwGrid[row][col]) {
            cell = nwGrid[row][col];
            counter2++;
          }
        }
      }
    }

    if (counter1 === 16 && counter2 === 16) {
      lose.classList.remove('hidden');
    } else {
      lose.classList.add('hidden');
    }

    for (let caunterRow = 0; caunterRow < this.grid.length; caunterRow++) {
      for (let caunterCol = 0; caunterCol < this.grid.length; caunterCol++) {
        if (this.grid[caunterRow][caunterCol] === 2048) {
          cell2048 = this.grid[caunterRow][caunterCol];
        }
      }
    }

    if (cell2048 >= 2048) {
      win.classList.remove('hidden');
    } else {
      win.classList.add('hidden');
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.spawnTile();
    this.render();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.boardElement.innerHTML = '';

    for (let row = 0; row < this.grid.length; row++) {
      const tr = document.createElement('tr');

      for (let col = 0; col < this.grid.length; col++) {
        const tile = document.createElement('td');

        tile.classList.add('field-cell');
        tr.appendChild(tile);
      }
      this.boardElement.appendChild(tr);
    }

    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.scoreResult = 0;
  }

  spawnTile() {
    this.emptyCells = [];

    for (let rw = 0; rw < this.grid.length; rw++) {
      for (let cl = 0; cl < this.grid.length; cl++) {
        if (this.grid[rw][cl] === 0) {
          this.emptyCells.push({ row: rw, col: cl });
        }
      }
    }

    if (this.emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      this.emptyCells[Math.floor(Math.random() * this.emptyCells.length)];

    this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  render() {
    this.boardElement.innerHTML = '';

    for (let row = 0; row < this.grid.length; row++) {
      const tr = document.createElement('tr');

      for (let col = 0; col < this.grid.length; col++) {
        const value = this.grid[row][col];
        const tile = document.createElement('td');

        tile.classList.add('field-cell');
        tile.setAttribute('data-row', row);
        tile.setAttribute('data-col', col);

        if (value !== 0) {
          tile.classList.add(`field-cell--${value}`);
          tile.textContent = value;
        } else {
          tile.classList.add('field-cell');
        }
        tr.appendChild(tile);
      }
      this.boardElement.appendChild(tr);
    }
  }
}

module.exports = Game;
