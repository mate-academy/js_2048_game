export class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
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
    this.move((row) => this.mergeLine(row));
  }

  moveRight() {
    this.move((row) => {
      const result = this.mergeLine(row.reverse());

      return {
        line: result.line.reverse(),
        gainedScore: result.gainedScore,
      };
    });
  }

  moveUp() {
    this.moveColumns((column) => this.mergeLine(column));
  }

  moveDown() {
    this.moveColumns((column) => {
      const result = this.mergeLine(column.reverse());

      return {
        line: result.line.reverse(),
        gainedScore: result.gainedScore,
      };
    });
  }

  mergeLine(line) {
    const filtered = line.filter((value) => value !== 0);
    const result = [];
    let gainedScore = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        gainedScore += merged;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return {
      line: result,
      gainedScore,
    };
  }

  move(transform) {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);
    let gainedScore = 0;

    this.state = this.state.map((row) => {
      const result = transform([...row]);

      gainedScore += result.gainedScore;

      return result.line;
    });

    if (!this.statesEqual(oldState, this.state)) {
      this.score += gainedScore;
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveColumns(transform) {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);
    let gainedScore = 0;

    for (let column = 0; column < 4; column++) {
      const values = this.state.map((row) => row[column]);
      const result = transform([...values]);

      gainedScore += result.gainedScore;

      for (let row = 0; row < 4; row++) {
        this.state[row][column] = result.line[row];
      }
    }

    if (!this.statesEqual(oldState, this.state)) {
      this.score += gainedScore;
      this.addRandomTile();
      this.checkStatus();
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          emptyCells.push({ row, column });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];

    cell.value = Math.random() < 0.9 ? 2 : 4;

    this.state[cell.row][cell.column] = cell.value;
  }

  checkStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (this.hasAvailableMoves()) {
      this.status = 'playing';
    } else {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    // Empty cell means a move is possible
    if (this.state.some((row) => row.includes(0))) {
      return true;
    }

    // Check horizontal neighbours
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 3; column++) {
        if (this.state[row][column] === this.state[row][column + 1]) {
          return true;
        }
      }
    }

    // Check vertical neighbours
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === this.state[row + 1][column]) {
          return true;
        }
      }
    }

    return false;
  }

  statesEqual(first, second) {
    return first.every(
      (row, rowIndex) =>
        row.every(
          (value, columnIndex) => value === second[rowIndex][columnIndex],
        ),
      // eslint-disable-next-line function-paren-newline
    );
  }
}
