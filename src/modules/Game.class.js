'use strict';
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    UIBoard,
    UIScore,
    UIButton,
    UIInput,

    UIMessageLose,
    UIMessageWin,
    UIMessageStart,
    UITitle,
  ) {
    this.board = initialState;
    this.boardHeight = this.board.length;
    this.boardWidth = this.board[0].length;

    this.UIScore = UIScore;

    this.UIBoard = this.renderUIBoard(UIBoard);

    this.UIButton = UIButton;
    this.UIInput = UIInput;

    this.score = 0;
    this.gameStatus = 'idle';

    this.maxSize = 9;
    this.minSize = 4;

    this.UIMessageLose = UIMessageLose;
    this.UIMessageWin = UIMessageWin;
    this.UIMessageStart = UIMessageStart;
    this.UITitle = UITitle;

    this.winNumber = 2048;
    this.biggestNumber = 0;
  }

  renderZeroBoard(size) {
    this.UITitle.innerText = String(2 ** (size + 7));

    this.board = [Array.from({ length: size }, () => 0)];
    this.board = [...Array.from({ length: size }, () => [...this.board[0]])];
    this.boardHeight = this.board.length;
    this.boardWidth = this.board[0].length;
    this.renderUIBoard(this.UIBoard);
  }

  renderUIBoard(UIBoardReference) {
    [...UIBoardReference.children].forEach((child) => child.remove());

    this.board.forEach((row) => {
      const UIRow = document.createElement('tr');

      UIRow.classList.add('field-row');

      row.forEach((column) => {
        const UIColumn = document.createElement('td');

        UIColumn.classList.add('field-cell');

        UIRow.append(UIColumn);
      });

      UIBoardReference.append(UIRow);
    });

    return UIBoardReference;
  }

  addRandomize() {
    let quantity = this.boardWidth - 3;

    const zerosCounter = this.board.reduce((previous, row) => {
      return (
        previous +
        row.reduce((counter, column) => {
          if (column === 0) {
            return counter + 1;
          }

          return counter;
        }, 0)
      );
    }, 0);

    if (quantity > zerosCounter) {
      quantity = zerosCounter;
    }

    const randomizedNumbers = [];

    for (let i = 1; i <= quantity; i++) {
      const randomNumber = Math.floor(Math.random() * (101 - 0) + 0);

      if (randomNumber <= 10) {
        randomizedNumbers.push(4);
        continue;
      }

      randomizedNumbers.push(2);
    }

    while (randomizedNumbers.length !== 0) {
      const randomRow = Math.floor(Math.random() * this.boardHeight);
      const randomColumn = Math.floor(Math.random() * this.boardWidth);

      if (this.board[randomRow][randomColumn] === 0) {
        this.board[randomRow][randomColumn] = randomizedNumbers.shift() || 2;
      }
    }
  }

  renderBoard() {
    this.UIScore.innerText = String(this.score);

    for (let row = 0; row < this.boardHeight; row++) {
      for (let column = 0; column < this.boardWidth; column++) {
        this.UIBoard.children[row].children[column].classList = 'field-cell';

        if (this.board[row][column] !== 0) {
          this.UIBoard.children[row].children[column].classList.add(
            `field-cell--${this.board[row][column]}`,
          );
        }

        this.UIBoard.children[row].children[column].innerHTML = String(
          this.board[row][column] || '',
        );
      }
    }

    if (this.biggestNumber >= this.winNumber) {
      this.gameWin();

      return;
    }

    const checkGameOverArray = [];

    for (let row = 0; row < this.boardHeight; row++) {
      checkGameOverArray.push(this.#checkAbilityToMove([...this.board[row]]));
    }

    for (let column = 0; column < this.boardWidth; column++) {
      checkGameOverArray.push(
        this.#checkAbilityToMove([...this.#reduceToColumn(column)]),
      );
    }

    if (checkGameOverArray.every((item) => item === false)) {
      this.gameOver();
    }
  }

  #checkAbilityToMove(row) {
    if (row.filter((item) => item !== 0).length === 0) {
      return false;
    }

    if (row.includes(0)) {
      return true;
    }

    const boardRowZeroless = row.filter((number) => number !== 0);

    return boardRowZeroless.some((number, index) => {
      if (index === boardRowZeroless.length - 1) {
        return false;
      }

      if (boardRowZeroless[index] === boardRowZeroless[index + 1]) {
        return true;
      }

      return false;
    });
  }

  moveHorizontally(direction) {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moveAffected = false;

    for (let row = 0; row < this.boardHeight; row++) {
      let isRowChanged = false;

      const newRow = [...this.board[row]];

      if (this.#checkAbilityToMove(newRow)) {
        switch (direction) {
          case 'right':
            for (let column = this.boardWidth - 1; column > 0; column--) {
              if (this.board[row][column] !== 0) {
                let indexOfIdenticalNumber = -1;

                for (
                  let searchColumn = column - 1;
                  searchColumn >= 0;
                  searchColumn--
                ) {
                  if (
                    this.board[row][searchColumn] === this.board[row][column] &&
                    this.board[row][searchColumn] !== 0
                  ) {
                    indexOfIdenticalNumber = searchColumn;
                    break;
                  }

                  if (this.board[row][searchColumn] !== 0) {
                    break;
                  }
                }

                if (indexOfIdenticalNumber !== -1) {
                  const newRowNumberCopy = newRow[indexOfIdenticalNumber];

                  newRow[indexOfIdenticalNumber] = 0;
                  newRow[column] = newRowNumberCopy * 2;
                  this.score += newRow[column];
                  this.board[row] = newRow;

                  isRowChanged = true;
                }
              }
            }

            break;

          case 'left':
            for (let column = 0; column < this.boardWidth - 1; column++) {
              if (this.board[row][column] !== 0) {
                let indexOfIdenticalNumber = -1;

                for (
                  let searchColumn = column + 1;
                  searchColumn < this.boardWidth;
                  searchColumn++
                ) {
                  if (
                    this.board[row][searchColumn] === this.board[row][column] &&
                    this.board[row][searchColumn] !== 0
                  ) {
                    indexOfIdenticalNumber = searchColumn;
                    break;
                  }

                  if (this.board[row][searchColumn] !== 0) {
                    break;
                  }
                }

                if (indexOfIdenticalNumber !== -1) {
                  const newRowNumberCopy = newRow[column];

                  newRow[column] = 0;
                  newRow[indexOfIdenticalNumber] = newRowNumberCopy * 2;
                  this.score += newRow[indexOfIdenticalNumber];
                  this.board[row] = newRow;

                  isRowChanged = true;
                }
              }
            }
        }

        if (isRowChanged || this.board[row].includes(0)) {
          moveAffected = true;

          this.board[row] = this.board[row].filter((number) => number !== 0);

          const zeros = '0'
            .repeat(this.boardWidth - this.board[row].length)
            .split('')
            .map((number) => Number(number));

          switch (direction) {
            case 'right':
              this.board[row].unshift(...zeros);
              break;

            case 'left':
              this.board[row].push(...zeros);
              break;
          }
        }
      }
    }

    if (moveAffected) {
      this.addRandomize();
      this.renderBoard();
    }
  }

  #reduceToColumn(column) {
    return this.board.reduce((previous, current) => {
      previous.push(current[column]);

      return previous;
    }, []);
  }

  moveVertically(direction) {
    if (this.gameStatus !== 'playing') {
      return;
    }

    let moveAffected = false;

    for (let column = 0; column < this.boardWidth; column++) {
      let isColumnChanged = false;

      const newColumn = [...this.#reduceToColumn(column)];

      if (this.#checkAbilityToMove(newColumn)) {
        switch (direction) {
          case 'up':
            for (let row = 0; row < this.boardHeight - 1; row++) {
              if (this.board[row][column] !== 0) {
                let indexOfIdenticalNumber = -1;

                for (
                  let searchRow = row + 1;
                  searchRow < this.boardHeight;
                  searchRow++
                ) {
                  if (
                    this.board[searchRow][column] === this.board[row][column] &&
                    this.board[searchRow][column] !== 0
                  ) {
                    indexOfIdenticalNumber = searchRow;
                    break;
                  }

                  if (this.board[searchRow][column] !== 0) {
                    break;
                  }
                }

                if (indexOfIdenticalNumber !== -1) {
                  const newColumnNumberCopy = newColumn[row];

                  newColumn[row] = 0;
                  newColumn[indexOfIdenticalNumber] = newColumnNumberCopy * 2;
                  this.score += newColumn[indexOfIdenticalNumber];

                  this.board.forEach((boardRow, index) => {
                    boardRow[column] = newColumn[index];
                  });

                  isColumnChanged = true;
                }
              }
            }
            break;

          case 'down':
            for (let row = this.boardHeight - 1; row > 0; row--) {
              if (this.board[row][column] !== 0) {
                let indexOfIdenticalNumber = -1;

                for (let searchRow = row - 1; searchRow >= 0; searchRow--) {
                  if (
                    this.board[searchRow][column] === this.board[row][column] &&
                    this.board[searchRow][column] !== 0
                  ) {
                    indexOfIdenticalNumber = searchRow;
                    break;
                  }

                  if (this.board[searchRow][column] !== 0) {
                    break;
                  }
                }

                if (indexOfIdenticalNumber !== -1) {
                  const newColumnNumberCopy = newColumn[indexOfIdenticalNumber];

                  newColumn[indexOfIdenticalNumber] = 0;
                  newColumn[row] = newColumnNumberCopy * 2;
                  this.score += newColumn[row];

                  this.board.forEach((boardRow, index) => {
                    boardRow[column] = newColumn[index];
                  });

                  isColumnChanged = true;
                }
              }
            }
        }

        if (isColumnChanged || this.#reduceToColumn(column).includes(0)) {
          moveAffected = true;

          const filteredColumn = this.#reduceToColumn(column).filter(
            (number) => number !== 0,
          );

          const zeros = '0'
            .repeat(this.boardHeight - filteredColumn.length)
            .split('')
            .map((number) => Number(number));

          switch (direction) {
            case 'up':
              filteredColumn.push(...zeros);
              break;

            case 'down':
              filteredColumn.unshift(...zeros);
          }

          this.board.forEach((boardRow, index) => {
            boardRow[column] = filteredColumn[index];
          });
        }
      }
    }

    if (moveAffected) {
      this.addRandomize();
      this.renderBoard();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.score = 0;
    this.addRandomize();
    this.addRandomize();
    this.renderBoard();
    this.gameStatus = 'playing';
    this.UIButton.innerText = 'Restart';
    this.UIButton.classList = 'button restart';

    this.UIInput.disabled = true;

    this.UIMessageStart.classList.add('hidden');
    this.UIMessageLose.classList.add('hidden');
    this.UIMessageWin.classList.add('hidden');
  }

  restart() {
    this.gameStatus = 'idle';
    this.renderZeroBoard(this.boardWidth);
    this.start();
  }

  gameOver() {
    this.UIMessageLose.classList.remove('hidden');
    this.gameStatus = 'lose';
  }

  gameWin() {
    this.UIMessageWin.classList.remove('hidden');
    this.gameStatus = 'win';
  }
}

module.exports = Game;
