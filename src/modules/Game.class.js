'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
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

  /**
   * Gera um número aleatório (2 ou 4) em uma posição vazia
   */
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

  /**
   * Move as peças para a esquerda
   */
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

  /**
   * Move as peças para a direita
   */
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

  /**
   * Move as peças para cima
   */
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

  /**
   * Move as peças para baixo
   */
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

  /**
   * Mescla uma linha (usado para todos os movimentos)
   */
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

  /**
   * Verifica se há movimentos possíveis
   */
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

  /**
   * Verifica se o jogador venceu (atingiu 2048)
   */
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

  /**
   * Verifica o status do jogo
   */
  checkGameStatus() {
    if (this.hasWon()) {
      this.status = 'win';
    } else if (!this.hasValidMoves()) {
      this.status = 'lose';
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
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

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
