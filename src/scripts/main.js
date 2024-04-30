"use strict";

let board = [];
let score = 0;
let wonGame = false;
const tileContainer = document.querySelector(".tileContainer");
const scoreElement = document.getElementById("scoreElement");
const start = document.getElementById("start");

start.addEventListener("click", startNewGame);

function createBoard() {
  for (let i = 0; i < 4; i++) {
    const row = [];

    for (let j = 0; j < 4; j++) {
      row.push(0);
    }
    board.push(row);
  }
}

function addRandomTile() {
  const emptyTiles = [];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        emptyTiles.push([i, j]);
      }
    }
  }

  const [randomI, randomJ] =
    emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

  board[randomI][randomJ] = Math.random() < 0.9 ? 2 : 4;
  addTileToPage(randomI, randomJ, board[randomI][randomJ]);
}

function addTileToPage(row, column, value) {
  const tile = document.createElement("div");

  tile.classList.add(
    "field-cell",
    "row" + (row + 1),
    "column" + (column + 1),
    "field-cell--" + value,
  );
  tile.innerHTML = value;
  tileContainer.appendChild(tile);
  tile.classList.add("merged");

  tile.addEventListener("animationend", function () {
    tile.classList.remove("merged");
  });
}

/* eslint-disable no-unused-vars */
function startNewGame() {
  start.classList.remove("restart");
  start.classList.add("start");
  start.innerHTML = "Start";
  document.querySelector(".message-start").classList.add("hidden");
  document.querySelector(".message-lose").classList.add("hidden");
  document.querySelector(".message-win").classList.add("hidden");
  tileContainer.innerHTML = "";
  scoreElement.innerHTML = 0;
  board = [];
  score = 0;
  wonGame = false;
  document.addEventListener("keydown", onDirectionKeyPress);
  createBoard();
  addRandomTile();
  addRandomTile();
}

/* eslint-enable no-unused-vars */

function onDirectionKeyPress(gameEvent) {
  let movePossible;

  switch (gameEvent.key) {
    case "ArrowUp":
      movePossible = moveTiles(1, 0);
      break;
    case "ArrowDown":
      movePossible = moveTiles(-1, 0);
      break;
    case "ArrowLeft":
      movePossible = moveTiles(0, -1);
      break;
    case "ArrowRight":
      movePossible = moveTiles(0, 1);
      break;
  }

  if (movePossible) {
    addRandomTile();

    const gameOver = isGameOver();

    if (gameOver.gameOver) {
      showAlert(gameOver.message);
    }
  }
}

function moveTiles(directionY, directionX) {
  let movePossible = false;
  let mergedRecently = false;

  if (directionX !== 0) {
    const startX = directionX === 1 ? 3 : 0;
    const stepX = directionX === 1 ? -1 : 1;

    for (let i = 0; i < 4; i++) {
      let j = startX;
      /* eslint-disable no-unmodified-loop-condition */

      while ((j <= 3 && stepX === 1) || (j >= 0 && stepX === -1)) {
        if (board[i][j] === 0) {
          j += stepX;
          continue;
        }

        const destination = getDestinationSquare(i, j, 0, directionX);
        const tileClass = ".row" + (i + 1) + ".column" + (j + 1);
        const tile = document.querySelector(tileClass);

        if (!destination.merge || (destination.merge && mergedRecently)) {
          mergedRecently = false;
          destination.destinationX += destination.merge ? stepX : 0;
          board[i][destination.destinationX] = board[i][j];

          if (destination.destinationX !== j) {
            movePossible = true;
            board[i][j] = 0;
          }
          moveTileOnPage(i, destination.destinationX, tile, false);
          j += stepX;
          continue;
        }
        mergedRecently = true;
        board[i][destination.destinationX] = board[i][j] * 2;
        score += board[i][destination.destinationX];
        scoreElement.innerHTML = score;

        if (score === 4 || score === 8) {
          start.classList.remove("start");
          start.classList.add("restart");
          start.innerHTML = "Restart";
        }
        movePossible = true;
        board[i][j] = 0;
        moveTileOnPage(i, destination.destinationX, tile, destination.merge);
        j += stepX;
      }
    }
  } else if (directionY !== 0) {
    const startY = directionY === 1 ? 3 : 0;
    const stepY = directionY === 1 ? -1 : 1;

    for (let j = 0; j < 4; j++) {
      let i = startY;

      while ((i <= 3 && stepY === 1) || (i >= 0 && stepY === -1)) {
        if (board[i][j] === 0) {
          i += stepY;
          continue;
        }

        const destination = getDestinationSquare(i, j, directionY, 0);
        const tileClass = ".row" + (i + 1) + ".column" + (j + 1);
        const tile = document.querySelector(tileClass);

        if (!destination.merge || (destination.merge && mergedRecently)) {
          mergedRecently = false;
          destination.destinationY += destination.merge ? stepY : 0;
          board[destination.destinationY][j] = board[i][j];

          if (destination.destinationY !== i) {
            movePossible = true;
            board[i][j] = 0;
          }
          moveTileOnPage(destination.destinationY, j, tile, false);
          i += stepY;
          continue;
        }
        mergedRecently = true;
        board[destination.destinationY][j] = board[i][j] * 2;
        score += board[destination.destinationY][j];
        scoreElement.innerHTML = score;
        movePossible = true;
        board[i][j] = 0;
        moveTileOnPage(destination.destinationY, j, tile, destination.merge);
        i += stepY;
      }
    }
  }

  return movePossible;
}

