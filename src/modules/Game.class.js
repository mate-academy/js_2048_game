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
    this.size = 4;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = this.getStatus();
    this.started = false;
  }

  boardsEqual(b1, b2) {
    for (let row = 0; row < b1.length; row++) {
      for (let col = 0; col < b1[row].length; col++) {
        if (b1[row][col] !== b2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  moveLeft() {
    const previous = this.board.map((row) => [...row]);

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row];

      let filtered = currentRow.filter((n) => n !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
        }
      }

      filtered = filtered.filter((n) => n !== 0);

      while (filtered.length < this.board.length) {
        filtered.push(0);
      }

      this.board[row] = filtered;
    }

    if (!this.boardsEqual(previous, this.board)) {
      this.addRandomBlock();
      this.render();
      this.getScore();
    }
  }

  moveRight() {
    const previous = this.board.map((row) => [...row]);

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row];

      let filtered = currentRow.filter((n) => n !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
        }
      }

      filtered = filtered.filter((n) => n !== 0);

      while (filtered.length < this.board.length) {
        filtered.unshift(0);
      }

      this.board[row] = filtered;
    }

    if (!this.boardsEqual(previous, this.board)) {
      this.addRandomBlock();
      this.render();
      this.getScore();
    }
  }
  moveUp() {
    const previous = this.board.map((row) => [...row]);
    const colamns = [];

    while (colamns.length < this.board.length) {
      colamns.push([]);
    }

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        colamns[c].push(this.board[r][c]);
      }
    }

    for (let col = 0; col < colamns.length; col++) {
      if (colamns[col].some((n) => n > 0)) {
        const column = colamns[col];

        let filtered = column.filter((n) => n !== 0);

        for (let i = 0; i < filtered.length; i++) {
          if (filtered[i] === filtered[i + 1]) {
            filtered[i] *= 2;
            this.score += filtered[i];
            filtered[i + 1] = 0;
          }
        }

        filtered = filtered.filter((n) => n !== 0);

        while (filtered.length < this.board.length) {
          filtered.push(0);
        }

        for (let i = 0; i < this.board.length; i++) {
          this.board[i][col] = filtered[i];
        }
      }
    }

    if (!this.boardsEqual(previous, this.board)) {
      this.addRandomBlock();
      this.render();
      this.getScore();
    }
  }
  moveDown() {
    const previous = this.board.map((row) => [...row]);

    const colamns = [];

    while (colamns.length < this.board.length) {
      colamns.push([]);
    }

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        colamns[c].push(this.board[r][c]);
      }
    }

    for (let col = 0; col < colamns.length; col++) {
      if (colamns[col].some((n) => n > 0)) {
        const column = colamns[col];

        let filtered = column.filter((n) => n !== 0);

        for (let i = 0; i < filtered.length; i++) {
          if (filtered[i] === filtered[i + 1]) {
            filtered[i] *= 2;
            this.score += filtered[i];
            filtered[i + 1] = 0;
          }
        }

        filtered = filtered.filter((n) => n !== 0);

        while (filtered.length < this.board.length) {
          filtered.unshift(0);
        }

        for (let i = 0; i < this.board.length; i++) {
          this.board[i][col] = filtered[i];
        }
      }
    }

    if (!this.boardsEqual(previous, this.board)) {
      this.addRandomBlock();
      this.render();
      this.getScore();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    const score = document.querySelector('.game-score');

    score.textContent = '';

    score.textContent = this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
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
    if (!this.started) {
      return 'idle';
    }

    for (const row of this.board) {
      if (row.some((n) => n === 2048)) {
        return 'win';
      }
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          return 'playing';
        }
      }
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length - 1; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return 'playing';
        }
      }
    }

    for (let row = 0; row < this.board.length - 1; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return 'playing';
        }
      }
    }

    return 'lose';
  }

  /**
   * Starts the game.
   */
  start() {
    this.addRandomBlock();
    this.addRandomBlock();
    this.render();
    this.started = true;
  }

  addRandomBlock() {
    const emptyCells = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  render() {
    const table = document.querySelector('table');
    const tableBody = table.querySelector('tbody');

    tableBody.innerHTML = '';

    for (let tr = 0; tr < this.board.length; tr++) {
      const newTr = document.createElement('tr');

      newTr.classList.add('field-row');

      for (let td = 0; td < this.board.length; td++) {
        const newTd = document.createElement('td');

        newTd.classList.add('field-cell');
        newTr.appendChild(newTd);
      }

      tableBody.appendChild(newTr);
    }

    const trArr = Array.from(tableBody.querySelectorAll('tr'));

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] > 0) {
          const cell = trArr[row].children[col];

          const block = document.createElement('div');

          block.textContent = `${this.board[row][col]}`;

          block.classList.add(
            'field-cell',
            `field-cell--${this.board[row][col]}`,
            'field-cell--appear',
          );

          cell.appendChild(block);

          cell.addEventListener(
            'animationend',
            () => {
              block.classList.remove('field-cell--appear');
            },
            { once: true },
          );
        }
      }
    }

    const score = document.querySelector('.game-score');

    score.textContent = '';
    score.textContent = this.score;

    const winMessage = document.querySelector('.message-win');
    const loseMessage = document.querySelector('.message-lose');
    const startMessage = document.querySelector('.message-start');

    if (this.getStatus() === 'win') {
      winMessage.classList.remove('hidden');

      if (!startMessage.classList.contains('hidden')) {
        startMessage.classList.add('hidden');
      }
    }

    if (this.getStatus() === 'lose') {
      loseMessage.classList.remove('hidden');

      if (!startMessage.classList.contains('hidden')) {
        startMessage.classList.add('hidden');
      }
    }

    if (this.getStatus() === 'idle') {
      startMessage.classList.remove('hidden');

      if (!loseMessage.classList.contains('hidden')) {
        loseMessage.classList.add('hidden');
      }

      if (!winMessage.classList.contains('hidden')) {
        winMessage.classList.add('hidden');
      }
    }
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
    this.started = false;

    this.render();
  }

  // Add your own methods here
}

module.exports = Game;
