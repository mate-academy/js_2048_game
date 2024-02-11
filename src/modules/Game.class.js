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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.count = 0;
    this.points = 0;
  }

  /**
* @returns {number}
*/

  /**
* @returns {number[][]}
*/

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

  canMoveLeft() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 1; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          if (this.board[i][j - 1] === 0
              || this.board[i][j - 1] === this.board[i][j]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  canMoveRight() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = this.board[i].length - 2; j >= 0; j--) {
        if (this.board[i][j] !== 0) {
          if (this.board[i][j + 1] === 0
              || this.board[i][j + 1] === this.board[i][j]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  canMoveUp() {
    for (let j = 0; j < this.board[0].length; j++) {
      for (let i = 1; i < this.board.length; i++) {
        if (this.board[i][j] !== 0) {
          if (this.board[i - 1][j] === 0
              || this.board[i - 1][j] === this.board[i][j]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  canMoveDown() {
    for (let j = 0; j < this.board[0].length; j++) {
      for (let i = this.board.length - 2; i >= 0; i--) {
        if (this.board[i][j] !== 0) {
          if (this.board[i + 1][j] === 0
              || this.board[i + 1][j] === this.board[i][j]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  getStatus() {
    if (this.getEmptyCells().length === 0) {
      if (!this.canMoveLeft() && !this.canMoveRight()
        && !this.canMoveUp() && !this.canMoveDown()) {
        alert('Lose!');
        this.restart();
        this.spawn();
      }
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 2048) {
          alert('Win!');
          this.restart();
          this.spawn();
        }
      }
    }
  }

  /**
* Starts the game.
*/
  start() {
    if (this.count >= 1) {
      alert('Вы уже начали игру!');

      return false;
    }
    this.spawnRandomTile();

    this.count++;

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === this.cheak(this.board[i][j])) {
          this.cheak(this.board[i][j]);
        }

        if (this.board[i][j] === this.cheak(this.board[i][j])) {
          this.cheak(this.board[i][j]);
        };
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

    this.points = 0;
    this.gameScore();
  }

  // Add your own methods here

  spawnRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 1) {
      const randomIndex1 = Math.floor(Math.random() * emptyCells.length);
      let randomIndex2;

      do {
        randomIndex2 = Math.floor(Math.random() * emptyCells.length);
      } while (randomIndex2 === randomIndex1);

      const randomCell1 = emptyCells[randomIndex1];
      const randomCell2 = emptyCells[randomIndex2];

      this.setTileValue(randomCell1.i, randomCell1.j,
        Math.random() > 0.2 ? 2 : 4);

      this.setTileValue(randomCell2.i, randomCell2.j,
        Math.random() > 0.2 ? 2 : 4);
    } else if (emptyCells.length === 1) {
      const randomCell = emptyCells[0];

      this.setTileValue(randomCell.i, randomCell.j,
        Math.random() > 0.2 ? 2 : 4);
    }
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({
            i, j,
          });
        }
      }
    }

    return emptyCells;
  }

  setTileValue(i, j, value) {
    this.board[i][j] = value;
  }

  moveUp() {
    const coord = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          coord.push({
            i, j,
          });
        }
      }
    }

    // console.log(coord); вывод найденых плиток

    for (let h = 0; h < coord.length; h++) {
      const { i, j } = coord[h];
      let newRow = i;

      while (newRow > 0) {
        if (this.board[newRow - 1][j] === 0) {
          this.board[newRow - 1][j] = this.board[newRow][j];
          this.board[newRow][j] = 0;
          newRow--;
        } else if (this.board[newRow - 1][j] === this.board[newRow][j]) {
          this.points += this.board[newRow - 1][j] *= 2;
          this.gameScore();
          this.board[newRow][j] = 0;
          break;
        } else {
          break;
        }
      }
    }

    this.getStatus();
    this.spawn();

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          this.cheak(this.board[i][j]);
        }

        if (this.board[i][j] !== 0) {
          this.cheak(this.board[i][j]);
        }

        if (this.board[i][j] === 0) {
          this.cheak();
        }
      }
    }
  }

  moveDown() {
    const coord = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          coord.push({
            i, j,
          });
        }
      }
    }

    for (let h = coord.length - 1; h >= 0; h--) {
      const { i, j } = coord[h];
      let newRow = i;

      while (newRow < this.board.length - 1) {
        if (this.board[newRow + 1][j] === 0) {
          this.board[newRow + 1][j] = this.board[newRow][j];
          this.board[newRow][j] = 0;
          newRow++;
        } else if (this.board[newRow + 1][j] === this.board[newRow][j]) {
          this.points += this.board[newRow + 1][j] *= 2;
          this.gameScore();
          this.board[newRow][j] = 0;
          break;
        } else {
          break;
        }
      }
    }

    this.getStatus();
    this.spawn();

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          this.cheak(this.board[i][j]);
        }

        if (this.board[i][j] !== 0) {
          this.cheak(this.board[i][j]);
        }

        if (this.board[i][j] === 0) {
          this.cheak();
        }
      }
    }
  }

  moveRight() {
    const coord = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          coord.push({
            i, j,
          });
        }
      }
    }

    for (let h = coord.length - 1; h >= 0; h--) {
      const { i, j } = coord[h];
      const newRow = i;
      let newWidth = j;

      while (newWidth < this.board.length - 1) {
        if (this.board[newRow][newWidth + 1] === 0) {
          this.board[newRow][newWidth + 1] = this.board[newRow][newWidth];
          this.board[newRow][newWidth] = 0;
          newWidth++;
        } else if (this.board[newRow][newWidth + 1]
            === this.board[newRow][newWidth]) {
          this.points += this.board[newRow][newWidth + 1] *= 2;
          this.gameScore();
          this.board[newRow][newWidth] = 0;
          break;
        } else {
          break;
        }
      }
    }

    this.getStatus();
    this.spawn();

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          this.cheak(this.board[i][j]);
        }

        if (this.board[i][j] !== 0) {
          this.cheak(this.board[i][j]);
        }

        if (this.board[i][j] === 0) {
          this.cheak();
        }
      }
    }
  }

  moveLeft() {
    const coord = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          coord.push({
            i, j,
          });
        }
      }
    }

    for (let h = 0; h < coord.length; h++) {
      const { i, j } = coord[h];
      const newRow = i;
      let newWidth = j;

      while (newWidth > 0) {
        if (this.board[newRow][newWidth - 1] === 0) {
          this.board[newRow][newWidth - 1] = this.board[newRow][newWidth];
          this.board[newRow][newWidth] = 0;
          newWidth--;
        } else if (this.board[newRow][newWidth - 1]
            === this.board[newRow][newWidth]) {
          this.points += this.board[newRow][newWidth - 1] *= 2;
          this.gameScore();
          this.board[newRow][newWidth] = 0;
          break;
        } else {
          break;
        }
      }
    }

    this.getStatus();
    this.spawn();

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          this.cheak(this.board[i][j]);
        }

        if (this.board[i][j] !== 0) {
          this.cheak(this.board[i][j]);
        }

        if (this.board[i][j] === 0) {
          this.cheak();
        }
      }
    }
  }

  cheak() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const position = document.querySelector(`
          .field-cell[data-row='${i}'][data-col='${j}']`);

        position.classList.remove('field-cell--2', 'field-cell--4',
          'field-cell--8', 'field-cell--16', 'field-cell--32', 'field-cell--64',
          'field-cell--128', 'field-cell--256', 'field-cell--512',
          'field-cell--1024');

        switch (this.board[i][j]) {
          case 0:
            position.textContent = '';
            break;

          case 2:
            position.classList.add('field-cell--2');
            position.textContent = '2';
            break;

          case 4:
            position.classList.add('field-cell--4');
            position.textContent = '4';
            break;

          case 8:
            position.classList.add('field-cell--8');
            position.textContent = '8';
            break;

          case 16:
            position.classList.add('field-cell--16');
            position.textContent = '16';
            break;

          case 32:
            position.classList.add('field-cell--32');
            position.textContent = '32';
            break;

          case 64:
            position.classList.add('field-cell--64');
            position.textContent = '64';
            break;

          case 128:
            position.classList.add('field-cell--128');
            position.textContent = '128';
            break;

          case 256:
            position.classList.add('field-cell--256');
            position.textContent = '256';
            break;

          case 512:
            position.classList.add('field-cell--512');
            position.textContent = '512';
            break;

          case 1024:
            position.classList.add('field-cell--1024');
            position.textContent = '1024';
            break;

          case 2048:
            position.classList.add('field-cell--2048');
            position.textContent = '2048';
            break;

          default:
            break;
        }
      }
    }
  }

  spawn() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      this.setTileValue(randomCell.i, randomCell.j,
        Math.random() > 0.2 ? 2 : 4);
    }
  }

  gameScore() {
    const score = document.querySelector('.game-score');

    score.textContent = `${this.points}`;
  }

  spw() {
    this.spawnRandomTile();

    this.count++;

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === this.cheak(this.board[i][j])) {
          this.cheak(this.board[i][j]);
        }

        if (this.board[i][j] === this.cheak(this.board[i][j])) {
          this.cheak(this.board[i][j]);
        };
      }
    }
  }
}

module.exports = Game;
