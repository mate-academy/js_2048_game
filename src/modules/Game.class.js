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

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    if (this.status === 'idle') {
      return 'idle';
    }

    if (this.hasWinningTile()) {
      this.status = 'win';
      this.showMessage('win');

      return 'win';
    }

    if (!this.canMove()) {
      this.status = 'lose';
      this.showMessage('lose');

      return 'lose';
    }

    this.status = 'playing';

    return 'playing';
  }

  showMessage(type) {
    for (let m = 0; m < this.messages.length; m++) {
      if (this.messages[m].classList.contains(`message-${type}`)) {
        this.messages[m].classList.remove('hidden');
      }
    }
  }

  hiddenMessage(type) {
    for (let m = 0; m < this.messages.length; m++) {
      if (this.messages[m].classList.contains(`message-${type}`)) {
        this.messages[m].classList.add('hidden');
      }
    }
  }

  hasWinningTile() {
    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length; c++) {
        if (this.state[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let i = 0; i < this.state.length; i++) {
      const newRow = this.mergeLine(this.state[i]);

      if (newRow.toString() !== this.state[i].toString()) {
        this.moved = true;
      }

      this.state[i] = newRow;
    }

    if (this.moved) {
      this.updeteAfterMove();
    }

    return this.moved;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let i = 0; i < this.state.length; i++) {
      const reservedRow = [...this.state[i]].reverse();
      const newRow = this.mergeLine(reservedRow).reverse();

      if (newRow.toString() !== this.state[i].toString()) {
        this.moved = true;
      }

      this.state[i] = newRow;
    }

    if (this.moved) {
      this.updeteAfterMove();
    }

    return this.moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let col = 0; col < 4; col++) {
      const columns = [];

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== 0) {
          columns.push(this.state[row][col]);
        }
      }

      const newCol = this.mergeLine(columns);

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newCol[row]) {
          this.state[row][col] = newCol[row];
          this.moved = true;
        }
      }
    }

    if (this.moved) {
      this.updeteAfterMove();
    }

    return this.moved;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.moved = false;

    for (let col = 0; col < 4; col++) {
      const columns = [];

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== 0) {
          columns.push(this.state[row][col]);
        }
      }

      const newCol = this.mergeLine(columns.reverse()).reverse();

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newCol[row]) {
          this.state[row][col] = newCol[row];
          this.moved = true;
        }
      }
    }

    if (this.moved) {
      this.updeteAfterMove();
    }

    return this.moved;
  }

  mergeLine(line) {
    let arr = line.filter((v) => v !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr[i + 1] = 0;
      }
    }

    arr = arr.filter((v) => v !== 0);

    while (arr.length < 4) {
      arr.push(0);
    }

    return arr;
  }

  updeteAfterMove() {
    this.addRandomTile();
    this.getScore();
    this.updateDOM();
    this.getStatus();

    return true;
  }

  start() {
    if (this.status === 'playing') {
      return;
    }

    this.reset();
    this.status = 'playing';

    this.hiddenMessage('start');
    this.addRandomTile();
    this.addRandomTile();

    this.updateDOM();
    this.updateButton();
  }

  restart() {
    this.hiddenMessage('lose');
    this.reset();
  }

  reset() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';

    this.showMessage('start');
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
