'use strict';

/* ========================================== */

const tbody = document.querySelector('tbody');
const buttonOfStart = document.querySelector('button');
const arrayTr = Array.from(tbody.children);

/* ===================================================== */

class Game {
  constructor(ss) {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing'; // або 'finished' (гра завершена)
  }

  start() {
    this.deleteMessage();
    this.clearBoard();
    this.restart();
    this.addSCore();

    this.spawnTile();
    this.spawnTile();
    this.updateBoardFromDOM();
  }

  deleteMessage() {
    const message = document.querySelector('.message-container');
    const messageStart = message.children[2];

    messageStart.classList.remove('message-lose');
    messageStart.classList.remove('message-win');
    messageStart.classList.remove('message');

    messageStart.textContent = '';
  }

  spawnTile() {
    const randomNumber = () => Math.floor(Math.random() * 4);
    const randomTwoOrForth = () => (Math.random() < 0.1 ? 4 : 2);
    const arraytr = Array.from(tbody.children);
    let canAddNewElement = false;

    for (const array of arraytr) {
      if (Array.from(array.children).some((td) => td.textContent === '')) {
        canAddNewElement = true;
        break; // Зупиняємо цикл, якщо знайшли порожню клітинку
      }
    }

    if (canAddNewElement) {
      let randomTd;
      let finish = false;

      while (!finish) {
        randomTd = arrayTr[randomNumber()].children[randomNumber()];

        if (!randomTd.classList.contains('activ')) {
          randomTd.textContent = randomTwoOrForth();
          randomTd.classList.add('activ');

          if (+randomTd.textContent === 2) {
            randomTd.classList.add('field-cell--2');
          }

          if (+randomTd.textContent === 4) {
            randomTd.classList.add('field-cell--4');
          }

          finish = true; // Зупиняємо цикл, коли плитка додана
        }
      }
    }
  } // Додає випадкову плитку.

  updateBoardFromDOM = () => {
    Array.from(tbody.children).forEach((tr, indexTr) => {
      Array.from(tr.children).forEach((td, indexTd) => {
        this.board[indexTr][indexTd] =
          td.textContent === '' ? 0 : td.textContent;
      });
    });
  }; // Перезапускає поле.

