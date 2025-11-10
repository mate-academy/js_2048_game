'use strict';

const startField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

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
  constructor(initialState = startField) {
    this.field = initialState.map((row) => row.slice());
    this.initialField = initialState.map((row) => row.slice());

    this.status = 'idle';
    this.newNumber = null;
  }

  createNumber() {
    const currentField = this.getState();

    const opportunityInsert = currentField.some((curRow) => {
      return curRow.some((item) => item === 0);
    });

    if (opportunityInsert === false) {
      this.newNumber = null;

      return;
    }

    let position = [0, 0];
    let randomNumber = Math.random();

    if (randomNumber > 0.1) {
      randomNumber = 2;
    } else {
      randomNumber = 4;
    }

    do {
      position = position.map(() => {
        const result = Math.floor(Math.random() * 4);

        return result;
      });
    } while (this.field[position[0]][position[1]] !== 0);

    const [row, column] = position;

    this.field[row][column] = randomNumber;

    this.newNumber = [randomNumber, row, column];
  }
  getNumber() {
    return this.newNumber;
  }

  moveLeft(checkOnly = false) {
    if (this.status !== 'playing') {
      return;
    }

    const currentField = this.getState();

    const resultsMerge = [];

    const startPosition = [];

    for (const row of currentField) {
      const currentRow = [];

      // создаем объект в который заносим данные каждого значения из ряда
      row.forEach((element, elIndex) => {
        const obj = {};

        obj.value = element;
        obj.indexStart = elIndex;

        currentRow.push(obj);
      });
      startPosition.push(currentRow);
    }

    // оставляем объекты в которых значение не равно 0
    const filteredPosition = startPosition.map((row) => {
      return row.filter((obj) => obj.value !== 0);
    });

    const finalPosition = [];

    for (let i = 0; i < filteredPosition.length; i++) {
      const currentPosition = [];

      // если ряд пустой - пушим в массив
      if (filteredPosition[i].length === 0) {
        finalPosition.push(filteredPosition[i]);
        continue;
      }

      // начинаем перебирать объекты в ряду
      for (
        let objIndex = 0;
        objIndex < filteredPosition[i].length;
        objIndex++
      ) {
        // получаем текущий объект и следующий
        const currentObj = { ...filteredPosition[i][objIndex] };
        const nextObj = filteredPosition[i][objIndex + 1];

        // проверка на следующий элемент, иначе будет ошибка
        if (nextObj !== undefined) {
          if (currentObj.value === nextObj.value) {
            currentObj.value += nextObj.value;
            currentObj.merged = true;
            currentObj.indexStart = [currentObj.indexStart, nextObj.indexStart];

            resultsMerge.push(currentObj.value);

            currentPosition.push(currentObj);
            objIndex++;
            continue;
          }

          if (currentObj.value !== nextObj.value) {
            currentObj.merged = false;

            currentPosition.push(currentObj);
          }
        } else {
          currentObj.merged = false;

          currentPosition.push(currentObj);
        }
      }

      finalPosition.push(currentPosition);
    }

    const copyStartField = startField.map((row) => row.slice());

    // добавляем данные текущего положения в объект и обновляем поле
    finalPosition.forEach((row, iRow) => {
      row.forEach((obj, iObj) => {
        copyStartField[iRow][iObj] = obj.value;
        obj.to = iObj;
      });
    });

    // проверка изменилось ли поле после движения
    const checkChanges = !currentField.every((row, iRow) => {
      return row.every((item, i) => {
        return copyStartField[iRow][i] === item;
      });
    });

    if (checkOnly === false) {
      if (checkChanges) {
        this.field = copyStartField.map((row) => row.slice());

        this.createNumber();
        this.getStatus();

        this.getScore(resultsMerge);

        return finalPosition;
      } else {
        this.getStatus();

        return;
      }
    }

    if (checkOnly === true) {
      return copyStartField;
    }
  }
  moveRight(checkOnly = false) {
    if (this.status !== 'playing') {
      return;
    }

    const currentField = this.getState();

    const startPosition = [];

    const resultsMerge = [];

    for (const row of currentField) {
      const currentRow = [];

      // создаем объект в который заносим данные каждого значения из ряда
      row.forEach((element, elIndex) => {
        const obj = {};

        obj.value = element;
        obj.indexStart = elIndex;

        currentRow.push(obj);
      });
      startPosition.push(currentRow);
    }

    // оставляем объекты в которых значение не равно 0
    const filteredPosition = startPosition.map((row) => {
      return row.filter((obj) => obj.value !== 0);
    });

    const finalPosition = [];

    for (let i = 0; i < filteredPosition.length; i++) {
      const currentPosition = [];

      // если ряд пустой - пушим в массив
      if (filteredPosition[i].length === 0) {
        finalPosition.push(filteredPosition[i]);
        continue;
      }

      // начинаем перебирать объекты в ряду
      for (
        let objIndex = filteredPosition[i].length - 1;
        objIndex >= 0;
        objIndex--
      ) {
        // получаем текущий объект и следующий
        const currentObj = { ...filteredPosition[i][objIndex] };
        const nextObj = filteredPosition[i][objIndex - 1];

        // проверка на следующий элемент, иначе будет ошибка
        if (nextObj !== undefined) {
          if (currentObj.value === nextObj.value) {
            currentObj.value += nextObj.value;
            currentObj.merged = true;
            currentObj.indexStart = [currentObj.indexStart, nextObj.indexStart];

            resultsMerge.push(currentObj.value);

            currentPosition.push(currentObj);
            objIndex--;
            continue;
          }

          if (currentObj.value !== nextObj.value) {
            currentObj.merged = false;

            currentPosition.push(currentObj);
          }
        } else {
          currentObj.merged = false;

          currentPosition.push(currentObj);
        }
      }

      finalPosition.push(currentPosition);
    }

    const copyStartField = startField.map((row) => row.slice());

    // добавляем данные текущего положения в объект и обновляем поле
    finalPosition.forEach((row, iRow) => {
      row.forEach((obj, iObj) => {
        if (typeof indexStart === 'object') {
          obj.to = iObj;
        } else {
          obj.to = 3 - iObj;
        }
      });
    });

    finalPosition.forEach((row, iRow) => {
      row.forEach((item, i) => {
        copyStartField[iRow][item.to] = item.value;
      });
    });

    // проверка изменилось ли поле после движения
    const checkChanges = !currentField.every((row, iRow) => {
      return row.every((item, i) => {
        return copyStartField[iRow][i] === item;
      });
    });

    if (checkOnly === false) {
      if (checkChanges) {
        this.field = copyStartField.map((row) => row.slice());

        this.createNumber();
        this.getStatus();
        this.getScore(resultsMerge);

        return finalPosition;
      } else {
        this.getStatus();

        return;
      }
    }

    if (checkOnly === true) {
      return copyStartField;
    }
  }
  moveUp(checkOnly = false) {
    if (this.status !== 'playing') {
      return;
    }

    const currentField = this.getState();

    const turnOver = [];

    const resultsMerge = [];

    // создаем в turnOver кол-во массивов равное кол-ву рядов в поле
    currentField.forEach(() => turnOver.push([]));

    // перебираем каждый элемент из оригинального массива
    // берем индекс элемента и вставлеяем в тот же индекс массива turnOver
    // таким образом: [
    //   [2, 0, 0, 0],
    //   [2, 0, 0, 0],
    //   [2, 0, 0, 0],
    //   [2, 0, 0, 0],
    // ]
    // превращается в: [2, 2, 2, 2]
    currentField.forEach((row) => {
      row.forEach((item, i) => turnOver[i].push(item));
    });

    const startPosition = [];

    for (let column = 0; column < turnOver.length; column++) {
      const currentPosition = [];

      turnOver[column].forEach((item, i) => {
        const obj = {};

        obj.value = item;
        obj.column = column;
        obj.rowStart = i;

        currentPosition.push(obj);
      });

      startPosition.push(currentPosition);
    }

    const filteredPosition = startPosition.map((row) => {
      return row.filter((obj) => obj.value !== 0);
    });

    const finalPosition = [];

    for (let row = 0; row < filteredPosition.length; row++) {
      const currentPosition = [];

      if (filteredPosition[row].length === 0) {
        finalPosition.push(currentPosition);
        continue;
      }

      for (
        let objIndex = 0;
        objIndex < filteredPosition[row].length;
        objIndex++
      ) {
        const currentObj = { ...filteredPosition[row][objIndex] };
        const nextObj = filteredPosition[row][objIndex + 1];

        if (nextObj !== undefined) {
          if (currentObj.value === nextObj.value) {
            currentObj.value += nextObj.value;
            currentObj.merged = true;
            currentObj.rowStart = [currentObj.rowStart, nextObj.rowStart];

            resultsMerge.push(currentObj.value);

            currentPosition.push(currentObj);
            objIndex++;
            continue;
          }

          if (currentObj.value !== nextObj.value) {
            currentObj.merged = false;

            currentPosition.push(currentObj);
          }
        } else {
          currentObj.merged = false;

          currentPosition.push(currentObj);
        }
      }

      finalPosition.push(currentPosition);
    }

    const copyStartField = startField.map((row) => row.slice());

    finalPosition.forEach((column, iCol) => {
      column.forEach((item, iRow) => {
        copyStartField[iRow][iCol] = item.value;
        item.to = iRow;
      });
    });

    // проверка изменилось ли поле после движения
    const checkChanges = !currentField.every((row, iRow) => {
      return row.every((item, i) => {
        return copyStartField[iRow][i] === item;
      });
    });

    if (checkOnly === false) {
      if (checkChanges) {
        this.field = copyStartField.map((row) => row.slice());

        this.createNumber();
        this.getStatus();
        this.getScore(resultsMerge);

        return finalPosition;
      } else {
        this.getStatus();

        return;
      }
    }

    if (checkOnly === true) {
      return copyStartField;
    }
  }
  moveDown(checkOnly = false) {
    if (this.status !== 'playing') {
      return;
    }

    const currentField = this.getState();

    const turnOver = [];

    const resultsMerge = [];

    // создаем в turnOver кол-во массивов равное кол-ву рядов в поле
    currentField.forEach(() => turnOver.push([]));

    // перебираем каждый элемент из оригинального массива
    // берем индекс элемента и вставлеяем в тот же индекс массива turnOver
    // таким образом: [
    //   [2, 0, 0, 0],
    //   [2, 0, 0, 0],
    //   [2, 0, 0, 0],
    //   [2, 0, 0, 0],
    // ]
    // превращается в: [2, 2, 2, 2]
    currentField.forEach((row) => {
      row.forEach((item, i) => turnOver[i].push(item));
    });

    const startPosition = [];

    for (let column = 0; column < turnOver.length; column++) {
      const currentPosition = [];

      turnOver[column].forEach((item, i) => {
        const obj = {};

        obj.value = item;
        obj.column = column;
        obj.rowStart = i;

        currentPosition.push(obj);
      });

      startPosition.push(currentPosition);
    }

    const filteredPosition = startPosition.map((row) => {
      return row.filter((obj) => obj.value !== 0);
    });

    const finalPosition = [];

    for (let row = 0; row < filteredPosition.length; row++) {
      const currentPosition = [];

      if (filteredPosition[row].length === 0) {
        finalPosition.push(currentPosition);
        continue;
      }

      for (
        let objIndex = filteredPosition[row].length - 1;
        objIndex >= 0;
        objIndex--
      ) {
        const currentObj = { ...filteredPosition[row][objIndex] };
        const nextObj = filteredPosition[row][objIndex - 1];

        if (nextObj !== undefined) {
          if (currentObj.value === nextObj.value) {
            currentObj.value += nextObj.value;
            currentObj.merged = true;
            currentObj.rowStart = [currentObj.rowStart, nextObj.rowStart];

            resultsMerge.push(currentObj.value);

            currentPosition.push(currentObj);
            objIndex--;
            continue;
          }

          if (currentObj.value !== nextObj.value) {
            currentObj.merged = false;

            currentPosition.push(currentObj);
          }
        } else {
          currentObj.merged = false;

          currentPosition.push(currentObj);
        }
      }

      finalPosition.push(currentPosition);
    }

    const copyStartField = startField.map((row) => row.slice());

    finalPosition.forEach((column, iCol) => {
      column.forEach((item, iRow) => {
        item.to = 3 - iRow;
        copyStartField[item.to][iCol] = item.value;
      });
    });

    // проверка изменилось ли поле после движения
    const checkChanges = !currentField.every((row, iRow) => {
      return row.every((item, i) => {
        return copyStartField[iRow][i] === item;
      });
    });

    if (checkOnly === false) {
      if (checkChanges) {
        this.field = copyStartField.map((row) => row.slice());

        this.createNumber();
        this.getStatus();
        this.getScore(resultsMerge);

        return finalPosition;
      } else {
        this.getStatus();

        return;
      }
    }

    if (checkOnly === true) {
      return copyStartField;
    }
  }

  /**
   * @returns {number}
   */
  getScore(values = [0]) {
    if (!this.sum) {
      this.sum = 0;
    }

    for (const num of values) {
      this.sum += num;
    }

    return this.sum;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.field.map((row) => [...row]);
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
    if (
      this.status === 'lose' ||
      this.status === 'win' ||
      this.status === 'idle'
    ) {
      return this.status;
    }

    if (this.field.some((row) => row.some((item) => item === 2048))) {
      this.status = 'win';

      return this.status;
    }

    const oldState = this.getState();
    const checkMovesAll = [];

    const moveResults = [
      this.moveUp(true),
      this.moveDown(true),
      this.moveLeft(true),
      this.moveRight(true),
    ];

    for (const currentState of moveResults) {
      const result = oldState.every((row, iRow) => {
        return row.every((item, i) => {
          return currentState[iRow][i] === item;
        });
      });

      checkMovesAll.push(result);
    }

    if (checkMovesAll.every((result) => result === true)) {
      this.status = 'lose';
    }

    return this.status;
  }

  checkStatus() {
    return this.status;
  }

  start() {
    const num1 = this.getNumber(this.createNumber());
    const num2 = this.getNumber(this.createNumber());

    this.status = 'playing';

    return [num1, num2];
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = this.initialField.map((row) => row.slice());

    this.sum = 0;
    this.newNumber = null;

    this.status = 'idle';
  }

  // Add your own methods here
}

module.exports = Game;
