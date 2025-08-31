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
  const vazio = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (tabuleiro[r][c] === 0) vazio.push([r, c]);
    }
  }
  if (vazio.length === 0) return;
  const [r, c] = vazio[Math.floor(Math.random() * vazio.length)];
  tabuleiro[r][c] = Math.random() < 0.1 ? 4 : 2;
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
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (tabuleiro[r][c] === 2048) gameStatus = "win";
    }
  }
}

function checkGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (tabuleiro[r][c] === 0) return;
      if (r < 3 && tabuleiro[r][c] === tabuleiro[r + 1][c]) return;
      if (c < 3 && tabuleiro[r][c] === tabuleiro[r][c + 1]) return;
    }
  }
  gameStatus = "over";
}

function move(direction) {
  let mudou = false;

  for (let i = 0; i < 4; i++) {
    const original = [];
    const linha = [];

    for (let j = 0; j < 4; j++) {
      const valor = direction === "up" || direction === "down" ? tabuleiro[j][i] : tabuleiro[i][j];
      linha.push(valor);
      original.push(valor);
    }

    if (direction === "right" || direction === "down") linha.reverse();

    // Compacta e mescla
    let compacta = linha.filter(x => x !== 0);
    for (let j = 0; j < compacta.length - 1; j++) {
      if (compacta[j] === compacta[j + 1]) {
        compacta[j] *= 2;
        score += compacta[j];
        compacta[j + 1] = 0;
      }
    }
    compacta = compacta.filter(x => x !== 0);
    while (compacta.length < 4) compacta.push(0);

    if (direction === "right" || direction === "down") compacta.reverse();

    for (let j = 0; j < 4; j++) {
      if (compacta[j] !== original[j]) mudou = true;
      if (direction === "up" || direction === "down") tabuleiro[j][i] = compacta[j];
      else tabuleiro[i][j] = compacta[j];
    }
  }

  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

function moveLeft() { move("left"); }
function moveRight() { move("right"); }
function moveUp() { move("up"); }
function moveDown() { move("down"); }

function start() {
  tabuleiro = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
  score = 0;
  gameStatus = "playing";
  gerarNumero();
  gerarNumero();
}

function restart() {
  start();
}
