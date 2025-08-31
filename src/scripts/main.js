"use strict";

let score = 0;
let gameStatus = "playing";

let tabuleiro = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [2, 0, 0, 0],
  [2, 0, 0, 0],
];

function gerarNumero() {
  let vazio = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (tabuleiro[row][col] === 0) vazio.push([row, col]);
    }
  }
  if (vazio.length === 0) return;
  let [row, col] = vazio[Math.floor(Math.random() * vazio.length)];
  tabuleiro[row][col] = Math.random() < 0.1 ? 4 : 2;
}

function getState() {
  return tabuleiro.map(row => [...row]);
}

function getScore() {
  return score;
}

function getStatus() {
  return gameStatus;
}

function checkWin() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (tabuleiro[row][col] === 2048) gameStatus = "win";
    }
  }
}

function checkGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (tabuleiro[row][col] === 0) return;
      if (row < 3 && tabuleiro[row][col] === tabuleiro[row + 1][col]) return;
      if (col < 3 && tabuleiro[row][col] === tabuleiro[row][col + 1]) return;
    }
  }
  gameStatus = "over";
}

function moveLeft() {
  let mudou = false;
  for (let row = 0; row < 4; row++) {
    let linha = tabuleiro[row].filter(x => x !== 0);
    for (let j = 0; j < linha.length - 1; j++) {
      if (linha[j] === linha[j + 1]) {
        linha[j] *= 2;
        score += linha[j];
        linha[j + 1] = 0;
      }
    }
    linha = linha.filter(x => x !== 0);
    while (linha.length < 4) linha.push(0);
    if (!mudou && linha.some((v, idx) => v !== tabuleiro[row][idx])) mudou = true;
    tabuleiro[row] = linha;
  }
  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function moveRight() {
  let mudou = false;
  for (let row = 0; row < 4; row++) {
    let linha = tabuleiro[row].filter(x => x !== 0);
    for (let j = linha.length - 1; j > 0; j--) {
      if (linha[j] === linha[j - 1]) {
        linha[j] *= 2;
        score += linha[j];
        linha[j - 1] = 0;
      }
    }
    linha = linha.filter(x => x !== 0);
    while (linha.length < 4) linha.unshift(0);
    if (!mudou && linha.some((v, idx) => v !== tabuleiro[row][idx])) mudou = true;
    tabuleiro[row] = linha;
  }
  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function moveUp() {
  let mudou = false;
  for (let col = 0; col < 4; col++) {
    let coluna = [];
    for (let row = 0; row < 4; row++) coluna.push(tabuleiro[row][col]);
    coluna = coluna.filter(x => x !== 0);
    for (let j = 0; j < coluna.length - 1; j++) {
      if (coluna[j] === coluna[j + 1]) {
        coluna[j] *= 2;
        score += coluna[j];
        coluna[j + 1] = 0;
      }
    }
    coluna = coluna.filter(x => x !== 0);
    while (coluna.length < 4) coluna.push(0);
    for (let row = 0; row < 4; row++) {
      if (tabuleiro[row][col] !== coluna[row]) mudou = true;
      tabuleiro[row][col] = coluna[row];
    }
  }
  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function moveDown() {
  let mudou = false;
  for (let col = 0; col < 4; col++) {
    let coluna = [];
    for (let row = 0; row < 4; row++) coluna.push(tabuleiro[row][col]);
    coluna = coluna.filter(x => x !== 0);
    for (let j = coluna.length - 1; j > 0; j--) {
      if (coluna[j] === coluna[j - 1]) {
        coluna[j] *= 2;
        score += coluna[j];
        coluna[j - 1] = 0;
      }
    }
    coluna = coluna.filter(x => x !== 0);
    while (coluna.length < 4) coluna.unshift(0);
    for (let row = 0; row < 4; row++) {
      if (tabuleiro[row][col] !== coluna[row]) mudou = true;
      tabuleiro[row][col] = coluna[row];
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
  score = 0;
  gameStatus = "playing";
  gerarNumero();
  gerarNumero();
}

function restart() {
  start();
}

// exportando funções para testes ou uso externo
export {
  getState,
  getScore,
  getStatus,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  restart,
  start,
};
