// src/modules/Game.class.js
export class Game {
  constructor(initialState) {
    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';

    // sprawdź od razu, czy gra nie jest od razu wygrana lub przegrana
    this.updateStatus();
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.score = 0;

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((val, colIndex) => {
        if (val === 0) {
          emptyCells.push({ r: rowIndex, c: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  slideAndMerge(row) {
    const filtered = row.filter((val) => val !== 0);
    const result = [];
    let i = 0;

    while (i < filtered.length) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        this.score += merged;
        i += 2; // SKIP the next tile after merge
      } else {
        result.push(filtered[i]);
        i += 1;
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  moveLeft() {
    const beforeMove = JSON.stringify(this.state);

    const newState = this.state.map((row) => this.slideAndMerge(row));

    const afterMove = JSON.stringify(newState);

    if (beforeMove !== afterMove) {
      this.state = newState;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    const beforeMove = JSON.stringify(this.state);

    const merged = this.state.map((row) => {
      return this.slideAndMerge([...row].reverse()).reverse();
    });
    const newState = merged;

    const afterMove = JSON.stringify(newState);

    if (beforeMove !== afterMove) {
      this.state = newState;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    const beforeMove = JSON.stringify(this.state);

    const transposed = this.transpose(this.state);
    const merged = transposed.map((row) => this.slideAndMerge(row));
    const newState = this.transpose(merged);

    const afterMove = JSON.stringify(newState);

    if (beforeMove !== afterMove) {
      this.state = newState;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    const beforeMove = JSON.stringify(this.state);

    let newState = this.transpose(this.state).map((row) => {
      return this.slideAndMerge([...row].reverse()).reverse();
    });

    newState = this.transpose(newState);

    const afterMove = JSON.stringify(newState);

    if (beforeMove !== afterMove) {
      this.state = newState;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  transpose(matrix) {
    return matrix[0].map((_, c) => matrix.map((row) => row[c]));
  }

  updateStatus() {
    // sprawdź, czy ktoś wygrał
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'won';

        return;
      }
    }

    // sprawdź, czy są możliwe ruchy
    if (!this.hasMoves()) {
      this.status = 'over';

      return;
    }

    // w przeciwnym wypadku gra trwa
    this.status = 'playing';
  }

  // sprawdza, czy są możliwe ruchy
  hasMoves() {
    // pusta komórka?
    for (const row of this.state) {
      if (row.includes(0)) {
        return true;
      }
    }

    // czy sąsiednie komórki można scalić w poziomie?
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.state[r][c] === this.state[r][c + 1]) {
          return true;
        }
      }
    }

    // czy sąsiednie komórki można scalić w pionie?
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        if (this.state[r][c] === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false; // brak możliwych ruchów
  }
}
