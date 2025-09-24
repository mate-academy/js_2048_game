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
    this.gameBoard = document.querySelector('.game-board');
    this.scoreDisplay = document.querySelector('.game-score');
    this.startButton = document.querySelector('.start');
    this.wonMessage = document.querySelector('.message-win');
    this.loseMessage = document.querySelector('.message-lose');
    this.startMessage = document.querySelector('.message-start');

    this.initGame(initialState);
    this.setupEventListeners();
  }

  initGame() {
    this.tiles = new Array(16).fill(null);
    this.score = 0;

    this.moved = false;
    this.merged = new Array(16).fill(false);
    this.firstMove = false;

    this.renderBoard();
    // якщо статус гри playing додаємо рестарт кнопку
  }

  renderBoard() {
    this.gameBoard.innerHTML = '';

    this.tiles.forEach((tile) => {
      const tileElement = document.createElement('div');

      tileElement.classList.add('field-cell');

      if (tile !== null) {
        tileElement.textContent = tile;
        tileElement.classList.add(`field-cell--${tile}`);
      }

      this.gameBoard.appendChild(tileElement);
    });

    this.scoreDisplay.textContent = this.score;
  }

  addRandomTile() {
    const emptyTiles = this.tiles
      .map((tile, index) => (tile === null ? index : null))
      .filter((index) => index !== null);

    if (emptyTiles.length === 0) {
      return;
    }

    const randomIndex =
      emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    this.tiles[randomIndex] = Math.random() < 0.9 ? 2 : 4;
  }

  setupEventListeners() {
    this.startButton.addEventListener('click', () => {
      const gameStatus = this.getStatus();

      if (gameStatus === 'idle') {
        this.start();
      } else {
        this.restart();
      }
    });
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    this.moved = false;

    switch (e.key) {
      case 'ArrowRight':
        this.moved = this.moveRight();
        break;
      case 'ArrowLeft':
        this.moved = this.moveLeft();
        break;
      case 'ArrowDown':
        this.moved = this.moveDown();
        break;
      case 'ArrowUp':
        this.moved = this.moveUp();
        break;
      default:
        break;
    }

    if (this.moved) {
      this.addRandomTile();
      this.renderBoard();
    }

    if (this.moved && !this.firstMove) {
      this.firstMove = true;
      this.startButton.textContent = 'Restart';
      this.startButton.classList.remove('start');
      this.startButton.classList.add('restart');
      this.startMessage.classList.add('hidden');
    }

    const currentStatus = this.getStatus();

    if (currentStatus === 'win') {
      this.wonMessage.classList.remove('hidden');
      this.startMessage.classList.add('hidden');
    } else if (currentStatus === 'lose') {
      this.loseMessage.classList.remove('hidden');
      this.startMessage.classList.add('hidden');
    }

    // if (currentStatus === 'win' || currentStatus === 'lose') {
    //   return;
    // }
  }

  moveLeft() {
    this.moved = false;
    this.merged = new Array(16).fill(false);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const index = this.getIndex(row, col);
        const minPosition = Math.floor(index / 4) * 4;
        let currentPosition = index;

        while (currentPosition > minPosition) {
          if (this.moveTile(currentPosition, currentPosition - 1)) {
            currentPosition--;
          } else {
            break;
          }
        }
      }
    }

    return this.moved;
  }
  moveRight() {
    this.moved = false;
    this.merged = new Array(16).fill(false);

    for (let row = 0; row < 4; row++) {
      for (let col = 3; col >= 0; col--) {
        const index = this.getIndex(row, col);
        const maxPosition = Math.floor(index / 4) * 4 + 3;
        let currentPosition = index;

        while (currentPosition < maxPosition) {
          if (this.moveTile(currentPosition, currentPosition + 1)) {
            currentPosition++;
          } else {
            break;
          }
        }
      }
    }

    return this.moved;
  }
  moveUp() {
    this.moved = false;
    this.merged = new Array(16).fill(false);

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        const index = this.getIndex(row, col);
        const maxPosition = index % 4;
        let currentPosition = index;

        while (currentPosition > maxPosition) {
          if (this.moveTile(currentPosition, currentPosition - 4)) {
            currentPosition -= 4;
          } else {
            break;
          }
        }
      }
    }

    return this.moved;
  }
  moveDown() {
    this.moved = false;
    this.merged = new Array(16).fill(false);

    for (let col = 0; col < 4; col++) {
      for (let row = 3; row >= 0; row--) {
        const index = this.getIndex(row, col);
        const minPosition = 12 + (index % 4);
        let currentPosition = index;

        while (currentPosition < minPosition) {
          if (this.moveTile(currentPosition, currentPosition + 4)) {
            currentPosition += 4;
          } else {
            break;
          }
        }
      }
    }

    return this.moved;
  }

  moveTile = (from, to) => {
    if (this.tiles[to] === null) {
      this.tiles[to] = this.tiles[from];
      this.tiles[from] = null;
      this.moved = true;
    } else if (this.tiles[to] === this.tiles[from] && !this.merged[to]) {
      this.tiles[to] *= 2;
      this.tiles[from] = null;
      this.score += this.tiles[to];
      this.merged[to] = true;
      this.moved = true;
    }

    return this.moved;
  };

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
    const state = [];

    for (let i = 0; i < 4; i++) {
      state.push(this.tiles.slice(i * 4, i * 4 + 4));
    }

    return state;
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
    if (this.tiles.every((tile) => tile === null)) {
      return 'idle';
    }

    if (this.tiles.includes(2048)) {
      return 'win';
    }

    if (this.canMove() === false && !this.tiles.includes(null)) {
      return 'lose';
    }

    if (this.tiles.includes(null)) {
      return 'playing';
    }
  }

  /**
   * Starts the game.
   */

  start() {
    this.addRandomTile();
    this.addRandomTile();

    this.renderBoard();
  }
  /**
   * Resets the game.
   */
  restart() {
    this.initGame();
    this.firstMove = false;
    this.startButton.textContent = 'Start';
    this.startButton.classList.add('start');
    this.startButton.classList.remove('restart');
    this.startMessage.classList.remove('hidden');
    this.renderBoard();
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const index = this.getIndex(row, col);

        if (this.tiles[index] === this.tiles[index + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        const index = this.getIndex(row, col);

        if (this.tiles[index] === this.tiles[index + 4]) {
          return true;
        }
      }
    }

    return false;
  }

  getIndex(row, col) {
    return row * 4 + col;
  }

  // Add your own methods here
}

module.exports = Game;
