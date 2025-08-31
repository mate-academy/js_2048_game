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
    return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
  }

  clone(board) {
    return board.map(row => [...row]);
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
    const vazio = [];
    this.tabuleiro.forEach((row, i) => row.forEach((val, j) => {
      if (val === 0) vazio.push([i, j]);
    }));

    if (!vazio.length) return;

    const [i, j] = vazio[Math.floor(Math.random() * vazio.length)];
    this.tabuleiro[i][j] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() { return this.moveHorizontal(true); }
  moveRight() { return this.moveHorizontal(false); }

  moveHorizontal(left = true) {
    let mudou = false;
    const range = left ? [0, 4, 1] : [3, -1, -1];

    for (let i = 0; i < 4; i++) {
      let row = this.tabuleiro[i];
      const compacted = row.filter(v => v !== 0);

      for (let j = 0; j < compacted.length - 1; j++) {
        if (compacted[j] === compacted[j + 1]) {
          compacted[j] *= 2;
          this.somar += compacted[j];
          compacted[j + 1] = 0;
        }
      }

      const newRow = compacted.filter(v => v !== 0);
      while (newRow.length < 4) left ? newRow.push(0) : newRow.unshift(0);

      if (row.some((v, idx) => v !== newRow[idx])) mudou = true;
      this.tabuleiro[i] = newRow;
    }

    if (mudou) {
      this.gerarNumero();
      this.checkStatus();
    }
    return mudou;
  }

  moveUp() { return this.moveVertical(true); }
  moveDown() { return this.moveVertical(false); }

  moveVertical(up = true) {
    let mudou = false;
    for (let i = 0; i < 4; i++) {
      const col = this.tabuleiro.map(row => row[i]).filter(v => v !== 0);
      for (let j = 0; j < col.length - 1; j++) {
        if (col[j] === col[j + 1]) {
          col[j] *= 2;
          this.somar += col[j];
          col[j + 1] = 0;
        }
      }
      const newCol = col.filter(v => v !== 0);
      while (newCol.length < 4) up ? newCol.push(0) : newCol.unshift(0);
      for (let j = 0; j < 4; j++) {
        if (this.tabuleiro[j][i] !== newCol[j]) mudou = true;
        this.tabuleiro[j][i] = newCol[j];
      }
    }

    if (mudou) {
      this.gerarNumero();
      this.checkStatus();
    }
    return mudou;
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
