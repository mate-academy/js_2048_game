# 🎮 2048 Game

A modern, responsive web implementation of the classic **2048** puzzle game, built using vanilla JavaScript, Semantic HTML5, and Sass.

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://xapg6acc.github.io/js_2048_game/)
[![License: GPL--3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/ES6-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Sass](https://img.shields.io/badge/Sass-Compiled-pink.svg)](https://sass-lang.com/)

---

## 🚀 Live Demo

Play the game directly in your browser: **[Interactive Live Demo](https://xapg6acc.github.io/js_2048_game/)**

---

## ✨ Features

- **Responsive Design**: Optimized for desktop and mobile viewing.
- **Core Game Loop**: Smooth sliding and merging of tiles.
- **Dynamic Score Tracking**: Tracks scores in real-time, incrementing based on the value of merged tiles.
- **Game State Modals**: Clear visual overlay prompts for start, victory, and game-over states.
- **Automated Tests**: Comprehensive Cypress E2E testing.

---

## 📜 Game Rules

1. **The Grid**: The game is played on a standard **4x4** grid.
2. **Movement**: Use the **Arrow Keys** (Up, Down, Left, Right) to slide all tiles in that direction.
3. **Merging**: When two tiles with the same number touch, they **merge into one** with a value equal to their sum (e.g., two `2` tiles merge into a `4`).
4. **Tile Spawning**: After every valid move, a new tile (either `2` or `4`) randomly spawns in an empty spot. The probability of spawning a `4` is 10%.
5. **Winning**: The game is won when a tile with a value of **2048** appears on the board.
6. **Game Over**: The game ends when there are no empty spaces and no valid moves remaining.

---

## 🛠️ Tech Stack & Tools

- **Core**: Vanilla JavaScript (ES6+), HTML5, CSS3 / Sass.
- **Bundler**: [Parcel](https://parceljs.org/) for compilation and asset bundling.
- **Linting & Formatting**: ESLint, Prettier, Stylelint, LintHTML.
- **Testing**: Cypress for E2E testing, Jest for unit testing.

---

## 📂 Project Structure

```text
├── src/
│   ├── images/          # Assets and images
│   ├── modules/
│   │   └── Game.class.js # Game engine class & logic
│   ├── scripts/
│   │   └── main.js      # UI rendering & DOM event handlers
│   ├── styles/
│   │   └── main.scss    # Styled layout and responsiveness
│   └── index.html       # Primary HTML structure
├── cypress/             # E2E Cypress tests
├── package.json         # Scripts and project dependencies
└── README.md            # Project documentation
```

---

## 💻 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (recommended version `20.x`).

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/xapg6acc/js_2048_game.git
cd js_2048_game
npm install
```

### 2. Run the Development Server

To launch the project locally with live-reloading:

```bash
npm start
```
This command runs the local dev server. Open your browser and navigate to the address shown in your console.

### 3. Build for Production

To build optimized production assets in the `dist` directory:

```bash
npm run build
```

### 4. Deploy to GitHub Pages

To publish the build output to your GitHub Pages:

```bash
npm run deploy
```

### 5. Running Tests & Linters

Ensure your code is clean and passes all validation checks:

- Run linters:
  ```bash
  npm run lint
  ```
- Run tests:
  ```bash
  npm test
  ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/xapg6acc/js_2048_game/issues) if you want to contribute.

---

## 📄 License

This project is licensed under the GPL-3.0 License. See the [LICENSE](LICENSE) file for details.
