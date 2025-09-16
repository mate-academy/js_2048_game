'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  // Tabuleiro Inicial
  constructor(tableId, scoreId, startId) {
    this.tableId = tableId;
    this.scoreId = scoreId;
    this.startId = startId;

    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = this.initialState;
    this.score = 0;
    this.hasWon = false;
    this.status = 'idle';
    this.gameOver = false;
  }

  // Metodo para iniciar o jogo
  start() {
    this.status = 'playing';
    // Adiciona dois números iniciais ao tabuleiro
    this.addRandomTile();
    this.addRandomTile();
    // Esconde a mensagem inicial
    document.querySelector('.message-start').classList.add('hidden');
    // Atualiza o display
    this.updateDisplay();
  }

  init() {
    // Configura os eventos
    this.bindEvents();
    // Atualiza o display inicial
    this.updateDisplay();
  }

  // Metodo para reiniciar o jogo
  restart() {
    // Reseta o tabuleiro
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    // Reseta estados
    this.score = 0;
    this.status = 'idle';
    this.gameOver = false;
    this.hasWon = false;

    // Esconde todas as mensagens
    document.querySelectorAll('.message').forEach((msg) => {
      msg.classList.add('hidden');
    });

    // Mostra mensagem inicial
    document.querySelector('.message-start').classList.remove('hidden');

    // Reseta texto do botão
    const startButton = document.getElementById(this.startId);

    if (startButton) {
      startButton.textContent = 'Start';
    }

    // Atualiza display
    this.updateScore();
    this.updateDisplay();
  }

  // Metodo para adicionar um valor de (2 ou 4) em uma posição aleatória
  addRandomTile() {
    const emptyCells = [];

    // Encontrar todas as células vazias
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    // Adiciona o valor de (2 ou 4) em uma célula vazia aleatória
    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      const newValue = Math.random() < 0.9 ? 2 : 4;

      this.board[randomCell.row][randomCell.col] = newValue;
    }
  }

  // Metodo para movimentar o tabuleiro
  move(direction) {
    if (this.gameOver || this.status !== 'playing') {
      return;
    }

    let moved = false;

    switch (direction) {
      case 'left':
        moved = this.moveLeft();
        break;
      case 'right':
        moved = this.moveRight();
        break;
      case 'up':
        moved = this.moveUp();
        break;
      case 'down':
        moved = this.moveDown();
        break;
      default:
        return;
    }

    // Só adiciona nova peça se houve movimento
    if (moved) {
      this.addRandomTile();
      this.updateDisplay();
      this.updateScore();
      this.checkGameState();
    }
  }

  // Metodo para movimentar para a esquerda
  moveLeft() {
    let moved = false;
    const newBoard = this.board.map((row) => {
      const newRow = row.filter((num) => num !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i]; // Adiciona ao score
          newRow[i + 1] = 0;
          moved = true;
        }
      }

      const merged = newRow.filter((num) => num !== 0);

      while (merged.length < 4) {
        merged.push(0);
      }

      return merged;
    });

    this.board = newBoard;

    return moved;
  }

  // Metodo para movimentar para a direita
  moveRight() {
    let moved = false;
    const newBoard = this.board.map((row) => {
      const newRow = row.filter((num) => num !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          this.score += newRow[i]; // Adiciona ao score
          newRow[i - 1] = 0;
          moved = true;
        }
      }

      const merged = newRow.filter((num) => num !== 0);

      while (merged.length < 4) {
        merged.unshift(0);
      }

      return merged;
    });

    this.board = newBoard;

    return moved;
  }

  // Metodo para movimentar para cima
  moveUp() {
    let moved = false;
    const newBoard = [[], [], [], []];

    for (let col = 0; col < 4; col++) {
      const newCol = [];
      const originalCol = this.board.map((row) => row[col]);

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol[i + 1] = 0;
        }

        if (JSON.stringify(originalCol) !== JSON.stringify(newCol)) {
          moved = true;
        }
      }

      // Remove os zeros novamente após a fusão e adiciona zeros ao final
      const merged = newCol.filter((num) => num !== 0);

      while (merged.length < 4) {
        merged.push(0);
      }

      // Preenche a nova coluna no novo tabuleiro
      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = merged[row];
      }
    }

    this.board = newBoard;

    return moved;
  }
  // Metodo para movimentar para baixo
  moveDown() {
    let moved = false;
    const newBoard = [[], [], [], []];

    for (let col = 0; col < 4; col++) {
      const newCol = [];
      const originalCol = this.board.map((row) => row[col]);

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = newCol.length - 1; i > 0; i--) {
        if (newCol[i] === newCol[i - 1]) {
          newCol[i] *= 2;
          this.score += newCol[i];
          newCol[i - 1] = 0;
        }

        if (JSON.stringify(originalCol) !== JSON.stringify(newCol)) {
          moved = true;
        }
      }

      // Remove os zeros novamente após a fusão e adiciona zeros ao início
      const merged = newCol.filter((num) => num !== 0);

      while (merged.length < 4) {
        merged.unshift(0);
      }

      // Preenche a nova coluna no novo tabuleiro
      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = merged[row];
      }
    }

    this.board = newBoard;

    return moved;
  }

  updateScore() {
    const scoreElement = document.getElementById(this.scoreId);

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  updateDisplay() {
    const table = document.getElementById(this.tableId);

    if (!table) {
      return;
    }

    const cells = table.getElementsByClassName('field-cell');
    let cellIndex = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];
        const cell = cells[cellIndex];

        // Remove classes antigas
        cell.className = 'field-cell';

        // Adiciona o valor como texto
        cell.textContent = value || '';

        // Adiciona a classe específica do valor
        if (value) {
          cell.classList.add(`field-cell--${value}`);
        }

        cellIndex++;
      }
    }
  }

  bindEvents() {
    // Evento do botão start
    const startButton = document.getElementById(this.startId);

    if (startButton) {
      startButton.addEventListener('click', () => {
        if (this.status === 'idle') {
          // Primeiro clique - Inicia o jogo
          this.start();
          startButton.textContent = 'Restart';
        } else {
          // Cliques subsequentes - Reinicia o jogo
          this.restart();
          // Mostra mensagem inicial
          document.querySelector('.message-start').classList.remove('hidden');
        }
      });
    }

    // Eventos do teclado
    document.addEventListener('keydown', (e) => {
      if (this.status !== 'playing') {
        return;
      }

      let moved = false;

      switch (e.key) {
        case 'ArrowLeft':
          moved = this.moveLeft();
          break;
        case 'ArrowRight':
          moved = this.moveRight();
          break;
        case 'ArrowUp':
          moved = this.moveUp();
          break;
        case 'ArrowDown':
          moved = this.moveDown();
          break;
      }

      // Se houve movimento, adiciona duas novas peças
      if (moved) {
        this.addRandomTile();
        this.addRandomTile();
        this.updateScore();
        this.updateDisplay();
        this.checkGameState();
      }
    });
  }

  checkGameState() {
    // Verifica se perdeu
    if (!this.canMove()) {
      this.gameOver = true;
      this.status = 'idle'; // Adiciona esta linha

      const message = document.querySelector('.message-lose');

      if (message) {
        message.classList.remove('hidden');
      }
    }

    // Verifica se ganhou (atingiu 2048)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.hasWon = true;

          const message = document.querySelector('.message-win');

          if (message) {
            message.classList.remove('hidden');
          }

          return;
        }
      }
    }
  }

  canMove() {
    // Verifica se há células vazias
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        const current = this.board[row][col];

        // Verifica a célula à direita
        if (col < 3 && this.board[row][col + 1] === current) {
          return true;
        }

        // Verifica a célula abaixo
        if (row < 3 && this.board[row + 1][col] === current) {
          return true;
        }
      }
    }

    return false;
  }

  hideMessage() {
    const message = document.getElementById('message');

    message.style.display = 'none';
  }
}

module.exports = Game;
