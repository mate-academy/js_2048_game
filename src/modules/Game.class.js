'use strict';

class Game {
  constructor(size = 4) {
    this.size = size;
    this.score = 0;
    this.status = 'idle';
    this.board = this.createEmptyBoard();
    this.tileId = 0;
  }

  createEmptyBoard() {
    return Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(null));
  }

  getBoard() {
    return this.board.map((row) => row.map((tile) => (tile ? tile.value : 0)));
  }

  createTile(value, row, col) {
    const tile = document.createElement('div');

    tile.className = `tile field-cell--${value}`;
    tile.textContent = value;
    tile.id = `tile-${this.tileId++}`;

    const gameField = document.querySelector('.game-field');
    const cellSize = 75;
    const spacing = 10;

    const left = col * (cellSize + spacing) + spacing;
    // eslint-disable-next-line no-shadow
    const top = row * (cellSize + spacing) + spacing;

    tile.style.left = `${left}px`;
    tile.style.top = `${top}px`;

    gameField.appendChild(tile);

    return {
      element: tile,
      value: value,
      row: row,
      col: col,
      id: tile.id,
    };
  }

  moveTile(tile, newRow, newCol) {
    const cellSize = 75;
    const spacing = 10;

    const left = newCol * (cellSize + spacing) + spacing;
    // eslint-disable-next-line no-shadow
    const top = newRow * (cellSize + spacing) + spacing;

    tile.element.style.left = `${left}px`;
    tile.element.style.top = `${top}px`;

    tile.row = newRow;
    tile.col = newCol;
  }

  removeTile(tile) {
    if (tile && tile.element && tile.element.parentNode) {
      tile.element.parentNode.removeChild(tile.element);
    }
  }

  mergeTiles(tile1, tile2) {
    const newValue = tile1.value + tile2.value;

    this.score += newValue;

    this.moveTile(tile1, tile2.row, tile2.col);

    setTimeout(() => {
      this.removeTile(tile2);
      tile1.value = newValue;
      tile1.element.textContent = newValue;
      tile1.element.className = `tile field-cell--${newValue}`;
    }, 150);

    return tile1;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!this.board[i][j]) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    const tile = this.createTile(value, randomCell.row, randomCell.col);

    this.board[randomCell.row][randomCell.col] = tile;

    tile.element.style.transform = 'scale(0)';

    setTimeout(() => {
      tile.element.style.transform = 'scale(1)';
    }, 50);

    return true;
  }

  processRow(tiles) {
    let newRow = tiles.filter((tile) => tile !== null);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (
        newRow[i] &&
        newRow[i + 1] &&
        newRow[i].value === newRow[i + 1].value
      ) {
        newRow[i] = this.mergeTiles(newRow[i], newRow[i + 1]);
        newRow[i + 1] = null;
      }
    }

    newRow = newRow.filter((tile) => tile !== null);

    while (newRow.length < this.size) {
      newRow.push(null);
    }

    return newRow;
  }

  makeMove(getRows, setRows) {
    const oldBoard = this.board.map((row) => [...row]);
    const rows = getRows(this.board);
    let moved = false;

    rows.forEach((row, index) => {
      const newRow = this.processRow(row);

      const oldRow = getRows(oldBoard)[index];
      const hasChanged = !this.rowsEqual(oldRow, newRow);

      if (hasChanged) {
        moved = true;

        newRow.forEach((tile, pos) => {
          if (tile) {
            const newPos =
              setRows === this.setRowsHorizontal
                ? { row: index, col: pos }
                : setRows === this.setRowsVertical
                  ? { row: pos, col: index }
                  : setRows === this.setRowsHorizontalReverse
                    ? { row: index, col: this.size - 1 - pos }
                    : { row: this.size - 1 - pos, col: index };

            this.moveTile(tile, newPos.row, newPos.col);
          }
        });
      }

      rows[index] = newRow;
    });

    if (moved) {
      setRows(this.board, rows);

      setTimeout(() => {
        this.addRandomTile();
        this.updateScore();
        this.checkGameStatus();
      }, 200);
    }
  }

  rowsEqual(row1, row2) {
    if (row1.length !== row2.length) {
      return false;
    }

    for (let i = 0; i < row1.length; i++) {
      const val1 = row1[i] ? row1[i].value : 0;
      const val2 = row2[i] ? row2[i].value : 0;

      if (val1 !== val2) {
        return false;
      }
    }

    return true;
  }

  setRowsHorizontal = (board, rows) => {
    rows.forEach((row, i) => (board[i] = row));
  };

  setRowsVertical = (board, rows) => {
    rows.forEach((col, colIndex) => {
      col.forEach((tile, rowIndex) => {
        board[rowIndex][colIndex] = tile;
      });
    });
  };

  setRowsHorizontalReverse = (board, rows) => {
    rows.forEach((row, i) => (board[i] = row.reverse()));
  };

  setRowsVerticalReverse = (board, rows) => {
    rows.forEach((col, colIndex) => {
      col.reverse().forEach((tile, rowIndex) => {
        board[rowIndex][colIndex] = tile;
      });
    });
  };

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    this.makeMove((board) => board, this.setRowsHorizontal);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    this.makeMove(
      (board) => board.map((row) => row.slice().reverse()),
      this.setRowsHorizontalReverse,
    );
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.makeMove((board) => {
      const cols = [];

      for (let col = 0; col < this.size; col++) {
        cols.push(board.map((row) => row[col]));
      }

      return cols;
    }, this.setRowsVertical);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.makeMove((board) => {
      const cols = [];

      for (let col = 0; col < this.size; col++) {
        cols.push(board.map((row) => row[col]).reverse());
      }

      return cols;
    }, this.setRowsVerticalReverse);
  }

  updateScore() {
    document.querySelector('.game-score').textContent = this.score;
  }

  checkGameStatus() {
    const numericBoard = this.getBoard();

    if (numericBoard.some((row) => row.some((cell) => cell === 2048))) {
      this.status = 'win';
      this.showMessage('message-win');

      return;
    }

    const hasEmptyCells = numericBoard.some(
      (row) => row.some((cell) => cell === 0),
      // eslint-disable-next-line function-paren-newline
    );

    if (!hasEmptyCells && !this.canMove(numericBoard)) {
      this.status = 'lose';
      this.showMessage('message-lose');
    }
  }

  canMove(board) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (
          board[i][j] === board[i][j + 1] ||
          board[j][i] === board[j + 1][i]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  showMessage(messageClass) {
    document
      .querySelectorAll('.message')
      .forEach((msg) => msg.classList.add('hidden'));
    document.querySelector(`.${messageClass}`).classList.remove('hidden');
  }

  clearBoard() {
    document.querySelectorAll('.tile').forEach((tile) => {
      if (tile.parentNode) {
        tile.parentNode.removeChild(tile);
      }
    });

    this.board = this.createEmptyBoard();
    this.tileId = 0;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.getBoard();
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.score = 0;
    this.clearBoard();

    const button = document.querySelector('.button');

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');

    this.updateScore();

    document
      .querySelectorAll('.message')
      .forEach((msg) => msg.classList.add('hidden'));

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.status = 'idle';
    this.score = 0;
    this.clearBoard();

    const button = document.querySelector('.button');

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');

    this.updateScore();

    document
      .querySelectorAll('.message')
      .forEach((msg) => msg.classList.add('hidden'));
    document.querySelector('.message-start').classList.remove('hidden');
  }
}

module.exports = Game;
