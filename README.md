1. Replace `<your_account>` with your Github username in the link
    - [DEMO LINK](https://PaulMaistrenko.github.io/js_2048_game/)
2. Follow [this instructions](https://mate-academy.github.io/layout_task-guideline/)
    - Run `npm run test` command to test your code;
    - Run `npm run test:only -- -n` to run fast test ignoring linter;
    - Run `npm run test:only -- -l` to run fast test with additional info in console ignoring linter.

### Task: 2048 game

Hey! Are you ready for a real hard check of your JavaScript skills, ninja?
If you are still here, let's do it.

In this task, you need to implement the 2048 game like in [this reference](https://play2048.co/)
Don't play for too long! We need you to write the code!

Okay, what do we have?
1) HTML and CSS are already written. You can use it, or implement your own design if you want.
2) Reference.

That's it!

Okay, okay. Also, we have some rules:
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

Hints:
- You have class `field-cell--%cell_value%`, for styling cell in the game.
- Use `hidden` class for hiding elements on page.
- Use `start`, `restart` classes for the main button for different styles.
- Use `field-cell--%cell_value%` class like additional class, don't replace the main class.

You can change the HTM/CSS layout if you need it.

![Preview](./src/images/reference.png)
