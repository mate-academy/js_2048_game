class GameMovement {
  isMoveLeft(currentBoard) {
    for (let grid = currentBoard.length - 1; grid >= 0; grid--) {
      for (let cell = currentBoard.length - 1; cell >= 0; cell--) {
        if (currentBoard[grid][cell - 1] === currentBoard[grid][cell]) {
          return true;
        }
      }
    }

    return false;
  }

  isMoveRight(currentBoard) {
    for (let grid = 0; grid < currentBoard.length; grid++) {
      for (let cell = 0; cell < currentBoard.length; cell++) {
        if (currentBoard[grid][cell] === currentBoard[grid][cell + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  isMoveUp(currentBoard) {
    for (let grid = currentBoard.length - 1; grid >= 1; grid--) {
      for (let cell = currentBoard.length - 1; cell >= 0; cell--) {
        if (currentBoard[grid][cell] === currentBoard[grid - 1][cell]) {
          return true;
        }
      }
    }

    return false;
  }

  isMoveDown(currentBoard) {
    for (let grid = 0; grid < currentBoard.length - 1; grid++) {
      for (let cell = 0; cell < currentBoard.length; cell++) {
        if (currentBoard[grid][cell] === currentBoard[grid + 1][cell]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default GameMovement;
