class Game {
  constructor(initialState = []) {
    this.boardSize = 4;
    this.initialState = initialState;
    this.resetGame();
  }

  resetGame() {
    this.board = [];

    if (this.initialState.length === this.boardSize) {
      this.board = this.initialState.map((row) => [...row]);
    } else {
      for (let i = 0; i < this.boardSize; i++) {
        this.board.push(new Array(this.boardSize).fill(0));
      }
    }

    this.score = 0;
    this.status = 'initial';
    this.hasWon = false;
    this.isStarted = false;
    this.isBoardChangedThisTurn = false;

    this.mergedThisTurn = Array(this.boardSize)
      .fill(0)
      .map(() => Array(this.boardSize).fill(false));
  }

  start() {
    console.log('Game.start() chamado');

    if (
      !this.isStarted ||
      this.status === 'gameOver' ||
      this.status === 'win'
    ) {
      this.resetGame();
      this._addRandomTile();
      this._addRandomTile();
      this.status = 'playing';
      this.isStarted = true;
      console.log('Jogo iniciado, status:', this.status);

      return true;
    }

    return false;
  }

  restart() {
    console.log('Game.restart() chamado');

    return this.start();
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    return this._performMove('left');
  }

  moveRight() {
    return this._performMove('right');
  }

  moveUp() {
    return this._performMove('up');
  }

  moveDown() {
    return this._performMove('down');
  }

  _performMove(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const initialBoard = this.board.map((row) => [...row]);

    this.isBoardChangedThisTurn = false;

    this.mergedThisTurn = Array(this.boardSize)
      .fill(0)
      .map(() => Array(this.boardSize).fill(false));

    let board = this.board;

    if (direction === 'up' || direction === 'down') {
      board = this._transpose(board);
    }

    for (let i = 0; i < this.boardSize; i++) {
      const rowOrCol = board[i];

      if (direction === 'right' || direction === 'down') {
        rowOrCol.reverse();
      }

      const filteredRow = rowOrCol.filter((tile) => tile !== 0);
      let newRow = [...filteredRow];

      for (let j = 0; j < newRow.length - 1; j++) {
        if (
          newRow[j] !== 0 &&
          newRow[j] === newRow[j + 1] &&
          !this.mergedThisTurn[i][j]
        ) {
          newRow[j] *= 2;
          this.score += newRow[j];
          newRow[j + 1] = 0;
          this.mergedThisTurn[i][j] = true;
        }
      }

      newRow = newRow.filter((tile) => tile !== 0);

      while (newRow.length < this.boardSize) {
        newRow.push(0);
      }

      if (direction === 'right' || direction === 'down') {
        newRow.reverse();
      }
      board[i] = newRow;
    }

    if (direction === 'up' || direction === 'down') {
      this.board = this._transpose(board);
    } else {
      this.board = board;
    }

    this.isBoardChangedThisTurn = !this._boardsAreEqual(
      initialBoard,
      this.board,
    );

    if (this.isBoardChangedThisTurn) {
      this._addRandomTile();
      this._checkWin();
      this._checkGameOver();
    }

    return this.isBoardChangedThisTurn;
  }

  _addRandomTile() {
    const emptyCells = this._getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  _getEmptyCells() {
    const emptyCells = [];

    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    return emptyCells;
  }

  _checkWin() {
    if (this.hasWon) {
      return;
    }

    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';
          this.hasWon = true;

          return;
        }
      }
    }
  }

  _checkGameOver() {
    if (this.status === 'win') {
      return;
    }

    if (this._getEmptyCells().length > 0) {
      return;
    }

    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize - 1; c++) {
        if (
          this.board[r][c] !== 0 &&
          this.board[r][c] === this.board[r][c + 1]
        ) {
          return;
        }
      }
    }

    for (let c = 0; c < this.boardSize; c++) {
      for (let r = 0; r < this.boardSize - 1; r++) {
        if (
          this.board[r][c] !== 0 &&
          this.board[r][c] === this.board[r + 1][c]
        ) {
          return;
        }
      }
    }

    this.status = 'gameOver';
  }

  _transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  _boardsAreEqual(board1, board2) {
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (board1[r][c] !== board2[r][c]) {
          return false;
        }
      }
    }

    return true;
  }
}

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
  console.log('Inicializando elementos DOM...');

  gameBoardElement = document.getElementById('gameBoard');
  scoreElement = document.getElementById('score');
  gameButton = document.getElementById('gameButton');
  startMessage = document.getElementById('startMessage');
  winMessage = document.getElementById('winMessage');
  gameOverMessage = document.getElementById('gameOverMessage');
  tryAgainWinButton = document.getElementById('tryAgainWin');
  tryAgainGameOverButton = document.getElementById('tryAgainGameOver');

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
  console.log('Atualizando UI...');

  if (!gameBoardElement) {
    console.error('gameBoardElement não encontrado!');

    return;
  }

  const board = game.getState();
  const score = game.getScore();
  const status = game.getStatus();

  console.log('Estado do jogo:', { board, score, status });

  gameBoardElement.innerHTML = '';

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

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  updateGameMessages(status);
  updateGameButton(status);
}

function updateGameMessages(status) {
  if (!startMessage || !winMessage || !gameOverMessage) {
    return;
  }

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  gameOverMessage.classList.add('hidden');

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
  console.log('Configurando event listeners...');

  if (gameButton) {
    gameButton.addEventListener('click', () => {
      console.log('Botão clicado!');

      if (game.getStatus() === 'initial') {
        console.log('Iniciando jogo...');
        game.start();
      } else {
        console.log('Reiniciando jogo...');
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

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, inicializando jogo...');

  if (initializeElements()) {
    game = new Game();
    console.log('Instância do jogo criada:', game);

    setupEventListeners();
    updateUI();

    console.log('Jogo inicializado com sucesso!');
  } else {
    console.error('Falha ao inicializar elementos DOM');
  }
});
