/* eslint-disable prettier/prettier */
'use strict';

/**
 * This class represents the game.
 * It has a basic structure, that is needed for testing.
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
   * [0, 0, 0, 0],
   * [0, 0, 0, 0],
   * [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
    // O tabuleiro atual do jogo, inicializado como uma cópia do initialState
    this.board = this.initialState.map((row) => row.slice());
  }

  /**
   * @returns {boolean} True se um tile foi adicionado, false caso contrário.
   */
  addRandomTile() {
    const emptyCells = [];

    // Encontra todas as células vazias
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // Adiciona um 2 (90% de chance) ou um 4 (10% de chance)
    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  /**
   * Helper function to process a line (row or column) for sliding and merging.
   * This method applies the slide and merge logic and
   *  calculates the score gained for that line.
   *
   * @param {number[]} line The array representing a row or column to process.
   * @param {boolean} [isReverse=false]
   * True if processing from right/bottom to left/top
   * (e.g., moveRight, moveDown).
   * @returns {{newLine: number[], score: number}}
   *  An object containing the processed line and the score gained.
   */
  _processLine(line, isReverse = false) {
    let filteredLine = line.filter(val => val !== 0);
    // Use an array to track if a tile has already been merged
    //  in this specific move.
    // This prevents a single tile from merging multiple times.
    const mergedFlags = new Array(filteredLine.length).fill(false);
    let currentScore = 0;

    if (isReverse) {
      // Process from right to left (or bottom to top for columns)
      for (let i = filteredLine.length - 1; i > 0; i--) {
        if (filteredLine[i] === filteredLine[i - 1] &&
          !mergedFlags[i] && !mergedFlags[i - 1]) {
          filteredLine[i] *= 2;
          currentScore += filteredLine[i];
          filteredLine[i - 1] = 0;
          mergedFlags[i] = true;
          mergedFlags[i - 1] = true; // Mark both as used for merging
        }
      }
    } else {
      // Process from left to right (or top to bottom for columns)
      for (let i = 0; i < filteredLine.length - 1; i++) {
        if (filteredLine[i] === filteredLine[i + 1] &&
          !mergedFlags[i] && !mergedFlags[i + 1]) {
          filteredLine[i] *= 2;
          currentScore += filteredLine[i];
          filteredLine[i + 1] = 0;
          mergedFlags[i] = true;
          mergedFlags[i + 1] = true;
        }
      }
    }

    // Remove zeros resulting from merges and re-compact the line
    filteredLine = filteredLine.filter(val => val !== 0);

    // Pad the line with zeros to ensure it's always 4 elements long
    const newPaddedLine = Array(4).fill(0);

    if (isReverse) {
      // For right/down moves, add zeros to the beginning
      for (let i = 0; i < filteredLine.length; i++) {
        newPaddedLine[4 - filteredLine.length + i] = filteredLine[i];
      }
    } else {
      // For left/up moves, add zeros to the end
      for (let i = 0; i < filteredLine.length; i++) {
        newPaddedLine[i] = filteredLine[i];
      }
    }

    return { newLine: newPaddedLine, score: currentScore };
  }


  /**
   * Realiza um movimento para a esquerda.
   * @returns {boolean} True se o tabuleiro mudou, false caso contrário.
   */
  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let movedOccurred = false;
    const oldBoard = this.board.map(row => [...row]);
    // Deep copy of the board before move
    let totalScoreForMove = 0;

    for (let r = 0; r < 4; r++) {
      const { newLine, score } = this._processLine(this.board[r], false);

      totalScoreForMove += score;

      if (!this.arraysEqual(newLine, oldBoard[r])) {
        this.board[r] = newLine;
        movedOccurred = true;
      }
    }

    if (movedOccurred) {
      this.score += totalScoreForMove;
      this.addRandomTile();
      this.updateGameStatus();
    }

    return movedOccurred;
  }

  /**
   * Realiza um movimento para a direita.
   * @returns {boolean} True se o tabuleiro mudou, false caso contrário.
   */
  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let movedOccurred = false;
    const oldBoard = this.board.map(row => [...row]);
    let totalScoreForMove = 0;

    for (let r = 0; r < 4; r++) {
      const { newLine, score } = this._processLine(this.board[r], true);
      // true for reverse

      totalScoreForMove += score;

      if (!this.arraysEqual(newLine, oldBoard[r])) {
        this.board[r] = newLine;
        movedOccurred = true;
      }
    }

    if (movedOccurred) {
      this.score += totalScoreForMove;
      this.addRandomTile();
      this.updateGameStatus();
    }

    return movedOccurred;
  }

  /**
   * Realiza um movimento para cima.
   * @returns {boolean} True se o tabuleiro mudou, false caso contrário.
   */
  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let movedOccurred = false;
    const oldBoard = this.board.map(row => [...row]);
    let totalScoreForMove = 0;

    // Transpõe o tabuleiro para processar colunas como linhas
    // Cria um novo array onde as colunas do oldBoard se tornam as linhas

    const transposedOldBoard = Array.from({ length: 4 }, (_, i) =>
      Array.from({ length: 4 }, (__, j) => oldBoard[j][i]));


    const newTransposedBoard = Array.from({ length: 4 },
      () => Array(4).fill(0));

    for (let c = 0; c < 4; c++) {
      const currentColumn = transposedOldBoard[c];
      // Pega a coluna (que agora é uma linha)
      const { newLine, score } = this._processLine(currentColumn, false);
      // Processa como moveLeft

      totalScoreForMove += score;
      newTransposedBoard[c] = newLine;
    }

    // Re-transpõe o tabuleiro de volta para o formato original
    const newBoard = Array.from({ length: 4 }, (_, i) =>
      Array.from({ length: 4 }, (__, j) => newTransposedBoard[j][i]));

    // Compara o tabuleiro antigo e o novo para ver se houve movimento
    // Convertemos para flat para uma comparação de
    // array unidimensional mais simples
    if (!this.arraysEqual(newBoard.flat(), oldBoard.flat())) {
      this.board = newBoard;
      movedOccurred = true;
    }

    if (movedOccurred) {
      this.score += totalScoreForMove;
      this.addRandomTile();
      this.updateGameStatus();
    }

    return movedOccurred;
  }

  /**
   * Realiza um movimento para baixo.
   * @returns {boolean} True se o tabuleiro mudou, false caso contrário.
   */
  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let movedOccurred = false;
    const oldBoard = this.board.map(row => [...row]);
    let totalScoreForMove = 0;

    // Transpõe o tabuleiro para processar colunas como linhas
    const transposedOldBoard = Array.from({ length: 4 }, (_, i) =>
      Array.from({ length: 4 }, (__, j) => oldBoard[j][i]));


    const newTransposedBoard = Array.from({ length: 4 },
      () => Array(4).fill(0));

    for (let c = 0; c < 4; c++) {
      const currentColumn = transposedOldBoard[c];
      const { newLine, score } = this._processLine(currentColumn, true);
      // Processa como moveRight (reverse)

      totalScoreForMove += score;
      newTransposedBoard[c] = newLine;
    }

    // Re-transpõe o tabuleiro de volta
    const newBoard = Array.from({ length: 4 }, (_, i) =>
      Array.from({ length: 4 }, (__, j) => newTransposedBoard[j][i]));


    if (!this.arraysEqual(newBoard.flat(), oldBoard.flat())) {
      this.board = newBoard;
      movedOccurred = true;
    }

    if (movedOccurred) {
      this.score += totalScoreForMove;
      this.addRandomTile();
      this.updateGameStatus();
    }

    return movedOccurred;
  }

  /**
   * Retorna a pontuação atual do jogo.
   * @returns {number} A pontuação atual.
   */
  getScore() {
    return this.score;
  }

  /**
   * Retorna o estado atual do tabuleiro.
   * @returns {number[][]} Uma cópia profunda do tabuleiro.
   */
  getState() {
    return this.board.map((row) => row.slice());
  }

  /**
   * Retorna o status atual do jogo.
   * @returns {string} Um dos seguintes: 'idle', 'playing', 'win', 'lose'.
   */
  getStatus() {
    return this.status;
  }

  /**
   * Inicia o jogo, resetando o tabuleiro e adicionando tiles iniciais.
   */
  start() {
    this.status = 'playing';

    this.board = this.initialState.map((row) => row.slice());
    this.score = 0;

    this.addRandomTile();
    this.addRandomTile();

    this.updateGameStatus();
  }

  /**
   * Reinicia o jogo para o seu estado inicial
   */
  restart() {
    this.status = 'idle'; // Retorna o status para 'idle'
    // Restaura o tabuleiro para o estado inicial original
    this.board = this.initialState.map((row) => row.slice());
    this.score = 0;
  }

  /**
   * Compara dois arrays para verificar se são iguais.
   * Adaptado para funcionar com arrays unidimensionais ou
   * arrays bidimensionais (quando flat).
   * @param {Array} a Primeiro array.
   * @param {Array} b Segundo array.
   * @returns {boolean} True se os arrays são iguais, false caso contrário.
   */
  arraysEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Atualiza o status do jogo (ganho ou perdido).
   */
  updateGameStatus() {
    if (this.checkWin()) {
      this.status = 'win';

      return; // Venceu, não precisa verificar perda
    }

    if (!this.canMove()) {
      this.status = 'lose';
    } else {
      this.status = 'playing'; // Continua jogando se ainda pode mover
    }
  }

  /**
   * Verifica se o jogador atingiu a célula 2048.
   * @returns {boolean} True se o 2048 for encontrado, false caso contrário.
   */
  checkWin() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Simula um movimento em uma direção específica em um tabuleiro temporário
   * para verificar se o movimento é possível sem alterar o estado real do jogo.
   *
   * @param {number[][]} tempBoard O tabuleiro a ser simulado.
   * @param {string} direction Move direction ('left', 'right', 'up', 'down').
   * @returns {boolean} True se a simulação do movimento resultaria em
   * uma mudança, false caso contrário.
   */
  simulateMove(tempBoard, direction) {
    // Cria uma cópia profunda do tabuleiro para a simulação
    const simulatedBoard = tempBoard.map(row => [...row]);
    let simulatedMoved = false;

    // Transpõe para facilitar a simulação de movimentos verticais
    let processedBoard = simulatedBoard;

    if (direction === 'up' || direction === 'down') {
      processedBoard = Array.from({ length: 4 }, (_, i) =>
        Array.from({ length: 4 }, (__, j) => simulatedBoard[j][i]));
    }

    for (let i = 0; i < 4; i++) {
      const currentLine = processedBoard[i];

      const { newLine } = this._processLine(currentLine,
        direction === 'right' ||
        direction === 'down');

      // Se a linha simulada for diferente da original, houve um movimento
      if (!this.arraysEqual(currentLine, newLine)) {
        simulatedMoved = true;
        break;
      }
    }

    return simulatedMoved;
  }

  /**
   * @returns {boolean} True se um movimento é possível, false caso contrário.
   */
  canMove() {
    // 1. Verifica se há células vazias (se sim, sempre é possível mover)
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    // 2. Se não há células vazias, verifica se alguma mesclagem é possível
    const directions = ['left', 'right', 'up', 'down'];

    for (const direction of directions) {
      // Usa simulateMove para verificar se qualquer movimento alteraria
      // o tabuleiro
      if (this.simulateMove(this.board, direction)) {
        return true;
      }
    }

    return false; // Nenhuma célula vazia e nenhuma mesclagem possível
  }
}

module.exports = Game;
