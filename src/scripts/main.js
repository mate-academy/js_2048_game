'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

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
    // eslint-disable-next-line no-console
    this.state = initialState;
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    // alert('testando esq')
    for (let i = 0; i < 4; i++) {
      let naoZero = this.state[i].filter((cedula) => cedula !== 0);

      naoZero = this.juntar(naoZero);
      this.state[i] = naoZero.concat(new Array(4 - naoZero.length).fill(0));
    }

    this.spawn();
    this.update();
  }
  moveRight() {
    // alert('testando dir')
    for (let i = 0; i < 4; i++) {
      let naoZero = this.state[i].filter((cedula) => cedula !== 0).reverse();

      naoZero = this.juntar(naoZero);

      this.state[i] = new Array(4 - naoZero.length)
        .fill(0)
        .concat(naoZero.reverse());
    }

    this.spawn();
    this.update();
  }
  moveUp() {
    // alert('testando cima')
    for (let i = 0; i < 4; i++) {
      let coluna = [];

      for (let j = 0; j < 4; j++) {
        coluna.push(this.state[j][i]);
      }
      coluna = coluna.filter((c) => c !== 0);
      coluna = this.juntar(coluna);

      for (let k = 0; k < 4; k++) {
        this.state[k][i] = k < coluna.length ? coluna[k] : 0;
      }
    }
    this.spawn();
    this.update();
  }
  moveDown() {
    for (let i = 0; i < 4; i++) {
      let coluna = [];

      for (let j = 0; j < 4; j++) {
        coluna.push(this.state[j][i]);
      }
      coluna = coluna.filter((c) => c !== 0).reverse();
      coluna = this.juntar(coluna);
      coluna = coluna.reverse();

      for (let k = 0; k < 4; k++) {
        this.state[k][i] = k < coluna.length ? coluna[k] : 0;
      }
    }
    this.spawn();
    this.update();
  }

  handleKeyEvent(e) {
    if (this.status !== 'playing') {
      return;
    }

    if (e.key === 'ArrowRight') {
      this.moveRight();
    } else if (e.key === 'ArrowLeft') {
      this.moveLeft();
    } else if (e.key === 'ArrowUp') {
      this.moveUp();
    } else if (e.key === 'ArrowDown') {
      this.moveDown();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
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
  start() {
    this.isStarted = true;
    this.status = 'playing';
    this.spawn();

    const botao = document.getElementById('start-button');

    botao.textContent = 'Restart';
    botao.style.backgroundColor = '#eaf573';
    botao.style.fontSize = '18px';
    botao.onclick = () => this.restart();
  }

  spawn() {
    const vazios = [];

    for (let linha = 0; linha < 4; linha++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[linha][col] === 0) {
          vazios.push({ linha, col });
        }
      }
    }

    if (vazios.length > 0) {
      const { linha, col } = vazios[Math.floor(Math.random() * vazios.length)];

      this.state[linha][col] = Math.random() < 0.9 ? 2 : 4;
    }

    this.update();
  }

  juntar(naoZero) {
    for (let i = 0; i < naoZero.length; i++) {
      if (naoZero[i] === naoZero[i + 1]) {
        naoZero[i] *= 2;
        this.score += naoZero[i];

        naoZero.splice(i + 1, 1);
      }
    }

    return naoZero;
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return false;
        }

        if (j < 3 && this.state[i][j] === this.state[i][j + 1]) {
          return false;
        }

        if (i < 3 && this.state[i][j] === this.state[i + 1][j]) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }

  update() {
    const cells = document.querySelectorAll('.field-cell');
    let index = 0;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = cells[index];

        cell.className = 'field-cell';

        if (this.state[i][j] !== 0) {
          cell.textContent = this.state[i][j];
          cell.classList.add(`field-cell--${this.state[i][j]}`);
        } else {
          cell.textContent = '';
        }
        index++;
      }
    }
    this.updateStatus();
    document.querySelector('.game-score').textContent = this.score;
  }

  updateStatus() {
    const oldStatus = this.status;

    this.checkWin();
    this.checkLose();

    if (oldStatus !== this.status) {
      if (this.status === 'win') {
        alert('Você ganhou');
      } else if (this.status === 'lose') {
        alert('Você perdeu');
      }
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
    this.status = 'idle';
    this.score = 0;
    this.start();
  }

  // Add your own methods here
}

const game = new Game();

document.addEventListener('keydown', (e) => {
  game.handleKeyEvent(e);
});
