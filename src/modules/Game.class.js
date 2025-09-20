'use strict';

class Game {
  startBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor() {
    this.board = this.startBoard.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.firstMove = false;
  }

  moveLeft() {
    const rowMain = [];
    let chengCheck = false;

    this.board.forEach((row) => {
      const copyRow = [...row];
      const readyRow = this.slideRowLeft(row);

      this.score += readyRow.record;
      rowMain.push(readyRow.row);

      if (copyRow.toLocaleString() !== readyRow.row.toLocaleString()) {
        chengCheck = true;
      }
    });

    if (chengCheck) {
      this.board = rowMain;
      this.addRandomTitle();
      this.firstMove = true;
    }
  }
  moveRight() {
    const rowMain = [];
    let chengCheck = false;

    this.board.forEach((row) => {
      const copyRow = [...row];
      const readyRow = this.slideRowRight(row);

      this.score += readyRow.record;
      rowMain.push(readyRow.row);

      if (copyRow.toLocaleString() !== readyRow.row.toLocaleString()) {
        chengCheck = true;
      }
    });

    if (chengCheck) {
      this.board = rowMain;
      this.addRandomTitle();
      this.firstMove = true;
    }
  }
  moveUp() {
    const transformColums = this.creatColumn(this.board);
    const mainBoard = this.slideRowUp(transformColums);

    if (mainBoard.cheng) {
      this.board = mainBoard.board;
      this.score += mainBoard.record;
      this.addRandomTitle();
      this.firstMove = true;
    }
  }
  moveDown() {
    const transformColums = this.creatColumn(this.board);
    const mainBoard = this.slideRowDown(transformColums);

    if (mainBoard.cheng) {
      this.board = mainBoard.board;
      this.score += mainBoard.record;
      this.addRandomTitle();
      this.firstMove = true;
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    this.winChek(this.board);
    this.loseChek(this.board);

    return this.status;
  }

  start() {
    this.score = 0;
    this.board = this.startBoard.map((row) => [...row]);
    this.status = 'playing';
    this.firstMove = true;

    this.addRandomTitle();
    this.addRandomTitle();
  }

  restart() {
    this.score = 0;
    this.board = this.startBoard.map((row) => [...row]);
    this.status = 'playing';
    this.firstMove = false;

    this.addRandomTitle();
    this.addRandomTitle();
  }

  // ----------------------------------------------------

  addRandomTitle() {
    const cleanCells = [];

    this.board.forEach((array, i) => {
      array.forEach((cells, j) => {
        if (cells === 0) {
          cleanCells.push({ row: i, cell: j });
        }
      });
    });

    if (cleanCells.length === 0) {
      return;
    }

    const randomCel = cleanCells[Math.floor(Math.random() * cleanCells.length)];
    const num = Math.random() < 0.1 ? 4 : 2;

    this.board[randomCel.row][randomCel.cell] = num;
  }

  // функция проверки попеди

  winChek(nowBoard) {
    nowBoard.forEach((row) => {
      if (row.some((num) => num === 2048)) {
        this.status = 'win';
      }
    });
  }

  // функция проверки поражения

  loseChek(curentBoard) {
    let cleanCell = false;
    let loseChek = true;

    curentBoard.forEach((row) => {
      if (row.some((num) => num === 0)) {
        cleanCell = true;
        loseChek = false;
      }
    });

    if (!cleanCell) {
      for (let i = 0; i < curentBoard.length; i++) {
        for (let j = 0; j < curentBoard[i].length - 1; j++) {
          if (curentBoard[i][j] === curentBoard[i][j + 1]) {
            loseChek = false;
          }
        }
      }
    }

    if (!cleanCell) {
      const columsBoard = this.creatColumn(curentBoard);

      for (let i = 0; i < columsBoard.length; i++) {
        for (let j = 0; j < columsBoard[i].length - 1; j++) {
          if (columsBoard[i][j] === columsBoard[i][j + 1]) {
            loseChek = false;
          }
        }
      }
    }

    if (loseChek) {
      this.status = 'lose';
    }
  }

  // функция для смещения чисел

  move(row) {
    const newRow = [];

    row.forEach((num) => {
      if (num !== 0) {
        newRow.push(num);
      }
    });

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  // функция для соиденения пар

  merge(row) {
    let record = 0;

    for (let i = 0; i < row.length; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] = row[i] * 2;
        row[i + 1] = 0;
        record += row[i];
        i++;
      }
    }

    return { row: row, record: record };
  }

  // фунция для создания колонок

  creatColumn(board) {
    const newColums = [[], [], [], []];

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        newColums[j].push(board[i][j]);
      }
    }

    return newColums;
  }

  // функция для парсинга столбцов обратно в колонки

  parsRowInColums(colums) {
    const readyBoard = [[], [], [], []];

    for (let i = 0; i < colums.length; i++) {
      for (let j = 0; j < colums[i].length; j++) {
        readyBoard[j].push(colums[i][j]);
      }
    }

    return readyBoard;
  }

  // соиденям движения в лево

  slideRowLeft(row) {
    let mainRow = this.move(row);

    mainRow = this.merge(mainRow);

    const newRecord = mainRow.record;

    mainRow = this.move(mainRow.row);

    return { row: mainRow, record: newRecord };
  }

  // соиденяем движения в право
  slideRowRight(row) {
    const readyRow = this.slideRowLeft(row);

    return { row: readyRow.row.reverse(), record: readyRow.record };
  }
  // движения в верх

  slideRowUp(colums) {
    let newColums = [];
    let chengCheck = false;
    let upRecord = 0;

    colums.forEach((column) => {
      const copyColumn = [...column];
      const newColumn = this.slideRowLeft(column);

      newColums.push(newColumn.row);
      upRecord += newColumn.record;

      if (copyColumn.toString() !== newColumn.row.toString()) {
        chengCheck = true;
      }
    });

    newColums = this.parsRowInColums(newColums);

    return { board: newColums, record: upRecord, cheng: chengCheck };
  }

  // движения в низ

  slideRowDown(colums) {
    let newColums = [];
    let chengCheck = false;
    let upRecord = 0;

    colums.forEach((colum) => {
      const copyColumn = [...colum];
      const newColumn = this.slideRowRight(colum);

      newColums.push(newColumn.row);
      upRecord += newColumn.record;

      if (copyColumn.toString() !== newColumn.row.toString()) {
        chengCheck = true;
      }
    });

    newColums = this.parsRowInColums(newColums);

    return { board: newColums, record: upRecord, cheng: chengCheck };
  }
}

module.exports = Game;
