'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
function initialize() {
  const button = document.querySelector('.start');

  button.addEventListener('click', () => {
    if (button.classList.contains('start')) {
      // Change the button to Reset
      button.className = 'button restart';
      button.textContent = 'Restart';

      // Start the game
      game.start();
    } else {
      // Change the button to Start
      button.className = 'button start';
      button.textContent = 'Start';

      // Restart the game
      game.restart();
      document.removeEventListener('keydown', handleKeyDown);
    }

    document.addEventListener('keydown', handleKeyDown);
  });
}

initialize();

// eslint-disable-next-line no-console
console.log('initialized - end of code');

function handleKeyDown(keyEvent) {
  keyEvent.preventDefault();

  switch (keyEvent.key) {
    case 'ArrowUp':
      if (moveTilesUp(game) === true) {
        game.createRandomTile();
        game.printTiles();
      }
      break;

    case 'ArrowDown':
      if (moveTilesDown(game) === true) {
        game.createRandomTile();
        game.printTiles();
      }
      break;

    case 'ArrowRight':
      if (moveTilesRight(game) === true) {
        game.createRandomTile();
        game.printTiles();
      }
      break;

    case 'ArrowLeft':
      if (moveTilesLeft(game) === true) {
        game.createRandomTile();
        game.printTiles();
      }
      break;
  }
}

function moveTilesRight(gameInstance) {
  let didTilesMove = false;

  for (let row = 0; row < 4; row++) {
    for (let tile = 2; tile >= 0; tile--) {
      // Check whether the tile we want to move isn't empty
      if (gameInstance.state[row][tile] > 0) {
        let moveTileBy = 0;

        // Check how far can we move the tile
        while (gameInstance.state[row][tile + moveTileBy + 1] === 0) {
          moveTileBy++;
        }

        if (moveTileBy > 0) {
          // Move the tile to the right
          gameInstance.state[row][tile + moveTileBy] =
            gameInstance.state[row][tile];
          // Reset the tile we just moved
          gameInstance.state[row][tile] = 0;

          didTilesMove = true;
        }
      }
    }
  }

  return didTilesMove;
}

function moveTilesLeft(gameInstance) {
  let didTilesMove = false;

  for (let row = 0; row < 4; row++) {
    for (let tile = 1; tile < 4; tile++) {
      // Check whether the tile we want to move isn't empty
      if (gameInstance.state[row][tile] > 0) {
        let moveTileBy = 0;

        // Check how far can we move the tile
        while (gameInstance.state[row][tile - moveTileBy - 1] === 0) {
          moveTileBy++;
        }

        if (moveTileBy > 0) {
          // Move the tile to the [CHECK DIRECTION] left
          gameInstance.state[row][tile - moveTileBy] =
            gameInstance.state[row][tile];
          // Reset the tile we just moved
          gameInstance.state[row][tile] = 0;

          didTilesMove = true;
        }
      }
    }
  }

  return didTilesMove;
}

function moveTilesDown(gameInstance) {
  let didTilesMove = false;

  // Iterate through every column
  for (let column = 0; column < 4; column++) {
    // Iterate through the current column
    for (let tile = 2; tile >= 0; tile--) {
      // Iterate through each tile in the current column

      // Check whether the tile we want to move isn't empty
      if (gameInstance.state[tile][column] > 0) {
        let moveTileBy = 0;

        // Check how far can we move the tile
        while (
          tile + moveTileBy + 1 < gameInstance.state.length &&
          gameInstance.state[tile + moveTileBy + 1][column] === 0
        ) {
          moveTileBy++;
        }

        if (moveTileBy > 0) {
          // Move the tile [CHECK DIRECTION] down
          gameInstance.state[tile + moveTileBy][column] =
            gameInstance.state[tile][column];
          // Reset the tile we just moved
          gameInstance.state[tile][column] = 0;

          didTilesMove = true;
        }
      }
    }
  }

  return didTilesMove;
}

function moveTilesUp(gameInstance) {
  let didTilesMove = false;

  // Iterate through every column
  for (let column = 0; column < 4; column++) {
    // Iterate through the current column
    for (let tile = 1; tile < 4; tile++) {
      // Iterate through each tile in the current column

      // Check whether the tile we want to move isn't empty
      if (gameInstance.state[tile][column] > 0) {
        let moveTileBy = 0;

        // Check how far can we move the tile
        while (
          tile - moveTileBy - 1 >= 0 &&
          gameInstance.state[tile - moveTileBy - 1][column] === 0
        ) {
          moveTileBy++;
        }

        if (moveTileBy > 0) {
          // Move the tile [CHECK DIRECTION] down
          gameInstance.state[tile - moveTileBy][column] =
            gameInstance.state[tile][column];
          // Reset the tile we just moved
          gameInstance.state[tile][column] = 0;

          didTilesMove = true;
        }
      }
    }
  }

  return didTilesMove;
}
