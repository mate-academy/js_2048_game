'use strict';

// script.js
var board;
var score = 0;
var rows = 4;
var columns = 4;
var gameStarted = false;

window.onload = function() {
    setGame();
}

function setGame() {
    // Clear the board
    document.getElementById("board").innerHTML = "";

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Set gameStarted to true when starting a new game
    gameStarted = true;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    // Reset the score to zero
    score = 0;
    document.getElementById("score").innerText = score;

    // Create 2 to begin the game
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 2048) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x" + num.toString());
            // Check if the value is 2048 and show the "Winner" message
            if (num === 2048) {
                document.getElementById('winnerMessage').style.display = 'block';
            }
        }
    }
}

document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();

    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
})

function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } //[4, 0, 2]
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        checkGameOver();
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        checkGameOver();
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        checkGameOver();
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}

function resetGame() {
    // Hide the "Game Over" message
    document.getElementById('gameOverMessage').style.display = 'none';

    // Call the setGame() function to set up a new game
    setGame();
}
function checkGameOver() {
    if (!gameStarted) return; // Ignore checking if the game hasn't started
    if (!hasAvailableMoves()) {
        // Display the "game over" message
        document.getElementById('gameOverMessage').style.display = 'block';
        document.getElementById('restartButton').addEventListener('click', function () {
            resetGame();
        });
        gameStarted = false; // Game is over, prevent further moves
    }
}
document.addEventListener('keyup', (e) => {
    if (!gameStarted) return; // Ignore key events if the game hasn't started
    if (e.code == "ArrowLeft") {
        slideLeft();
    } else if (e.code == "ArrowRight") {
        slideRight();
    } else if (e.code == "ArrowUp") {
        slideUp();
    } else if (e.code == "ArrowDown") {
        slideDown();
    }
    document.getElementById("score").innerText = score;
    checkGameOver();
});








function hasAvailableMoves() {
    return (
        canMoveLeft() || canMoveRight() || canMoveUp() || canMoveDown()
    );
}

function canMoveLeft() {
    for (let r = 0; r < rows; r++) {
        for (let c = 1; c < columns; c++) {
            if (board[r][c] !== 0) {
                // Check if the tile to the left is either empty or has the same value
                if (board[r][c - 1] === 0 || board[r][c - 1] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight() {
    for (let r = 0; r < rows; r++) {
        for (let c = columns - 2; c >= 0; c--) {
            if (board[r][c] !== 0) {
                // Check if the tile to the right is either empty or has the same value
                if (board[r][c + 1] === 0 || board[r][c + 1] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp() {
    for (let r = 1; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] !== 0) {
                // Check if the tile above is either empty or has the same value
                if (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown() {
    for (let r = rows - 2; r >= 0; r--) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] !== 0) {
                // Check if the tile below is either empty or has the same value
                if (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}