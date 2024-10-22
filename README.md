2048 Game
=========

This project is a browser-based implementation of the popular 2048 puzzle game. The objective of the game is to combine tiles with the same numbers to create a tile with the number 2048.

Features
--------

-   **Real-time Score Tracking**: The score updates dynamically as tiles merge.
-   **Keyboard Controls**: Move tiles using the arrow keys (left, right, up, and down).
-   **Winning and Losing States**: A message appears when you win or lose the game.
-   **Restart Button**: Allows restarting the game at any time.
-   **Modular Game Logic**: The game state, scoring, and tile movement are handled in a structured and modular way.

Technologies Used
-----------------

-   **JavaScript (ES6+)**: Game logic, state management, and event handling.
-   **HTML5**: Basic game structure and layout.
-   **CSS3**: Styling for game board, tiles, and messages.

How to Play
-----------

-   Press "Start" to begin the game.
-   Use the **arrow keys** to move the tiles in the desired direction:
    -   **Up**: Moves all tiles up.
    -   **Down**: Moves all tiles down.
    -   **Left**: Moves all tiles left.
    -   **Right**: Moves all tiles right.
-   Tiles with the same number will merge to form a new tile with double the value.
-   The goal is to create a tile with the value **2048**.
-   You win the game when you reach 2048. If no valid moves are left, you lose.

Game Design
-----------

The game board consists of a 4x4 grid. Each move slides all tiles in the chosen direction, and a new tile (2 or 4) randomly appears on the board. The challenge is to strategically combine the tiles while managing space on the grid.

Future Enhancements
-------------------

-   **Local Storage**: Save the game state between sessions.
-   **Undo Feature**: Add the ability to undo the last move.
-   **Mobile Support**: Improve touch-screen controls for mobile devices.

Acknowledgments
---------------

-   The original 2048 game was created by Gabriele Cirulli. This project is an adaptation of the idea, created as a coding exercise to demonstrate the use of JavaScript for dynamic applications.
