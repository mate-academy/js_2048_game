export default class Game {
  constructor(initialState) {
    const emptyState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : emptyState.map((row) => [...row]);

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
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
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.applyMove((row) => row);
  }

  moveRight() {
    this.applyMove((row) => [...row].reverse());
  }

  moveUp() {
    this.transpose();
    this.applyMove((row) => row);
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.applyMove((row) => [...row].reverse());
    this.transpose();
  }

  applyMove(prepareRow) {
    if (this.status !== 'playing') {
      return;
    }

    const prev = JSON.stringify(this.state);
    let gained = 0;

    this.state = this.state.map((row) => {
      const prepared = prepareRow([...row]);
      const { newRow, score } = this.mergeRow(prepared);

      gained += score;

      return prepareRow(newRow);
    });

    if (JSON.stringify(this.state) !== prev) {
      this.score += gained;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  mergeRow(row) {
    const filtered = row.filter(Boolean);
    const result = [];
    let score = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        score += merged;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return { newRow: result, score };
  }

  addRandomTile() {
    const empty = [];

    // eslint-disable-next-line no-shadow
    for (let r = 0; r < 4; r++) {
      // eslint-disable-next-line no-shadow
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];

    this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose() {
    const res = [];

    for (let c = 0; c < 4; c++) {
      res[c] = [];

      for (let r = 0; r < 4; r++) {
        res[c][r] = this.state[r][c];
      }
    }

    this.state = res;
  }

  updateStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  hasMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const v = this.state[r][c];

        if (v === 0) {
          return true;
        }

        if (c < 3 && v === this.state[r][c + 1]) {
          return true;
        }

        if (r < 3 && v === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}
