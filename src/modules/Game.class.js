'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.board.forEach((row, rowIndex) => {
      if (Array.isArray(row)) {
        const newRow = row.filter((cell) => cell !== 0);
        const mergedRow = [];

        for (let i = 0; i < newRow.length; i++) {
          if (newRow[i] === newRow[i + 1]) {
            mergedRow.push(newRow[i] * 2);
            i++;
          } else {
            mergedRow.push(newRow[i]);
          }
        }

        while (mergedRow.length < 4) {
          mergedRow.push(0);
        }
        this.board[rowIndex] = mergedRow;
      } else {
        // eslint-disable-next-line no-console
        console.error(`Row at index ${rowIndex} is invalid:`, row);
      }
    });
    this.addRandomTile();
  }
  moveRight() {
    this.board.forEach((row, rowIndex) => {
      if (Array.isArray(row)) {
        const newRow = row.reverse().filter((cell) => cell !== 0);
        const mergedRow = [];

        for (let i = 0; i < newRow.length; i++) {
          if (newRow[i] === newRow[i + 1]) {
            mergedRow.push(newRow[i] * 2);
            i++;
          } else {
            mergedRow.push(newRow[i]);
          }
        }

        while (mergedRow.length < 4) {
          mergedRow.push(0);
        }
        this.board[rowIndex] = mergedRow.reverse();
      } else {
        // eslint-disable-next-line no-console
        console.error(`Row at index ${rowIndex} is invalid:`, row);
      }
    });
    this.addRandomTile();
  }

  moveUp() {
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const column = [];

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        column.push(this.board[rowIndex][colIndex]);
      }

      const newColumn = column.filter((cell) => cell !== 0);
      const mergedColumn = [];

      for (let i = 0; i < newColumn.length; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          mergedColumn.push(newColumn[i] * 2);
          i++;
        } else {
          mergedColumn.push(newColumn[i]);
        }
      }

      while (mergedColumn.length < 4) {
        mergedColumn.push(0);
      }

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        this.board[rowIndex][colIndex] = mergedColumn[rowIndex];
      }
    }
    this.addRandomTile();
  }

  moveDown() {
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const column = [];

      // Збираємо стовпець
      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        column.push(this.board[rowIndex][colIndex]);
      }

      // Перевертаємо стовпець, щоб обробляти його як рух вгору
      const newColumn = column.reverse().filter((cell) => cell !== 0);
      const mergedColumn = [];

      // Зливаємо однакові елементи
      for (let i = 0; i < newColumn.length; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          mergedColumn.push(newColumn[i] * 2);
          i++;
        } else {
          mergedColumn.push(newColumn[i]);
        }
      }

      // Додаємо нулі в кінець, щоб довжина була 4
      while (mergedColumn.length < 4) {
        mergedColumn.push(0);
      }

      // Перевертаємо назад і записуємо результат в стовпець
      const finalColumn = mergedColumn.reverse();

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        this.board[rowIndex][colIndex] = finalColumn[rowIndex];
      }
    }
    this.addRandomTile();
  }

  getScore() {
    return this.score;
  }

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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  getMaxTile() {
    let maxTile = 0;

    this.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell > maxTile) {
          maxTile = cell;
        }
      });
    });

    return maxTile;
  }

  getWin() {
    let maxTile = 0;

    this.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell > maxTile) {
          maxTile = cell;
        }
      });
    });

    if (maxTile >= 2048) {
      this.status = 'win';
    }

    return this.status;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  isBoardFull() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    return true;
  }

  canMerge() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== 0) {
          if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
            return true;
          }

          if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
            return true;
          }
        }
      }
    }

    return false; // Якщо не знайдено жодного можливого злиття
  }

  isGameOver() {
    // eslint-disable-next-line no-console
    console.log(this.status);

    return this.isBoardFull() && !this.canMerge() && this.getWin();
  }
}

export default Game;
