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

  randomSpawn(numberOfDigits, isActive = true, board = this.board) {
    if (isActive) {
      let hasPlaced = false;
      let counter = 0;

      while (!hasPlaced) {
        const randomRow = Math.floor(Math.random() * 4);
        const randomCol = Math.floor(Math.random() * 4);

        if (board[randomRow][randomCol] === 0 && counter !== numberOfDigits) {
          const randomNumber = Math.floor(Math.random() * 10);

          if (randomNumber === 0) {
            board[randomRow][randomCol] = 4;
          } else {
            board[randomRow][randomCol] = 2;
          }
          counter++;
        } else if (counter === numberOfDigits) {
          hasPlaced = true;
        }
      }
    }

    return board;
  }

  randomStartPosition(board) {
    return this.randomSpawn(2, true, board);
  }

  rendering() {
    const rows = document.getElementsByClassName('field-row');

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== 0) {
          rows[i].children[j].className = 'field-cell';
          rows[i].children[j].classList.add(`field-cell--${this.board[i][j]}`);
          rows[i].children[j].textContent = this.board[i][j];
        } else {
          rows[i].children[j].className = 'field-cell';
          rows[i].children[j].textContent = '';
        }
      }
    }
  }

  constructor(initialState) {
    // eslint-disable-next-line no-console
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.status = 'idle';
    this.firstMove = false;
    this.messageLose = document.getElementsByClassName('message-lose')[0];
    this.messageWin = document.getElementsByClassName('message-win')[0];
    this.messageStart = document.getElementsByClassName('message-start')[0];
  }

  move(direction) {
    this.firstMove = true;

    const boardBefore = structuredClone(this.board);

    let rotatedBoard = this.prepareBoardForMove(direction);

    rotatedBoard = this.slideLeft(rotatedBoard);

    this.board = this.restoreBoardAfterMove(rotatedBoard, direction);

    const changed = !this.areBoardsEqual(boardBefore, this.board);

    if (changed) {
      this.randomSpawn(1);
    }

    this.rendering();

    this.firstMoveCheck(this.firstMove);

    this.isWin();
    this.isLose();
  }

  prepareBoardForMove(direction) {
    const board = structuredClone(this.board);

    switch (direction) {
      case 'ArrowRight':
        return board.map((row) => row.reverse());
      case 'ArrowUp':
        return this.transpose(board);
      case 'ArrowDown':
        return this.transpose(board).map((row) => row.reverse());
      default:
        return board;
    }
  }

  slideLeft(board) {
    const size = board.length;
    const score = document.getElementsByClassName('game-score')[0];

    for (let i = 0; i < size; i++) {
      let row = board[i].filter((v) => v !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          score.textContent = this.getScore(row[j]);
          row[j + 1] = 0;
        }
      }

      row = row.filter((v) => v !== 0);

      while (row.length < size) {
        row.push(0);
      }
      board[i] = row;
    }

    return board;
  }

  restoreBoardAfterMove(board, direction) {
    switch (direction) {
      case 'ArrowRight':
        return board.map((row) => row.reverse());
      case 'ArrowUp':
        return this.transpose(board);
      case 'ArrowDown':
        return this.transpose(board.map((row) => row.reverse()));
      default:
        return board;
    }
  }

  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  areBoardsEqual(board1, board2) {
    for (let i = 0; i < board1.length; i++) {
      for (let j = 0; j < board1[i].length; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  moveLeft() {
    this.move('ArrowLeft');
  }

  moveRight() {
    this.move('ArrowRight');
  }

  moveUp() {
    this.move('ArrowUp');
  }

  moveDown() {
    this.move('ArrowDown');
  }

  firstMoveCheck(isFirstMove) {
    const button = document.getElementsByClassName('button')[0];

    if (isFirstMove) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }
  }

  movement() {
    this.handleKeyDown = () => {
      switch (event.key) {
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
    };

    document.addEventListener('keydown', this.handleKeyDown);
  }

  isWin() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
      this.getStatus();

      this.messageWin.classList.remove('hidden');
      this.messageLose.classList.add('hidden');
      this.messageStart.classList.add('hidden');

      document.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  isLose() {
    const hasEmptyCell = this.board.some((row) => row.includes(0));

    if (hasEmptyCell) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.board[i][j];

        if (j < 3 && this.board[i][j + 1] === current) {
          return false;
        }

        if (i < 3 && this.board[i + 1][j] === current) {
          return false;
        }
      }
    }

    this.status = 'lose';
    this.getStatus();

    this.messageWin.classList.add('hidden');
    this.messageLose.classList.remove('hidden');
    this.messageStart.classList.add('hidden');

    document.removeEventListener('keydown', this.handleKeyDown);

    return true;
  }

  /**
   * @returns {number}
   */
  getScore(numberToAdd) {
    const score = document.getElementsByClassName('game-score')[0];

    return parseInt(score.textContent) + numberToAdd;
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
    switch (this.status) {
      case 'playing':
        return this.status;
      case 'win':
        return this.status;
      case 'lose':
        return this.status;
      default:
        return this.status;
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.getStatus();

    this.board = this.randomStartPosition(this.board);

    this.rendering();

    this.movement();

    this.messageStart.classList.toggle('hidden');
  }

  /**
   * Resets the game.
   */
  restart() {
    const button = document.getElementsByClassName('button')[0];
    const score = document.getElementsByClassName('game-score')[0];

    this.status = 'idle';
    this.getStatus();

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    score.textContent = '0';

    this.rendering();

    this.messageWin.classList.add('hidden');
    this.messageLose.classList.add('hidden');
    this.messageStart.classList.remove('hidden');

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }
}

module.exports = Game;
