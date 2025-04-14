'use strict';

function generateIndexNewTiles(state, gameStatus) {
  const indexEmptyCells = [];

  state.flat().forEach((num, i) => {
    if (num === 0) {
      indexEmptyCells.push(i);
    }
  });

  if (indexEmptyCells.length === 0) {
    return [];
  }

  let firstNum;
  let secondNum;

  if (gameStatus === 'playing') {
    do {
      firstNum = Math.floor(Math.random() * 16);
    } while (!indexEmptyCells.includes(firstNum));

    return [firstNum];
  }

  do {
    firstNum = Math.floor(Math.random() * 16);
    secondNum = Math.floor(Math.random() * 16);
  } while (
    !indexEmptyCells.includes(firstNum) ||
    !indexEmptyCells.includes(secondNum) ||
    firstNum === secondNum
  );

  return [firstNum, secondNum];
}

function getNewFlatState(currentState, indexNewTiles) {
  const newFlatState = [];

  currentState.flat().forEach((num, i) => {
    const valueNewTile = Math.floor(Math.random() * 10) === 0 ? 4 : 2;

    if (indexNewTiles.includes(i)) {
      newFlatState.push(valueNewTile);
    } else {
      newFlatState.push(num);
    }
  });

  return newFlatState;
}

export function setCells(flatState) {
  const cells = [...document.getElementsByClassName('field-cell')];

  cells.forEach((cell, i) => {
    cell.textContent = '';
    cell.className = 'field-cell';

    if (flatState[i]) {
      cell.textContent = flatState[i];
      cell.classList.add(`field-cell--${flatState[i]}`);
    }
  });
}

function getTwoDimensionalState(flatState) {
  const twoDimensionalState = [];
  let start = 0;

  for (let i = 1; i <= flatState.length; i++) {
    if (i % 4 === 0) {
      twoDimensionalState.push(flatState.slice(start, i));
      start = i;
    }
  }

  return twoDimensionalState;
}

export function useLocalStorage(key, startValue) {
  let data = localStorage.getItem(key);

  if (data === null) {
    data = startValue;
  }

  try {
    data = JSON.parse(data);
  } catch {
    localStorage.removeItem(key);
  }

  const save = (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [data, save];
}

class Game {
  gameStatus = 'idle';
  currentState = [];
  startState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  currentScore = 0;

  moveLeft() {
    const newState = this.moveHorizontally(this.currentState);

    if (JSON.stringify(this.currentState) !== JSON.stringify(newState)) {
      this.getState(newState);
    }
  }

  moveRight() {
    const newState = this.moveHorizontally(this.currentState, true);

    if (JSON.stringify(this.currentState) !== JSON.stringify(newState)) {
      this.getState(newState);
    }
  }

  moveUp() {
    const newState = this.moveVertically(this.currentState);

    if (JSON.stringify(this.currentState) !== JSON.stringify(newState)) {
      this.getState(newState);
    }
  }

  moveDown() {
    const newState = this.moveVertically(this.currentState, true);

    if (JSON.stringify(this.currentState) !== JSON.stringify(newState)) {
      this.getState(newState);
    }
  }

  getScore() {
    const gameScore = [...document.getElementsByClassName('game-score')][1];
    const [, setBestScore] = useLocalStorage('bestScore', 0);
    const [, setCurrentScore] = useLocalStorage('currentScore', 0);
    const bestScore = document.querySelector('.best');

    gameScore.textContent = this.currentScore;
    setCurrentScore(this.currentScore);

    if (this.currentScore > bestScore.textContent) {
      setBestScore(this.currentScore);
      bestScore.textContent = this.currentScore;
    }
  }

  getState(state) {
    const indexNewTiles = generateIndexNewTiles(state, this.gameStatus);
    const newFlatState = getNewFlatState(state, indexNewTiles);
    const [, setState] = useLocalStorage('gameState', this.startState);

    this.currentState = getTwoDimensionalState(newFlatState);
    setCells(newFlatState);
    this.getScore();
    this.searchMoveOpportunity(newFlatState, this.currentState);
    this.search2048Cell(newFlatState);

    if (this.gameStatus !== 'lose' && this.gameStatus !== 'win') {
      setState(this.currentState);
    }
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.getState(this.startState);
    this.gameStatus = 'playing';

    const [, setStatus] = useLocalStorage('gameStatus', 'playing');

    setStatus('playing');
  }

  restart() {
    this.gameStatus = 'idle';
    this.currentScore = 0;
    this.getState(this.startState);
    localStorage.removeItem('currentScore');
    this.gameStatus = 'playing';
  }

  // Add your own methods here
  moveVertically(state, down = false) {
    const newState = [[], [], [], []];

    state.forEach((_, i) => {
      const column = Array.from({ length: 4 }, (__, j) => state[j][i]);

      if (down) {
        column.reverse();
      }

      const itemsInColumn = column.filter((cell) => cell);

      if (column.every((cell) => !cell)) {
        newState.forEach((row) => row.push(0));
      }

      if (itemsInColumn.length === 1) {
        column.sort((a, b) => b - a);
        newState.forEach((row, j) => row.push(column[j]));
      }

      if (itemsInColumn.length > 1) {
        const newCol = this.mergeAdjacentCells(itemsInColumn).filter(
          (cell) => cell,
        );

        newState.forEach((row, j) => row.push(newCol[j] || 0));
      }
    });

    if (down) {
      newState.reverse();
    }

    return newState;
  }

  moveHorizontally(state, right = false) {
    const newState = [[], [], [], []];

    state.forEach((_, i) => {
      const row = Array.from({ length: 4 }, (__, j) => state[i][j]);

      if (right) {
        row.reverse();
      }

      const itemsInRow = row.filter((cell) => cell);

      if (row.every((cell) => !cell)) {
        row.forEach(() => newState[i].push(0));
      }

      if (itemsInRow.length === 1) {
        newState[i] = row.sort((a, b) => b - a);
      }

      if (itemsInRow.length > 1) {
        const newRow = this.mergeAdjacentCells(itemsInRow).filter(
          (cell) => cell,
        );

        for (let j = 0; j < 4; j++) {
          newState[i].push(newRow[j] || 0);
        }
      }
    });

    if (right) {
      newState.forEach((row) => row.reverse());
    }

    return newState;
  }

  mergeAdjacentCells(line) {
    const newLine = Array(4).fill(0);

    for (let i = 0; i < line.length; ) {
      if (line[i] === line[i + 1]) {
        newLine[i] = line[i] + line[i + 1];
        this.currentScore += newLine[i];
        i += 2;
      } else {
        newLine[i] = line[i];
        i++;
      }
    }

    return newLine;
  }

  searchMoveOpportunity(flatState, state) {
    if (flatState.every((cell) => cell)) {
      let hasEqualCells = false;

      for (let i = 0; i < state.length; i++) {
        const column = Array.from({ length: 4 }, (__, j) => state[j][i]);
        const row = Array.from({ length: 4 }, (__, j) => state[i][j]);

        if (
          column.some((cell, j) => j > 0 && cell === column[j - 1]) ||
          row.some((cell, j) => j > 0 && cell === row[j - 1])
        ) {
          hasEqualCells = true;
        }
      }

      if (!hasEqualCells) {
        this.gameStatus = 'lose';

        localStorage.removeItem('gameStatus');
        localStorage.removeItem('gameState');
      }
    }
  }

  search2048Cell(flatState) {
    flatState.forEach((cell) => {
      if (cell === 2048) {
        this.gameStatus = 'win';

        localStorage.removeItem('gameStatus');
        localStorage.removeItem('gameState');
      }
    });
  }
}

export default Game;
