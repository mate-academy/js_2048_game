'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static states = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };
  board;
  boardTransposed = [];
  state;
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
  ) {
    const cellsPromise = new Promise((resolve, reject) => {
      document.addEventListener('DOMContentLoaded', (e) => {
        resolve(document.querySelectorAll('.field-cell'));
      });
    });

    this.board = initialState.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        return {
          initial: cell,
          value: 0,
          row: rowIndex,
          col: colIndex,
          cell: null,
          setValue: (newValue) => {
            return cellsPromise.then((cells) => {
              if (this.board[rowIndex][colIndex].value !== 0) {
                this.board[rowIndex][colIndex].cell.classList.remove(
                  `field-cell--${this.board[rowIndex][colIndex].value}`,
                );
              }
              this.board[rowIndex][colIndex].value = newValue;

              this.board[rowIndex][colIndex].cell =
                cells[rowIndex * row.length + colIndex];
              this.board[rowIndex][colIndex].cell.innerHTML = newValue;

              if (newValue === 0) {
                this.board[rowIndex][colIndex].cell.innerHTML = '';
              }

              this.board[rowIndex][colIndex].cell.classList.add(
                `field-cell--${newValue}`,
              );

              return this.board;
            });
          },
        };
      });
    });

    this.board.flat(Infinity).forEach((cell) => {
      cell.setValue(cell.initial);
    });

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (!this.boardTransposed[j]) {
          this.boardTransposed[j] = [];
        }
        this.boardTransposed[j][i] = this.board[i][j];
      }
    }

    this.state = Game.states.idle;
    this.boundStart = this.start.bind(this);
    this.boundRestart = this.restart.bind(this);
    document.querySelector('.start').addEventListener('click', this.boundStart);

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
        case 'ArrowUp':
          this.moveUp();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
      }
    });
  }

  move(isHorizontal, isRight) {
    let board = this.board;

    if (!isHorizontal) {
      board = this.boardTransposed;
    }

    for (let i = 0; i < board.length; i++) {
      const filteredRow = board[i].filter((cell) => {
        return cell.value !== 0;
      });

      if (isRight) {
        filteredRow.reverse();
      }

      for (let j = 0; j < board[i].length; j++) {
        let index = j;

        if (isRight) {
          index = board[i].length - 1 - j;
        }

        if (
          j < filteredRow.length - 1 &&
          filteredRow[j + 1].value === filteredRow[j].value
        ) {
          board[i][index].setValue(filteredRow[j].value * 2);
          filteredRow.splice(j + 1, 1);
          continue;
        }

        if (j < filteredRow.length) {
          board[i][index].setValue(filteredRow[j].value);
          continue;
        }

        board[i][index].setValue(0);
      }
    }
  }

  moveLeft() {
    this.beforeMove();
    this.move(true, false);
    this.afterMove();
  }
  moveRight() {
    this.beforeMove();
    this.move(true, true);
    this.afterMove();
  }
  moveUp() {
    this.beforeMove();
    this.move(false, false);
    this.afterMove();
  }
  moveDown() {
    this.beforeMove();
    this.move(false, true);
    this.afterMove();
  }
  beforeMove() {
    if (this.state === Game.states.idle) {
      this.switchState(Game.states.playing);
    }
  }
  async afterMove() {
    await this.cellsPromise;

    if (
      this.board.flat(Infinity).some((cell) => {
        return cell.value === 2048;
      })
    ) {
      this.switchState(Game.states.win);
    }

    this.addNumber();

    this.checkLose().then((isLost) => {
      if (isLost) {
        this.switchState(Game.states.lose);
      }
    });
  }
  async checkLose() {
    await this.cellsPromise;

    if (
      this.board.flat(Infinity).find((cell) => {
        return cell.value === 0;
      })
    ) {
      return false;
    }

    if (this.checkMoveAvailable(true)) {
      return false;
    }

    if (this.checkMoveAvailable(false)) {
      return false;
    }

    return true;
  }
  checkMoveAvailable(isHorizontal) {
    let board = this.board;

    if (!isHorizontal) {
      board = this.boardTransposed;
    }

    for (let i = 0; i < board.length; i++) {
      const filteredRow = board[i].filter((cell) => {
        return cell.value !== 0;
      });

      if (filteredRow.length < board[i].length) {
        return true;
      }

      for (let j = 0; j < board[i].length; j++) {
        if (
          j < filteredRow.length - 1 &&
          filteredRow[j + 1].value === filteredRow[j].value
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.board.reduce((sum, row) => {
      return (
        sum +
        row.reduce((sumRow, cell) => {
          return sumRow + cell.value;
        }, 0)
      );
    }, 0);
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => {
      return row.map((cell) => {
        return cell.value;
      });
    });
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
    return this.state;
  }

  /**
   * Starts the game.
   */
  start() {
    this.beforeMove();
    this.afterMove();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.switchState(Game.states.idle);
  }

  /**
   * @param {'Game.states'} newState
   */
  switchState(newState) {
    if (!Object.keys(Game.states).includes(newState)) {
      return;
    }

    switch (this.state) {
      case Game.states.idle:
        document
          .querySelector('.start')
          .removeEventListener('click', this.boundStart);
        document.querySelector('.message-start').classList.add('hidden');
        break;
      case Game.states.playing:
        document
          .querySelector('.restart')
          .removeEventListener('click', this.boundRestart);
        break;
      case Game.states.win:
        document
          .querySelector('.restart')
          .removeEventListener('click', this.boundRestart);
        document.querySelector('.message-win').classList.add('hidden');
        break;
      case Game.states.lose:
        document
          .querySelector('.restart')
          .removeEventListener('click', this.boundRestart);
        document.querySelector('.message-lose').classList.add('hidden');
        break;
    }

    switch (newState) {
      case Game.states.idle:
        this.board.flat(Infinity).forEach((cell) => {
          cell.setValue(cell.initial);
        });
        document.querySelector('.game-score').innerHTML = 0;

        document
          .querySelector('.restart')
          .classList.replace('restart', 'start');
        document.querySelector('.start').innerHTML = 'Start';

        document
          .querySelector('.start')
          .addEventListener('click', this.boundStart);
        this.state = Game.states.idle;
        break;
      case Game.states.playing:
        document.querySelector('.start').classList.replace('start', 'restart');
        document.querySelector('.restart').innerHTML = 'Restart';

        document
          .querySelector('.restart')
          .addEventListener('click', this.boundRestart);
        this.state = Game.states.playing;
        break;
      case Game.states.win:
        document
          .querySelector('.restart')
          .addEventListener('click', this.boundRestart);
        document.querySelector('.message-win').classList.remove('hidden');
        this.state = Game.states.win;
        break;
      case Game.states.lose:
        document
          .querySelector('.restart')
          .addEventListener('click', this.boundRestart);
        document.querySelector('.message-lose').classList.remove('hidden');
        this.state = Game.states.lose;
        break;
      default:
        break;
    }
  }

  /**
   * Adds new number to the board
   *
   * @returns {boolean} true on success
   *
   */
  addNumber() {
    const availableCells = this.board.flat(Infinity).filter((cell) => {
      return cell.value === 0;
    });

    if (availableCells.length === 0) {
      return false;
    }

    const rand = Math.floor(Math.random() * availableCells.length);
    let newNum = 2;

    if (Math.floor(Math.random() * 10) === 0) {
      newNum = 4;
    }

    availableCells[rand].setValue(newNum).then((board) => {
      document.querySelector('.game-score').innerHTML = this.getScore();
    });

    return true;
  }
}

module.exports = Game;
