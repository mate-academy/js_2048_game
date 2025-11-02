'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 *
 */
const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

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

  // copia defalt do tabuleiro
  constructor(initialState = board.map((row) => row.slice())) {
    // cópia para fazer restart
    this.initialState = initialState.map((row) => row.slice());
    // cópia do tabuleiro, essa é a mutável que vamos alterar
    this.board = initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'play';
  }
  getState() {
    return this.board.map((row) => row.slice());
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }
  // [2,
  // 2,
  // 4,
  // 0 ] row
  mergeRowLeft(row) {
    const arr = row.filter((x) => x !== 0); // [2, 2, 4]
    let gained = 0;
    const result = []; // [4, 4]

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === arr[i + 1]) {
        result.push(arr[i] * 2); // [2, 2, 4]
        gained += arr[i] * 2;
        i++;
      } else {
        result.push(arr[i]);
      }
    }

    while (result.length < 4) {
      result.push(0); // [4, 4, 0, 0]
    }

    return {
      newRow: result,
      gained,
    };
  }
  moveLeft() {
    let gainedTotal = 0;
    const newBoard = Array.from({ length: 4 }, () => [0, 0, 0, 0]);

    for (let i = 0; i < this.board.length; i++) {
      const { newRow, gained } = this.mergeRowLeft(this.board[i]);

      newBoard[i] = newRow;
      gainedTotal += gained;
    }

    const oldBoard = this.getState();
    /* nesse for, iteramos pelas linhas */

    let changed = false;

    for (let i = 0; i < newBoard.length; i++) {
      /* nesse for, iteramos pelas colunas.
      No j < newBoard[i].length, acesso o newBoard[i] e coloco o limite de J
       como sendo o tamanho da linha const newboard = [
  [0, 0, 0, 0], newBoard[0] length = 4
  [0, 0, 0, 0], newBoard[1] length = 4
  [0, 0, 0, 0], newBoard[2] length = 4
  [0, 0, 0, 0], newBoard[3] length = 4
]; */
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j] !== oldBoard[i][j]) {
          changed = true;
          break; // para apenas o loop interno
        }
      }

      if (changed) {
        break; // para o loop externo
      }
    }

    if (changed) {
      this.board = newBoard;
      this.score += gainedTotal;
      this.addRandomTile();

      if (this.isWon()) {
        this.status = 'won';
      } else if (this.isGameOver()) {
        this.status = 'over';
      }
    }
  }

  addRandomTile() {
    const empties = []; // [ [0, 1], [2, 3], [3, 0] ];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          empties.push([i, j]);
        }
      }
    }

    if (empties.length === 0) {
      return `Não há onde colocar`;
    }
    /* - Math.random()
- Gera um número aleatório entre 0 (inclusive) e 1 (exclusivo)
  - Math.floor(...)
- Arredonda para baixo para obter um índice inteiro válido
- Garante que o índice esteja dentro dos limites do array
*/

    const idx = Math.floor(Math.random() * empties.length); // 2
    const [r, c] = empties[idx]; /*  [3, 0] aqui estou dizendo que r
    terá o valor de 3 e c tera o valor de 0 */
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[r][c] = value;
  }
  /* .slice(start, end) retorna uma nova matriz com os elementos da matriz
    de origem começando do start índice até o endíndice (não incluindo) */
  /* .reverse() altera a ordem dos elementos para a oposta */
  moveRight() {
    const newBoard = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    let gainedTotal = 0;
    const oldBoard = this.getState();

    for (let i = 0; i < this.board.length; i++) {
      const rev = this.board[i].slice().reverse();
      const { newRow, gained } = this.mergeRowLeft(rev);
      const final = newRow.slice().reverse();

      newBoard[i] = final;
      gainedTotal += gained;
    }

    let changed = false;

    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j] !== oldBoard[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (changed) {
      this.board = newBoard;
      this.score += gainedTotal;
      this.addRandomTile();

      if (this.isWon()) {
        this.status = 'won';
      } else if (this.isGameOver()) {
        this.status = 'over';
      }
    }
  }
  moveUp() {
    const newBoard = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    let gainedTotal = 0;
    const oldBoard = this.getState().map((r) => r.slice());
    /*   [2, 0, 0, 0],
          [2, 0, 0, 0],
          [4, 0, 0, 0],
          [0, 0, 0, 0],
        ]; */

    for (let j = 0; j < this.board.length; j++) {
      const col = [
        this.board[0][j],
        this.board[1][j],
        this.board[2][j],
        this.board[3][j],
      ];

      /* [2, board[0][j]
          [2,board[1][j]
          [4,  board[2][j]
          [0  board[3][j] */
      const { newRow, gained } = this.mergeRowLeft(col);

      gainedTotal += gained;

      for (let i = 0; i < newBoard.length; i++) {
        newBoard[i][j] = newRow[i];
      }
    }

    let changed = false;

    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j] !== oldBoard[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (changed) {
      this.board = newBoard;
      this.score += gainedTotal;
      this.addRandomTile();

      if (this.isWon()) {
        this.status = 'won';
      } else if (this.isGameOver()) {
        this.status = 'over';
      }
    }
  }

  isGameOver() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (j + 1 < 4 && this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }

        if (i + 1 < 4 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  isWon() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }
  moveDown() {
    const newBoard = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    let gainedTotal = 0;
    const oldBoard = this.getState().map((r) => r.slice());

    for (let j = 0; j < this.board.length; j++) {
      const col = [
        this.board[0][j],
        this.board[1][j],
        this.board[2][j],
        this.board[3][j],
      ];

      /* aqui criamos um array de linhas, eu separei em
      colunas apenas para ilustrar col =
      /* [2, board[0][j]
          [2,board[1][j]
          [4,  board[2][j]
          [0  board[3][j] */

      const rev = col.slice().reverse();
      /* aqui reverto os numereos
          [0, board[0][j]
          [4,board[1][j]
          [2,  board[2][j]
          [2  board[3][j] */
      const { newRow, gained } = this.mergeRowLeft(rev);
      const newCol = newRow.slice().reverse();

      gainedTotal += gained;

      for (let i = 0; i < newBoard.length; i++) {
        newBoard[i][j] = newCol[i];
      }
    }

    let changed = false;

    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j] !== oldBoard[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (changed) {
      this.board = newBoard;
      this.score += gainedTotal;
      this.addRandomTile();

      if (this.isWon()) {
        this.status = 'won';
      } else if (this.isGameOver()) {
        this.status = 'over';
      }
    }
  }
  start() {
    let allEmpty = true;

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          allEmpty = false;
          break;
        }
      }

      if (!allEmpty) {
        break;
      }
    }

    if (allEmpty) {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }
  restart() {
    this.board = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'play';
    this.start();
  }
}

export default Game;
