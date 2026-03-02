class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    // Начальное поле с фиксированными числами 2, 4, 8 и 16
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.start();
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    return this.move((row) => row);
  }

  moveRight() {
    return this.move((row) => row.reverse());
  }

  moveUp() {
    return this.move((_, i) => this.board.map((row) => row[i]));
  }

  moveDown() {
    return this.move((_, i) => this.board.map((row) => row[i]).reverse());
  }

  move(extract) {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let i = 0; i < 4; i++) {
      const line = extract(this.board[i], i);
      const { result, score, changed } = this.merge(line);

      if (changed) {
        moved = true;
      }
      this.score += score;

      for (let j = 0; j < 4; j++) {
        if (extract === this.moveLeft || extract === this.moveRight) {
          newBoard[i][j] = result[j] || 0;
        } else {
          newBoard[j][i] = result[j] || 0;
        }
      }
    }

    if (!moved) {
      return false;
    }

    this.board = newBoard;
    this.addRandomTile();

    if (this.has2048()) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }

    return true;
  }

  merge(line) {
    const filtered = line.filter((n) => n !== 0);
    let score = 0;
    let changed = false;

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        score += filtered[i];
        filtered[i + 1] = 0;
        changed = true;
      }
    }

    const result = filtered.filter((n) => n !== 0);

    while (result.length < 4) {
      result.push(0);
    }

    if (!changed) {
      changed = result.some((v, i) => v !== line[i]);
    }

    return { result, score, changed };
  }

  addRandomTile() {
    const empty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [x, y] = empty[Math.floor(Math.random() * empty.length)];

    // Добавляем плитку 2 или 4
    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  has2048() {
    return this.board.flat().includes(2048);
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
