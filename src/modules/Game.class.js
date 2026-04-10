class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.messages = [...document.querySelectorAll('.message')];
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let i = 0; i < this.state.length; i++) {
      const merged = this.mergeLine([...this.state[i]]);

      if (merged.toString() !== this.state[i].toString()) {
        this.moved = true;
      }

      this.state[i] = merged;
    }

    this.afterMove();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let i = 0; i < this.state.length; i++) {
      const merged = this.mergeLine([...this.state[i]].reverse()).reverse();

      if (merged.toString() !== this.state[i].toString()) {
        this.moved = true;
      }

      this.state[i] = merged;
    }

    this.afterMove();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let col = 0; col < 4; col++) {
      const column = this.state.map((row) => row[col]);
      const merged = this.mergeLine(column);

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== merged[row]) {
          this.state[row][col] = merged[row];
          this.moved = true;
        }
      }
    }

    this.afterMove();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let col = 0; col < 4; col++) {
      const column = this.state.map((row) => row[col]);
      const merged = this.mergeLine([...column].reverse()).reverse();

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== merged[row]) {
          this.state[row][col] = merged[row];
          this.moved = true;
        }
      }
    }

    this.afterMove();
  }

  mergeLine(line) {
    let result = line.filter((val) => val !== 0);

    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] === result[i + 1]) {
        result[i] *= 2;
        this.score += result[i];
        result[i + 1] = 0;
        this.moved = true;
      }
    }

    result = result.filter((val) => val !== 0);

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  afterMove() {
    if (this.moved) {
      this.addRandomTile();
      this.getScore();
      this.updateDOM();
    }
    this.getStatus();
    this.updateButton();
  }

  getScore() {
    this.gameScore = document.querySelector('.game-score');

    if (this.gameScore) {
      this.gameScore.innerHTML = this.score;
    }

    return this.score;
  }

  getState() {
    return this.state;
  }

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
    } else {
      this.restart();
    }
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';

    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].classList.contains('message-start')) {
        this.messages[i].classList.remove('hidden');
      } else {
        this.messages[i].classList.add('hidden');
      }
    }

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
    this.squares = [...document.querySelectorAll('.field-cell')];

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
