We have some rules:
1) The game field is 4 x 4
2) Each cell can be empty or contain one of the numbers: 2, 4, 8 ... 2^n
3) The player can move cells with keyboard arrows
4) All the numbers should be moved in the selected direction until all empty cells are filled in
   - 2 equal cells should be merged into a doubled number
   - The merged cell can’t be merged twice during one move
5) The move is possible if at least one cell is changed after the move
6) After move 2 or 4 appears in a random empty cell. 4 probability is 10%
7) When 2048 value is displayed in any cell, win message should be shown.
8) The `game over` message should be shown if there are no more available moves.
9) Hide start message when game starts.
10) Change the `Start` button to `Restart` after the first move.
11) Increase score with each move. The score should be increased by the sum of all merged cells.

Demo https://vasyliev-anton.github.io/js_2048_game/
