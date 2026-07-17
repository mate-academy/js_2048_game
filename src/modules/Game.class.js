'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
const fusaoTabuleiroDefault = [
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
];

function genarateNumber(tabuleiro) {
  const numero = Math.random() < 0.9 ? 2 : 4;
  const vazios = [];

  tabuleiro.forEach((linha, r) => {
    linha.forEach((valor, o) => {
      if (valor === 0) {
        vazios.push([r, o]);
      }
    });
  });

  if (vazios.length === 0) {
    return tabuleiro;
  }

  const [i, j] = vazios[Math.floor(Math.random() * vazios.length)];

  tabuleiro[i][j] = numero;

  return tabuleiro;
}
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.tabuleiro = initialState.map((linha) => [...linha]);
    this.initialState = JSON.parse(JSON.stringify(initialState));
    this.fusaoTabuleiro = fusaoTabuleiroDefault.map((linha) => [...linha]);
    this.soma = 0;
  }

  moveLeft() {
    const copia = JSON.stringify(this.tabuleiro);

    this.empurrarEsquerda();

    for (let i = 0; i <= 3; i++) {
      for (let o = 3; o >= 1; o--) {
        if (
          this.tabuleiro[i][o] === this.tabuleiro[i][o - 1] &&
          this.fusaoTabuleiro[i][o] === false
        ) {
          this.tabuleiro[i][o] = 0;
          this.tabuleiro[i][o - 1] *= 2;
          this.soma += this.tabuleiro[i][o - 1];
          this.fusaoTabuleiro[i][o - 1] = true;
        }
      }
    }

    this.empurrarEsquerda();
    this.fusaoTabuleiro = fusaoTabuleiroDefault.map((linha) => [...linha]);

    if (copia !== JSON.stringify(this.tabuleiro)) {
      this.tabuleiro = genarateNumber(this.tabuleiro);
    }
  }
  moveRight() {
    const copia = JSON.stringify(this.tabuleiro);

    this.empurrarDireita();

    for (let i = 0; i <= 3; i++) {
      for (let o = 0; o <= 2; o++) {
        if (
          this.tabuleiro[i][o] === this.tabuleiro[i][o + 1] &&
          this.fusaoTabuleiro[i][o] === false
        ) {
          this.tabuleiro[i][o] = 0;
          this.tabuleiro[i][o + 1] *= 2;
          this.soma += this.tabuleiro[i][o + 1];
          this.fusaoTabuleiro[i][o + 1] = true;
        }
      }
    }

    this.empurrarDireita();
    this.fusaoTabuleiro = fusaoTabuleiroDefault.map((linha) => [...linha]);

    if (copia !== JSON.stringify(this.tabuleiro)) {
      this.tabuleiro = genarateNumber(this.tabuleiro);
    }
  }
  moveUp() {
    const copia = JSON.stringify(this.tabuleiro);

    this.empurrarCima();

    for (let i = 0; i <= 3; i++) {
      for (let o = 3; o >= 1; o--) {
        if (
          this.tabuleiro[o][i] === this.tabuleiro[o - 1][i] &&
          this.fusaoTabuleiro[o][i] === false
        ) {
          this.tabuleiro[o][i] = 0;
          this.tabuleiro[o - 1][i] *= 2;
          this.soma += this.tabuleiro[o - 1][i];
          this.fusaoTabuleiro[o - 1][i] = true;
        }
      }
    }
    this.empurrarCima();
    this.fusaoTabuleiro = fusaoTabuleiroDefault.map((linha) => [...linha]);

    if (copia !== JSON.stringify(this.tabuleiro)) {
      this.tabuleiro = genarateNumber(this.tabuleiro);
    }
  }
  moveDown() {
    const copia = JSON.stringify(this.tabuleiro);

    this.empurrarBaixo();

    for (let i = 0; i <= 3; i++) {
      for (let o = 0; o <= 2; o++) {
        if (
          this.tabuleiro[o][i] === this.tabuleiro[o + 1][i] &&
          this.fusaoTabuleiro[o][i] === false
        ) {
          this.tabuleiro[o][i] = 0;
          this.tabuleiro[o + 1][i] *= 2;
          this.soma += this.tabuleiro[o + 1][i];
          this.fusaoTabuleiro[o + 1][i] = true;
        }
      }
    }

    this.empurrarBaixo();
    this.fusaoTabuleiro = fusaoTabuleiroDefault.map((linha) => [...linha]);

    if (copia !== JSON.stringify(this.tabuleiro)) {
      this.tabuleiro = genarateNumber(this.tabuleiro);
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.soma;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.tabuleiro;
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
    if (JSON.stringify(this.tabuleiro) === JSON.stringify(this.initialState)) {
      return 'idle';
    }

    let temZero = false;

    for (let i = 0; i < 4; i++) {
      for (let o = 0; o < 4; o++) {
        const valor = this.tabuleiro[i][o];

        if (valor === 0) {
          temZero = true;
        }

        if (valor === 2048) {
          return 'win';
        }

        if (o < 3 && valor === this.tabuleiro[i][o + 1]) {
          return 'playing';
        }

        if (i < 3 && valor === this.tabuleiro[i + 1][o]) {
          return 'playing';
        }
      }
    }

    if (temZero) {
      return 'playing';
    }

    return 'lose';
  }

  /**
   * Starts the game.
   */
  start() {
    this.tabuleiro = genarateNumber(this.tabuleiro);
    this.tabuleiro = genarateNumber(this.tabuleiro);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.tabuleiro = JSON.parse(JSON.stringify(this.initialState));
    this.soma = 0;
    this.fusaoTabuleiro = fusaoTabuleiroDefault.map((linha) => [...linha]);
  }

  // Add your own methods here
  empurrarDireita() {
    for (let i = 0; i <= 3; i++) {
      for (let o = 0; o <= 2; o++) {
        if (this.tabuleiro[i][o + 1] === 0) {
          this.tabuleiro[i][o + 1] = this.tabuleiro[i][o];
          this.tabuleiro[i][o] = 0;
        }
      }

      for (let o = 0; o <= 2; o++) {
        if (this.tabuleiro[i][o + 1] === 0) {
          this.tabuleiro[i][o + 1] = this.tabuleiro[i][o];
          this.tabuleiro[i][o] = 0;
        }
      }
    }
  }
  empurrarEsquerda() {
    for (let i = 0; i <= 3; i++) {
      for (let o = 3; o >= 1; o--) {
        if (this.tabuleiro[i][o - 1] === 0) {
          this.tabuleiro[i][o - 1] = this.tabuleiro[i][o];
          this.tabuleiro[i][o] = 0;
        }
      }

      for (let o = 3; o >= 1; o--) {
        if (this.tabuleiro[i][o - 1] === 0) {
          this.tabuleiro[i][o - 1] = this.tabuleiro[i][o];
          this.tabuleiro[i][o] = 0;
        }
      }
    }
  }
  empurrarCima() {
    for (let i = 0; i <= 3; i++) {
      for (let o = 3; o >= 1; o--) {
        if (this.tabuleiro[o - 1][i] === 0) {
          this.tabuleiro[o - 1][i] = this.tabuleiro[o][i];
          this.tabuleiro[o][i] = 0;
        }
      }

      for (let o = 3; o >= 1; o--) {
        if (this.tabuleiro[o - 1][i] === 0) {
          this.tabuleiro[o - 1][i] = this.tabuleiro[o][i];
          this.tabuleiro[o][i] = 0;
        }
      }
    }
  }
  empurrarBaixo() {
    for (let i = 0; i <= 3; i++) {
      for (let o = 0; o <= 2; o++) {
        if (this.tabuleiro[o + 1][i] === 0) {
          this.tabuleiro[o + 1][i] = this.tabuleiro[o][i];
          this.tabuleiro[o][i] = 0;
        }
      }

      for (let o = 0; o <= 2; o++) {
        if (this.tabuleiro[o + 1][i] === 0) {
          this.tabuleiro[o + 1][i] = this.tabuleiro[o][i];
          this.tabuleiro[o][i] = 0;
        }
      }
    }
  }
}

export default Game;
