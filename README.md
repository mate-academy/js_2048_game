# 2048 Game

## Project Overview

[Demo Link](https://mateuszcieplak.github.io/js_2048_game/)

This project is a browser-based implementation of the popular puzzle game **2048**, where the main goal is to slide and merge tiles with numbers to reach the **2048** tile. The game is built entirely in **vanilla JavaScript**, without external frameworks, making it a great example of pure logic implementation and DOM manipulation.

The game logic is encapsulated in a `Game` class that handles:
- the game board state,
- movement in four directions,
- merging of tiles,
- score calculation and game status (win/loss) tracking.

## Technologies Used

- **JavaScript (ES6+)** – core game logic and DOM interaction  
- **HTML5** – page structure  
- **CSS3** – styling of the board and tiles (using dynamic `field-cell--X` classes)  
- **Node.js + npm** – for running tests  
- **Webpack** (optional in the project structure) – for bundling JavaScript files if configured

## Folder Structure

```
├── src/
│   ├── index.html        # User interface
│   ├── main.js           # Game setup and integration with Game.class.js
│   └── modules/
│       └── Game.class.js # Main game logic
├── styles/               # CSS styles
├── tests/                # Unit tests
├── package.json
```

## How to Run the Project Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/MateuszCieplak/js_2048_game
   cd 2048_game

2. **Install dependencies**

  Make sure you have Node.js and npm installed.

   ```bash
     npm install
   ```

3. **Run tests**
  To verify that the game logic works correctly:

   ```bash
     npm run test
   ```
  Or run quick tests without linting:

   ```bash
     npm run test:only -- -n
   ```

4. **Launch the game in the browser**
   
  Open the src/index.html file in your browser manually, or use a local development server (e.g., Live Server extension in VS Code).
