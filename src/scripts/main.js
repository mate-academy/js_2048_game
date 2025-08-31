'use strict';

export default class Game {
  constructor(initialState = null) {
    this.somar = 0;
    this.status = "playing";
    this.tabuleiro = initialState ? this.clone(initialState) : this.emptyBoard();

    if (!initialState) {
      this.gerarNumero();
      this.gerarNumero();
    }
  }

  emptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  clone(board) {
    let copia = [];
    for (let i = 0; i < 4; i++) {
      copia.push([...board[i]]);
    }
    return copia;
  }

  start() {
    this.somar = 0;
    this.status = "playing";
    this.tabuleiro = this.emptyBoard();
    this.gerarNumero();
    this.gerarNumero();
  }

  restart() {
    this.start();
  }

  getState() {
    return this.clone(this.tabuleiro);
  }

  getScore() {
    return this.somar;
  }

  getStatus() {
    return this.status;
  }

  gerarNumero() {
    let vazio = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.tabuleiro[i][j] === 0) {
          vazio.push([i, j]);
        }
      }
    }

    if (vazio.length === 0) return;

    let [primeiro, segundo] = vazio[Math.floor(Math.random() * vazio.length)];
    let numero = Math.ceil(Math.random() * 10);

    if (numero === 10) {
      this.tabuleiro[primeiro][segundo] = 4;
    } else {
      this.tabuleiro[primeiro][segundo] = 2;
    }
  }

  moveLeft() {
    let mudou = false;

    for (let i = 0; i < 4; i++) {
      // compacta
      for (let o = 0; o < 4; o++) {
        if (this.tabuleiro[i][o] === 0) {
          for (let k = o + 1; k < 4; k++) {
            if (this.tabuleiro[i][k] !== 0) {
              this.tabuleiro[i][o] = this.tabuleiro[i][k];
              this.tabuleiro[i][k] = 0;
              mudou = true;
              break;
            }
          }
        }
      }

     
      for (let o = 0; o < 3; o++) {
        if (this.tabuleiro[i][o] !== 0 && this.tabuleiro[i][o] === this.tabuleiro[i][o + 1]) {
          this.tabuleiro[i][o] *= 2;
          this.somar += this.tabuleiro[i][o];
          this.tabuleiro[i][o + 1] = 0;
          mudou = true;
        }
      }

     
      for (let o = 0; o < 4; o++) {
        if (this.tabuleiro[i][o] === 0) {
          for (let k = o + 1; k < 4; k++) {
            if (this.tabuleiro[i][k] !== 0) {
              this.tabuleiro[i][o] = this.tabuleiro[i][k];
              this.tabuleiro[i][k] = 0;
              mudou = true;
              break;
            }
          }
        }
      }
    }

    if (mudou) {
      this.gerarNumero();
      this.checkStatus();
    }
  }

  moveRight() {
    let mudou = false;

    for (let i = 0; i < 4; i++) {
      for (let o = 3; o >= 0; o--) {
        if (this.tabuleiro[i][o] === 0) {
          for (let k = o - 1; k >= 0; k--) {
            if (this.tabuleiro[i][k] !== 0) {
              this.tabuleiro[i][o] = this.tabuleiro[i][k];
              this.tabuleiro[i][k] = 0;
              mudou = true;
              break;
            }
          }
        }
      }

      for (let o = 3; o > 0; o--) {
        if (this.tabuleiro[i][o] !== 0 && this.tabuleiro[i][o] === this.tabuleiro[i][o - 1]) {
          this.tabuleiro[i][o] *= 2;
          this.somar += this.tabuleiro[i][o];
          this.tabuleiro[i][o - 1] = 0;
          mudou = true;
        }
      }

      for (let o = 3; o >= 0; o--) {
        if (this.tabuleiro[i][o] === 0) {
          for (let k = o - 1; k >= 0; k--) {
            if (this.tabuleiro[i][k] !== 0) {
              this.tabuleiro[i][o] = this.tabuleiro[i][k];
              this.tabuleiro[i][k] = 0;
              mudou = true;
              break;
            }
          }
        }
      }
    }

    if (mudou) {
      this.gerarNumero();
      this.checkStatus();
    }
  }

  moveUp() {
    let mudou = false;

    for (let i = 0; i < 4; i++) {
      for (let o = 1; o < 4; o++) {
        if (this.tabuleiro[o][i] !== 0) {
          let k = o;
          while (k > 0 && this.tabuleiro[k - 1][i] === 0) {
            this.tabuleiro[k - 1][i] = this.tabuleiro[k][i];
            this.tabuleiro[k][i] = 0;
            k--;
            mudou = true;
          }
          if (k > 0 && this.tabuleiro[k][i] === this.tabuleiro[k - 1][i]) {
            this.tabuleiro[k - 1][i] *= 2;
            this.somar += this.tabuleiro[k - 1][i];
            this.tabuleiro[k][i] = 0;
            mudou = true;
          }
        }
      }
    }

    if (mudou) {
      this.gerarNumero();
      this.checkStatus();
    }
  }

  moveDown() {
    let mudou = false;

    for (let i = 0; i < 4; i++) {
      for (let o = 2; o >= 0; o--) {
        if (this.tabuleiro[o][i] !== 0) {
          let k = o;
          while (k < 3 && this.tabuleiro[k + 1][i] === 0) {
            this.tabuleiro[k + 1][i] = this.tabuleiro[k][i];
            this.tabuleiro[k][i] = 0;
            k++;
            mudou = true;
          }
          if (k < 3 && this.tabuleiro[k][i] === this.tabuleiro[k + 1][i]) {
            this.tabuleiro[k + 1][i] *= 2;
            this.somar += this.tabuleiro[k + 1][i];
            this.tabuleiro[k][i] = 0;
            mudou = true;
          }
        }
      }
    }

    if (mudou) {
      this.gerarNumero();
      this.checkStatus();
    }
  }

  checkStatus() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.tabuleiro[i][j] === 2048) {
          this.status = "won";
          return;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.tabuleiro[i][j] === 0) return;
        if (j < 3 && this.tabuleiro[i][j] === this.tabuleiro[i][j + 1]) return;
        if (i < 3 && this.tabuleiro[i][j] === this.tabuleiro[i + 1][j]) return;
      }
    }

    this.status = "over";
  }
}
