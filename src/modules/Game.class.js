'use strict';

class Game {
  scoreMax = 0;

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
  constructor(initialState = []) {
    this.board = initialState ? [...this._getBlankBoard()] : initialState;
    this.scoreCurrent = 0;
    this.gameStatus = 'idle';
  }

  /**
   * Generate blank board
   * @returns blank board array
   */
  _getBlankBoard() {
    return Array.from(
      { length: 4 },
      () => Array.from({ length: 4 }, () => 0),
      // eslint-disable-next-line function-paren-newline
    );
  }

  /**
   * Innitiate game
   */
  _initialize() {
    this.board = [...this._getBlankBoard()];
    this._genRandCells();
    this._genRandCells();
  }

  /**
   * Generate 2 random tiles and populates the board
   * @returns {undefined}
   */
  _genRandCells() {
    const randTile = this._generateRandomTile(this.board);

    if (!randTile) {
      return;
    }
    this.board[randTile[0]][randTile[1]] = randTile[2];
  }

  /**
   * Function generate random row and colum which is currently unpopulated
   * Also return random number 2 or 4 with 4 (10% probability)
   * @param {number[][]} boardArrs
   * @returns [random row, random colum, random number]
   */
  _generateRandomTile(boardArrs) {
    let randRow;
    let randCol;

    // Run this random generator until row and
    // collum position in given board are zero(vacant)
    do {
      randRow = Math.floor(Math.random() * boardArrs.length);
      randCol = Math.floor(Math.random() * boardArrs[0].length);
    } while (boardArrs[randRow][randCol] !== 0);

    // Add 2 or 4 with 4 10% probability
    let randValue = 2;

    if (Math.floor(Math.random() * 100 + 1) <= 10) {
      randValue = 4;
    }

    return [randRow, randCol, randValue];
  }

  /**
   * Check if can continue to play
   * @returns true or false
   * true- can continue the game
   * false - stop the game (no moves, win or lose)
   */
  _checkGameStatus() {
    // Check if winning score reached
    if (this.scoreCurrent >= 2048) {
      this.gameStatus = 'win';

      return false;
    }
    // Check if less then 2 evaliable tiles exist on the board
    const freeTiles = this.board.reduce(
      (acc, cur) => acc + cur.filter((cell) => cell === 0).length,
      0,
    );

    if (this._anyMovesLeft() === false && freeTiles === 0) {
      this.gameStatus = 'lose';

      return false;
    }
    this.gameStatus = 'playing';

    return true;
  }

