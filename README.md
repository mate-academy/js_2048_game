# 2048 Game

A browser-based implementation of the classic [2048](https://play2048.co/) puzzle game, built with vanilla JavaScript using an object-oriented `Game` class for all game logic.

🎮 **[DEMO LINK](https://<your_account>.github.io/js_2048_game/)**

> Replace `<your_account>` with your GitHub username before publishing.

---

## About the Game

Slide numbered tiles on a 4×4 grid to merge matching values. Reach the **2048** tile to win!

**Rules:**

- Use arrow keys to slide all tiles in a direction
- Two equal adjacent tiles merge into their doubled value — but only once per move
- After each valid move, a new tile (2 or 4) appears in a random empty cell (4 has a 10% probability)
- The game ends when no moves are left
- Your score increases by the sum of all merged tiles each move

---

## Project Structure

```
src/
├── index.html              # Game markup
├── modules/
│   └── Game.class.js       # Core game logic (state, moves, score, status)
├── scripts/
│   └── main.js             # UI layer — renders board, handles input
└── styles/
    └── main.scss           # Game styles
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your_account>/js_2048_game.git

# 2. Navigate into the project folder
cd js_2048_game

# 3. Install dependencies
npm install
```

### Running Locally

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser (or whichever port your dev server uses).

---

## Running Tests

```bash
# Full test suite (includes linter)
npm run test

# Fast test, linter skipped
npm run test:only -- -n

# Fast test with extra console output, linter skipped
npm run test:only -- -l
```

---

## Implementation Details

### `Game` class (`src/modules/Game.class.js`)

| Method                       | Description                                             |
| ---------------------------- | ------------------------------------------------------- |
| `constructor(initialState?)` | Creates a new game; defaults to an empty 4×4 board      |
| `start()`                    | Sets status to `'playing'` and spawns two initial tiles |
| `restart()`                  | Resets board, score, and status; spawns two new tiles   |
| `moveLeft()`                 | Slides all tiles left                                   |
| `moveRight()`                | Slides all tiles right                                  |
| `moveUp()`                   | Slides all tiles up                                     |
| `moveDown()`                 | Slides all tiles down                                   |
| `getState()`                 | Returns a copy of the current 4×4 board                 |
| `getScore()`                 | Returns the current score                               |
| `getStatus()`                | Returns `'idle'`, `'playing'`, `'win'`, or `'lose'`     |

### UI (`src/scripts/main.js`)

- Listens for `keydown` events on the four arrow keys
- Calls the appropriate `Game` method and re-renders the board
- Toggles `hidden` class on win/lose/start messages
- Switches the button between `Start` and `Restart` styles

---

## Deploy and Pull Request

1. Replace `<your_account>` with your GitHub username in the demo link at the top of this file.
2. Follow the [task guidelines](https://mate-academy.github.io/layout_task-guideline/) for submitting a pull request.

---

[DEMO LINK](https://vovanchu.github.io/js_2048_game/)
