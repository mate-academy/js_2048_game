

const Game = require('../modules/Game.class');
const game = new Game();

'use strict';

let somar = 0;
let status = "playing";
let tabuleiro = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [2, 0, 0, 0],
  [2, 0, 0, 0],
];

class Game {
  start() {
    somar = 0;
    status = "playing";
    tabuleiro = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    gerarNumero();
    gerarNumero();
  }

  restart() {
    this.start();
  }

  getState() {
    return tabuleiro;
  }

  getScore() {
    return somar;
  }

  getStatus() {
    return status;
  }

  moveLeft() {
    moveLeft();
  }

  moveRight() {
    moveRight();
  }

  moveUp() {
    moveUp();
  }

  moveDown() {
    moveDown();
  }
}

function gerarNumero() {
  let vazio = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (tabuleiro[i][j] === 0) {
        vazio.push([i, j]);
      }
    }
  }

  if (vazio.length === 0) return;

  let [primeiro, segundo] = vazio[Math.floor(Math.random() * vazio.length)];
  let numero = Math.ceil(Math.random() * 10);

  if (numero === 10) {
    tabuleiro[primeiro][segundo] = 4;
  } else {
    tabuleiro[primeiro][segundo] = 2;
  }
}

function getState() {
  return tabuleiro;
}

function getScore() {
  return somar;
}

function getStatus() {
  return status;
}

function moveRight() {
  for (let i = 0; i < 4; i++) {
    for (let o = 0; o < 4; o++) {
      if (o < 3) {
        if (tabuleiro[i][o] === tabuleiro[i][o + 1] && tabuleiro[i][o] !== 0) {
          tabuleiro[i][o + 1] = tabuleiro[i][o] * 2;
          somar += tabuleiro[i][o + 1];
          tabuleiro[i][o] = 0;
          o++;
        } else if (tabuleiro[i][o] !== 0 && tabuleiro[i][o + 1] === 0) {
          tabuleiro[i][o + 1] = tabuleiro[i][o];
          tabuleiro[i][o] = 0;
        }
      }
    }

    for (let j = 2; j >= 0; j--) {
      if (tabuleiro[i][j] !== 0 && tabuleiro[i][j + 1] === 0) {
        tabuleiro[i][j + 1] = tabuleiro[i][j];
        tabuleiro[i][j] = 0;
      }
    }
  }

  gerarNumero();
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    for (let o = 0; o < 4; o++) {
      if (tabuleiro[i][o] === 0) {
        for (let k = o + 1; k < 4; k++) {
          if (tabuleiro[i][k] !== 0) {
            tabuleiro[i][o] = tabuleiro[i][k];
            tabuleiro[i][k] = 0;
            break;
          }
        }
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let o = 0; o < 3; o++) {
      if (tabuleiro[i][o] !== 0 && tabuleiro[i][o] === tabuleiro[i][o + 1]) {
        tabuleiro[i][o] *= 2;
        somar += tabuleiro[i][o];
        tabuleiro[i][o + 1] = 0;
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let o = 0; o < 4; o++) {
      if (tabuleiro[i][o] === 0) {
        for (let k = o + 1; k < 4; k++) {
          if (tabuleiro[i][k] !== 0) {
            tabuleiro[i][o] = tabuleiro[i][k];
            tabuleiro[i][k] = 0;
            break;
          }
        }
      }
    }
  }

  gerarNumero();
}

function moveUp() {
  for (let i = 0; i < 4; i++) {
    for (let o = 1; o < 4; o++) {
      if (tabuleiro[o][i] !== 0) {
        let k = o;
        while (k > 0 && tabuleiro[k - 1][i] === 0) {
          tabuleiro[k - 1][i] = tabuleiro[k][i];
          tabuleiro[k][i] = 0;
          k--;
        }
        if (k > 0 && tabuleiro[k][i] === tabuleiro[k - 1][i]) {
          tabuleiro[k - 1][i] *= 2;
          somar += tabuleiro[k - 1][i];
          tabuleiro[k][i] = 0;
        }
      }
    }
  }

  gerarNumero();
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    for (let o = 2; o >= 0; o--) {
      if (tabuleiro[o][i] !== 0) {
        let k = o;
        while (k < 3 && tabuleiro[k + 1][i] === 0) {
          tabuleiro[k + 1][i] = tabuleiro[k][i];
          tabuleiro[k][i] = 0;
          k++;
        }
        if (k < 3 && tabuleiro[k][i] === tabuleiro[k + 1][i]) {
          tabuleiro[k + 1][i] *= 2;
          somar += tabuleiro[k + 1][i];
          tabuleiro[k][i] = 0;
        }
      }
    }
  }

  gerarNumero();
}