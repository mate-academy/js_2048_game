'use strict';

class Game {
  constructor(initialState) {
    const defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : defaultState;

    this.nextId = 1;
    this.tiles = [];

    this.state = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.initialState[r][c] !== 0) {
          const tile = {
            id: this.nextId++,
            value: this.initialState[r][c],
            r,
            c,
          };

          this.state[r][c] = tile;
          this.tiles.push(tile);
        }
      }
    }

    this.score = 0;
    this.status = 'idle';
  }

  getScore() {
    return this.score;
  }

  getTiles() {
    return this.tiles;
  }

  getState() {
    const arr = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const tile = this.state[r][c];

        if (tile) {
          arr[r][c] = tile.value;
        }
      }
    }

    return arr;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
    this.checkEndGame();
  }

  restart() {
    this.nextId = 1;
    this.tiles = [];

    this.state = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.initialState[r][c] !== 0) {
          const tile = {
            id: this.nextId++,
            value: this.initialState[r][c],
            r,
            c,
          };

          this.state[r][c] = tile;
          this.tiles.push(tile);
        }
      }
    }

    this.score = 0;
    this.status = 'idle';
  }

  addRandomCell() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!this.state[r][c]) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      const tile = {
        id: this.nextId++,
        value: Math.random() < 0.9 ? 2 : 4,
        r,
        c,
        isNew: true,
      };

      this.state[r][c] = tile;
      this.tiles.push(tile);
    }
  }

  checkEndGame() {
    let has2048 = false;
    let hasEmpty = false;
    let hasMoves = false;

    const arr = this.getState();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (arr[r][c] >= 2048) {
          has2048 = true;
        }

        if (arr[r][c] === 0) {
          hasEmpty = true;
        }

        if (c < 3 && arr[r][c] === arr[r][c + 1]) {
          hasMoves = true;
        }

        if (r < 3 && arr[r][c] === arr[r + 1][c]) {
          hasMoves = true;
        }
      }
    }

    if (has2048) {
      this.status = 'win';
    } else if (!hasEmpty && !hasMoves) {
      this.status = 'lose';
    }
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    this.tiles.forEach((t) => {
      t.isNew = false;
      t.isMerged = false;
    });

    let moved = false;
    let addedScore = 0;

    for (let i = 0; i < 4; i++) {
      const lineTiles = [];

      const getCoords = (lineIndex, cellIndex) => {
        switch (direction) {
          case 'left':
            return { r: lineIndex, c: cellIndex };
          case 'right':
            return { r: lineIndex, c: 3 - cellIndex };
          case 'up':
            return { r: cellIndex, c: lineIndex };
          case 'down':
            return { r: 3 - cellIndex, c: lineIndex };
          default:
            return { r: 0, c: 0 };
        }
      };

      for (let j = 0; j < 4; j++) {
        const { r, c } = getCoords(i, j);

        if (this.state[r][c] !== null) {
          lineTiles.push(this.state[r][c]);
        }
      }

      const newLine = [];
      let k = 0;

      while (k < lineTiles.length) {
        if (
          k + 1 < lineTiles.length &&
          lineTiles[k].value === lineTiles[k + 1].value
        ) {
          lineTiles[k].value *= 2;
          lineTiles[k].isMerged = true;
          this.tiles = this.tiles.filter((t) => t !== lineTiles[k + 1]);
          newLine.push(lineTiles[k]);
          addedScore += lineTiles[k].value;
          k += 2;
        } else {
          newLine.push(lineTiles[k]);
          k++;
        }
      }

      while (newLine.length < 4) {
        newLine.push(null);
      }

      for (let j = 0; j < 4; j++) {
        const { r, c } = getCoords(i, j);

        const item = newLine[j];

        if (this.state[r][c] !== item) {
          moved = true;
        }

        this.state[r][c] = item;

        if (item) {
          item.r = r;
          item.c = c;
        }
      }
    }

    if (moved) {
      this.score += addedScore;
      this.addRandomCell();
      this.checkEndGame();
    }
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
