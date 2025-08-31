"use strict";

let somar = 0;
let status = "playing";

let tabuleiro = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [2, 0, 0, 0],
  [2, 0, 0, 0],
];

function gerarNumero() {
  let vazio = [];
  for (let i = 0; i < 4; i++) {
    for (let o = 0; o < 4; o++) {
      if (tabuleiro[i][o] === 0) vazio.push([i, o]);
    }
  }
  if (vazio.length === 0) return;
  let [i, o] = vazio[Math.floor(Math.random() * vazio.length)];
  tabuleiro[i][o] = Math.random() < 0.1 ? 4 : 2;
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

function checkWin() {
  for (let i = 0; i < 4; i++) {
    for (let o = 0; o < 4; o++) {
      if (tabuleiro[i][o] === 2048) status = "win";
    }
  }
}

function checkGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let o = 0; o < 4; o++) {
      if (tabuleiro[i][o] === 0) return;
      if (i < 3 && tabuleiro[i][o] === tabuleiro[i + 1][o]) return;
      if (o < 3 && tabuleiro[i][o] === tabuleiro[i][o + 1]) return;
    }
  }
  status = "over";
}

function moveLeft() {
  let mudou = false;
  for (let i = 0; i < 4; i++) {
    for (let o = 0; o < 4; o++) {
      if (tabuleiro[i][o] === 0) {
        for (let k = o + 1; k < 4; k++) {
          if (tabuleiro[i][k] !== 0) {
            tabuleiro[i][o] = tabuleiro[i][k];
            tabuleiro[i][k] = 0;
            mudou = true;
            break;
          }
        }
      }
    }
    for (let o = 0; o < 3; o++) {
      if (tabuleiro[i][o] !== 0 && tabuleiro[i][o] === tabuleiro[i][o + 1]) {
        tabuleiro[i][o] *= 2;
        somar += tabuleiro[i][o];
        tabuleiro[i][o + 1] = 0;
        mudou = true;
      }
    }
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
  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function moveRight() {
  let mudou = false;
  for (let i = 0; i < 4; i++) {
    for (let o = 3; o >= 0; o--) {
      if (tabuleiro[i][o] === 0) {
        for (let k = o - 1; k >= 0; k--) {
          if (tabuleiro[i][k] !== 0) {
            tabuleiro[i][o] = tabuleiro[i][k];
            tabuleiro[i][k] = 0;
            mudou = true;
            break;
          }
        }
      }
    }
    for (let o = 3; o > 0; o--) {
      if (tabuleiro[i][o] !== 0 && tabuleiro[i][o] === tabuleiro[i][o - 1]) {
        tabuleiro[i][o] *= 2;
        somar += tabuleiro[i][o];
        tabuleiro[i][o - 1] = 0;
        mudou = true;
      }
    }
    for (let o = 3; o >= 0; o--) {
      if (tabuleiro[i][o] === 0) {
        for (let k = o - 1; k >= 0; k--) {
          if (tabuleiro[i][k] !== 0) {
            tabuleiro[i][o] = tabuleiro[i][k];
            tabuleiro[i][k] = 0;
            break;
          }
        }
      }
    }
  }
  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function moveUp() {
  let mudou = false;
  for (let i = 0; i < 4; i++) {
    for (let o = 0; o < 4; o++) {
      if (tabuleiro[o][i] === 0) {
        for (let k = o + 1; k < 4; k++) {
          if (tabuleiro[k][i] !== 0) {
            tabuleiro[o][i] = tabuleiro[k][i];
            tabuleiro[k][i] = 0;
            mudou = true;
            break;
          }
        }
      }
    }
    for (let o = 0; o < 3; o++) {
      if (tabuleiro[o][i] !== 0 && tabuleiro[o][i] === tabuleiro[o + 1][i]) {
        tabuleiro[o][i] *= 2;
        somar += tabuleiro[o][i];
        tabuleiro[o + 1][i] = 0;
        mudou = true;
      }
    }
    for (let o = 0; o < 4; o++) {
      if (tabuleiro[o][i] === 0) {
        for (let k = o + 1; k < 4; k++) {
          if (tabuleiro[k][i] !== 0) {
            tabuleiro[o][i] = tabuleiro[k][i];
            tabuleiro[k][i] = 0;
            break;
          }
        }
      }
    }
  }
  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function moveDown() {
  let mudou = false;
  for (let i = 0; i < 4; i++) {
    for (let o = 3; o >= 0; o--) {
      if (tabuleiro[o][i] === 0) {
        for (let k = o - 1; k >= 0; k--) {
          if (tabuleiro[k][i] !== 0) {
            tabuleiro[o][i] = tabuleiro[k][i];
            tabuleiro[k][i] = 0;
            mudou = true;
            break;
          }
        }
      }
    }
    for (let o = 3; o > 0; o--) {
      if (tabuleiro[o][i] !== 0 && tabuleiro[o][i] === tabuleiro[o - 1][i]) {
        tabuleiro[o][i] *= 2;
        somar += tabuleiro[o][i];
        tabuleiro[o - 1][i] = 0;
        mudou = true;
      }
    }
    for (let o = 3; o >= 0; o--) {
      if (tabuleiro[o][i] === 0) {
        for (let k = o - 1; k >= 0; k--) {
          if (tabuleiro[k][i] !== 0) {
            tabuleiro[o][i] = tabuleiro[k][i];
            tabuleiro[k][i] = 0;
            break;
          }
        }
      }
    }
  }
  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function start() {
  tabuleiro = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  somar = 0;
  status = "playing";
  gerarNumero();
  gerarNumero();
}

function restart() {
  start();
}

