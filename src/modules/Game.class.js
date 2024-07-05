'use strict';
class Game {
  constructor() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.ROWS_NODE = [...document.querySelectorAll('.field-row')];
    this.LOSE_MESSAGE_NODE = document.querySelector('.message-lose');
    this.WIN_MESSAGE_NODE = document.querySelector('.message-win');
    this.SCORE_NODE = document.querySelector('.game-score');

    this.gameActive = true;
    this.remove = false;
  }

  moveCells() {
    let x = null;
    let y = null;

    document.addEventListener('touchstart', (e) => {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
      if (!x || !y) {
        return;
      }

      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;

      const xDiff = clientX - x;
      const yDiff = clientY - y;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff < 0) {
          horizontalMove('left');
        } else {
          horizontalMove('right');
        }
      } else {
        if (yDiff < 0) {
          verticalMove('up');
        } else {
          verticalMove('down');
        }
      }

      x = null; // reset
      y = null; // reset
    });

    // move handler, checks whether anything has changed so we can make the move
    const hasAnythingChanged = (changedBoard) => {
      if (!this.arraysEqual(this.board, changedBoard)) {
        this.board = changedBoard;
        this.updateBoard();
        this.getScore();
        this.placeRandomTile();
        this.checkGameOver();
        this.checkWin();
      }
    };

    const horizontalMove = (direction) => {
      const newBoard = [];

      this.board.forEach((row) => {
        let newRow = row.filter((cell) => cell !== 0);

        if (direction === 'right') {
          newRow = newRow.reverse();
        }

        for (let i = 0; i < newRow.length - 1; i++) {
          if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            newRow[i + 1] = 0;
            this.score += newRow[i];
            this.scoreChangeColor();
          }
        }

        newRow = newRow.filter((cell) => cell !== 0);

        while (newRow.length < 4) {
          newRow.push(0);
        }

        if (direction === 'right') {
          newRow = newRow.reverse();
        }

        newBoard.push(newRow);
      });

      hasAnythingChanged(newBoard);
    };

    const verticalMove = (direction) => {
      const newBoard = [[], [], [], []];
      const resultBoard = [[], [], [], []];

      for (let cell = 0; cell < this.board.length; cell++) {
        for (let col = 0; col < this.board.length; col++) {
          if (this.board[col][cell] !== 0) {
            newBoard[cell].push(this.board[col][cell]);
          }
        }
      }

      for (let col = 0; col < newBoard.length; col++) {
        if (direction === 'up') {
          for (let cell = 0; cell < newBoard[col].length; cell++) {
            if (newBoard[col][cell] === newBoard[col][cell + 1]) {
              newBoard[col][cell] *= 2;
              newBoard[col][cell + 1] = 0;
              this.score += newBoard[col][cell];
              this.scoreChangeColor();
            }
          }

          newBoard[col] = newBoard[col].filter((cell) => cell !== 0);

          while (newBoard[col].length < 4) {
            newBoard[col].push(0);
          }
        } else if (direction === 'down') {
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

          newBoard[col] = newBoard[col].filter((cell) => cell !== 0);

          while (newBoard[col].length < 4) {
            newBoard[col].unshift(0);
          }
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
    };

    document.addEventListener('keydown', (e) => {
      if (!this.gameActive) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          verticalMove('up');
          break;

        case 'ArrowDown':
          verticalMove('down');
          break;

        case 'ArrowLeft':
          horizontalMove('left');
          break;

        case 'ArrowRight':
          horizontalMove('right');
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

  getScore() {
    this.SCORE_NODE.innerHTML = `${this.score}`;
  }

  start() {
    this.clickStartButton();
    this.moveCells();
  }

  placeRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (this.board[row][cell] === 0) {
          emptyCells.push({ row, cell });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = Math.floor(Math.random() * emptyCells.length);

      const randomValue = Math.random() <= 0.1 ? 4 : 2;
      const RandomTilePosition = emptyCells[randomCell];
      const { row, cell } = RandomTilePosition;

      this.board[row][cell] = randomValue;

      const changingCell = this.ROWS_NODE[row].children[cell];

      changingCell.classList.add(`field-cell--${randomValue}`);
      changingCell.innerHTML = randomValue.toString();

      changingCell.style = 'color: #FF7F50';

      setTimeout(() => {
        changingCell.style = '';
      }, 400);
    }
  }

  clickStartButton() {
    const START_BUTTON_NODE = document.querySelector('.button');
    const startButtonClickHandler = () => {
      if (!this.remove) {
        this.changeStartNodes();
        this.placeRandomTile();
        this.placeRandomTile();

        this.remove = true;

        return;
      }

      this.changeRestartNodes();
    };

    START_BUTTON_NODE.addEventListener('click', startButtonClickHandler);
  }

  resetBoard() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

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
      this.gameActive = false;

      this.ROWS_NODE.forEach((row) => {
        const cells = [...row.cells];

        cells.forEach((cell) => {
          cell.style = 'color: #FF7F50';

          setTimeout(() => {
            cell.style = '';
          }, 500);
        });
      });

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
      this.gameActive = false;
      this.WIN_MESSAGE_NODE.classList.remove('hidden');
    }
  }

  scoreChangeColor() {
    this.SCORE_NODE.style = 'color: #FF7F50';

    setTimeout(() => {
      this.SCORE_NODE.style = '';
    }, 400);
  }

  changeStartNodes() {
    const START_BUTTON_NODE = document.querySelector('.button.start');
    const START_MESSAGE_NODE = document.querySelector('.message.message-start');

    START_MESSAGE_NODE.innerHTML = 'Your ad can be here';

    START_MESSAGE_NODE.classList.replace('message-start', 'message-restart');
    START_BUTTON_NODE.innerHTML = 'Restart';
    START_BUTTON_NODE.classList.replace('start', 'restart');
    this.WIN_MESSAGE_NODE.classList.toggle('hidden', true);

    this.gameActive = true;
  }

  changeRestartNodes() {
    const RESTART_BUTTON_NODE = document.querySelector('.button.restart');
    const RESTART_MESSAGE_NODE = document.querySelector(
      '.message.message-restart',
    );

    if (RESTART_BUTTON_NODE !== null) {
      this.WIN_MESSAGE_NODE.classList.add('hidden');
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
  }
}

module.exports = Game;
