**Project Overview**
This project is a browser-based 2048 game, built using JavaScript and the DOM. The goal is to combine numbered tiles to reach 2048 while following simple gameplay mechanics.

**Technologies Used**
JavaScript (JS) – for game logic
DOM Manipulation – for handling UI updates

**Live Preview**
https://pasha1932.github.io/js_2048_game/

**Mockup**
https://play2048.co/

**Game Rules**
+ The game board is 4×4, and tiles can have values 2, 4, 8… 2ⁿ.
+ Use arrow keys to move tiles. Numbers slide until blocked.
+ Matching tiles merge into a doubled number (one merge per move).
+ A move is valid if at least one tile changes.
+ After each move, a new tile (2 or 4) appears (10% chance for 4).
+ Win: A 2048 tile appears.
+ Game Over: No valid moves left.
+ The Start button turns into Restart after the first move.
+ Score increases based on merged values.
+ 
**Project Structure**
Game logic – src/modules/Game.class.js (exports Game class).
UI & Controls – src/index.html with main.js (uses Game instance).

**How to Launch the Project**
Clone the repository:
- git clone [repository-url]
- Open index.html in a browser to start playing.
