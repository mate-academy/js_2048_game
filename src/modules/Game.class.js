import {
  BOARD_SIZE,
  TILE_VALUE,
  SECOND_TILE_VALUE,
  PROBABILITY_OF_VALUE,
  WIN_VALUE,
  GAME_STATUS,
} from '../constants/constants';

export default class Game {
  constructor() {
    this.state = this.createInitialState();
    this.score = 0;
    this.status = GAME_STATUS.IDLE;
  }

  createInitialState() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  }

  moveLeft() {
    const prevState = this.state.map(row => [...row]);
    const { board: newBoard, score } = this.slideCells(this.state);

    const isBoardChanged = this.checkBoardChange(newBoard, prevState);
    
    if (isBoardChanged) {
      this.state = newBoard;
      this.score += score;
      this.addRandomTile();
    };

    this.getStatus();

    return newBoard;
  }

  moveRight() {
    const prevState = this.state.map(row => [...row]);
    const reversed = this.reverse(this.state);
    const { board: newBoard, score } = this.slideCells(reversed);
    const resBoard = this.reverse(newBoard);

    const isBoardChanged = this.checkBoardChange(resBoard, prevState);
    
    if (isBoardChanged) {
      this.state = resBoard;
      this.score += score;
      this.addRandomTile();
    };
    
    this.getStatus();

    return resBoard;
  }

  moveUp() {
    const prevState = this.state.map(row => [...row]);
    const rotated = this.rotate(this.state, 'back');
    const { board: newBoard, score } = this.slideCells(rotated);
    const resBoard = this.rotate(newBoard);

    const isBoardChanged = this.checkBoardChange(resBoard, prevState);
    
    if (isBoardChanged) {
      this.state = resBoard;
      this.score += score;
      this.addRandomTile();
    };
    
    this.getStatus();

    return resBoard;
  }

  moveDown() {
    const prevState = this.state.map(row => [...row]);
    const rotated = this.rotate(this.state);
    const { board: newBoard, score } = this.slideCells(rotated);
    const resBoard = this.rotate(newBoard, 'back');

    const isBoardChanged = this.checkBoardChange(resBoard, prevState);
    
    if (isBoardChanged) {
      this.state = resBoard;
      this.score += score;
      this.addRandomTile();
    };
    
    this.getStatus();

    return resBoard;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    const canMove = this.canMoveCells(this.state);
    const isYouWin = this.state.some((row) => {
      return row.some((cell) => cell === WIN_VALUE);
    });

    if (isYouWin) {
      this.status = GAME_STATUS.WIN;
    } else if (!canMove) {
      this.status = GAME_STATUS.LOSE;
    } else {
      this.status = GAME_STATUS.PLAYING;
    }

    return this.status;
  }

  start() {
    this.score = 0;
    this.status = GAME_STATUS.PLAYING;

    this.addRandomTile(this.state);
    this.addRandomTile(this.state);
  }

  restart() {
    this.state = this.createInitialState();
    this.score = 0;
    this.status = GAME_STATUS.PLAYING;

    this.addRandomTile(this.state);
    this.addRandomTile(this.state);
  }

  canMoveCells(board) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const current = board[i][j];

        if (current === 0) {
          return true;
        }

        if (j < BOARD_SIZE - 1 && current === board[i][j + 1]) {
          return true;
        }

        if (i < BOARD_SIZE - 1 && current === board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  getEmptyCells(board) {
    const emptyCells = [];

    board.forEach((row, i) => {
      row.forEach((elem, j) => {
        if (elem === 0) {
          emptyCells.push({
            i: i,
            j: j,
          });
        }
      });
    });

    return emptyCells;
  }

  slideCells(board) {
    const newBoard = { board: [], score: 0 };

    board.forEach((row) => {
      const filtered = row.filter((x) => x !== 0);
      const newRow = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          const merged = filtered[i] * 2;

          newRow.push(merged);
          newBoard.score += merged;
          i++;
        } else {
          newRow.push(filtered[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      newBoard.board.push(newRow);
    });

    return newBoard;
  }

  reverse(board) {
    return board.map((row) => [...row].reverse());
  }

  rotate(board, direction = '') {
    const newBoard = this.createInitialState();

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (direction) {
          newBoard[BOARD_SIZE - 1 - j][i] = board[i][j];
        } else {
          newBoard[j][BOARD_SIZE - 1 - i] = board[i][j];
        }
      }
    }

    return newBoard;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells(this.state);

    if (!emptyCells.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { i, j } = emptyCells[randomIndex];

    const randomValue =
      Math.random() < PROBABILITY_OF_VALUE ? TILE_VALUE : SECOND_TILE_VALUE;

    this.state[i][j] = randomValue;
  }

  checkBoardChange(board1, board2) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return true;
        }
      }
    }

    return false;
  }
}