  _didTileMoved(newArr, oldArr) {
    // Check if newArr same as board
    for (let row = 0; row < oldArr.length; row++) {
      for (let col = 0; col < oldArr[row].length; col++) {
        if (oldArr[row][col] !== newArr[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  _anyMovesLeft() {
    const posMoves = [
      this._combineTiles('ArrowLeft', this.board)['score'],
      this._combineTiles('ArrowRight', this.board)['score'],
      this._combineTiles('ArrowUp', this.board)['score'],
      this._combineTiles('ArrowDown', this.board)['score'],
    ];

    return posMoves.some((m) => m !== 0);
  }

  moves(direction) {
    if (this.getStatus() === 'playing') {
      const beforeMoveBoard = this._arrayDeepCopy(this.board);
      const combBoard = this._combineTiles(direction, this.board);
      this.board = this._arrayDeepCopy(combBoard['board']);
      this.scoreCurrent += combBoard['score'];

      if (this._didTileMoved(beforeMoveBoard, this.board)) {
        this._genRandCells();
      }
      this._checkGameStatus();
    }
  }

  _shiftRight(arrN) {
    const arr = [...arrN];

    // Run for each row: filter-out Zeros appen zeroes from the left
    for (let r = 0; r < arr.length; r++) {
      const temp = arr[r].filter((e) => e);

      arr[r] = Array.from(
        { length: arr[r].length - temp.length },
        () => 0,
      ).concat(temp);
    }

    return arr;
  }

  _shiftLeft(arrN) {
    const arr = [...arrN];

    // Run for each row: filter-out Zeros appen zeroes from the right
    for (let r = 0; r < arr.length; r++) {
      const temp = arr[r].filter((e) => e);

      arr[r] = temp.concat(
        Array.from({ length: arr[r].length - temp.length }, () => 0),
      );
    }

    return arr;
  }

  _transpose(arr) {
    const temp = [];

    for (let cols = 0; cols < arr.length; cols++) {
      const tempCol = [];

      for (let rows = 0; rows < arr[0].length; rows++) {
        tempCol.push(arr[rows][cols]);
      }
      temp.push(tempCol);
    }

    return temp;
  }

  _combineTiles(direction, board) {
    function combLeft() {
      for (let row = 0; row < tempBoard.length; row++) {
        for (let col = 0; col < tempBoard[row].length - 1; col++) {
          const el = tempBoard[row][col];
          const elRight = tempBoard[row][col + 1];

          if (el && elRight && el === elRight) {
            tempBoard[row][col] = el + elRight;
            tempBoard[row][col + 1] = 0;
            col++;
            tempScore = el + elRight;
          }
        }
      }
    }
    function combRight() {
      for (let row = tempBoard.length - 1; row >= 0; row--) {
        for (let col = tempBoard[row].length - 1; col >= 1; col--) {
          const el = tempBoard[row][col];
          const elLeft = tempBoard[row][col - 1];

          if (el && elLeft && el === elLeft) {
            tempBoard[row][col] = el + elLeft;
            tempBoard[row][col - 1] = 0;
            col--;
            tempScore = el + elLeft;
          }
        }
      }
    }

    let tempBoard = this._arrayDeepCopy(board);
    let tempScore = 0;
    switch (direction) {
      case 'ArrowLeft':
        tempBoard = this._shiftLeft(tempBoard);
        combLeft();
        tempBoard = this._shiftLeft(tempBoard);
        break;

      case 'ArrowRight':
        tempBoard = this._shiftRight(tempBoard);
        combRight();
        tempBoard = this._shiftRight(tempBoard);
        break;

      case 'ArrowUp':
        tempBoard = this._transpose(tempBoard);
        tempBoard = this._shiftLeft(tempBoard);
        combLeft();
        tempBoard = this._shiftLeft(tempBoard);
        tempBoard = this._transpose(tempBoard);
        break;

      case 'ArrowDown':
        tempBoard = this._transpose(tempBoard);
        tempBoard = this._shiftRight(tempBoard);
        combLeft();
        tempBoard = this._shiftRight(tempBoard);
        tempBoard = this._transpose(tempBoard);
        break;
    }

    return { board: tempBoard, score: tempScore };
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.scoreCurrent;
  }

  getScoreMax() {
    return this.scoreMax;
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
    return this.gameStatus;
  }

  getBoard() {
    return this.board;
  }

  /**
   * Starts the game.
   */
  start() {
    this.gameStatus = 'playing';
    this._initialize();
  }

  /**
   * Resets the game.
   */
  restart() {
    this._updateMaxScore(this.scoreCurrent);
    this.scoreCurrent = 0;
    this.gameStatus = 'playing';
    this._initialize();
  }

  _arrayDeepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
      return obj.reduce((arr, item, i) => {
        arr[i] = this._arrayDeepCopy(item);
        return arr;
      }, []);
    }

    if (obj instanceof Object) {
      return Object.keys(obj).reduce((newObj, key) => {
        newObj[key] = this._arrayDeepCopy(obj[key]);
        return newObj;
      }, {});
    }
  }

  _updateMaxScore(curScore) {
    if (
      this.scoreMax < curScore &&
      (this.getStatus() === 'win' || this.getStatus() === 'lose')
    ) {
      this.scoreMax = curScore;
    }
  }
}

module.exports = Game;
