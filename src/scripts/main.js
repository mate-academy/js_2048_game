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

function move(direction) {
  let mudou = false;

  for (let i = 0; i < 4; i++) {
    let linha;
    if (direction === "up" || direction === "down") {
      linha = [tabuleiro[0][i], tabuleiro[1][i], tabuleiro[2][i], tabuleiro[3][i]];
    } else {
      linha = [...tabuleiro[i]];
    }

    const original = [...linha];

    if (direction === "right" || direction === "down") linha.reverse();

    // Compacta e mescla
    linha = linha.filter(x => x !== 0);
    for (let j = 0; j < linha.length - 1; j++) {
      if (linha[j] === linha[j + 1]) {
        linha[j] *= 2;
        score += linha[j];
        linha[j + 1] = 0;
      }
    }
    linha = linha.filter(x => x !== 0);
    while (linha.length < 4) linha.push(0);

    if (direction === "right" || direction === "down") linha.reverse();

    // Checa se houve mudança
    if (!mudou) {
      for (let k = 0; k < 4; k++) {
        if (linha[k] !== original[k]) {
          mudou = true;
          break;
        }
      }
    }

    if (direction === "up" || direction === "down") {
      for (let j = 0; j < 4; j++) tabuleiro[j][i] = linha[j];
    } else {
      tabuleiro[i] = linha;
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

function restart() { start(); }