  clearBoard() {
    const cells = tbody.querySelectorAll('td');

    cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'field-cell';
      cell.removeAttribute('style');
    });
  } // Очищає поле гри.

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    const button = document.querySelector('.button');
    const messageConT = document.querySelector('.message-container');

    if (button.textContent === 'Start') {
      button.style.fontSize = '18px';
      button.textContent = 'Restart';
      button.classList.add('restart');
    } else {
      button.style.fontSize = '18px';
      button.textContent = 'Start';
      button.classList.remove('restart');
      button.classList.add('start');

      messageConT.children[2].textContent =
        'Press "Start" to begin game. Good luck!';
      messageConT.children[2].classList.add('message-start');
      messageConT.children[2].classList.add('message');
    }
  } // Перезапускає гру, обнуляючи рахунки.

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  } // Створює поле гри.

  getScore() {
    return this.score;
  } // Повертає Score.

  getStatus() {
    return this.status;
  } // Повертає Status.

  addColor() {
    Array.from(tbody.children).forEach((tr) => {
      Array.from(tr.children).forEach((td) => {
        const tdContent = td.textContent;

        switch (+tdContent) {
          case 2:
            td.classList.add('field-cell--2');
            break;

          case 4:
            td.classList.add('field-cell--4');
            break;

          case 8:
            td.classList.add('field-cell--8');
            break;

          case 16:
            td.classList.add('field-cell--16');
            break;

          case 32:
            td.classList.add('field-cell--32');
            break;

          case 64:
            td.classList.add('field-cell--64');
            break;

          case 128:
            td.classList.add('field-cell--128');
            break;

          case 256:
            td.classList.add('field-cell--256');
            break;

          case 512:
            td.classList.add('field-cell--512');
            break;

          case 1024:
            td.classList.add('field-cell--1024');
            break;

          case 2048:
            td.classList.add('field-cell--2048');
            break;
        }
      });
    });
  } // Різні кольори до плиток на основі їх значень.

  canContinueGame() {
    const columns = [[], [], [], []];

    // Перетворюємо стовпці в масиви
    this.board.forEach((row) => {
      columns[0].push(row[0]);
      columns[1].push(row[1]);
      columns[2].push(row[2]);
      columns[3].push(row[3]);
    });

    // Перевірка на склеювання комірок стовпців.
    const columnMerge = (column) => {
      const newColumn = column.filter((item) => item !== 0);
      const newColumnLength = newColumn.length;
      let y = 0;

      while (y < newColumnLength) {
        if (newColumn[y] === newColumn[y + 1]) {
          return true;
        }

        y++;
      }
    };

    // Обробляємо кожен стовпець
    for (const column of columns) {
      if (columnMerge(column)) {
        return true; // Якщо хоча б в одному стовпці є злиття
      }
    }

    // =============================================

    const rows = [[], [], [], []];

    this.board.forEach((row, i) => {
      rows[i].push(row[0]);
      rows[i].push(row[1]);
      rows[i].push(row[2]);
      rows[i].push(row[3]);
    });

    // Перевірка на склеювання комірок рядків.
    const rowsMerge = (row) => {
      const newRow = row.filter((item) => item !== 0);
      const newRowLength = newRow.length;
      let y = 0;

      while (y < newRowLength) {
        if (newRow[y] === newRow[y + 1]) {
          return true;
        }

        y++;
      }
    };

    for (const row of rows) {
      if (rowsMerge(row)) {
        return true;
      }
    }

    // Перевірка на порожні комірки.
    for (const row of this.board) {
      if (row.includes(0)) {
        return true;
      }
    }

    // Перевірка на рух.

    return false;
  }

  addSCore() {
    const gameScore = document.querySelector('.game-score');

    gameScore.textContent = this.score;
  }

  getMessage() {
    const messageConT = document.querySelector('.message-container');

    messageConT.children[2].textContent = messageConT.children[0].textContent;
    messageConT.children[2].classList.add('message-lose');
    messageConT.children[2].classList.add('message');
  }

  getMessageWin() {
    const messageConT = document.querySelector('.message-container');
    const messageWin = document.querySelector('.message-win');

    messageConT.children[2].textContent = messageWin.textContent;
    messageConT.children[2].classList.add('message-win');
    messageConT.children[2].classList.add('message');
  }

  moveUp() {
    if (!this.canContinueGame()) {
      this.getMessage();
      this.status = 'finished';

      return;
    }

    const oldBoard = JSON.stringify(this.board);

    const column1 = [];
    const column2 = [];
    const column3 = [];
    const column4 = [];

    this.board.forEach((row) => {
      column1.push(row[0]);
      column2.push(row[1]);
      column3.push(row[2]);
      column4.push(row[3]);
    });

    const mergeColumn = (column) => {
      const merged = column.filter((cell) => cell !== 0);
      const result = [];
      let i = 0;

      while (i < merged.length) {
        if (i < merged.length - 1 && merged[i] === merged[i + 1]) {
          result.push(merged[i] * 2);
          this.score += merged[i] * 2;
          i += 2;
        } else {
          result.push(merged[i]);
          i++;
        }
      }

      while (result.length < 4) {
        result.push(0);
      }

      return result;
    };

    const newColumn1 = mergeColumn(column1);
    const newColumn2 = mergeColumn(column2);
    const newColumn3 = mergeColumn(column3);
    const newColumn4 = mergeColumn(column4);

    this.board = [
      [newColumn1[0], newColumn2[0], newColumn3[0], newColumn4[0]],
      [newColumn1[1], newColumn2[1], newColumn3[1], newColumn4[1]],
      [newColumn1[2], newColumn2[2], newColumn3[2], newColumn4[2]],
      [newColumn1[3], newColumn2[3], newColumn3[3], newColumn4[3]],
    ];

    this.clearBoard();

    const arrayFromTr = Array.from(tbody.children);

    for (let i = 0; i < arrayFromTr.length; i++) {
      const currentTr = arrayFromTr[i].children;

      currentTr[0].textContent = newColumn1[i] === 0 ? '' : newColumn1[i];
      currentTr[1].textContent = newColumn2[i] === 0 ? '' : newColumn2[i];
      currentTr[2].textContent = newColumn3[i] === 0 ? '' : newColumn3[i];
      currentTr[3].textContent = newColumn4[i] === 0 ? '' : newColumn4[i];

      if (currentTr[0].textContent !== '') {
        currentTr[0].classList.add('activ');
      }

      if (currentTr[1].textContent !== '') {
        currentTr[1].classList.add('activ');
      }

      if (currentTr[2].textContent !== '') {
        currentTr[2].classList.add('activ');
      }

      if (currentTr[3].textContent !== '') {
        currentTr[3].classList.add('activ');
      }
    }

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.spawnTile();
    }

    this.addColor();
    this.addSCore();

    const has2048 = this.board.some((row) => row.includes(2048));

    if (has2048) {
      this.getMessageWin();
    }

    this.updateBoardFromDOM();
  } // Рух в верх.

  moveDown() {
    const column1 = [];
    const column2 = [];
    const column3 = [];
    const column4 = [];

    // Перетворюємо стовпці в масиви
    this.board.forEach((row) => {
      column1.push(row[0]);
      column2.push(row[1]);
      column3.push(row[2]);
      column4.push(row[3]);
    });

    const mergeColumn = (column) => {
      // Спочатку фільтруємо нулі
      const merged = column.filter((cell) => cell !== 0);
      const result = [];
      let i = 0;

      // Злиття плиток
      while (i < merged.length) {
        if (i < merged.length - 1 && merged[i] === merged[i + 1]) {
          result.push(merged[i] * 2); // Подвоїти плитки
          this.score += merged[i] * 2; // Додаємо до рахунку
          i += 2; // Пропускаємо наступну плитку після злиття
        } else {
          result.push(merged[i]); // Якщо плитки не однакові
          i++;
        }
      }

      // Переміщуємо плитки вниз, щоб не було проміжків
      while (result.length < 4) {
        result.unshift(0);
      }

      return result;
    };

    const oldBoard = JSON.stringify(this.board);

    // Обробляємо кожен стовпець
    const newColumn1 = mergeColumn(column1);
    const newColumn2 = mergeColumn(column2);
    const newColumn3 = mergeColumn(column3);
    const newColumn4 = mergeColumn(column4);

    this.board = [
      [newColumn1[0], newColumn2[0], newColumn3[0], newColumn4[0]],
      [newColumn1[1], newColumn2[1], newColumn3[1], newColumn4[1]],
      [newColumn1[2], newColumn2[2], newColumn3[2], newColumn4[2]],
      [newColumn1[3], newColumn2[3], newColumn3[3], newColumn4[3]],
    ];

    // Очищаємо дошку
    this.clearBoard();

    // Оновлення значень на сторінці
    const arrayFromTr = Array.from(tbody.children);

    for (let i = 0; i < arrayFromTr.length; i++) {
      const currentTr = arrayFromTr[i].children;

      currentTr[0].textContent = newColumn1[i] === 0 ? '' : newColumn1[i];
      currentTr[1].textContent = newColumn2[i] === 0 ? '' : newColumn2[i];
      currentTr[2].textContent = newColumn3[i] === 0 ? '' : newColumn3[i];
      currentTr[3].textContent = newColumn4[i] === 0 ? '' : newColumn4[i];

      if (currentTr[0].textContent !== '') {
        currentTr[0].classList.add('activ');
      }

      if (currentTr[1].textContent !== '') {
        currentTr[1].classList.add('activ');
      }

      if (currentTr[2].textContent !== '') {
        currentTr[2].classList.add('activ');
      }

      if (currentTr[3].textContent !== '') {
        currentTr[3].classList.add('activ');
      }
    }

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.spawnTile();
    }

    this.addColor();
    this.addSCore();

    const has2048 = this.board.some((row) => row.includes(2048));

    if (has2048) {
      this.getMessageWin();
    }

    // Оновлюємо дошку
    this.updateBoardFromDOM();
  } // Рух в вниз.

  moveRight() {
    if (!this.canContinueGame()) {
      this.getMessage();
      this.status = 'finished';

      return;
    }

    const mergeColumn = (row) => {
      const merged = row.filter((cell) => cell !== 0);
      const result = [];
      let i = 0;

      // Злиття плиток
      while (i < merged.length) {
        if (i < merged.length - 1 && merged[i] === merged[i + 1]) {
          result.push(merged[i] * 2); // Подвоїти плитки
          this.score += merged[i] * 2; // Додаємо до рахунку
          i += 2; // Пропускаємо наступну плитку після злиття
        } else {
          result.push(merged[i]); // Якщо плитки не однакові
          i++;
        }
      }

      // Переміщуємо плитки вправо, щоб не було проміжків
      while (result.length < 4) {
        result.unshift(0);
      }

      return result;
    };

    const oldBoard = JSON.stringify(this.board);

    // Обробляємо кожен рядок

    const arraRow = this.board.map((row) => mergeColumn(row));

    this.board = [
      [arraRow[0][0], arraRow[0][1], arraRow[0][2], arraRow[0][3]],
      [arraRow[1][0], arraRow[1][1], arraRow[1][2], arraRow[1][3]],
      [arraRow[2][0], arraRow[2][1], arraRow[2][2], arraRow[2][3]],
      [arraRow[3][0], arraRow[3][1], arraRow[3][2], arraRow[3][3]],
    ];

    // Очищаємо дошку
    this.clearBoard();

    // Оновлення значень на сторінці
    const arrayFromTr = Array.from(tbody.children);

    for (let i = 0; i < arrayFromTr.length; i++) {
      const currentTr = arrayFromTr[i].children;

      currentTr[0].textContent = arraRow[i][0] === 0 ? '' : arraRow[i][0];
      currentTr[1].textContent = arraRow[i][1] === 0 ? '' : arraRow[i][1];
      currentTr[2].textContent = arraRow[i][2] === 0 ? '' : arraRow[i][2];
      currentTr[3].textContent = arraRow[i][3] === 0 ? '' : arraRow[i][3];

      if (currentTr[0].textContent !== '') {
        currentTr[0].classList.add('activ');
      }

      if (currentTr[1].textContent !== '') {
        currentTr[1].classList.add('activ');
      }

      if (currentTr[2].textContent !== '') {
        currentTr[2].classList.add('activ');
      }

      if (currentTr[3].textContent !== '') {
        currentTr[3].classList.add('activ');
      }
    }

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.spawnTile();
    }

    this.addColor();
    this.addSCore();

    const has2048 = this.board.some((row) => row.includes(2048));

    if (has2048) {
      this.getMessageWin();
    }

    // Оновлюємо дошку
    this.updateBoardFromDOM();
  } // Тільки ровні пацани йдуть туди.

  moveLeft() {
    const mergeColumn = (row) => {
      const merged = row.filter((cell) => cell !== 0);
      const result = [];
      let i = 0;

      // Злиття плиток
      while (i < merged.length) {
        if (i < merged.length - 1 && merged[i] === merged[i + 1]) {
          result.push(merged[i] * 2); // Подвоїти плитки
          this.score += merged[i] * 2; // Додаємо до рахунку
          i += 2; // Пропускаємо наступну плитку після злиття
        } else {
          result.push(merged[i]); // Якщо плитки не однакові
          i++;
        }
      }

      // Переміщуємо плитки вправо, щоб не було проміжків
      while (result.length < 4) {
        result.push(0);
      }

      return result;
    };

    const oldBoard = JSON.stringify(this.board);

    // Обробляємо кожен рядок

    const arraRow = this.board.map((row) => mergeColumn(row));

    this.board = [
      [arraRow[0][0], arraRow[0][1], arraRow[0][2], arraRow[0][3]],
      [arraRow[1][0], arraRow[1][1], arraRow[1][2], arraRow[1][3]],
      [arraRow[2][0], arraRow[2][1], arraRow[2][2], arraRow[2][3]],
      [arraRow[3][0], arraRow[3][1], arraRow[3][2], arraRow[3][3]],
    ];

    // Очищаємо дошку
    this.clearBoard();

    // Оновлення значень на сторінці
    const arrayFromTr = Array.from(tbody.children);

    for (let i = 0; i < arrayFromTr.length; i++) {
      const currentTr = arrayFromTr[i].children;

      currentTr[0].textContent = arraRow[i][0] === 0 ? '' : arraRow[i][0];
      currentTr[1].textContent = arraRow[i][1] === 0 ? '' : arraRow[i][1];
      currentTr[2].textContent = arraRow[i][2] === 0 ? '' : arraRow[i][2];
      currentTr[3].textContent = arraRow[i][3] === 0 ? '' : arraRow[i][3];

      if (currentTr[0].textContent !== '') {
        currentTr[0].classList.add('activ');
      }

      if (currentTr[1].textContent !== '') {
        currentTr[1].classList.add('activ');
      }

      if (currentTr[2].textContent !== '') {
        currentTr[2].classList.add('activ');
      }

      if (currentTr[3].textContent !== '') {
        currentTr[3].classList.add('activ');
      }
    }

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.spawnTile();
    }

    this.addColor();
    this.addSCore();

    const has2048 = this.board.some((row) => row.includes(2048));

    if (has2048) {
      this.getMessageWin();
    }

    // Оновлюємо дошку
    this.updateBoardFromDOM();
  } // Рух в ліво.
}

const game2048 = new Game();

buttonOfStart.addEventListener('click', () => {
  game2048.start();
});

document.addEventListener('keydown', (ewent) => {
  switch (ewent.key) {
    case 'ArrowUp':
      game2048.moveUp();
      break;

    case 'ArrowDown':
      game2048.moveDown();
      break;

    case 'ArrowRight':
      game2048.moveRight();
      break;

    case 'ArrowLeft':
      game2048.moveLeft();
      break;
  }
});

module.exports = Game;
