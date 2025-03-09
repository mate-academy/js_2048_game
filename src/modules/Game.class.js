'use strict';

// export class Game {
class Game {
  constructor(initialState) {
    this.initialState = initialState || this.createDefaultBoard();
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  createDefaultBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'idle';
    this.score = 0;
  }

  adjacentNumbers(row) {
    // Primeiro, removemos todos os zeros para avaliar a adjacência
    const nonZeroNumbers = row.filter((num) => num !== 0);

    // Array resultado começando com o tamanho original, preenchido com zeros
    const result = Array(row.length).fill(0);

    // Índice para o array resultado
    let resultIndex = 0;

    // Percorrendo o array sem zeros
    let i = 0;

    while (i < nonZeroNumbers.length) {
      // Se o número atual é igual ao próximo, somamos e avançamos dois índices
      if (
        i + 1 < nonZeroNumbers.length &&
        nonZeroNumbers[i] === nonZeroNumbers[i + 1]
      ) {
        result[resultIndex] = nonZeroNumbers[i] * 2;
        this.score += nonZeroNumbers[i] * 2;
        i += 2;
      } else {
        // Caso contrário, apenas copiamos o número atual
        result[resultIndex] = nonZeroNumbers[i];
        i += 1;
      }
      resultIndex++;
    }

    return result;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = JSON.stringify(this.board);

    // Para cada linha do tabuleiro
    for (let i = 0; i < this.board.length; i++) {
      // Filtra os números diferentes de zero
      let nonZeroNumbers = this.board[i].filter((num) => num !== 0);

      // se existir adjacentes, já volta mesclado
      const checkAdjacent = this.adjacentNumbers(nonZeroNumbers);

      // nonZeroNumbers = checkAdjacent;
      nonZeroNumbers = checkAdjacent.filter((num) => num !== 0);

      // Cria uma nova linha preenchida com zeros
      const newRow = Array(this.board[i].length).fill(0);

      // Coloca os números não-zero no final da linha (direita)
      // Se tivermos uma linha com tamanho 4 e 2 números não-zero,
      // eles começarão nas posições 2 e 3 (índices)
      for (let j = 0; j < nonZeroNumbers.length; j++) {
        newRow[this.board[i].length - nonZeroNumbers.length + j] =
          nonZeroNumbers[j];
      }

      // Substitui a linha atual pela nova linha
      this.board[i] = newRow;
    }

    // adiciona um tile se board foi alterado
    if (previousBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      } else {
        this.checkWinCondition();
      }
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = JSON.stringify(this.board);

    // Para cada linha do tabuleiro
    for (let i = 0; i < this.board.length; i++) {
      // Filtra os números diferentes de zero
      let nonZeroNumbers = this.board[i].filter((num) => num !== 0);
      // console.log(nonZeroNumbers);
      const checkAdjacent = this.adjacentNumbers(nonZeroNumbers);

      nonZeroNumbers = checkAdjacent;
      // console.log(checkAdjacent);

      // Preenche o resto da linha com zeros
      const zerosToAdd = this.board[i].length - nonZeroNumbers.length;
      const newRow = [...nonZeroNumbers, ...Array(zerosToAdd).fill(0)];
      // console.log(newRow);

      // Substitui a linha atual pela nova linha
      this.board[i] = newRow;
    }

    // adiciona um tile se board foi alterado
    if (previousBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      } else {
        this.checkWinCondition();
      }
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = JSON.stringify(this.board);

    // Para cada coluna do tabuleiro
    // console.log('this.board[0].length >>> ' + this.board[0].length);
    for (let j = 0; j < this.board[0].length; j++) {
      // Extrai os números da coluna atual
      const column = [];

      for (let i = 0; i < this.board.length; i++) {
        column.push(this.board[i][j]);
      }

      // Filtra os números diferentes de zero
      let nonZeroNumbers = column.filter((num) => num !== 0);

      // Verifica e mescla números adjacentes
      const checkAdjacent = this.adjacentNumbers(nonZeroNumbers);

      nonZeroNumbers = checkAdjacent;

      // Preenche o resto da coluna com zeros
      const zerosToAdd = this.board.length - nonZeroNumbers.length;
      const newColumn = [...nonZeroNumbers, ...Array(zerosToAdd).fill(0)];

      // Substitui a coluna atual pela nova coluna
      for (let i = 0; i < this.board.length; i++) {
        this.board[i][j] = newColumn[i];
      }
    }

    // adiciona um tile se board foi alterado
    if (previousBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      } else {
        this.checkWinCondition();
      }
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = JSON.stringify(this.board);

    // Para cada coluna do tabuleiro
    for (let j = 0; j < this.board[0].length; j++) {
      // Extrai os números da coluna atual
      const column = [];

      for (let i = 0; i < this.board.length; i++) {
        column.push(this.board[i][j]);
      }

      // Filtra os números diferentes de zero
      let nonZeroNumbers = column.filter((num) => num !== 0);

      // se existir adjacentes, já volta mesclado
      const checkAdjacent = this.adjacentNumbers(nonZeroNumbers);
      // nonZeroNumbers = checkAdjacent;

      nonZeroNumbers = checkAdjacent.filter((num) => num !== 0);

      // Cria uma nova coluna preenchida com zeros
      const newColumn = Array(this.board.length).fill(0);

      // Coloca os números não-zero no final da coluna (baixo)
      // Se tivermos uma coluna com tamanho 4 e 2 números não-zero,
      // eles começarão nas posições 2 e 3 (índices)
      for (let i = 0; i < nonZeroNumbers.length; i++) {
        newColumn[this.board.length - nonZeroNumbers.length + i] =
          nonZeroNumbers[i];
      }

      // Substitui a coluna atual pela nova coluna
      for (let i = 0; i < this.board.length; i++) {
        this.board[i][j] = newColumn[i];
      }
    }

    // adiciona um tile se board foi alterado
    if (previousBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();

      if (this.isGameOver()) {
        this.status = 'lose';
      } else {
        this.checkWinCondition();
      }
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  isGameOver() {
    // Verifica se há células vazias
    if (this.board.some((row) => row.some((cell) => cell === 0))) {
      return false;
    }

    // Verifica se há células adjacentes com o mesmo valor
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (
          (c < 3 && this.board[r][c] === this.board[r][c + 1]) ||
          (r < 3 && this.board[r][c] === this.board[r + 1][c])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  checkWinCondition() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }
}

module.exports = Game;
