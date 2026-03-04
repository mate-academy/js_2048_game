'use strict';

const buttonStart = document.querySelector('button.start');
const scoreEl = document.querySelector('.game-score');
const winText = document.querySelector('.message-win');
const loseText = document.querySelector('.message-lose');
const startText = document.querySelector('.message-start');

class Game {
  constructor(initialState) {
    this.board = initialState
      ? initialState.map((row) => [...row])
      : [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    this.score = 0;
    this.status = 'idle';
    this.firstMove = false;

    buttonStart.addEventListener('click', () => {
      if (!this.firstMove) {
        this.start();
      } else {
        this.restart();
      }
    });

    this.getAllListenerKeydown();
  }

  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'playing';
    this.firstMove = false;
    this.score = 0;
    this.hideAllMessages();
    this.addRandomTile();
    this.addRandomTile();
    this.render();
    this.getScore();
    this.updateMainButton();
  }

  hideAllMessages() {
    winText.classList.add('hidden');
    loseText.classList.add('hidden');
    startText.classList.add('hidden');
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((rowEL, indexRow) => {
      rowEL.forEach((cell, indexCell) => {
        if (cell === 0) {
          emptyCells.push({ row: indexRow, col: indexCell });
        }
      });
    });

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const row = emptyCells[randomIndex].row;
    const col = emptyCells[randomIndex].col;

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  render() {
    const rows = document.querySelectorAll('.field-row');

    rows.forEach((rowEl, rowIndex) => {
      const cells = rowEl.querySelectorAll('.field-cell');

      cells.forEach((cellEl, colIndex) => {
        const value = this.board[rowIndex][colIndex];

        cellEl.textContent = value === 0 ? '' : String(value);

        cellEl.classList.forEach((cls) => {
          if (cls.startsWith('field-cell--')) {
            cellEl.classList.remove(cls);
          }
        });

        if (value !== 0) {
          cellEl.classList.add(`field-cell--${value}`);
        }
      });
    });

    this.checkedWin();

  }

  checkedWin() {
    let has2048 = false;

    this.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 2048) {
          has2048 = true;
        }
      });
    });

    if (has2048) {
      this.status = 'win';
      this.showWinMessage();
    }
  }

  showWinMessage() {
    loseText.classList.add('hidden');
    winText.classList.remove('hidden');
    startText.classList.add('hidden');
    this.updateMainButton();
  }

  getScore() {
    scoreEl.textContent = this.score;
  }

  getAllListenerKeydown() {
    document.addEventListener('keydown', (e) => {
      if (this.status !== 'playing') {
        return;
      }

      const prevBoard = this.board.map((row) => [...row]);

      if (e.code === 'ArrowLeft') {
        this.moveLeft();
      }

      if (e.code === 'ArrowRight') {
        this.moveRight();
      }

      if (e.code === 'ArrowUp') {
        this.moveUp();
      }

      if (e.code === 'ArrowDown') {
        this.moveDown();
      }

      const changedBoard = 
        JSON.stringify(prevBoard) !== JSON.stringify(this.board);

      if (!changedBoard) {
        return;
      }

      this.addRandomTile();
      this.render();
      this.getScore();

      if (this.status !== 'win' && this.getGameOver()) {
        this.status = 'lose';
        this.showLoseMessage();
      };

      this.updateMainButton();
    });
  }

  moveLeft() {
    const newBoard = [];

    this.board.forEach((row) => {
      const dataFromKeydown = this.getDataFromKeydown(row, false);

      newBoard.push(dataFromKeydown);
    });
    this.board = newBoard;
  }

  moveRight() {
    const newBoard = [];

    this.board.forEach((row) => {
      const dataFromKeydown = this.getDataFromKeydown(row, true);

      newBoard.push(dataFromKeydown);
    });
    this.board = newBoard;
  }

  moveUp() {
    const newBoard = [];

    for (let i = 0; i < 4; i++) {
      newBoard.push([0, 0, 0, 0]);
    }

    for (let col = 0; col < 4; col++) {
      const columns = [];

      for (let row = 0; row < 4; row++) {
        columns.push(this.board[row][col]);
      }

      const dataFromKeydown = this.getDataFromKeydown(columns, false);

      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = dataFromKeydown[row];
      }
    }
    this.board = newBoard;
  }

  moveDown() {
    const newBoard = [];

    for (let i = 0; i < 4; i++) {
      newBoard.push([0, 0, 0, 0]);
    }

    for (let col = 0; col < 4; col++) {
      const columns = [];

      for (let row = 0; row < 4; row++) {
        columns.push(this.board[row][col]);
      }

      const dataFromKeydown = this.getDataFromKeydown(columns, true);

      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = dataFromKeydown[row];
      }
    }
    this.board = newBoard;
  }

  getDataFromKeydown(line, reverse = false) {
    const currentLine = [...line];

    if (reverse) {
      currentLine.reverse();
    }

    const filteredNum = currentLine.filter((el) => el !== 0);

    for (let i = 0; i < filteredNum.length - 1; i++) {
      if (filteredNum[i] === filteredNum[i + 1]) {
        filteredNum[i] *= 2;
        this.score += filteredNum[i];
        filteredNum.splice(i + 1, 1);
      }
    }

    while (filteredNum.length < 4) {
      filteredNum.push(0);
    }

    return reverse ? filteredNum.reverse() : filteredNum;
  }

  getGameOver() {
    let hasZero = false;
    let hasMerge = false;

    this.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 0) {
          hasZero = true;
        }
      });
    });

    if (hasZero) {
      return false;
    }

    this.board.forEach((row) => {
      row.forEach((cell, indCell) => {
        if (indCell < 3 && cell === row[indCell + 1]) {
          hasMerge = true;
        }
      });
    });

    if (hasMerge) {
      return false;
    }

    this.board.forEach((row, indRow) => {
      row.forEach((cell, indCell) => {
        if (indRow < 3 && cell === this.board[indRow + 1][indCell]) {
          hasMerge = true;
        }
      });
    });

    return !hasMerge;
  }

  showLoseMessage() {
    loseText.classList.remove('hidden');
    winText.classList.add('hidden');
    startText.classList.add('hidden');
  }

  getState() {
    return {
      board: this.board.map((row) => [...row]),
      score: this.score,
      status: this.status,
    };
  }

  getStatus() {
    return this.status;
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.firstMove = false;
    this.hideAllMessages();
    startText.classList.remove('hidden');
    this.render();
    this.getScore();
    this.updateMainButton();
  }

  updateMainButton() {
    const isRestartMode = this.status !== 'idle';

    buttonStart.classList.toggle('start', !isRestartMode);
    buttonStart.classList.toggle('restart', isRestartMode);

    buttonStart.textContent = isRestartMode ? 'Restart' : 'Start';
  }
}

export default Game;
