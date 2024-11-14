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

  static STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  static DIRECTION = {
    left: 'left',
    right: 'right',
    up: 'up',
    down: 'down',
  };

  static INITIAL_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  static WIN_COUNT = 2048;

  constructor(initialState = Game.INITIAL_STATE) {
    this.initialState = initialState;
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = Game.STATUS.idle;
    this.gameSize = initialState.length;
  }

  moveLeft() {
    this.move(Game.DIRECTION.left);
  }
  moveRight() {
    this.move(Game.DIRECTION.right);
  }
  moveUp() {
    this.move(Game.DIRECTION.up);
  }
  moveDown() {
    this.move(Game.DIRECTION.down);
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
    return this.state;
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
    this.status = Game.STATUS.playing;
    this.addTile();
    this.addTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = Game.STATUS.idle;
  }

  move(direction) {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    let newState;

    if (direction === Game.DIRECTION.left) {
      newState = this.state.map((row) => this.updateRow(row));
    }

    if (direction === Game.DIRECTION.right) {
      newState = this.reverseRows(
        this.reverseRows(this.state).map((row) => {
          return this.updateRow(row);
        }),
      );
    }

    if (direction === Game.DIRECTION.up) {
      newState = this.columnsToRows(
        this.columnsToRows(this.state).map((row) => {
          return this.updateRow(row);
        }),
      );
    }

    if (direction === Game.DIRECTION.down) {
      newState = this.columnsToRows(
        this.reverseRows(
          this.reverseRows(this.columnsToRows(this.state)).map((row) => {
            return this.updateRow(row);
          }),
        ),
      );
    }

    if (this.shouldMove(this.state, newState)) {
      this.state = newState;
      this.addTile();
    }

    this.updateGameStatus();
  }

  getEmptyCells() {
    return this.state.reduce((acc, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell) {
          acc.push({ rowIndex, colIndex });
        }
      });

      return acc;
    }, []);
  }

  addTile() {
    const number = Math.random() <= 0.1 ? 4 : 2;

    const emptyCells = this.getEmptyCells();

    if (emptyCells.length) {
      const emptyCellIndex = Math.floor(Math.random() * emptyCells.length);

      const { rowIndex, colIndex } = emptyCells[emptyCellIndex];

      this.state[rowIndex][colIndex] = number;
    }
  }

  columnsToRows(state) {
    return state.reduce((acc, row) => {
      row.forEach((cell, i) => {
        if (!acc[i]) {
          acc[i] = [];
        }

        acc[i].push(cell);
      });

      return acc;
    }, []);
  }

  reverseRows(state) {
    return state.map((row) => [...row].reverse());
  }

  updateRow(row) {
    const filteredCells = row.filter((cell) => cell);

    for (let i = 0; i < filteredCells.length - 1; i++) {
      const currentCell = filteredCells[i];
      const nextCell = filteredCells[i + 1];

      if (currentCell === nextCell) {
        const count = currentCell * 2;

        filteredCells[i] = count;
        filteredCells.splice(i + 1, 1);
        this.score += count;
      }
    }

    while (filteredCells.length < this.gameSize) {
      filteredCells.push(0);
    }

    return filteredCells;
  }

  canMoveRow(row) {
    return row.some((cell, index) => cell === row[index + 1]);
  }

  shouldMove(currentState, newState) {
    return newState.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        return cell !== currentState[rowIndex][colIndex];
      });
    });
  }

  canMove() {
    return (
      this.state.some((row) => this.canMoveRow(row)) ||
      this.columnsToRows(this.state).some((row) => this.canMoveRow(row))
    );
  }

  updateGameStatus() {
    const isWinGame = this.state.some((row) => row.includes(Game.WIN_COUNT));

    if (isWinGame) {
      this.status = Game.STATUS.win;
    }

    if (!this.canMove()) {
      this.status = Game.STATUS.lose;
    }
  }
}

module.exports = Game;