function getDestinationSquare(i, j, directionY, directionX) {
  let destinationY = i;
  let destinationX = j;
  let merge = false;

  while (
    (destinationY < 3 && directionY === 1) ||
    (destinationY > 0 && directionY === -1) ||
    (destinationX < 3 && directionX === 1) ||
    (destinationX > 0 && directionX === -1)
  ) {
    const nextY = destinationY + directionY;
    const nextX = destinationX + directionX;
    const nextCell = board[nextY][nextX];
    const currentCell = board[i][j];

    if (nextCell === 0 || nextCell === currentCell) {
      destinationY = nextY;
      destinationX = nextX;
      merge = nextCell === currentCell;
    }

    if (nextCell === 0 || nextCell === currentCell) {
      destinationY = nextY;
      destinationX = nextX;
      merge = nextCell === currentCell;
    }

    if (nextCell !== 0 && nextCell !== currentCell) {
      break;
    }

    if (merge) {
      break;
    }
  }

  return {
    merge: merge,
    destinationY: destinationY,
    destinationX: destinationX,
  };
}

/* eslint-enable no-unused-vars */

function moveTileOnPage(row, column, tile, merge) {
  const classes = Array.from(tile.classList);

  classes.forEach((className) => {
    if (className.startsWith("row") || className.startsWith("column")) {
      tile.classList.remove(className);
    }
  });
  tile.classList.add("row" + (row + 1), "column" + (column + 1));

  if (merge) {
    let elements = tileContainer.querySelectorAll(
      ".row" + (row + 1) + ".column" + (column + 1),
    );

    while (elements.length > 1) {
      tileContainer.removeChild(elements[0]);

      elements = tileContainer.querySelectorAll(
        ".row" + (row + 1) + ".column" + (column + 1),
      );
    }

    elements[0].className =
      "field-cell " +
      "row" +
      (row + 1) +
      " column" +
      (column + 1) +
      " " +
      "field-cell--" +
      board[row][column];
    elements[0].innerHTML = board[row][column];
    elements[0].classList.add("merged");

    elements[0].addEventListener("animationend", function () {
      tile.classList.remove("merged");
    });
  }
}

function isGameOver() {
  let emptySquare = false;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        emptySquare = true;
      }

      if (board[i][j] === 2048 && !wonGame) {
        return {
          gameOver: true,
          message: "You won!",
        };
      }

      if (j !== 3 && board[i][j] === board[i][j + 1]) {
        emptySquare = true;
      }

      if (i !== 3 && board[i][j] === board[i + 1][j]) {
        emptySquare = true;
      }
    }
  }

  if (emptySquare) {
    return {
      gameOver: false,
      message: "",
    };
  }

  return {
    gameOver: true,
    message: "Game over!",
  };
}

function showAlert(message) {
  if (message === "Game over!") {
    document.querySelector(".message-lose").classList.remove("hidden");
  }

  if (message === "You won!") {
    wonGame = true;

    document.querySelector(".message-win").classList.remove("hidden");

    document.removeEventListener("keydown", onDirectionKeyPress);
  }
}

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", onTouchStart);
document.addEventListener("touchend", onTouchEnd);

function onTouchStart(touchEvent) {
  touchStartX = touchEvent.touches[0].clientX;
  touchStartY = touchEvent.touches[0].clientY;
}

function onTouchEnd(touchEvent) {
  let movePossible;
  const touchEndX = touchEvent.changedTouches[0].clientX;
  const touchEndY = touchEvent.changedTouches[0].clientY;
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  const swipeThreshold = 50;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        movePossible = moveTiles(0, 1);
      } else {
        movePossible = moveTiles(0, -1);
      }
    }
  } else {
    // Vertical swipe
    if (Math.abs(deltaY) > swipeThreshold) {
      if (deltaY > 0) {
        movePossible = moveTiles(-1, 0);
      } else {
        movePossible = moveTiles(1, 0);
      }
    }
  }

  if (movePossible) {
    addRandomTile();

    const gameOver = isGameOver();

    if (gameOver.gameOver) {
      showAlert(gameOver.message);
    }
  }
}
