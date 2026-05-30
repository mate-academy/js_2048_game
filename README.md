# 🧩 2048 Game 

A fully interactive, responsive, and pixel-perfect implementation of the famous **2048 puzzle game**. Built from scratch using modern Vanilla JavaScript (ES6+ Class architecture), object-oriented programming (OOP) principles, and semantic component design.

---

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=Sass&logoColor=white)

---

## DEMO

<a href="https://<wolfymmm>.github.io/2048-game/" target="_blank">
  <img src="https://img.shields.io/badge/Live_Demo-Play_2048-brightgreen?style=for-the-badge&logo=github&logoColor=white" alt="Live Demo" />
</a>

---

## Game Rules & Mechanics

The game is played on a smooth **4 × 4 grid** using your keyboard arrow keys:
* **Movement:** When a direction is chosen, all numbered tiles slide as far as they can in that direction.
* **Merging:** Two tiles of the same number collide and merge into a single tile with a doubled value (e.g., $2 + 2 \rightarrow 4$).
* **Mathematical Restriction:** A tile cannot be merged more than once during a single turn.
* **Random Spawning:** After every successful move, a new tile randomly spawns in an empty cell. It has a $90\%$ chance of being a **2** and a $10\%$ chance of being a **4**.
* **Scoring:** Your score increases dynamically by the exact sum of all combined tiles during that turn.
* **Win Condition:** The game triggers a victory screen as soon as a **2048** tile is achieved.
* **Game Over:** Triggers automatically when the board is completely full and no valid adjacent merges remain.

---

## Architecture & Codebase Design

The project is strictly separated into two distinct layers (following decoupled UI/Logic principles):

1. **Core Logic Engine (`Game.class.js`):**
   A stateful, framework-agnostic JavaScript class that completely handles data structures, board state array transformations, merge vectors, probability matrix calculation, and win/loss assertions.
2. **UI & Event Management Layer (`main.js`):**
   Directs raw DOM manipulation, keydown event handlers, dynamic class rendering (`field-cell--%value%`), screen state management (start, restart, modulations), and modal injections.

### Obligatory API Specifications:
* `constructor(initialState)` — Instantiates core properties with optional predefined matrix states.
* `getState()` / `getScore()` / `getStatus()` — Public getter APIs ensuring decoupled data tracking.
* `moveLeft()` / `moveRight()` / `moveUp()` / `moveDown()` — Structural grid translation algorithms.
* `start()` / `restart()` — State reset configurations.

---

## Gameplay Preview

<p align="center">
  <img width="70%" height="1458" alt="image" src="https://github.com/user-attachments/assets/25acb590-c9df-49cd-a167-1bba2f82d9e4" />
</p>

---

## Installation & Local Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/](https://github.com/)<your_github_username>/2048-game.git
   cd 2048-game


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
