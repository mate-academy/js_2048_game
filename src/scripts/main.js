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
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 4; col++)
      if (tabuleiro[row][col] === 0) vazio.push([row, col]);
  if (vazio.length === 0) return;
  let [row, col] = vazio[Math.floor(Math.random() * vazio.length)];
  tabuleiro[row][col] = Math.random() < 0.1 ? 4 : 2;
}

function getState() { return tabuleiro.map(row => [...row]); }
function getScore() { return score; }
function getStatus() { return gameStatus; }

function checkWin() {
  if (tabuleiro.flat().includes(2048)) gameStatus = "win";
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

// Função genérica para movimentos
function move(direction) {
  let mudou = false;

  const getLine = i => direction === "up" || direction === "down"
    ? [tabuleiro[0][i], tabuleiro[1][i], tabuleiro[2][i], tabuleiro[3][i]]
    : [...tabuleiro[i]];

  const setLine = (i, line) => {
    if (direction === "up" || direction === "down")
      for (let j = 0; j < 4; j++) tabuleiro[j][i] = line[j];
    else tabuleiro[i] = line;
  };

  for (let i = 0; i < 4; i++) {
    let linha = getLine(i).filter(x => x !== 0);

    if (direction === "right" || direction === "down") linha.reverse();

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

    if (!mudou && linha.some((v, idx) => v !== getLine(i)[idx])) mudou = true;

    setLine(i, linha);
  }

  if (mudou) gerarNumero();
  checkWin();
  checkGameOver();
}

// Movimentos específicos
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
