"use strict";
/* eslint-disable */ // Uncomment the i lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();
// Write your code here
class Game {
    constructor(initialState){
        // Cоздаем поле.
        this.field = [
            [
                0,
                0,
                0,
                0
            ],
            [
                0,
                0,
                0,
                0
            ],
            [
                0,
                0,
                0,
                0
            ],
            [
                0,
                0,
                0,
                0
            ]
        ];
        // Если initialState передан, заменяем поле копией initialState
        if (initialState) this.field = JSON.parse(JSON.stringify(initialState));
        // Cохраняем начальное состояние.
        this.initialState = JSON.parse(JSON.stringify(this.field));
        // Начальные параментры игры.
        this.status = "ready";
        this.score = 0;
    }
    getState() {
        return this.field;
    }
    getScore() {
        return this.score;
    }
    getStatus() {
        return this.status;
    }
    moveLeft() {
        let canMove = false;
        // запоминаем score до хода
        const prevScore = this.score;
        if (this.status !== "playing") return;
        for(let row = 0; row < this.field.length; row++){
            const line = this.getLine(row, "left");
            const merged = this.mergeLine(line);
            if (!this.linesSimilar(line, merged)) canMove = true;
            this.setLine(row, "left", merged); // Добавляем строку обратно в поле
        }
        if (!canMove) {
            this.score = prevScore;
            return;
        }
        // Добавить рандомные числа
        this.addRandom();
        // Проверка победы
        this.checkWin();
        // Проверка проиграша
        this.checkLose();
    }
    moveRight() {
        let canMove = false;
        const prevScore = this.score;
        if (this.status !== "playing") return;
        // Проходим по всем строкам
        for(let row = 0; row < this.field.length; row++){
            const line = this.getLine(row, "right");
            const merged = this.mergeLine(line);
            if (!this.linesSimilar(line, merged)) canMove = true;
            this.setLine(row, "right", merged);
        }
        // Если ход ничего не изменил — выходим
        if (!canMove) {
            this.score = prevScore;
            return;
        }
        //Добавить рандом
        this.addRandom();
        // Проверка победы
        this.checkWin();
        // Проверка проиграша
        this.checkLose();
    }
    moveUp() {
        let canMove = false;
        const prevScore = this.score;
        if (this.status !== "playing") return;
        // Проходим по колонкам
        for(let col = 0; col < this.field.length; col++){
            const line = this.getLine(col, "up");
            const merged = this.mergeLine(line);
            // Проверяем, изменился ли столбец
            if (!this.linesSimilar(line, merged)) canMove = true;
            this.setLine(col, "up", merged);
        }
        // Если ход ничего не изменил — выходим
        if (!canMove) {
            this.score = prevScore;
            return;
        }
        //Добавить рандом
        this.addRandom();
        // Проверка победы
        this.checkWin();
        // Проверка проиграша
        this.checkLose();
    }
    start() {
        // Ищим пустую кординату (ячейку)
        if (this.status === "playing") return;
        let box = [];
        for(let i = 0; i < this.field.length; i++){
            for(let j = 0; j < this.field.length; j++)if (this.field[i][j] === 0) box.push([
                i,
                j
            ]); /// [1,2]
        }
        // 1.Выбираем случайную пустую клетку из box
        // 2. // Первая плитка
        let randomIndex = Math.floor(Math.random() * box.length);
        let cords = box[randomIndex];
        let i = cords[0];
        let j = cords[1];
        // Работаем со случайным числом
        this.field[i][j] = Math.random() < 0.9 ? 2 : 4;
        // Удаляем первую использованную координату
        box.splice(randomIndex, 1);
        // Вторая плитка
        let randomIndex2 = Math.floor(Math.random() * box.length);
        let cords2 = box[randomIndex2];
        let i2 = cords2[0];
        let j3 = cords2[1];
        this.field[i2][j3] = Math.random() < 0.9 ? 2 : 4;
        // Удаляем вторую использованную координату
        box.splice(randomIndex2, 1);
        // Играем (меняем статус)
        this.status = "playing";
    }
    restart() {
        //создаёт глубокую копию,для того чтобы поле было таким же как в конструкторе
        this.field = JSON.parse(JSON.stringify(this.initialState));
        this.score = 0;
        this.status = "idle";
    }
    moveDown() {
        let canMove = false;
        const prevScore = this.score;
        if (this.status !== "playing") return;
        for(let col = 0; col < this.field.length; col++){
            const line = this.getLine(col, "down");
            const merged = this.mergeLine(line);
            // Проверяем, изменился ли столбец
            if (!this.linesSimilar(line, merged)) canMove = true;
            this.setLine(col, "down", merged);
        }
        // Если ход ничего не изменил — выходим
        if (!canMove) {
            this.score = prevScore;
            return;
        }
        this.addRandom();
        this.checkWin();
        // Проверка проиграша
        this.checkLose();
    }
    // TODO: ДЕЛАЕМ ЗАГОТОВКИ ДЛЯ ОСНОВНЫХ МЕТОДОВ.
    getLine(i, direction) {
        if (direction === "left") return [
            ...this.field[i]
        ];
        if (direction === "right") return [
            ...this.field[i]
        ].reverse();
        if (direction === "up") return this.field.map((row)=>row[i]);
        if (direction === "down") return this.field.map((row)=>row[i]).reverse();
    }
    mergeLine(line) {
        const withoutZero = line.filter((n)=>n !== 0);
        let mergeRes = [];
        for(let i = 0; i < withoutZero.length; i++)if (withoutZero[i] === withoutZero[i + 1]) {
            let result = withoutZero[i] * 2;
            this.score += result;
            mergeRes.push(result);
            i++;
        } else mergeRes.push(withoutZero[i]);
        while(mergeRes.length < 4)mergeRes.push(0);
        return mergeRes;
    }
    setLine(index, direction, line) {
        if (direction === "right") this.field[index] = [
            ...line
        ].reverse();
        if (direction === "left") this.field[index] = [
            ...line
        ];
        if (direction === "up") for(let row = 0; row < 4; row++)this.field[row][index] = line[row];
        if (direction === "down") {
            const reverse = [
                ...line
            ].reverse();
            for(let row = 0; row < 4; row++)this.field[row][index] = reverse[row];
        }
    }
    addRandom() {
        let empyField = [];
        for(let row = 0; row < this.field.length; row++){
            for(let col = 0; col < this.field.length; col++)if (this.field[row][col] === 0) empyField.push([
                row,
                col
            ]);
        }
        if (empyField.length > 0) {
            let index = Math.floor(Math.random() * empyField.length);
            let [row, col] = empyField[index];
            this.field[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    linesSimilar(a, b) {
        for(let i = 0; i < a.length; i++){
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
    checkWin() {
        for(let row = 0; row < 4; row++){
            for(let col = 0; col < 4; col++)if (this.field[row][col] === 2048) {
                this.status = "win";
                return;
            }
        }
    }
    checkLose() {
        let canPlay = false;
        // Есть пустые клетки
        for(let row = 0; row < 4; row++){
            for(let col = 0; col < 4; col++)if (this.field[row][col] === 0) canPlay = true;
        }
        // Если пустых нет — ищем возможные merge
        if (!canPlay) {
            for(let row = 0; row < 4; row++){
                for(let col = 0; col < 3; col++)if (this.field[row][col] === this.field[row][col + 1]) canPlay = true;
            }
            for(let col = 0; col < 4; col++){
                for(let row = 0; row < 3; row++)if (this.field[row][col] === this.field[row + 1][col]) canPlay = true;
            }
        }
        if (!canPlay) {
            this.status = "lose";
            return;
        }
    }
}
// Получаем DOM элементыю.
const cells = [
    ...document.querySelectorAll(".field-cell")
];
const scoreEL = document.querySelector(".game-score");
const startBtn = document.querySelector(".start");
const win = document.querySelector(".message-win");
const lose = document.querySelector(".message-lose");
const mesStart = document.querySelector(".message-start");
// Создаем игру
const newGame = new Game();
// !!!!!!Любое событие, которое меняет данные → вызывает render!!!!!!!
function render() {
    // Вызываем метод у объекта и сохраняем его.
    // C помощью метода flat деламем поле плоским(16)
    const stateRes = newGame.getState().flat();
    const newScore = newGame.getScore();
    const newStatus = newGame.getStatus();
    // Создаем цыкл чтобы синхронизировать каждую DOM-клетку с данными игры.
    for(let i = 0; i < cells.length; i++){
        //Данные
        const value = stateRes[i];
        //Отоббражения
        const cell = cells[i];
        //  Полная очистка клетки
        cell.textContent = "";
        cell.className = "field-cell";
        if (value !== 0) {
            cell.textContent = value;
            cell.classList.add(`field-cell--${value}`);
        }
    }
    mesStart.classList.toggle("hidden", newStatus !== "ready");
    win.classList.toggle("hidden", newStatus !== "win");
    lose.classList.toggle("hidden", newStatus !== "lose");
    scoreEL.textContent = newScore;
    if (newStatus === "win") {
        startBtn.textContent = "New game";
        startBtn.classList.remove("start");
        startBtn.classList.add("restart");
    } else if (newStatus === "lose") {
        startBtn.textContent = "Restart";
        startBtn.classList.remove("start");
        startBtn.classList.add("restart");
    } else if (newStatus === "ready") startBtn.textContent = "Start";
    else if (newStatus === "playing") {
        startBtn.textContent = "Restart";
        startBtn.classList.remove("start");
        startBtn.classList.add("restart");
    }
}
// Работаем с кликами
function handleStartButtonClick() {
    // в каком статусе сейчас игра.
    const newStatus = newGame.getStatus();
    // сначала if на проверу cтарт потом
    if (newStatus === "win") {
        newGame.restart();
        newGame.start();
    } else if (newStatus === "lose") {
        newGame.restart();
        newGame.start();
    } else if (newStatus === "ready") newGame.start();
    else if (newStatus === "playing") {
        newGame.restart();
        newGame.start();
    }
    render();
}
// Когда пользователь кликнет на кнопку, вызваем функцию
startBtn.addEventListener("click", handleStartButtonClick);
// Работаем с клаиатурой
function keyboardStatus(event) {
    const newStatus = newGame.getStatus();
    if (newStatus !== "playing") return;
    if (event.key === "ArrowUp") newGame.moveUp();
    if (event.key === "ArrowDown") newGame.moveDown();
    if (event.key === "ArrowRight") newGame.moveRight();
    if (event.key === "ArrowLeft") newGame.moveLeft();
    render();
}
// Когда пользователь кликнет на клавишу, вызваем функцию
document.addEventListener("keydown", keyboardStatus);
// Показать текущий экран, без вызова rendera, пользователь ничего не будет видеть до первого действия
render();

//# sourceMappingURL=index.f75de5e1.js.map
