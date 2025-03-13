'use strict';

class Game {
  constructor(initialState) {
    this.gameBoard = document.querySelector('.game-field');
    this.scoreDisplay = document.querySelector('.game-score');
    this.messageContainer = document.querySelector('.message-container');
    this.messageLose = document.querySelector('.message-lose');
    this.messageWin = document.querySelector('.message-win');
    this.messageStart = document.querySelector('.message-start');
    this.startButton = document.querySelector('.start');
    this.restartButton = document.querySelector('.restart');

    this.squares = [];
    this.score = 0;
    this.status = '';
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.gameStarted = false;
    this.restart();

    const defaultState = Array.from({ length: 4 }, () => Array(4).fill(0));

    this.boardState = Array.isArray(initialState) ? initialState : defaultState;

    this.createGameBoard();

    document.addEventListener('keydown', (userEvent) =>
      this.handleKeydown(userEvent),);

    this.addTouchEvents();
    this.getState();
    this.getScore();
    this.getStatus();

    this.restartButton.addEventListener('click', () => this.restart());

    this.startButton.addEventListener('click', () => {
      this.start();
    });
  }

  createGameBoard() {
    this.gameBoard.innerHTML = '';

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      const rowElement = document.createElement('div');

      rowElement.classList.add('field-row');

      for (let colIdx = 0; colIdx < 4; colIdx++) {
        const square = document.createElement('div');

        square.classList.add('field-cell');
        rowElement.appendChild(square);
        this.squares.push(square);
      }

      this.gameBoard.appendChild(rowElement);
    }
  }

  updateBoard() {
    this.squares.forEach((square, index) => {
      const rowIdx = Math.floor(index / 4);
      const colIdx = index % 4;
      const value = this.boardState[rowIdx][colIdx];

      square.textContent = value || '';
      square.className = 'field-cell';

      if (value) {
        const className =
          value > 2048 ? 'field-cell--super' : `field-cell--${value}`;

        square.classList.add(className);
      }
    });

    this.scoreDisplay.textContent = this.score;
  }

  start() {
    this.gameStarted = true;
    this.boardState = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.generate();
    this.generate();
    this.updateBoard();

    this.messageStart.classList.add('hidden');
    this.startButton.classList.add('hidden');
    this.restartButton.classList.remove('hidden');
  }

  restart() {
    this.gameStarted = false;
    this.boardState = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = '';
    this.generate();
    this.generate();
    this.updateBoard();

    this.restartButton.classList.add('hidden');
    this.startButton.classList.remove('hidden');
    this.messageStart.classList.remove('hidden');

    this.messageLose.classList.add('hidden');
    this.messageWin.classList.add('hidden');
  }

  getState() {
    return this.boardState.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  generate() {
    if (!this.gameStarted) {
      return;
    }

    const emptySquares = [];

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      for (let colIdx = 0; colIdx < 4; colIdx++) {
        if (this.boardState[rowIdx][colIdx] === 0) {
          emptySquares.push({ rowIdx, colIdx });
        }
      }
    }

    if (emptySquares.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    const { rowIdx, colIdx } = emptySquares[randomIndex];

    const randomValue = Math.random() < 0.9 ? 2 : 4;

    this.boardState[rowIdx][colIdx] = randomValue;

    this.updateBoard();
  }

  addTouchEvents() {
    this.gameBoard.addEventListener('touchstart', (e) => {
      const touchStart = e.touches[0];

      this.touchStartX = touchStart.pageX;
      this.touchStartY = touchStart.pageY;
    });

    this.gameBoard.addEventListener('touchend', (e) => {
      const touchEnd = e.changedTouches[0];
      const deltaX = touchEnd.pageX - this.touchStartX;
      const deltaY = touchEnd.pageY - this.touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          this.moveRight();
        } else {
          this.moveLeft();
        }
      } else {
        if (deltaY > 0) {
          this.moveDown();
        } else {
          this.moveUp();
        }
      }

      this.generate();
      this.result();
    });
  }

  handleKeydown(userEvent) {
    switch (userEvent.key) {
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
    }

    this.result();
  }

  getStatus() {
    if (this.boardState.some((row) => row.includes(2048))) {
      this.status = 'won';
    } else if (this.boardState.some((row) => row.includes(0))) {
      this.status = 'playing';
    } else {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const cell = this.boardState[i][j];

          if (
            (i > 0 && cell === this.boardState[i - 1][j]) ||
            (i < 3 && cell === this.boardState[i + 1][j]) ||
            (j > 0 && cell === this.boardState[i][j - 1]) ||
            (j < 3 && cell === this.boardState[i][j + 1])
          ) {
            this.status = 'playing';

            return 'playing';
          }
        }
      }
      this.status = 'lost';
    }

    this.result();

    return this.status;
  }

  result() {
    this.messageLose.classList.add('hidden');
    this.messageWin.classList.add('hidden');

    if (this.status === 'lost') {
      this.messageLose.classList.remove('hidden');
    } else if (this.status === 'won') {
      this.messageWin.classList.remove('hidden');
    }
  }

  moveLeft() {
    if (!this.gameStarted) {
      return;
    }

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      const newRow = this.boardState[rowIdx].filter((val) => val !== 0);
      const mergedRow = [];

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      this.boardState[rowIdx] = mergedRow;
    }

    this.updateBoard();
    this.generate();
    this.getStatus();
  }

  moveRight() {
    if (!this.gameStarted) {
      return;
    }

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      const newRow = this.boardState[rowIdx].filter((val) => val !== 0);
      const mergedRow = [];

      newRow.reverse();

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      this.boardState[rowIdx] = mergedRow.reverse();
    }

    this.updateBoard();
    this.generate();
    this.getStatus();
  }

  moveUp() {
    if (!this.gameStarted) {
      return;
    }

    for (let colIdx = 0; colIdx < 4; colIdx++) {
      const newColumn = [];

      for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
        if (this.boardState[rowIdx][colIdx] !== 0) {
          newColumn.push(this.boardState[rowIdx][colIdx]);
        }
      }

      const mergedColumn = [];

      for (let i = 0; i < newColumn.length; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          mergedColumn.push(newColumn[i] * 2);
          this.score += newColumn[i] * 2;
          i++;
        } else {
          mergedColumn.push(newColumn[i]);
        }
      }

      while (mergedColumn.length < 4) {
        mergedColumn.push(0);
      }

      for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
        this.boardState[rowIdx][colIdx] = mergedColumn[rowIdx];
      }
    }

    this.updateBoard();
    this.generate();
    this.getStatus();
  }

  moveDown() {
    if (!this.gameStarted) {
      return;
    }

    for (let colIdx = 0; colIdx < 4; colIdx++) {
      const newColumn = [];

      for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
        if (this.boardState[rowIdx][colIdx] !== 0) {
          newColumn.push(this.boardState[rowIdx][colIdx]);
        }
      }

      const mergedColumn = [];

      newColumn.reverse();

      for (let i = 0; i < newColumn.length; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          mergedColumn.push(newColumn[i] * 2);
          this.score += newColumn[i] * 2;
          i++;
        } else {
          mergedColumn.push(newColumn[i]);
        }
      }

      while (mergedColumn.length < 4) {
        mergedColumn.push(0);
      }

      mergedColumn.reverse();

      for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
        this.boardState[rowIdx][colIdx] = mergedColumn[rowIdx];
      }
    }

    this.updateBoard();
    this.generate();
    this.getStatus();
  }
}

module.exports = Game;
