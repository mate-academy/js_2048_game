# 2048 game

1. Short Project Description:

Embark on a captivating journey with the 2048 game - a classic rendition where strategy meets fun. Your goal is to skillfully merge numbered tiles and ascend to the illustrious 2048 tile. Immerse yourself in the challenge, sharpen your wits, and achieve the coveted 2048 tile!

2. Technologies Used:

Dive into the world of modern web development with our project, powered by the dynamic duo of JavaScript for seamless functionality and SCSS for sleek styling. Engage with the game, experience smooth interactions, and enjoy a visually appealing interface crafted using cutting-edge technologies.

3. Project Links:

- [DEMO LINK](https://baraban2003.github.io/js_2048_game/)

4. Main requirements:

- The game field is 4 x 4
- Each cell can be empty or contain one of the numbers: 2, 4, 8 ... 2^n
- The player can move cells with keyboard arrows
- All the numbers should be moved in the selected direction until all empty cells are filled in
  - 2 equal cells should be merged into a doubled number
  - The merged cell can’t be merged twice during one move
- The move is possible if at least one cell is changed after the move
- After move 2 or 4 appears in a random empty cell. 4 probability is 10%
- When 2048 value is displayed in any cell, win message should be shown.
- The `game over` message should be shown if there are no more available moves.
- Hide start message when game starts.
- Change the `Start` button to `Restart` after the first move.
- Increase score with each move. The score should be increased by the sum of all merged cells.

5. Manual for Starting the Project (Using Parcel).

To start the project locally, follow these steps:

Clone the Repository: bash Copy code git clone cd Install Dependencies: bash Copy code npm install Start the Development Server: bash Copy code npm start This will launch the project on a local development server. You can view it in your browser at http://localhost:8080.

Building for Production: To build the project for production:
bash Copy code npm run build This command generates a production-ready version of the project in the dist or build folder.
