# Game 2048
  The game written on pure JavaScript. Player can use arrow keys to move the tiles. Tiles with the same number merge into one when they touch. When the value 2048 is displayed in any tile, the player wins. When all the tiles are filled and there are no moves, the player loses.

  [DEMO LINK](https://OlhaArama.github.io/js_2048_game/)

# Technologies
  - JavaScript
  - HTML5
  - CSS3
  - Sass (SCSS)

# Game rules
  - The game field is 4 x 4
  - Each cell can be empty or contain one of the numbers: 2, 4, 8 ... 2^n
  - The player can move cells with keyboard arrows
  - All the numbers moved in the selected direction until all empty cells are filled in
  - 2 equal cells merged into a doubled number
  - The move is possible if at least one cell is changed after the move
  - After move 2 or 4 appears in a random empty cell. 4 probability is 10%
  - When 2048 value is displayed in any cell, win message will be shown.
  - The game over message will be shown if there are no more available moves.

# How to run the project locally
  - Fork and clone this repository
  - Run "npm install" in your terminal
  - Run "npm start" to start the project locally
