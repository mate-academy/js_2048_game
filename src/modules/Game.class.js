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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.ROWS_NODE = [...document.querySelectorAll('.field-row')];
    this.LOSE_MESSAGE_NODE = document.querySelector('.message-lose');
    this.SCORE_NODE = document.querySelector('.game-score');
    this.remove = false;
  }
  moveCells() {
    document.addEventListener('keydown', (e) => {
      let newBoard;
      let resultBoard;

      switch (e.key) {
        case 'ArrowUp':
          newBoard = [[], [], [], []];
          resultBoard = [[], [], [], []];

          for (let cell = 0; cell < this.board.length; cell++) {
            for (let col = 0; col < this.board.length; col++) {
              if (this.board[col][cell] !== 0) {
                newBoard[cell].push(this.board[col][cell]);
              }
            }
          }

          for (let col = 0; col < newBoard.length; col++) {
            for (let cell = 0; cell < newBoard[col].length; cell++) {
              if (newBoard[col][cell] === newBoard[col][cell + 1]) {
                newBoard[col][cell] *= 2;
                newBoard[col][cell + 1] = 0;
                this.score += newBoard[col][cell];
                this.scoreChangeColor();
              }
            }

            while (newBoard[col].length < 4) {
              newBoard[col].push(0);
            }
          }

          for (let col = 0; col < newBoard.length; col++) {
            for (let cell = 0; cell < newBoard.length; cell++) {
              resultBoard[cell][col] = newBoard[col][cell];
            }
          }

          if (!this.arraysEqual(this.board, resultBoard)) {
            this.board = resultBoard;
            this.updateBoard();
            this.getScore();
            this.placeRandomTile();
            this.checkGameOver();
            this.checkWin();
          }
          break;
        case 'ArrowDown':
          newBoard = [[], [], [], []];
          resultBoard = [[], [], [], []];

          for (let cell = 0; cell < this.board.length; cell++) {
            for (let col = 0; col < this.board.length; col++) {
              if (this.board[col][cell] !== 0) {
                newBoard[cell].push(this.board[col][cell]);
              }
            }
          }

          for (let col = 0; col < newBoard.length; col++) {
            let merge = true;

            for (let cell = newBoard[col].length - 1; cell >= 0; cell--) {
              if (newBoard[col][cell] === newBoard[col][cell - 1] && merge) {
                newBoard[col][cell] *= 2;
                newBoard[col][cell - 1] = 0;
                this.score += newBoard[col][cell];
                this.scoreChangeColor();
                merge = false;
              }
            }

            while (newBoard[col].length < 4) {
              newBoard[col].unshift(0);
            }
          }

          for (let col = 0; col < newBoard.length; col++) {
            for (let cell = 0; cell < newBoard.length; cell++) {
              resultBoard[cell][col] = newBoard[col][cell];
            }
          }

          if (!this.arraysEqual(this.board, resultBoard)) {
            this.board = resultBoard;
            this.updateBoard();
            this.getScore();
            this.placeRandomTile();
            this.checkGameOver();
            this.checkWin();
          }
          break;
        case 'ArrowLeft':
          newBoard = [];

          this.board.forEach((row) => {
            const newRow = row.filter((cell) => cell !== 0);

            for (let i = 0; i < newRow.length - 1; i++) {
              if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newRow[i + 1] = 0;
                this.score += newRow[i];
                this.scoreChangeColor();
              }
            }

            const filteredRow = newRow.filter((cell) => cell !== 0);

            while (filteredRow.length < 4) {
              filteredRow.push(0);
            }

            newBoard.push(filteredRow);
          });

          if (!this.arraysEqual(this.board, newBoard)) {
            this.board = newBoard;
            this.updateBoard();
            this.getScore();
            this.placeRandomTile();
            this.checkGameOver();
            this.checkWin();
          }
          break;

        case 'ArrowRight':
          newBoard = [];

          this.board.forEach((row) => {
            const newRow = row.filter((cell) => cell !== 0);

            for (let i = newRow.length - 1; i > 0; i--) {
              if (newRow[i] === newRow[i - 1]) {
                newRow[i] *= 2;
                newRow[i - 1] = 0;
                this.score += newRow[i];
                this.scoreChangeColor();
              }
            }

            const filteredRow = newRow.filter((cell) => cell !== 0);

            while (filteredRow.length < 4) {
              filteredRow.unshift(0);
            }
            newBoard.push(filteredRow);
          });

          if (!this.arraysEqual(this.board, newBoard)) {
            this.board = newBoard;
            this.updateBoard();
            this.getScore();
            this.placeRandomTile();
            this.checkGameOver();
            this.checkWin();
          }
          break;
      }
    });
  }

  updateBoard() {
    this.ROWS_NODE.forEach((row, rowIndex) => {
      const cells = [...row.cells];

      cells.forEach((cell, cellIndex) => {
        const boardValue = this.board[rowIndex][cellIndex];

        if (cell.textContent !== boardValue) {
          if (boardValue === 0) {
            cell.className = `field-cell`;
            cell.textContent = '';
          } else {
            cell.textContent = boardValue;
            cell.className = `field-cell field-cell--${boardValue}`;
          }
        }
      });
    });
  }

  arraysEqual(board1, board2) {
    for (let row = 0; row < board1.length; row++) {
      for (let cell = 0; cell < board1.length; cell++) {
        if (board1[row][cell] !== board2[row][cell]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * @returns {number}
   */

  getScore() {
    this.SCORE_NODE.innerHTML = `${this.score}`;
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
  getStatus() {}
  /**
   * Starts the game.
   */
  start() {
    this.clickStartButton();
    this.moveCells();
  }
  /**
   * Resets the game.
   */
  restart() {
    this.resetBoard();
  }
  placeRandomTile(firstOnes) {
    const emptyCells = [];

    // push empty cell coords as {row, cell} in [] (emptyCells)
    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (this.board[row][cell] === 0) {
          emptyCells.push({ row, cell });
        }
      }
    }

    if (emptyCells.length > 0) {
      // choose random number between 0 and emptyCells.length
      const randomCell = Math.floor(
        Math.random() * Math.floor(emptyCells.length),
      );
      // choose random value for cell (2 or 4), 4 probability is 10%
      const randomValue = Math.random() <= 0.1 ? 4 : 2;
      // pick randomly chosen number from randomCell
      const RandomTilePosition = emptyCells[randomCell];
      const { row, cell } = RandomTilePosition;
      // add random value to the board

      this.board[row][cell] = randomValue;

      // insert random value inside html
      const changingCell = this.ROWS_NODE[row].children[cell];

      changingCell.classList.add(`field-cell--${randomValue}`);
      changingCell.innerHTML = randomValue.toString();

      if (!firstOnes) {
        changingCell.style = 'color: #FF7F50';

        setTimeout(() => {
          changingCell.style = '';
        }, 400);
      }
    }
  }
  clickStartButton() {
    const START_BUTTON_NODE = document.querySelector('.button');
    const startButtonClickHandler = () => {
      if (!this.remove) {
        // eslint-disable-next-line no-shadow
        const START_BUTTON_NODE = document.querySelector('.button.start');
        const START_MESSAGE_NODE = document.querySelector(
          '.message.message-start',
        );

        this.placeRandomTile(true);
        this.placeRandomTile(true);
        START_MESSAGE_NODE.innerHTML = 'Your ad can be here';

        START_MESSAGE_NODE.classList.replace(
          'message-start',
          'message-restart',
        );
        START_BUTTON_NODE.innerHTML = 'Restart';
        START_BUTTON_NODE.classList.replace('start', 'restart');
        document.querySelector('.message-win').classList.toggle('hidden', true);
        this.remove = true;

        return;
      }

      const RESTART_BUTTON_NODE = document.querySelector('.button.restart');
      const RESTART_MESSAGE_NODE = document.querySelector(
        '.message.message-restart',
      );

      if (RESTART_BUTTON_NODE !== null) {
        this.remove = true;
        this.resetBoard();
        this.resetScore();

        RESTART_MESSAGE_NODE.innerHTML =
          'Press "Start" to begin game. <br> Good luck!';
        RESTART_BUTTON_NODE.innerHTML = 'Start';
        RESTART_BUTTON_NODE.classList.replace('restart', 'start');

        RESTART_MESSAGE_NODE.classList.replace(
          'message-restart',
          'message-start',
        );
        this.LOSE_MESSAGE_NODE.classList.toggle('hidden', true);
      }
      this.remove = false;
    };

    START_BUTTON_NODE.addEventListener('click', startButtonClickHandler);
  }

  resetBoard() {
    // reset array
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    // reset html
    this.ROWS_NODE.forEach((row) => {
      row.childNodes.forEach((cell) => {
        cell.innerHTML = '';
        cell.className = 'field-cell';
      });
    });
  }

  resetScore() {
    this.score = 0;
    this.SCORE_NODE.innerHTML = '0';
  }

  checkGameOver() {
    const allCellsFilled = () => {
      let result = true;

      this.board.forEach((row) => {
        if (row.find((cell) => cell === 0) !== undefined) {
          result = false;
        }
      });

      return result;
    };

    if (allCellsFilled()) {
      this.LOSE_MESSAGE_NODE.classList.remove('hidden');
    }
  }
  checkWin() {
    const winCellExists = () => {
      let result = false;

      this.board.forEach((row) => {
        if (row.find((cell) => cell === 2048) !== undefined) {
          result = true;
        }
      });

      return result;
    };

    if (winCellExists()) {
      document.querySelector('.message-win').classList.remove('hidden');
    }
  }

  scoreChangeColor() {
    this.SCORE_NODE.style = 'color: #FF7F50';

    setTimeout(() => {
      this.SCORE_NODE.style = '';
    }, 400);
  }
}
module.exports = Game;
