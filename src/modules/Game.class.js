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

    // prettier-ignore
    document.addEventListener('keydown', (userEvent) =>
      this.handleKeydown(userEvent));

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

    for (let outerRowIdx = 0; outerRowIdx < 4; outerRowIdx++) {
      for (let innerColIdx = 0; innerColIdx < 4; innerColIdx++) {
        if (this.boardState[outerRowIdx][innerColIdx] === 0) {
          emptySquares.push({ rowIdx: outerRowIdx, colIdx: innerColIdx });
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

  move(direction) {
    if (!this.gameStarted) {
      return;
    }

    let boardChanged = false;

    const isHorizontal = direction === 'left' || direction === 'right';
    const isReverse = direction === 'right' || direction === 'down';

    for (let i = 0; i < 4; i++) {
      const line = isHorizontal
        ? this.boardState[i].slice()
        : this.boardState.map((row) => row[i]);

      if (isReverse) {
        line.reverse();
      }

      const filtered = line.filter((val) => val !== 0);
      const merged = [];

      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j] === filtered[j + 1]) {
          merged.push(filtered[j] * 2);
          this.score += filtered[j] * 2;
          j++;
          boardChanged = true;
        } else {
          merged.push(filtered[j]);
        }
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      if (isReverse) {
        merged.reverse();
      }

      if (isHorizontal) {
        if (!this.arraysAreEqual(this.boardState[i], merged)) {
          this.boardState[i] = merged;
          boardChanged = true;
        }
      } else {
        for (let j = 0; j < 4; j++) {
          if (this.boardState[j][i] !== merged[j]) {
            this.boardState[j][i] = merged[j];
            boardChanged = true;
          }
        }
      }
    }

    if (boardChanged) {
      this.updateBoard();
      this.generate();
    }

    this.getStatus();
  }

  arraysAreEqual(arr1, arr2) {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    );
  }

  moveLeft() {
    this.move('left');
  }
  moveRight() {
    this.move('right');
  }
  moveUp() {
    this.move('up');
  }
  moveDown() {
    this.move('down');
  }
}

module.exports = Game;
