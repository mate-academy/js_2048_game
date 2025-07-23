# 2048 Game in JavaScript

This project is a complete implementation of the classic [2048](https://play2048.co/) puzzle game, written in vanilla JavaScript. It demonstrates core concepts of DOM manipulation, game state management using classes, and animations for an enhanced user experience.

**[Live Demo](https://anhrytsan.github.io/js_2048_game/)**

## Key Features

-   **Classic Gameplay:** A 4x4 grid where the player can slide tiles using the arrow keys.
-   **Tile Merging:** Two tiles with the same number merge into one, doubling their value.
-   **Score Tracking:** The score increases by the value of the merged tiles.
-   **Keyboard and Swipe Controls:** The game supports both keyboard arrows (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) and swipe gestures on mobile devices, powered by **Hammer.js**.
-   **Animations:** Smooth animations for tile appearance and merging provide a pleasant visual experience.
-   **Game State Management:** Implemented game states for "playing", "win" (reaching the 2048 tile), and "game over" (no available moves).
-   **Start and Restart:** Functionality to begin a new game or restart the current one at any time.

## Technology Stack

-   **HTML5:** Semantic markup for the game structure.
-   **SCSS:** A preprocessor used for styling the game board, tiles, and animations.
-   **JavaScript (ES6+):** All game logic is implemented in pure JS, utilizing classes for state management.
-   **Hammer.js:** A library for recognizing gestures (swipes) on touch-enabled devices.
-   **Parcel:** Used as a project bundler for development and the final build.


