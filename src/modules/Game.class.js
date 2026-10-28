export class Game {
  constructor(initialState = null) {
    this.board = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : Array(4)
        .fill(0)
        .map(() => Array(4).fill(0));

    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
    this.hasWon = false;
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';

      this.board = Array(4)
        .fill(0)
        .map(() => Array(4).fill(0));
      this.score = 0;
      this.hasWon = false;
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.status = 'playing';

    this.board = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.hasWon = false;
    this.addRandomTile();
    this.addRandomTile();
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

      // 90% ймовірність для 2, 10% для 4
      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // Допоміжна функція для зсуву та злиття одного рядка вліво
  slideLeft(row) {
    const arr = row.filter((val) => val !== 0);
    let points = 0;
    const newRow = [];

    for (let i = 0; i < arr.length; i++) {
      if (i < arr.length - 1 && arr[i] === arr[i + 1]) {
        const mergedVal = arr[i] * 2;

        newRow.push(mergedVal);
        points += mergedVal;
        i++; // пропуск наступного, оскільки він злився

        if (mergedVal === 2048 && !this.hasWon) {
          this.hasWon = true;
          this.status = 'win';
        }
      } else {
        newRow.push(arr[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { newRow, points };
  }

  // Поворот матриці на 90 градусів за годинниковою стрілкою
  rotateClockwise(matrix) {
    const res = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        res[c][3 - r] = matrix[r][c];
      }
    }

    return res;
  }

  // Перевірка чи змінилося поле після руху
  isBoardChanged(oldBoard, newBoard) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (oldBoard[r][c] !== newBoard[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  // Загальна логіка виконання ходу
  makeMove(moveFunction) {
    if (this.status !== 'playing' && this.status !== 'win') {
      return;
    }

    const oldBoard = JSON.parse(JSON.stringify(this.board));

    moveFunction.call(this);

    if (this.isBoardChanged(oldBoard, this.board)) {
      this.addRandomTile();

      if (this.checkGameOver()) {
        this.status = 'lose';
      }
    }
  }

  moveLeft() {
    this.makeMove(() => {
      for (let r = 0; r < 4; r++) {
        const { newRow, points } = this.slideLeft(this.board[r]);

        this.board[r] = newRow;
        this.score += points;
      }
    });
  }

  moveRight() {
    this.makeMove(() => {
      for (let r = 0; r < 4; r++) {
        const reversed = [...this.board[r]].reverse();
        const { newRow, points } = this.slideLeft(reversed);

        this.board[r] = newRow.reverse();
        this.score += points;
      }
    });
  }

  moveUp() {
    this.makeMove(() => {
      const matrix = this.rotateClockwise(
        this.rotateClockwise(this.rotateClockwise(this.board)),
      );

      for (let r = 0; r < 4; r++) {
        const { newRow, points } = this.slideLeft(matrix[r]);

        matrix[r] = newRow;
        this.score += points;
      }
      this.board = this.rotateClockwise(matrix);
    });
  }

  moveDown() {
    this.makeMove(() => {
      const matrix = this.rotateClockwise(this.board);

      for (let r = 0; r < 4; r++) {
        const { newRow, points } = this.slideLeft(matrix[r]);

        matrix[r] = newRow;
        this.score += points;
      }

      this.board = this.rotateClockwise(
        this.rotateClockwise(this.rotateClockwise(matrix)),
      );
    });
  }

  checkGameOver() {
    // Якщо є хоч одна нульова клітинка — гра не закінчена
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }
      }
    }

    // Перевірка чи є сусідні однакові елементи по горизонталі та вертикалі
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c < 3 && current === this.board[r][c + 1]) {
          return false;
        }

        if (r < 3 && current === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }
}
