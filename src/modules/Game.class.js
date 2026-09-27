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
    if (initialState) {
      this.state = initialState.map((row) => [...row]);
    } else {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.score = 0;
    this.status = 'idle';

    this.initialState = this.state.map((row) => [...row]);
  }

  updateStatus() {
    const flatState = this.state.flat();

    if (flatState.includes(2048)) {
      this.status = 'win';

      return;
    }

    const hasEmptyCell = flatState.includes(0);

    const checkCanMerge = (row, rowIndex) => {
      return row.some((value, colIndex) => {
        const right = row[colIndex + 1];
        const below = this.state[rowIndex + 1]?.[colIndex];

        return value === right || value === below;
      });
    };

    const hasAvailableMerge = this.state.some(checkCanMerge);

    if (hasEmptyCell || hasAvailableMerge) {
      this.status = 'playing';
    } else {
      this.status = 'lose';
    }
  }

  moveLeft() {
    let moved = false;

    const newState = this.state.map((row) => {
      const { row: newRow, scoreGained } = this.proccesLine(row);

      this.score += scoreGained;

      if (!row.every((value, index) => value === newRow[index])) {
        moved = true;
      }

      this.updateStatus();

      return newRow;
    });

    this.state = newState;

    if (moved) {
      this.addRandomTile();
    }
  }

  moveRight() {
    let moved = false;

    const newState = this.state.map((row) => {
      const reversedRow = [...row].reverse();
      const { row: processedRow, scoreGained } = this.proccesLine(reversedRow);
      const newRow = processedRow.reverse();

      this.score += scoreGained;

      if (!row.every((value, index) => value === newRow[index])) {
        moved = true;
      }

      this.updateStatus();

      return newRow;
    });

    this.state = newState;

    if (moved) {
      this.addRandomTile();
    }
  }

  moveUp() {
    const transposed = this.transpose(this.state);

    this.state = transposed;
    this.moveLeft();
    this.state = this.transpose(this.state);

    this.updateStatus();
  }

  moveDown() {
    const transposed = this.transpose(this.state);

    this.state = transposed;
    this.moveRight();
    this.state = this.transpose(this.state);

    this.updateStatus();
  }

  proccesLine(line) {
    const numbers = line.filter((number) => number !== 0);
    const result = [];
    let scoreGained = 0;

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const merged = numbers[i] * 2;

        result.push(merged);
        scoreGained += merged;
        i++;
      } else {
        result.push(numbers[i]);
      }
    }

    while (result.length < line.length) {
      result.push(0);
    }

    return { row: result, scoreGained };
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row: targetRow, col: targetCol } = emptyCells[randomIndex];

    this.state[targetRow][targetCol] = Math.random() < 0.1 ? 4 : 2;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }
  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state.map((row) => [...row]);
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
