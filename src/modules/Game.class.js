'use strict';

const startButton = document.querySelector('.start');
const rows = document.querySelectorAll('.field-row');
const cells = document.querySelectorAll('.field-cell');

for (const i of rows) {
  for (const n of i.children) {
    n.classList.add('field-cell--empty');
  }
}

class Game {
  /**
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   */
  status = 'idle';
  score = 0;

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = [...initialState];
  }

  moveLeft() {
    for (let i = 0; i < 4; i++) {
      this.state[i].sort((x, y) => {
        if (x === 0 && y !== 0) {
          return 1;
        }

        if (y === 0 && x !== 0) {
          return -1;
        }

        return 0;
      });

      const newCells = [...rows[i].children].sort((a, b) => {
        if (
          a.classList.contains('field-cell--empty') &&
          !b.classList.contains('field-cell--empty')
        ) {
          return 1;
        }

        if (
          !a.classList.contains('field-cell--empty') &&
          b.classList.contains('field-cell--empty')
        ) {
          return -1;
        }

        return 0;
      });

      rows[i].append(...newCells);
    }

    for (let i = 0; i < 4; i++) {
      for (let n = 0; n < 4; n++) {
        if (
          this.state[i][n] === this.state[i][n + 1] &&
          this.state[i][n] !== 0
        ) {
          this.score += this.state[i][n] * 2;

          rows[i].children[n].classList.replace(
            `field-cell--${this.state[i][n]}`,
            `field-cell--${this.state[i][n] * 2}`,
          );
          rows[i].children[n].innerHTML = `${this.state[i][n] * 2}`;
          this.state[i][n] *= 2;

          rows[i].children[n + 1].classList.replace(
            `field-cell--${this.state[i][n + 1]}`,
            'field-cell--empty',
          );
          rows[i].children[n + 1].innerHTML = '';
          this.state[i][n + 1] = 0;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      this.state[i].sort((x, y) => {
        if (x === 0 && y !== 0) {
          return 1;
        }

        if (y === 0 && x !== 0) {
          return -1;
        }

        return 0;
      });

      const newCells = [...rows[i].children].sort((a, b) => {
        if (
          a.classList.contains('field-cell--empty') &&
          !b.classList.contains('field-cell--empty')
        ) {
          return 1;
        }

        if (
          !a.classList.contains('field-cell--empty') &&
          b.classList.contains('field-cell--empty')
        ) {
          return -1;
        }

        return 0;
      });

      rows[i].append(...newCells);
    }
  }

  moveRight() {
    for (let i = 0; i < 4; i++) {
      this.state[i].sort((y, x) => {
        if (x === 0 && y !== 0) {
          return 1;
        }

        if (y === 0 && x !== 0) {
          return -1;
        }

        return 0;
      });

      const newCells = [...rows[i].children].sort((b, a) => {
        if (
          a.classList.contains('field-cell--empty') &&
          !b.classList.contains('field-cell--empty')
        ) {
          return 1;
        }

        if (
          !a.classList.contains('field-cell--empty') &&
          b.classList.contains('field-cell--empty')
        ) {
          return -1;
        }

        return 0;
      });

      rows[i].append(...newCells);
    }

    for (let i = 0; i < 4; i++) {
      for (let n = 3; n > 0; n--) {
        if (
          this.state[i][n] === this.state[i][n - 1] &&
          this.state[i][n] !== 0
        ) {
          this.score += this.state[i][n] * 2;

          rows[i].children[n].classList.replace(
            `field-cell--${this.state[i][n]}`,
            `field-cell--${this.state[i][n] * 2}`,
          );
          rows[i].children[n].innerHTML = `${this.state[i][n] * 2}`;
          this.state[i][n] *= 2;

          rows[i].children[n - 1].classList.replace(
            `field-cell--${this.state[i][n - 1]}`,
            'field-cell--empty',
          );
          rows[i].children[n - 1].innerHTML = '';
          this.state[i][n - 1] = 0;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      this.state[i].sort((y, x) => {
        if (x === 0 && y !== 0) {
          return 1;
        }

        if (y === 0 && x !== 0) {
          return -1;
        }

        return 0;
      });

      const newCells = [...rows[i].children].sort((b, a) => {
        if (
          a.classList.contains('field-cell--empty') &&
          !b.classList.contains('field-cell--empty')
        ) {
          return 1;
        }

        if (
          !a.classList.contains('field-cell--empty') &&
          b.classList.contains('field-cell--empty')
        ) {
          return -1;
        }

        return 0;
      });

      rows[i].append(...newCells);
    }
  }

  moveUp() {
    let newState = [
      [this.state[0][0], this.state[1][0], this.state[2][0], this.state[3][0]],
      [this.state[0][1], this.state[1][1], this.state[2][1], this.state[3][1]],
      [this.state[0][2], this.state[1][2], this.state[2][2], this.state[3][2]],
      [this.state[0][3], this.state[1][3], this.state[2][3], this.state[3][3]],
    ];

    newState.forEach((a) => {
      a.sort((x, y) => {
        if (x === 0 && y !== 0) {
          return 1;
        }

        if (y === 0 && x !== 0) {
          return -1;
        }

        return 0;
      });
    });

    this.state = [
      [newState[0][0], newState[1][0], newState[2][0], newState[3][0]],
      [newState[0][1], newState[1][1], newState[2][1], newState[3][1]],
      [newState[0][2], newState[1][2], newState[2][2], newState[3][2]],
      [newState[0][3], newState[1][3], newState[2][3], newState[3][3]],
    ];

    let newCells = [
      [
        rows[0].children[0],
        rows[1].children[0],
        rows[2].children[0],
        rows[3].children[0],
      ],
      [
        rows[0].children[1],
        rows[1].children[1],
        rows[2].children[1],
        rows[3].children[1],
      ],
      [
        rows[0].children[2],
        rows[1].children[2],
        rows[2].children[2],
        rows[3].children[2],
      ],
      [
        rows[0].children[3],
        rows[1].children[3],
        rows[2].children[3],
        rows[3].children[3],
      ],
    ];

    newCells.forEach((x) => {
      x.sort((a, b) => {
        if (
          a.classList.contains('field-cell--empty') &&
          !b.classList.contains('field-cell--empty')
        ) {
          return 1;
        }

        if (
          !a.classList.contains('field-cell--empty') &&
          b.classList.contains('field-cell--empty')
        ) {
          return -1;
        }

        return 0;
      });
    });

    rows[0].append(
      newCells[0][0],
      newCells[1][0],
      newCells[2][0],
      newCells[3][0],
    );

    rows[1].append(
      newCells[0][1],
      newCells[1][1],
      newCells[2][1],
      newCells[3][1],
    );

    rows[2].append(
      newCells[0][2],
      newCells[1][2],
      newCells[2][2],
      newCells[3][2],
    );

    rows[3].append(
      newCells[0][3],
      newCells[1][3],
      newCells[2][3],
      newCells[3][3],
    );

    for (let i = 0; i < 4; i++) {
      for (let n = 0; n < 3; n++) {
        if (
          this.state[n][i] === this.state[n + 1][i] &&
          this.state[n][i] !== 0
        ) {
          this.score += this.state[n][i] * 2;

          rows[n].children[i].classList.replace(
            `field-cell--${this.state[n][i]}`,
            `field-cell--${this.state[n][i] * 2}`,
          );
          rows[n].children[i].innerHTML = `${this.state[n][i] * 2}`;
          this.state[n][i] *= 2;

          rows[n + 1].children[i].classList.replace(
            `field-cell--${this.state[n + 1][i]}`,
            'field-cell--empty',
          );
          rows[n + 1].children[i].innerHTML = '';
          this.state[n + 1][i] = 0;
        }
      }
    }

    newState = [
      [this.state[0][0], this.state[1][0], this.state[2][0], this.state[3][0]],
      [this.state[0][1], this.state[1][1], this.state[2][1], this.state[3][1]],
      [this.state[0][2], this.state[1][2], this.state[2][2], this.state[3][2]],
      [this.state[0][3], this.state[1][3], this.state[2][3], this.state[3][3]],
    ];

    newState.forEach((a) => {
      a.sort((x, y) => {
        if (x === 0 && y !== 0) {
          return 1;
        }

        if (y === 0 && x !== 0) {
          return -1;
        }

        return 0;
      });
    });

    this.state = [
      [newState[0][0], newState[1][0], newState[2][0], newState[3][0]],
      [newState[0][1], newState[1][1], newState[2][1], newState[3][1]],
      [newState[0][2], newState[1][2], newState[2][2], newState[3][2]],
      [newState[0][3], newState[1][3], newState[2][3], newState[3][3]],
    ];

    newCells = [
      [
        rows[0].children[0],
        rows[1].children[0],
        rows[2].children[0],
        rows[3].children[0],
      ],
      [
        rows[0].children[1],
        rows[1].children[1],
        rows[2].children[1],
        rows[3].children[1],
      ],
      [
        rows[0].children[2],
        rows[1].children[2],
        rows[2].children[2],
        rows[3].children[2],
      ],
      [
        rows[0].children[3],
        rows[1].children[3],
        rows[2].children[3],
        rows[3].children[3],
      ],
    ];

    newCells.forEach((x) => {
      x.sort((a, b) => {
        if (
          a.classList.contains('field-cell--empty') &&
          !b.classList.contains('field-cell--empty')
        ) {
          return 1;
        }

        if (
          !a.classList.contains('field-cell--empty') &&
          b.classList.contains('field-cell--empty')
        ) {
          return -1;
        }

        return 0;
      });
    });

    rows[0].append(
      newCells[0][0],
      newCells[1][0],
      newCells[2][0],
      newCells[3][0],
    );

    rows[1].append(
      newCells[0][1],
      newCells[1][1],
      newCells[2][1],
      newCells[3][1],
    );

    rows[2].append(
      newCells[0][2],
      newCells[1][2],
      newCells[2][2],
      newCells[3][2],
    );

    rows[3].append(
      newCells[0][3],
      newCells[1][3],
      newCells[2][3],
      newCells[3][3],
    );
  }

  moveDown() {
    let newState = [
      [this.state[0][0], this.state[1][0], this.state[2][0], this.state[3][0]],
      [this.state[0][1], this.state[1][1], this.state[2][1], this.state[3][1]],
      [this.state[0][2], this.state[1][2], this.state[2][2], this.state[3][2]],
      [this.state[0][3], this.state[1][3], this.state[2][3], this.state[3][3]],
    ];

    newState.forEach((a) => {
      a.sort((y, x) => {
        if (x === 0 && y !== 0) {
          return 1;
        }

        if (y === 0 && x !== 0) {
          return -1;
        }

        return 0;
      });
    });

    this.state = [
      [newState[0][0], newState[1][0], newState[2][0], newState[3][0]],
      [newState[0][1], newState[1][1], newState[2][1], newState[3][1]],
      [newState[0][2], newState[1][2], newState[2][2], newState[3][2]],
      [newState[0][3], newState[1][3], newState[2][3], newState[3][3]],
    ];

    let newCells = [
      [
        rows[0].children[0],
        rows[1].children[0],
        rows[2].children[0],
        rows[3].children[0],
      ],
      [
        rows[0].children[1],
        rows[1].children[1],
        rows[2].children[1],
        rows[3].children[1],
      ],
      [
        rows[0].children[2],
        rows[1].children[2],
        rows[2].children[2],
        rows[3].children[2],
      ],
      [
        rows[0].children[3],
        rows[1].children[3],
        rows[2].children[3],
        rows[3].children[3],
      ],
    ];

    newCells.forEach((x) => {
      x.sort((b, a) => {
        if (
          a.classList.contains('field-cell--empty') &&
          !b.classList.contains('field-cell--empty')
        ) {
          return 1;
        }

        if (
          !a.classList.contains('field-cell--empty') &&
          b.classList.contains('field-cell--empty')
        ) {
          return -1;
        }

        return 0;
      });
    });

    rows[0].append(
      newCells[0][0],
      newCells[1][0],
      newCells[2][0],
      newCells[3][0],
    );

    rows[1].append(
      newCells[0][1],
      newCells[1][1],
      newCells[2][1],
      newCells[3][1],
    );

    rows[2].append(
      newCells[0][2],
      newCells[1][2],
      newCells[2][2],
      newCells[3][2],
    );

    rows[3].append(
      newCells[0][3],
      newCells[1][3],
      newCells[2][3],
      newCells[3][3],
    );

    for (let i = 0; i < 4; i++) {
      for (let n = 3; n > 0; n--) {
        if (
          this.state[n][i] === this.state[n - 1][i] &&
          this.state[n][i] !== 0
        ) {
          this.score += this.state[n][i] * 2;

          rows[n].children[i].classList.replace(
            `field-cell--${this.state[n][i]}`,
            `field-cell--${this.state[n][i] * 2}`,
          );
          rows[n].children[i].innerHTML = `${this.state[n][i] * 2}`;
          this.state[n][i] *= 2;

          rows[n - 1].children[i].classList.replace(
            `field-cell--${this.state[n - 1][i]}`,
            'field-cell--empty',
          );
          rows[n - 1].children[i].innerHTML = '';
          this.state[n - 1][i] = 0;
        }
      }
    }

    newState = [
      [this.state[0][0], this.state[1][0], this.state[2][0], this.state[3][0]],
      [this.state[0][1], this.state[1][1], this.state[2][1], this.state[3][1]],
      [this.state[0][2], this.state[1][2], this.state[2][2], this.state[3][2]],
      [this.state[0][3], this.state[1][3], this.state[2][3], this.state[3][3]],
    ];

    newState.forEach((a) => {
      a.sort((y, x) => {
        if (x === 0 && y !== 0) {
          return 1;
        }

        if (y === 0 && x !== 0) {
          return -1;
        }

        return 0;
      });
    });

    this.state = [
      [newState[0][0], newState[1][0], newState[2][0], newState[3][0]],
      [newState[0][1], newState[1][1], newState[2][1], newState[3][1]],
      [newState[0][2], newState[1][2], newState[2][2], newState[3][2]],
      [newState[0][3], newState[1][3], newState[2][3], newState[3][3]],
    ];

    newCells = [
      [
        rows[0].children[0],
        rows[1].children[0],
        rows[2].children[0],
        rows[3].children[0],
      ],
      [
        rows[0].children[1],
        rows[1].children[1],
        rows[2].children[1],
        rows[3].children[1],
      ],
      [
        rows[0].children[2],
        rows[1].children[2],
        rows[2].children[2],
        rows[3].children[2],
      ],
      [
        rows[0].children[3],
        rows[1].children[3],
        rows[2].children[3],
        rows[3].children[3],
      ],
    ];

    newCells.forEach((x) => {
      x.sort((b, a) => {
        if (
          a.classList.contains('field-cell--empty') &&
          !b.classList.contains('field-cell--empty')
        ) {
          return 1;
        }

        if (
          !a.classList.contains('field-cell--empty') &&
          b.classList.contains('field-cell--empty')
        ) {
          return -1;
        }

        return 0;
      });
    });

    rows[0].append(
      newCells[0][0],
      newCells[1][0],
      newCells[2][0],
      newCells[3][0],
    );

    rows[1].append(
      newCells[0][1],
      newCells[1][1],
      newCells[2][1],
      newCells[3][1],
    );

    rows[2].append(
      newCells[0][2],
      newCells[1][2],
      newCells[2][2],
      newCells[3][2],
    );

    rows[3].append(
      newCells[0][3],
      newCells[1][3],
      newCells[2][3],
      newCells[3][3],
    );
  }

  newCell() {
    const num = () => {
      if (Math.random() > 0.89) {
        return 4;
      }

      return 2;
    };
    // const map = [
    //   { place: 0, row: 0, cell: 0 }, // 0
    //   { place: 1, row: 0, cell: 1 }, // 1
    //   { place: 2, row: 0, cell: 2 }, // 2
    //   { place: 3, row: 0, cell: 3 }, // 3
    //   { place: 4, row: 1, cell: 0 }, // 4
    //   { place: 5, row: 1, cell: 1 }, // 5
    //   { place: 6, row: 1, cell: 2 }, // 6
    //   { place: 7, row: 1, cell: 3 }, // 7
    //   { place: 8, row: 2, cell: 0 }, // 8
    //   { place: 9, row: 2, cell: 1 }, // 9
    //   { place: 10, row: 2, cell: 2 }, // 10
    //   { place: 11, row: 2, cell: 3 }, // 11
    //   { place: 12, row: 3, cell: 0 }, // 12
    //   { place: 13, row: 3, cell: 1 }, // 13
    //   { place: 14, row: 3, cell: 2 }, // 14
    //   { place: 15, row: 3, cell: 3 }, // 15
    // ];

    const emptyCells = [];

    this.state.forEach((a, index) => {
      a.forEach((b, index2) => {
        if (b === 0) {
          emptyCells.push({ row: index, cell: index2 });
        }
      });
    });

    const place = Math.floor(Math.random() * emptyCells.length);
    const usedNum = num();
    const gamePlace =
      rows[emptyCells[place].row].children[emptyCells[place].cell];

    gamePlace.classList.replace(`field-cell--empty`, `field-cell--${usedNum}`);
    gamePlace.innerHTML = `${usedNum}`;
    this.state[emptyCells[place].row][emptyCells[place].cell] = usedNum;
  }

  lostCheck() {
    if (!this.state.some((a) => a.some((b) => b === 0))) {
      if (this.adjacentCells()) {
        return true;
      }
    }

    return false;
  }
  adjacentCells() {
    let sameCellsCount = 0;
    const newState = [
      [this.state[0][0], this.state[1][0], this.state[2][0], this.state[3][0]],
      [this.state[0][1], this.state[1][1], this.state[2][1], this.state[3][1]],
      [this.state[0][2], this.state[1][2], this.state[2][2], this.state[3][2]],
      [this.state[0][3], this.state[1][3], this.state[2][3], this.state[3][3]],
    ];

    for (let i = 0; i < 4; i++) {
      for (let n = 0; n < 3; n++) {
        if (this.state[i][n] === this.state[i][n + 1]) {
          sameCellsCount++;
        }

        if (newState[i][n] === newState[i][n + 1]) {
          sameCellsCount++;
        }
      }
    }

    if (sameCellsCount === 0) {
      return true;
    }
  }
  /**
   * @returns {number}
   */
  getScore() {
    document.querySelector('.game-score').innerHTML = `${this.score}`;

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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start(x) {
    this.newCell();
    this.newCell();
    this.status = 'playing';

    startButton.innerHTML = 'Restart';
    startButton.classList.replace('start', 'restart');
    x();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (const i of cells) {
      i.className = 'field-cell';
      i.classList.add('field-cell--empty');
      i.innerHTML = '';
    }

    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');

    this.newCell();
    this.newCell();
  }

  // Add your own methods here
}

module.exports = Game;
