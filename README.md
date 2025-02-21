**Project Overview**
This project is a browser-based 2048 game, built using JavaScript and the DOM. The goal is to combine numbered tiles to reach 2048 while following simple gameplay mechanics.

**Technologies Used**
JavaScript (JS) – for game logic
DOM Manipulation – for handling UI updates

**Live Preview**
https://pasha1932.github.io/js_2048_game/

**Mockup**
https://play2048.co/

**Describe**
This code implements the core logic for the 2048 game. It includes functions for initializing, rendering, and updating the game board. Key features:

+ start(): Begins the game by setting the status to "playing" and placing two random tiles on the board.
+ restart(): Resets the game board and score.
+ renderBoard(): Updates the game UI to reflect the current board state.
+ getRandomTitle(): Places a new random tile (2 or 4) in an empty cell.
+ slide(row): Moves and merges tiles in a row according to the 2048 rules.
+ checkGameOver(): Determines if the game is won or lost.
+ hasMoves(): Checks if there are any possible moves left.
+ hasWon(): Checks if the player has reached the 2048 tile.
The code follows the fundamental mechanics of the 2048 game, handling tile movements, merging, and game state checks.

**Project Structure**
Game logic – src/modules/Game.class.js (exports Game class).
UI & Controls – src/index.html with main.js (uses Game instance).

**How to Launch the Project**
Clone the repository:
- git clone [repository-url]
- npm i
- npm start
