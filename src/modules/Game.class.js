/* eslint-disable function-paren-newline */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
    this.state =
      initialState !== undefined
        ? initialState
        : Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));

    this.score = 0;
    this.status = 'idle';

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;

    // Percorre cada linha do tabuleiro
    this.state.forEach((row, rowIndex, board) => {
      // chama mergeLine para juntar números iguais
      const newRow = this.mergeLine(row);

      // completa com zeros até o tamanho 4
      while (newRow.length < 4) {
        newRow.push(0);
      }

      // compara linha antiga com nova para detectar mudança
      for (let i = 0; i < 4; i++) {
        if (board[rowIndex][i] !== newRow[i]) {
          changed = true;
          break; // detectou mudança ai para
        }
      }

      board[rowIndex] = newRow;
    });

    if (changed) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;

    this.state.forEach((row, rowIndex, board) => {
      // inverte a linha para processar como se fosse "esquerda"
      const reversedRow = [...row].reverse();

      // aplica mergeLine
      let newRow = this.mergeLine(reversedRow);

      // completa com zeros
      while (newRow.length < 4) {
        newRow.push(0);
      }

      // inverte de volta para a ordem correta
      newRow = newRow.reverse();

      // detecta se mudou
      for (let i = 0; i < 4; i++) {
        if (board[rowIndex][i] !== newRow[i]) {
          changed = true;
          break;
        }
      }

      // ubstitui a linha antiga pela nova
      board[rowIndex] = newRow;
    });

    // adiciona um novo tile se algo mudou
    if (changed) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;

    for (let col = 0; col < 4; col++) {
      // pega os elementos da coluna
      const column = this.state.map((row) => row[col]);

      // aplica o mergeLine
      const newColumn = this.mergeLine(column);

      // completa os zeros
      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      // detecta mudança
      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newColumn[row]) {
          changed = true;
          break;
        }
      }

      // coloca de volta na coluna
      for (let row = 0; row < 4; row++) {
        this.state[row][col] = newColumn[row];
      }
    }

    // adiciona novo tile se algo mudou
    if (changed) {
      this.addRandomTile();
    }

    //  atualiza status
    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;

    for (let col = 0; col < 4; col++) {
      // pega a coluna
      const column = this.state.map((row) => row[col]);

      // inverte p enviar como mergeUp
      const reversedCol = [...column].reverse();

      // aplica mergeLine
      let newCol = this.mergeLine(reversedCol);

      // completa com zeros
      while (newCol.length < 4) {
        newCol.push(0);
      }

      // inverte de volta
      newCol = newCol.reverse();

      // detecta mudança
      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newCol[row]) {
          changed = true;
          break;
        }
      }

      // coloca de volta na coluna
      for (let row = 0; row < 4; row++) {
        this.state[row][col] = newCol[row];
      }
    }

    if (changed) {
      this.addRandomTile();
    }

    this.updateStatus();
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
    return this.state;
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
    // Cria a matriz do jogo
    const isBoardEmpty = this.state.flat().every((cell) => cell === 0);
    // AQui vai zerar os pontos e mudar o status

    this.status = 'playing';
    this.score = 0;
    // Adiciona os primeiros 2 digitos

    if (isBoardEmpty) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    // Cria a matriz zerada
    this.state = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => 0),
    );
    // Reseta a pontuação
    this.score = 0;

    // Muda status para jogando
    this.status = 'playing';

    // Adiciona os dois primeiros tiles
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      // percorre as linhas
      row.forEach((cell, colIndex) => {
        // percorre as colulas
        if (cell === 0) {
          // se o que tiver na celula for 0 vai colocar no empty cells
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    // cria um numero aleatório ate 1.0 multiplica
    // pelo length das celulas vazias
    // (so pega celulas que podem receber)
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    // aqui de fato escolhe a celula vazia
    const randomCell = emptyCells[randomIndex];

    // caso gere N < 0.9 (90%) vai voltar um 2, 10% de ser 4
    const randomNumber = Math.random() < 0.9 ? 2 : 4;

    this.state[randomCell.row][randomCell.col] = randomNumber;
  }

  mergeLine(arr) {
    const nonZeroArr = arr.filter((n) => n > 0);
    const result = [];

    for (let i = 0; i < nonZeroArr.length; i++) {
      if (nonZeroArr[i] === nonZeroArr[i + 1]) {
        const merged = nonZeroArr[i] * 2;

        result.push(merged);

        this.score += merged; // Atualiza a pontuação
        i++; // pula o próximo
      } else {
        result.push(nonZeroArr[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  updateStatus() {
    // Verifica se ganhou (algum tile = 2048)
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    // Verifica se perdeu (nenhum movimento possível)
    const canMove = this.state.some((row, i) =>
      row.some((cell, j) => {
        if (cell === 0) {
          return true; // espaço vazio
        } else if (j < 3 && cell === row[j + 1]) {
          return true; // igual à direita
        } else if (i < 3 && cell === this.state[i + 1][j]) {
          return true; // igual abaixo
        } else {
          return false;
        }
      }),
    );

    if (!canMove) {
      this.status = 'lose';

      return;
    }

    // Se não ganhou nem perdeu, continua jogando
    this.status = 'playing';
  }
}
