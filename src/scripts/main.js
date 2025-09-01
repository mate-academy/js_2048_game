'use strict';

// Classe Game implementada diretamente no arquivo
class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
    this.size = 4;
  }

  generateRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;

      this.board[randomCell.row][randomCell.col] = value;
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    const originalBoard = JSON.stringify(this.board);

    for (let i = 0; i < this.size; i++) {
      this.board[i] = this.mergeLine(this.board[i]);
    }

    const changed = JSON.stringify(this.board) !== originalBoard;

    if (changed) {
      this.generateRandomTile();
      this.checkGameStatus();
    }

    return changed;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    const originalBoard = JSON.stringify(this.board);

    for (let i = 0; i < this.size; i++) {
      const reversed = this.board[i].reverse();
      const merged = this.mergeLine(reversed);

      this.board[i] = merged.reverse();
    }

    const changed = JSON.stringify(this.board) !== originalBoard;

    if (changed) {
      this.generateRandomTile();
      this.checkGameStatus();
    }

    return changed;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    const originalBoard = JSON.stringify(this.board);

    for (let j = 0; j < this.size; j++) {
      const column = [];

      for (let i = 0; i < this.size; i++) {
        column.push(this.board[i][j]);
      }

      const merged = this.mergeLine(column);

      for (let i = 0; i < this.size; i++) {
        this.board[i][j] = merged[i];
      }
    }

    const changed = JSON.stringify(this.board) !== originalBoard;

    if (changed) {
      this.generateRandomTile();
      this.checkGameStatus();
    }

    return changed;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    const originalBoard = JSON.stringify(this.board);

    for (let j = 0; j < this.size; j++) {
      const column = [];

      for (let i = 0; i < this.size; i++) {
        column.push(this.board[i][j]);
      }

      const reversed = column.reverse();
      const merged = this.mergeLine(reversed);
      const finalColumn = merged.reverse();

      for (let i = 0; i < this.size; i++) {
        this.board[i][j] = finalColumn[i];
      }
    }

    const changed = JSON.stringify(this.board) !== originalBoard;

    if (changed) {
      this.generateRandomTile();
      this.checkGameStatus();
    }

    return changed;
  }

  mergeLine(line) {
    // Remove zeros
    const filtered = line.filter((cell) => cell !== 0);

    // Mescla números iguais adjacentes
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered.splice(i + 1, 1);
      }
    }

    // Adiciona zeros no final
    while (filtered.length < this.size) {
      filtered.push(0);
    }

    return filtered;
  }

  hasValidMoves() {
    // Verifica se há células vazias
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }
      }
    }

    // Verifica se há possibilidade de mesclar
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const current = this.board[i][j];

        // Verifica direita
        if (j < this.size - 1 && this.board[i][j + 1] === current) {
          return true;
        }

        // Verifica baixo
        if (i < this.size - 1 && this.board[i + 1][j] === current) {
          return true;
        }
      }
    }

    return false;
  }

  hasWon() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameStatus() {
    if (this.hasWon()) {
      this.status = 'win';
    } else if (!this.hasValidMoves()) {
      this.status = 'lose';
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    // Gera duas peças iniciais
    this.generateRandomTile();
    this.generateRandomTile();
  }

  restart() {
    this.start();
  }
}

// Cria uma instância do jogo
const game = new Game();

// Elementos da interface
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const startButton = document.getElementById('main-button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const restartLoseButton = document.getElementById('restart-lose');
const restartWinButton = document.getElementById('restart-win');

// Função para atualizar a interface do jogo
function updateGameInterface() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  // Atualiza o score
  gameScore.textContent = score;

  // Atualiza o tabuleiro
  const cells = gameField.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    // Remove todas as classes de valor
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });

  // Atualiza as mensagens baseado no status
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  switch (gameStatus) {
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
  }

  // Atualiza o botão
  if (gameStatus === 'playing') {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }
}

// Função para lidar com movimentos do teclado
function handleKeydown(evt) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (evt.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    updateGameInterface();
  }
}

// Função para lidar com cliques no botão
function handleButtonClick() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle' || gameStatus === 'win' || gameStatus === 'lose') {
    game.start();
  } else {
    game.restart();
  }

  updateGameInterface();
}

// Função para lidar com toques em dispositivos móveis
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(evt) {
  touchStartX = evt.touches[0].clientX;
  touchStartY = evt.touches[0].clientY;
}

function handleTouchEnd(evt) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const touchEndX = evt.changedTouches[0].clientX;
  const touchEndY = evt.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  const minSwipeDistance = 30;
  let moved = false;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Movimento horizontal
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        moved = game.moveRight();
      } else {
        moved = game.moveLeft();
      }
    }
  } else {
    // Movimento vertical
    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        moved = game.moveDown();
      } else {
        moved = game.moveUp();
      }
    }
  }

  if (moved) {
    updateGameInterface();
  }
}

// Adiciona event listeners
document.addEventListener('keydown', handleKeydown);
startButton.addEventListener('click', handleButtonClick);

// Adiciona event listeners para os botões de restart
restartLoseButton.addEventListener('click', handleButtonClick);
restartWinButton.addEventListener('click', handleButtonClick);

// Suporte para dispositivos móveis
gameField.addEventListener('touchstart', handleTouchStart, { passive: true });
gameField.addEventListener('touchend', handleTouchEnd, { passive: true });

// Inicializa a interface
updateGameInterface();

// Previne o comportamento padrão de scroll em dispositivos móveis
gameField.addEventListener(
  'touchmove',
  (evt) => {
    evt.preventDefault();
  },
  { passive: false },
);
