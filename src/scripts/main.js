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

// --- Movimentos refatorados ---
function moveLeft() {
  let mudou = false;

  for (let i = 0; i < 4; i++) {
    let linha = tabuleiro[i].filter(x => x !== 0);
    for (let j = 0; j < linha.length - 1; j++) {
      if (linha[j] === linha[j + 1]) {
        linha[j] *= 2;
        somar += linha[j];
        linha[j + 1] = 0;
      }
    }
    linha = linha.filter(x => x !== 0);
    while (linha.length < 4) linha.push(0);
    if (!mudou && linha.some((v, idx) => v !== tabuleiro[i][idx])) mudou = true;
    tabuleiro[i] = linha;
  }

  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function moveRight() {
  let mudou = false;

  for (let i = 0; i < 4; i++) {
    let linha = tabuleiro[i].filter(x => x !== 0);
    for (let j = linha.length - 1; j > 0; j--) {
      if (linha[j] === linha[j - 1]) {
        linha[j] *= 2;
        somar += linha[j];
        linha[j - 1] = 0;
      }
    }
    linha = linha.filter(x => x !== 0);
    while (linha.length < 4) linha.unshift(0);
    if (!mudou && linha.some((v, idx) => v !== tabuleiro[i][idx])) mudou = true;
    tabuleiro[i] = linha;
  }

  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function moveUp() {
  let mudou = false;

  for (let i = 0; i < 4; i++) {
    let coluna = [];
    for (let j = 0; j < 4; j++) coluna.push(tabuleiro[j][i]);
    coluna = coluna.filter(x => x !== 0);

    for (let j = 0; j < coluna.length - 1; j++) {
      if (coluna[j] === coluna[j + 1]) {
        coluna[j] *= 2;
        somar += coluna[j];
        coluna[j + 1] = 0;
      }
    }

    coluna = coluna.filter(x => x !== 0);
    while (coluna.length < 4) coluna.push(0);

    for (let j = 0; j < 4; j++) {
      if (tabuleiro[j][i] !== coluna[j]) mudou = true;
      tabuleiro[j][i] = coluna[j];
    }
  }

  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function moveDown() {
  let mudou = false;

  for (let i = 0; i < 4; i++) {
    let coluna = [];
    for (let j = 0; j < 4; j++) coluna.push(tabuleiro[j][i]);
    coluna = coluna.filter(x => x !== 0);

    for (let j = coluna.length - 1; j > 0; j--) {
      if (coluna[j] === coluna[j - 1]) {
        coluna[j] *= 2;
        somar += coluna[j];
        coluna[j - 1] = 0;
      }
    }

    coluna = coluna.filter(x => x !== 0);
    while (coluna.length < 4) coluna.unshift(0);

    for (let j = 0; j < 4; j++) {
      if (tabuleiro[j][i] !== coluna[j]) mudou = true;
      tabuleiro[j][i] = coluna[j];
    }
  }

  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

// --- Início e reinício do jogo ---
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
