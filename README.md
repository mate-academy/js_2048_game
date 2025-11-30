# 2048 Game – Classic Puzzle (Vanilla JavaScript)

**Live Demo** → https://zrozik-cmd.github.io/js_2048_game/

![2048 preview](./preview.gif)

## Overview

Fully functional implementation of the classic 2048 puzzle game built with **pure vanilla JavaScript (ES6+)** and DOM manipulation — **no frameworks, no libraries**.

### Features

- Tile movement with arrow keys (↑ ↓ ← →)
- Merging of identical tiles (2 + 2 → 4 → 8 → …)
- Random spawning of new tiles (2 or 4) after every move
- Score tracking and display
- Win condition (reach 2048 tile)
- Game Over detection (no valid moves left)
- “New Game / Restart” button
- Smooth tile appearance animations
- Fully responsive design (desktop + mobile)

### Tech Stack

- HTML5
- CSS3 (Flexbox, Grid, CSS variables, animations)
- Vanilla JavaScript (ES6+): classes, arrow functions, destructuring
- DOM manipulation & Keyboard events

### Key Implementation Details

- OOP approach using `Game2048` class
- Optimized move/merge logic (single pass per column/row)
- Clean UI update via dedicated `updateUI()` method
- Random tile generation only on empty cells
- Game state checks after every move

### How to Run

git clone https://github.com/Zrozik-cmd/js_2048_game.git
cd js_2048_game
open index.html
