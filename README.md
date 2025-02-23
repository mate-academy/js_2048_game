# 2048 game

## Key Features:
- Game Initialization: Sets up a 4×4 grid with two random tiles (2 or 4) at the start.
- Movement Handling: Supports tile movement in four directions (left, right, up, down) with proper merging and score calculation.
- Score Tracking: Maintains the total score, increasing when tiles merge.
- Win & Lose Conditions: Checks if a player reaches 2048 (win) or if no more moves are possible (lose).
- Restart Functionality: Resets the game to its initial state.
- Helper Functions: Includes methods for flipping the grid (for movement logic), comparing arrays, and inserting random tiles.

## Functionality

### Movement Methods
These methods handle tile movement and merging. If movement occurs, a new random tile is added, and the game status is checked.

moveLeft() - Moves all tiles to the left, merging identical tiles. Updates the score when tiles merge. If any tile moved, adds a random tile and checks win/lose status.<br>
moveRight() - Reverses each row, calls moveLeft(), then reverses back. This simulates a rightward movement using the leftward logic.<br>
moveUp() - Transposes the grid (flips rows into columns), calls moveLeft(), then flips back. This simulates an upward movement.<br>
moveDown() - Transposes the grid, calls moveRight(), then flips back. This simulates a downward movement.<br>

### Game State Methods

getScore() - Returns the current game score.<br>
getState() - Returns the current game board (2D array).<br>
getStatus() - Returns the game status ("idle", "win", or "lose").<br>

### Game Control Methods

restart() - Resets the game: clears the board, resets score and status, and adds two random tiles.<br>
addRandomTile() - Finds all empty spaces on the board. Randomly places a 2 (90%) or a 4 (10%) in one of those spaces.<br>

### Utility Methods
flip(matrix) - Transposes the grid (flips rows into columns). Used to help with up/down movement logic.<br>
arraysEqual(a, b) - Compares two arrays to check if they are identical.<br>

### Win/Lose Check Methods
checkGameStatus() - Calls checkWin() and checkLose() to update the game status.<br>
checkWin() - Checks if 2048 exists on the board → If yes, game status = "win".<br>
checkLose() - If there are no empty tiles and no possible merges, the game is over ("lose").<br>

## How to Run the Project Locally
- 1️⃣ Clone the repository git clone [https://github.com/MOODDDII/kickstarter-landing](https://github.com/MOODDDII/js_2048_game/tree/develop)
- 2️⃣ Navigate to the project folder
- 3️⃣ Install dependencies with npm install
- 4️⃣ Open the project in a browser with npm start

## [DEMO LINK](https://moodddii.github.io/js_2048_game/)
