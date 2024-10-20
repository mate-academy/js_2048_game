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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = initialState;
    this.score = 0;
    this.status = 'idle';
    this.moved = false;
    this.gameScore = document.querySelector('.game-score');
    this.squares = [...document.querySelectorAll('.field-cell')];
    this.messages = [...document.querySelectorAll('.message')];
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let i = 0; i < this.state.length; i++) {
      let row = this.state[i];

      row = row.filter((val) => val !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
          this.moved = true;
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      if (row.toString() !== this.state[i].toString()) {
        this.moved = true;
      }

      this.state[i] = row;
    }

    if (this.moved) {
      this.addRandomTile();
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let i = 0; i < this.state.length; i++) {
      let row = this.state[i];

      row = row.filter((val) => val !== 0);
      row.reverse();

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
          this.moved = true;
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      row.reverse();

      if (row.toString() !== this.state[i].toString()) {
        this.moved = true;
      }

      this.state[i] = row;
    }

    if (this.moved) {
      this.addRandomTile();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== 0) {
          column.push(this.state[row][col]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
          this.moved = true;
        }
      }

      column = column.filter((val) => val !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== column[row]) {
          this.state[row][col] = column[row];
          this.moved = true;
        }
      }
    }

    if (this.moved) {
      this.addRandomTile();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== 0) {
          column.push(this.state[row][col]);
        }
      }

      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i - 1] = 0;
          this.moved = true;
        }
      }

      column = column.filter((val) => val !== 0);

      while (column.length < 4) {
        column.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== column[row]) {
          this.state[row][col] = column[row];
          this.moved = true;
        }
      }
    }

    if (this.moved) {
      this.addRandomTile();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    // Оновлюємо DOM тільки якщо gameScore присутній
    if (this.gameScore) {
      this.gameScore.innerHTML = this.score;
    }

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
    if (this.status === 'idle') {
      return 'idle';
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
          this.status = 'win';

          for (let k = 0; k < this.messages.length; k++) {
            if (this.messages[k].classList.contains('message-win')) {
              this.messages[k].classList.remove('hidden');
            }
          }

          return 'win';
        }
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';

      for (let k = 0; k < this.messages.length; k++) {
        if (this.messages[k].classList.contains('message-lose')) {
          this.messages[k].classList.remove('hidden');
        }
      }

      return 'lose';
    }

    this.status = 'playing';

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status === 'idle') {
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].classList.contains('message-start')) {
          this.messages[i].classList.add('hidden');
        }
      }

      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
      this.updateDOM();
      this.updateButton();
    } else if (this.status === 'playing') {
      this.restart();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
    this.getScore();
    this.updateDOM();
    this.updateButton();
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyTiles.push([i, j]);
        }
      }
    }

    if (emptyTiles.length > 0) {
      const [row, col] =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  updateDOM() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        const index = i * 4 + j;

        if (this.squares[index]) {
          this.squares[index].textContent =
            this.state[i][j] === 0 ? '' : this.state[i][j];
          this.addColors();
        }
      }
    }
  }

  canMove() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.state[i][j] === this.state[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.state[i][j] === this.state[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  addColors() {
    for (let i = 0; i < this.squares.length; i++) {
      const value = parseInt(this.squares[i].textContent);

      this.squares[i].className = 'field-cell';

      if (value) {
        this.squares[i].classList.add(`field-cell--${value}`);
      }
    }
  }

  updateButton() {
    const mainButton = document.querySelector('button');

    if (mainButton) {
      if (this.status === 'idle') {
        mainButton.classList.remove('restart');
        mainButton.classList.add('start');
        mainButton.textContent = 'Start';
      } else if (
        this.status === 'playing' ||
        this.status === 'win' ||
        this.status === 'lose'
      ) {
        mainButton.classList.remove('start');
        mainButton.classList.add('restart');
        mainButton.textContent = 'Restart';
      }
    }
  }
}

module.exports = Game;
