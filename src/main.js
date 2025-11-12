// main.js - Versão completa sem módulos ES6

// Classe Game incorporada diretamente
import Game from './modules/Game.class.js';

// Interface do Usuário
let game;
let gameBoardElement;
let scoreElement;
let gameButton;
let startMessage;
let winMessage;
let gameOverMessage;
let tryAgainWinButton;
let tryAgainGameOverButton;

function initializeElements() {
  console.log('Inicializando elementos DOM...'); // Debug

  gameBoardElement = document.getElementById('gameBoard');
  scoreElement = document.getElementById('score');
  gameButton = document.getElementById('gameButton');
  startMessage = document.getElementById('startMessage');
  winMessage = document.getElementById('winMessage');
  gameOverMessage = document.getElementById('gameOverMessage');
  tryAgainWinButton = document.getElementById('tryAgainWin');
  tryAgainGameOverButton = document.getElementById('tryAgainGameOver');

  // Verificar se todos os elementos foram encontrados
  const elements = {
    gameBoardElement,
    scoreElement,
    gameButton,
    startMessage,
    winMessage,
    gameOverMessage,
    tryAgainWinButton,
    tryAgainGameOverButton,
  };

  for (const [name, element] of Object.entries(elements)) {
    if (!element) {
      console.error(`Elemento não encontrado: ${name}`);
    } else {
      console.log(`Elemento encontrado: ${name}`);
    }
  }

  return Object.values(elements).every((el) => el !== null);
}

function updateUI() {
  console.log('Atualizando UI...'); // Debug

  if (!gameBoardElement) {
    console.error('gameBoardElement não encontrado!');

    return;
  }

  const board = game.getState();
  const score = game.getScore();
  const status = game.getStatus();

  console.log('Estado do jogo:', { board, score, status }); // Debug

  // Limpar tabuleiro anterior
  gameBoardElement.innerHTML = '';

  // Renderizar novo tabuleiro
  board.forEach((row) => {
    row.forEach((cellValue) => {
      const cellDiv = document.createElement('div');

      cellDiv.classList.add('field-cell');

      if (cellValue === 0) {
        cellDiv.classList.add('field-cell--empty');
      } else {
        cellDiv.classList.add(`field-cell--${cellValue}`);
        cellDiv.textContent = cellValue;
      }

      gameBoardElement.appendChild(cellDiv);
    });
  });

  // Atualizar pontuação
  if (scoreElement) {
    scoreElement.textContent = score;
  }

  // Gerenciar mensagens e botões
  updateGameMessages(status);
  updateGameButton(status);
}

function updateGameMessages(status) {
  if (!startMessage || !winMessage || !gameOverMessage) {
    return;
  }

  // Esconder todas as mensagens primeiro
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  gameOverMessage.classList.add('hidden');

  // Mostrar mensagem apropriada
  switch (status) {
    case 'initial':
      startMessage.classList.remove('hidden');
      break;
    case 'win':
      winMessage.classList.remove('hidden');
      break;
    case 'gameOver':
      gameOverMessage.classList.remove('hidden');
      break;
  }
}

function updateGameButton(status) {
  if (!gameButton) {
    return;
  }

  if (status === 'initial') {
    gameButton.textContent = 'Start';
    gameButton.className = 'game-button start';
  } else {
    gameButton.textContent = 'Restart';
    gameButton.className = 'game-button restart';
  }
}

function setupEventListeners() {
  console.log('Configurando event listeners...'); // Debug

  if (gameButton) {
    gameButton.addEventListener('click', () => {
      console.log('Botão clicado!'); // Debug

      if (game.getStatus() === 'initial') {
        console.log('Iniciando jogo...'); // Debug
        game.start();
      } else {
        console.log('Reiniciando jogo...'); // Debug
        game.restart();
      }
      updateUI();
    });
    console.log('Event listener do botão configurado');
  }

  if (tryAgainWinButton) {
    tryAgainWinButton.addEventListener('click', () => {
      game.restart();
      updateUI();
    });
  }

  if (tryAgainGameOverButton) {
    tryAgainGameOverButton.addEventListener('click', () => {
      game.restart();
      updateUI();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        moved = game.moveLeft();
        break;
      case 'ArrowRight':
        event.preventDefault();
        moved = game.moveRight();
        break;
      case 'ArrowUp':
        event.preventDefault();
        moved = game.moveUp();
        break;
      case 'ArrowDown':
        event.preventDefault();
        moved = game.moveDown();
        break;
    }

    if (moved) {
      updateUI();
    }
  });

  console.log('Todos os event listeners configurados');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, inicializando jogo...'); // Debug

  if (initializeElements()) {
    game = new Game();
    console.log('Instância do jogo criada:', game); // Debug

    setupEventListeners();
    updateUI();

    console.log('Jogo inicializado com sucesso!');
  } else {
    console.error('Falha ao inicializar elementos DOM');
  }
});
