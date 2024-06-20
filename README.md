# 2048 game
This project involves creating a web-based version of the popular 2048 game like [this reference](https://play2048.co/). The game is played on a 4x4 grid where the objective is to combine numbered tiles to reach the number 2048.

[**2048 game link**](https://irynak-a.github.io/js_2048_game/)

## Key Features

- **Game Field:** A 4x4 grid where each cell can be empty or contain a number (2, 4, 8, ..., 2^n);
- **Tile Movement:**
- Players can move tiles using keyboard arrow keys;
- Tiles move in the selected direction until they reach the edge of the grid or another tile;
- Tiles with the same number merge into a tile with double the value;
- A tile can only merge once per move;
- **Move Validation:** A move is valid only if at least one tile changes position or merges;
- **Random Tile Generation:** After each move, a new tile (2 or 4) appears in a random empty cell, the probability of a 4 appearing is 10%, while the probability of a 2 is 90%;
- **Winning Condition:** The game shows a win message when a tile with the value 2048 is created;
- **Game Over Condition:** The game displays a game over message if no more moves are possible;
- **Start/Restart Button:** After the first move, the start button changes to a restart button;
- **Score Tracking:** The score is incremented by the sum of the values of all merged tiles;

## Technologies Used
- **HTML/CSS:** For structuring and styling the game interface;
- **JavaScript:** For game logic and interactivity;

## Installation Instructions
1. **Fork** the repo: On the repository page, click the **Fork** button in the upper right corner of the page.
2. **Clone** the forked one:
- Click the Code button on your forked repository page;
- Copy the URL provided (either HTTPS, SSH, or GitHub CLI).
- Open your terminal and run `git clone` command to clone the repository to your local machine (The project link should have your name).
3. Run `npm install` (or just `npm i`).
4. Run `npm start`.
