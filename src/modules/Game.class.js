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
    this.status = 'idle';
    this._hasChanged = false;
    this._addRandomTile();
    this._addRandomTile();

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  // всередині Game класу
  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { r, c } = emptyCells[randomIndex];
      const value = Math.random() < 0.9 ? 2 : 4; // 90% для 2, 10% для 4

      this.board[r][c] = value;
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return; // Ходи можливі лише під час гри
    }

    this._hasChanged = false; // Скидаємо прапорець змін

    let scoreToAdd = 0;

    for (let r = 0; r < 4; r++) {
      const row = this.board[r];
      const newRow = this._slideAndMerge(row); // Виклик допоміжного методу

      if (JSON.stringify(row) !== JSON.stringify(newRow.row)) {
        this._hasChanged = true;
      }
      this.board[r] = newRow.row;
      scoreToAdd += newRow.mergedScore;
    }

    this.score += scoreToAdd;

    if (this._hasChanged) {
      this._addRandomTile();
      this._checkGameStatus(); // Перевірка статусу гри після ходу
    }
    // Якщо дошка не змінилася, хід недійсний, нічого не додаємо
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this._hasChanged = false;

    let scoreToAdd = 0;

    for (let r = 0; r < 4; r++) {
      const row = [...this.board[r]].reverse(); // копія
      const { row: mergedRow, mergedScore } = this._slideAndMerge(row);
      const newRow = mergedRow.reverse(); // копія

      if (JSON.stringify(this.board[r]) !== JSON.stringify(newRow)) {
        this._hasChanged = true;
      }

      this.board[r] = newRow;
      scoreToAdd += mergedScore;
    }

    this.score += scoreToAdd;

    if (this._hasChanged) {
      this._addRandomTile();
      this._checkGameStatus();
    }
  }

  // --- ЗМІНИ У Game.class.js ---

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this._hasChanged = false;

    let scoreToAdd = 0;

    // ЗМІНЕНО: Викликаємо _transposeBoard як метод класу Game
    // і передаємо this.board як аргумент.
    // Зберігаємо результат у тимчасовій змінній.
    const transposedBoard = this._transposeBoard(this.board);

    // Ітеруємо по стовпцях, оскільки дошка транспонована
    // Рядок у транспонованій дошці відповідає стовпцю у початковій
    for (let c = 0; c < 4; c++) {
      const column = [...transposedBoard[c]];
      const { row: mergedColumn, mergedScore } = this._slideAndMerge(column);

      // Порівнюємо, чи змінився цей "стовпець"
      if (JSON.stringify(transposedBoard[c]) !== JSON.stringify(mergedColumn)) {
        this._hasChanged = true;
      }

      // Оновлюємо "стовпець" у транспонованій дошці
      transposedBoard[c] = mergedColumn;
      scoreToAdd += mergedScore;
    }

    // ЗМІНЕНО: Транспонуємо дошку назад, щоб відновити її початкову орієнтацію
    // і присвоюємо результат назад this.board
    this.board = this._transposeBoard(transposedBoard);

    this.score += scoreToAdd;

    if (this._hasChanged) {
      this._addRandomTile();
      this._checkGameStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this._hasChanged = false;

    let scoreToAdd = 0;

    // ЗМІНЕНО: Транспонуємо поточну дошку this.board
    const transposedBoard = this._transposeBoard(this.board);

    // Ітеруємо по стовпцях (як рядках транспонованої дошки)
    for (let c = 0; c < 4; c++) {
      // Копіюємо і реверсуємо "стовпець"
      const column = [...transposedBoard[c]].reverse();
      const { row: mergedColumn, mergedScore } = this._slideAndMerge(column);
      const newColumn = mergedColumn.reverse(); // Реверсуємо назад

      // Порівнюємо, чи змінився цей "стовпець"
      if (JSON.stringify(transposedBoard[c]) !== JSON.stringify(newColumn)) {
        this._hasChanged = true;
      }

      // Оновлюємо "стовпець" у транспонованій дошці
      transposedBoard[c] = newColumn;
      scoreToAdd += mergedScore;
    }

    // ЗМІНЕНО: Транспонуємо дошку назад
    this.board = this._transposeBoard(transposedBoard);

    this.score += scoreToAdd;

    if (this._hasChanged) {
      this._addRandomTile();
      this._checkGameStatus();
    }
  }

  // Допоміжний метод для зсуву та об'єднання одного ряду/стовпця
  _slideAndMerge(line) {
    const newLine = line.filter((cell) => cell !== 0); // Видаляємо нулі
    let mergedScore = 0;
    // Для відстеження об'єднаних клітинок
    const mergedTiles = Array(4).fill(false);

    for (let i = 0; i < newLine.length - 1; i++) {
      if (
        newLine[i] === newLine[i + 1] &&
        !mergedTiles[i] &&
        !mergedTiles[i + 1]
      ) {
        newLine[i] *= 2;
        mergedScore += newLine[i];
        newLine.splice(i + 1, 1); // Видаляємо об'єднану клітинку
        mergedTiles[i] = true; // Позначаємо клітинку як об'єднану
      }
    }

    while (newLine.length < 4) {
      newLine.push(0); // Додаємо нулі до кінця
    }

    return { row: newLine, mergedScore: mergedScore };
  }

  // ... аналогічні методи для moveRight, moveUp, moveDown
  // (потрібно буде обертати/транспонувати дошку для moveUp/moveDown)

  // Допоміжний метод для перевірки статусу гри
  _checkGameStatus() {
    // Перемога
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // Програш (немає порожніх клітинок і немає можливих об'єднань)
    if (this.board.every((row) => row.every((cell) => cell !== 0))) {
      if (!this._hasPossibleMoves()) {
        this.status = 'lose';
        this._gameOver = true;
      }
    }
  }

  // Допоміжний метод для перевірки можливих ходів
  _hasPossibleMoves() {
    // Перевірка на горизонтальні об'єднання
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (
          this.board[r][c] !== 0 &&
          this.board[r][c] === this.board[r][c + 1]
        ) {
          return true;
        }
      }
    }

    // Перевірка на вертикальні об'єднання

    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        if (
          this.board[r][c] !== 0 &&
          this.board[r][c] === this.board[r + 1][c]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  // // всередині Game класу
  // // Змініть цей метод
  // _transposeBoard(boardToTranspose) {
  //   // Цей код вже правильний, він транспонує переданий йому масив
  //   return boardToTranspose[0].map((_, colIndex) =>
  //     boardToTranspose.map((row) => row[colIndex]),
  //   );
  // }

  _transposeBoard(boardToTranspose) {
    const numRows = boardToTranspose.length;
    // Припускаємо, що всі рядки мають однакову довжину
    const numCols = boardToTranspose[0].length;

    // Створюємо новий порожній масив для транспонованої дошки
    // Він матиме numCols рядків і numRows стовпців
    const transposedBoard = Array(numCols)
      .fill(0)
      .map(() => Array(numRows).fill(0));

    // Проходимо по оригінальній дошці і заповнюємо транспоновану
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        transposedBoard[c][r] = boardToTranspose[r][c];
      }
    }

    return transposedBoard;
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
    return this.board;
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
    // this._addRandomTile();
    // this._addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    // this._hasChanged = false;
    this._addRandomTile();
    this._addRandomTile();
    this._hasChanged = false; // Скинути прапорець
  }

  // Add your own methods here
}

module.exports = Game;
