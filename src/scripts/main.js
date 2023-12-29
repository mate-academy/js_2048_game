'use strict';

window.addEventListener('load', () => {
  const buttonStart = document.querySelector('.button.start');
  const table = document.querySelector('table tbody');
  const scoreElem = document.querySelector('.game-score');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const arrowDown = 'ArrowDown';
  const arrowLeft = 'ArrowLeft';
  const arrowRight = 'ArrowRight';
  const arrowUp = 'ArrowUp';
  const restart = 'Restart';

  class Board {
    constructor() {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      this.score = 0;
      this.start = false;
    }

    appendOneBox() {
      if (!this.start) {
        return;
      }

      if (this.occupiedPlaces().length < 16) {
        const ShouldAdd4 = Math.random() < 0.1;
        let xRandomIndex
      = Math.floor(Math.random() * (this.board.length));
        let yRandomIndex
      = Math.floor(Math.random() * (this.board[0].length));

        const occupiedPlaces = this.occupiedPlaces();

        while (occupiedPlaces.some(
          cell => cell.y === xRandomIndex && cell.x === yRandomIndex)) {
          xRandomIndex
        = Math.floor(Math.random() * (this.board.length));

          yRandomIndex
        = Math.floor(Math.random() * (this.board[0].length));
        }

        this.board[xRandomIndex][yRandomIndex] = ShouldAdd4 ? 4 : 2;

        this.render();
      }

      if (this.occupiedPlaces().length === 16 && !this.availableMoves()) {
        messageLose.classList.remove('hidden');
      }
    }

    availableMoves() {
      const move = this.occupiedPlaces().some(({ y, x }) => {
        return this.getBoardField(y, x - 1) === this.getBoardField(y, x)
        || this.getBoardField(y, x + 1) === this.getBoardField(y, x)
        || this.getBoardField(y + 1, x) === this.getBoardField(y, x)
        || this.getBoardField(y - 1, x) === this.getBoardField(y, x);
      });

      return move;
    }

    getBoardField(y, x) {
      return (this.board[y] && this.board[y][x]) || null;
    }

    check2048() {
      if (this.board.flat().some(elem => elem === 2048)) {
        messageWin.classList.toggle('hidden');
      }
    }

    updateScore(addedScore) {
      this.score += addedScore;
      scoreElem.textContent = this.score.toString();
    }

    occupiedPlaces() {
      const occupiedPlaces = [];

      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          if (this.board[y][x] !== 0) {
            occupiedPlaces.push({
              'y': y,
              'x': x,
            });
          }
        }
      }

      return occupiedPlaces;
    }

    render() {
      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          const cell = this.board[y][x];

          table.children[y].children[x].textContent = '';
          table.children[y].children[x].className = 'field-cell';

          if (cell !== 0) {
            table.children[y].children[x].textContent = `${cell}`;
            table.children[y].children[x].classList.add(`field-cell--${cell}`);
          }
        }
      }
    }

    move({ moveDirectionCallback, xIsWithinBoard, yIsWithinBoard,
      nextIndexY, columnStartIndex, nextIndexX,
      rowStartIndex, currentX, currentY }) {
      if (xIsWithinBoard) {
        if (yIsWithinBoard) {
          const temp = this.board[currentY][currentX];
          const isTheSameNumber = this.board[nextIndexY][nextIndexX] === temp;

          if ((temp !== 0 && this.board[nextIndexY][nextIndexX] === 0)
            || isTheSameNumber) {
            this.board[nextIndexY][nextIndexX] = isTheSameNumber
              ? temp * 2 : temp;
            this.board[currentY][currentX] = 0;

            if (isTheSameNumber) {
              this.updateScore(temp * 2);
            }
          }

          return moveDirectionCallback.call(this, nextIndexX, nextIndexY);
        } else {
          return moveDirectionCallback.call(
            this, rowStartIndex, columnStartIndex);
        }
      }

      this.appendOneBox();
      this.occupiedPlaces();
      this.check2048();
    }

    moveRight(x = 0, y = 0) {
      this.move({
        moveDirectionCallback: this.moveRight,
        xIsWithinBoard: (y < this.board.length),
        yIsWithinBoard: (x < this.board.length - 1),
        nextIndexY: y,
        columnStartIndex: y + 1,
        nextIndexX: x + 1,
        rowStartIndex: 0,
        currentX: x,
        currentY: y,
      });
    }

    moveLeft(x = this.board.length - 1, y = 0) {
      this.move({
        moveDirectionCallback: this.moveLeft,
        xIsWithinBoard: (y < this.board.length),
        yIsWithinBoard: (x > 0),
        nextIndexY: y,
        columnStartIndex: y + 1,
        nextIndexX: x - 1,
        rowStartIndex: (this.board.length - 1),
        currentX: x,
        currentY: y,
      });
    }

    moveUp(x = 0, y = this.board.length - 1) {
      this.move({
        moveDirectionCallback: this.moveUp,
        xIsWithinBoard: (x < this.board.length),
        yIsWithinBoard: (y > 0),
        nextIndexY: y - 1,
        columnStartIndex: (this.board.length - 1),
        nextIndexX: x,
        rowStartIndex: x + 1,
        currentX: x,
        currentY: y,
      });
    }

    moveDown(x = 0, y = 0) {
      this.move({
        moveDirectionCallback: this.moveDown,
        xIsWithinBoard: (x < this.board.length),
        yIsWithinBoard: (y < this.board.length - 1),
        nextIndexY: y + 1,
        columnStartIndex: 0,
        nextIndexX: x,
        rowStartIndex: x + 1,
        currentX: x,
        currentY: y,
      });
    }
  }

  const htmlBoard = new Board();

  document.addEventListener('keydown', ev => {
    switch (ev.key) {
      case arrowLeft:
        queueMove(() => htmlBoard.moveLeft());
        break;
      case arrowRight:
        queueMove(() => htmlBoard.moveRight());
        break;
      case arrowUp:
        ev.preventDefault();
        queueMove(() => htmlBoard.moveUp());
        break;
      case arrowDown:
        ev.preventDefault();
        queueMove(() => htmlBoard.moveDown());
        break;
      default:
        throw new Error('wrong button');
    }
  });

  const moveQueue = [];
  let isMoveInProgress = false;

  function queueMove(moveFunction) {
    moveQueue.push(moveFunction);

    if (!isMoveInProgress) {
      executeNextMove();
    }
  }

  function executeNextMove() {
    if (moveQueue.length > 0) {
      isMoveInProgress = true;

      const nextMove = moveQueue.shift();

      nextMove();

      setTimeout(() => {
        isMoveInProgress = false;
        executeNextMove();
      }, 100);
    }
  }

  buttonStart.addEventListener('click', startToReset);

  function startToReset() {
    if (buttonStart.classList.contains('start')) {
      htmlBoard.start = true;
      htmlBoard.appendOneBox();
      htmlBoard.appendOneBox();
    }

    buttonStart.classList.add('restart');
    buttonStart.classList.remove('start');
    messageStart.classList.add('hidden');

    if (buttonStart.textContent === restart) {
      htmlBoard.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      messageLose.classList.add('hidden');
      htmlBoard.appendOneBox();
      htmlBoard.appendOneBox();
      htmlBoard.score = 0;
      scoreElem.textContent = '0';
    }

    buttonStart.textContent = restart;
  }
});
