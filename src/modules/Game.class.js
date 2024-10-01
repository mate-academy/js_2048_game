'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.gameStatus = 'idle';
    this.score = 0;
  }

  moveLeft(rows) {
    if (this.gameStatus === 'playing') {
      const arrayOfRows = Array.from(rows);

      const gridBeforeMove = arrayOfRows.map(
        (row) =>
          Array.from(row.querySelectorAll('td')).map(
            (cell) => cell.textContent.trim(),
            // eslint-disable-next-line no-console
          ),
        // eslint-disable-next-line no-console
      );

      const nonEmptyCells = [];

      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');

        cells.forEach((cell, cellIndex) => {
          if (cell.textContent.trim().length > 0) {
            nonEmptyCells.push({
              rowIndex,
              cellIndex,
              cellNumber: parseInt(cell.textContent.trim(), 10),
            });
          }
        });
      });

      this.removeCell(rows);

      nonEmptyCells.forEach(({ rowIndex, cellIndex, cellNumber }) => {
        let targetCellIndex = cellIndex;

        while (targetCellIndex > 0) {
          const previousRow = rows[rowIndex];
          const previousCell =
            previousRow.querySelectorAll('td')[targetCellIndex - 1];

          if (previousCell.textContent.trim().length === 0) {
            targetCellIndex--;
          } else {
            const nextCellValue = parseInt(previousCell.textContent);

            if (nextCellValue === cellNumber) {
              const newCellValue = nextCellValue + cellNumber;

              previousCell.textContent = newCellValue;
              previousCell.className = `field-cell field-cell--${previousCell.textContent}`;

              this.getScore(newCellValue);

              if (newCellValue === 2048) {
                this.gameStatus = 'win';
              }
            } else {
              const currentRow = rows[rowIndex];
              const currentCell =
                currentRow.querySelectorAll('td')[targetCellIndex];

              currentCell.textContent = cellNumber;
              currentCell.className = `field-cell field-cell--${cellNumber}`;
            }

            return;
          }
        }

        const finalRow = rows[rowIndex];
        const finalCell = finalRow.querySelectorAll('td')[targetCellIndex];

        finalCell.textContent = cellNumber;
        finalCell.className = `field-cell field-cell--${cellNumber}`;
      });

      const gridAfterMove = arrayOfRows.map(
        (row) =>
          Array.from(row.querySelectorAll('td')).map(
            (cell) => cell.textContent.trim(),
            // eslint-disable-next-line no-console
          ),
        // eslint-disable-next-line no-console
      );

      const gridChanged = !gridBeforeMove.every(
        (row, rowIndex) =>
          row.every(
            (cell, cellIndex) => cell === gridAfterMove[rowIndex][cellIndex],
          ),
        // eslint-disable-next-line no-console
      );

      if (gridChanged) {
        return this.findEmptyCells(rows);
      }
    }
  }

  moveRight(rows) {
    if (this.gameStatus === 'playing') {
      const arrayOfRows = Array.from(rows);

      const gridBeforeMove = arrayOfRows.map(
        (row) =>
          Array.from(row.querySelectorAll('td')).map(
            (cell) => cell.textContent.trim(),
            // eslint-disable-next-line no-console
          ),
        // eslint-disable-next-line no-console
      );

      const nonEmptyCells = [];

      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');

        for (let cellIndex = cells.length - 1; cellIndex >= 0; cellIndex--) {
          const cell = cells[cellIndex];

          if (cell.textContent.trim().length > 0) {
            nonEmptyCells.push({
              rowIndex,
              cellIndex,
              cellNumber: parseInt(cell.textContent.trim(), 10),
            });
          }
        }
      });

      this.removeCell(rows);

      nonEmptyCells.forEach(({ rowIndex, cellIndex, cellNumber }) => {
        let targetCellIndex = cellIndex;

        while (targetCellIndex < rows[0].querySelectorAll('td').length - 1) {
          const nextRow = rows[rowIndex];
          const nextCell = nextRow.querySelectorAll('td')[targetCellIndex + 1];

          if (nextCell.textContent.trim().length === 0) {
            targetCellIndex++;
          } else {
            const nextCellValue = parseInt(nextCell.textContent);

            if (nextCellValue === cellNumber) {
              const newCellValue = nextCellValue + cellNumber;

              nextCell.textContent = newCellValue;
              nextCell.className = `field-cell field-cell--${nextCell.textContent}`;

              this.getScore(newCellValue);

              if (newCellValue === 2048) {
                this.gameStatus = 'win';
              }
            } else {
              const currentRow = rows[rowIndex];
              const currentCell =
                currentRow.querySelectorAll('td')[targetCellIndex];

              currentCell.textContent = cellNumber;
              currentCell.className = `field-cell field-cell--${cellNumber}`;
            }

            return;
          }
        }

        const finalRow = rows[rowIndex];
        const finalCell = finalRow.querySelectorAll('td')[targetCellIndex];

        finalCell.textContent = cellNumber;
        finalCell.className = `field-cell field-cell--${cellNumber}`;
      });

      const gridAfterMove = arrayOfRows.map(
        (row) =>
          Array.from(row.querySelectorAll('td')).map(
            (cell) => cell.textContent.trim(),
            // eslint-disable-next-line no-console
          ),
        // eslint-disable-next-line no-console
      );

      const gridChanged = !gridBeforeMove.every(
        (row, rowIndex) =>
          row.every(
            (cell, cellIndex) => cell === gridAfterMove[rowIndex][cellIndex],
          ),
        // eslint-disable-next-line no-console
      );

      if (gridChanged) {
        return this.findEmptyCells(rows);
      }
    }
  }

  moveUp(rows) {
    if (this.gameStatus === 'playing') {
      const arrayOfRows = Array.from(rows);

      const gridBeforeMove = arrayOfRows.map(
        (row) =>
          Array.from(row.querySelectorAll('td')).map(
            (cell) => cell.textContent.trim(),
            // eslint-disable-next-line no-console
          ),
        // eslint-disable-next-line no-console
      );

      const nonEmptyCells = [];

      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');

        cells.forEach((cell, cellIndex) => {
          if (cell.textContent.trim().length > 0) {
            nonEmptyCells.push({
              rowIndex,
              cellIndex,
              cellNumber: parseInt(cell.textContent.trim(), 10),
            });
          }
        });
      });

      this.removeCell(rows);

      nonEmptyCells.forEach(({ rowIndex, cellIndex, cellNumber }) => {
        let targetRowIndex = rowIndex;

        while (targetRowIndex > 0) {
          const previousRow = rows[targetRowIndex - 1];
          const previousCell = previousRow.querySelectorAll('td')[cellIndex];

          if (previousCell.textContent.trim().length === 0) {
            targetRowIndex--;
          } else {
            const previousCellValue = parseInt(previousCell.textContent);

            if (previousCellValue === cellNumber) {
              const newCellValue = previousCellValue + cellNumber;

              previousCell.textContent = newCellValue;
              previousCell.className = `field-cell field-cell--${previousCell.textContent}`;

              this.getScore(newCellValue);

              if (newCellValue === 2048) {
                this.gameStatus = 'win';
              }
            } else {
              const currentRow = rows[targetRowIndex];
              const currentCell = currentRow.querySelectorAll('td')[cellIndex];

              currentCell.textContent = cellNumber;
              currentCell.className = `field-cell field-cell--${cellNumber}`;
            }

            return;
          }
        }

        const finalRow = rows[targetRowIndex];
        const finalCell = finalRow.querySelectorAll('td')[cellIndex];

        finalCell.textContent = cellNumber;
        finalCell.className = `field-cell field-cell--${cellNumber}`;
      });

      const gridAfterMove = arrayOfRows.map(
        (row) =>
          Array.from(row.querySelectorAll('td')).map(
            (cell) => cell.textContent.trim(),
            // eslint-disable-next-line no-console
          ),
        // eslint-disable-next-line no-console
      );

      const gridChanged = !gridBeforeMove.every(
        (row, rowIndex) =>
          row.every(
            (cell, cellIndex) => cell === gridAfterMove[rowIndex][cellIndex],
          ),
        // eslint-disable-next-line no-console
      );

      if (gridChanged) {
        return this.findEmptyCells(rows);
      }
    }
  }

  moveDown(rows) {
    if (this.gameStatus === 'playing') {
      const arrayOfRows = Array.from(rows);

      const gridBeforeMove = arrayOfRows.map(
        (row) =>
          Array.from(row.querySelectorAll('td')).map(
            (cell) => cell.textContent.trim(),
            // eslint-disable-next-line no-console
          ),
        // eslint-disable-next-line no-console
      );

      const nonEmptyCells = [];

      for (let rowIndex = rows.length - 1; rowIndex >= 0; rowIndex--) {
        const cells = rows[rowIndex].querySelectorAll('td');

        cells.forEach((cell, cellIndex) => {
          if (cell.textContent.trim().length > 0) {
            nonEmptyCells.push({
              rowIndex,
              cellIndex,
              cellNumber: parseInt(cell.textContent.trim(), 10),
            });
          }
        });
      }

      this.removeCell(rows);

      nonEmptyCells.forEach(({ rowIndex, cellIndex, cellNumber }) => {
        let targetRowIndex = rowIndex;

        while (targetRowIndex < rows.length - 1) {
          const nextRow = rows[targetRowIndex + 1];
          const nextCell = nextRow.querySelectorAll('td')[cellIndex];

          if (nextCell.textContent.trim().length === 0) {
            targetRowIndex++;
          } else {
            const nextCellValue = parseInt(nextCell.textContent);

            if (nextCellValue === cellNumber) {
              const newCellValue = nextCellValue + cellNumber;

              nextCell.textContent = newCellValue;
              nextCell.className = `field-cell field-cell--${nextCell.textContent}`;

              this.getScore(newCellValue);

              if (newCellValue === 2048) {
                this.gameStatus = 'win';
              }
            } else {
              const currentRow = rows[targetRowIndex];
              const currentCell = currentRow.querySelectorAll('td')[cellIndex];

              currentCell.textContent = cellNumber;
              currentCell.className = `field-cell field-cell--${cellNumber}`;
            }

            return;
          }
        }

        const finalRow = rows[targetRowIndex];
        const finalCell = finalRow.querySelectorAll('td')[cellIndex];

        finalCell.textContent = cellNumber;
        finalCell.className = `field-cell field-cell--${cellNumber}`;
      });

      const gridAfterMove = arrayOfRows.map(
        (row) =>
          Array.from(row.querySelectorAll('td')).map(
            (cell) => cell.textContent.trim(),
            // eslint-disable-next-line no-console
          ),
        // eslint-disable-next-line no-console
      );

      const gridChanged = !gridBeforeMove.every(
        (row, rowIndex) =>
          row.every(
            (cell, cellIndex) => cell === gridAfterMove[rowIndex][cellIndex],
          ),
        // eslint-disable-next-line no-console
      );

      if (gridChanged) {
        return this.findEmptyCells(rows);
      }
    }
  }

  getScore(newScore) {
    if (newScore !== undefined) {
      this.score += newScore;
    }

    return this.score;
  }

  getState(rows) {
    const arrayOfRows = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');

      const arrayOfCell = [];

      cells.forEach((_, cellIndex) => {
        arrayOfCell.push(cellIndex);
      });

      arrayOfRows.push(arrayOfCell);
    });

    this.initialState = arrayOfRows;

    return this.initialState;
  }

  getStatus() {
    return this.gameStatus;
  }

  start(rows) {
    this.gameStatus = 'playing';

    let isEmpty = true;

    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');

      cells.forEach((cell) => {
        if (cell.textContent.trim().length > 0) {
          isEmpty = false;
        }
      });
    });

    return this.createCell(isEmpty);
  }

  restart(rows) {
    this.gameStatus = 'idle';

    this.score = 0;

    this.removeCell(rows);

    this.isGridFull = [];
  }

  getRandomIndex() {
    const arrayOfRandomIndexs = [];

    let firstIndex = Math.floor(Math.random() * 4);
    let secondIndex = Math.floor(Math.random() * 4);
    let thirdIndex = Math.floor(Math.random() * 4);
    let fourthIndex = Math.floor(Math.random() * 4);

    if (firstIndex === thirdIndex) {
      firstIndex = Math.floor(Math.random() * 4);
      thirdIndex = Math.floor(Math.random() * 4);
    }

    if (secondIndex === fourthIndex) {
      secondIndex = Math.floor(Math.random() * 4);
      fourthIndex = Math.floor(Math.random() * 4);
    }

    if (firstIndex === secondIndex) {
      firstIndex = Math.floor(Math.random() * 4);
      secondIndex = Math.floor(Math.random() * 4);
    }

    if (thirdIndex === fourthIndex) {
      thirdIndex = Math.floor(Math.random() * 4);
      fourthIndex = Math.floor(Math.random() * 4);
    }

    arrayOfRandomIndexs.push(firstIndex);
    arrayOfRandomIndexs.push(secondIndex);
    arrayOfRandomIndexs.push(thirdIndex);
    arrayOfRandomIndexs.push(fourthIndex);

    return arrayOfRandomIndexs;
  }

  getRandomCellNumber() {
    const persentOfFourFirst = Math.random();
    const persentOfFourSecond = Math.random();
    const arrayOfRandomCellNumber = [];

    const firstNumber = persentOfFourFirst <= 0.1 ? 4 : 2;
    const secondNumber = persentOfFourSecond <= 0.1 ? 4 : 2;

    arrayOfRandomCellNumber.push(firstNumber);
    arrayOfRandomCellNumber.push(secondNumber);

    return arrayOfRandomCellNumber;
  }

  createCell(isEmpty) {
    const randomIndexes = this.getRandomIndex();
    const cellNumber = this.getRandomCellNumber();

    let firstIndexes = null;
    let seconIndexes = null;

    const arrayOfIndexes = [];

    this.initialState.forEach((row, rowIndex) => {
      row.forEach((_, cellIndex) => {
        if (isEmpty) {
          if (rowIndex === randomIndexes[0] && cellIndex === randomIndexes[2]) {
            firstIndexes = {
              rowIndex: randomIndexes[0],
              cellIndex: randomIndexes[2],
              cellNumber: cellNumber[0],
            };

            arrayOfIndexes.push(firstIndexes);
          }

          if (rowIndex === randomIndexes[1] && cellIndex === randomIndexes[3]) {
            seconIndexes = {
              rowIndex: randomIndexes[1],
              cellIndex: randomIndexes[3],
              cellNumber: cellNumber[1],
            };

            arrayOfIndexes.push(seconIndexes);
          }
        }
      });
    });

    return arrayOfIndexes;
  }

  createCellIfGameStarted(arrayOfEmpyRows, arrayOfEmpyCells) {
    const randomSoloRow = Math.floor(Math.random() * arrayOfEmpyRows.length);
    const randomSoloRowIndex = arrayOfEmpyRows[randomSoloRow];
    const randomSoloCellIndex = arrayOfEmpyCells[randomSoloRow];

    arrayOfEmpyRows.splice(randomSoloRow, 1);
    arrayOfEmpyCells.splice(randomSoloRow, 1);

    const cellNumber = this.getRandomCellNumber();

    let firstIndexes = null;

    const arrayOfIndexes = [];

    arrayOfEmpyRows.splice(randomSoloRow, 1);
    arrayOfEmpyCells.splice(randomSoloRow, 1);

    this.initialState.forEach((row, rowIndex) => {
      row.forEach((_, cellIndex) => {
        if (
          rowIndex === randomSoloRowIndex &&
          cellIndex === randomSoloCellIndex
        ) {
          firstIndexes = {
            rowIndex,
            cellIndex,
            cellNumber: cellNumber[0],
          };

          arrayOfIndexes.push(firstIndexes);
        }
      });
    });

    return arrayOfIndexes;
  }

  findEmptyCells(rows) {
    const arrayOfEmptyRows = [];
    const arrayOfEmptyCells = [];

    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');

      cells.forEach((cell, cellIndex) => {
        if (cell.textContent.trim().length === 0) {
          arrayOfEmptyRows.push(rowIndex);
          arrayOfEmptyCells.push(cellIndex);
        }
      });
    });

    return this.createCellIfGameStarted(arrayOfEmptyRows, arrayOfEmptyCells);
  }

  isMovePossible(gridAfterMove) {
    const isCellsFullHorizontally = [];
    const isCellsFullVertically = [];

    gridAfterMove.forEach((row) => {
      if (
        row.length === 4 &&
        !row.includes('') &&
        isCellsFullHorizontally.length < 4
      ) {
        const isCellFull = [];

        for (let i = 0; i < row.length - 1; i++) {
          if (row[i] !== row[i + 1]) {
            isCellFull.push(true);
          }

          if (isCellFull.length === 3) {
            isCellsFullHorizontally.push(true);
          }
        }
      }
    });

    for (let i = 0; i < gridAfterMove.length - 1; i++) {
      const currentRow = gridAfterMove[i];
      const nextRow = gridAfterMove[i + 1];
      const isCellFull = [];

      if (
        currentRow.length === 4 &&
        nextRow.length === 4 &&
        !currentRow.includes('') &&
        !nextRow.includes('')
      ) {
        for (let j = 0; j < currentRow.length; j++) {
          if (currentRow[j] !== nextRow[j]) {
            isCellFull.push(true);
          }

          if (isCellFull.length === 4) {
            isCellsFullVertically.push(true);
          }
        }
      }
    }

    if (
      isCellsFullHorizontally.length === 4 &&
      isCellsFullVertically.length === 3
    ) {
      this.gameStatus = 'lose';
    }
  }

  removeCell(rows) {
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');

      cells.forEach((cell) => {
        if (cell.textContent.length > 0) {
          cell.className = 'field-cell';
          cell.innerHTML = '';
        }
      });
    });
  }

  changeMessage(startMessage) {
    if (this.gameStatus === 'playing') {
      startMessage.classList.add('hidden');
    }

    if (this.gameStatus === 'idle') {
      startMessage.classList.remove('hidden');
    }
  }
}

module.exports = Game;
