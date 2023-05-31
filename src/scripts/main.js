'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
;
;
;
;
var Axis;
(function (Axis) {
    Axis["X"] = "x";
    Axis["Y"] = "y";
})(Axis || (Axis = {}));
;
var MoveDirection;
(function (MoveDirection) {
    MoveDirection["ArrowUp"] = "ArrowUp";
    MoveDirection["ArrowDown"] = "ArrowDown";
    MoveDirection["ArrowLeft"] = "ArrowLeft";
    MoveDirection["ArrowRight"] = "ArrowRight";
})(MoveDirection || (MoveDirection = {}));
;
function generateField(rowLength, tierLength) {
    return {
        height: rowLength,
        width: tierLength,
        cells: generateCells({ x: rowLength, y: tierLength })
    };
}
;
function generateCells(maxSize) {
    var cells = [];
    for (var x = 1; x <= maxSize.x; x++) {
        for (var y = 1; y <= maxSize.y; y++) {
            var newCell = {
                coords: {
                    x: x,
                    y: y
                },
                contains: null
            };
            cells.push(newCell);
        }
    }
    return cells;
}
;
function fillCell(x, y, value) {
    var cell = document.querySelector(".field-row:nth-last-child(".concat(y, ") > .field-cell:nth-child(").concat(x));
    if (cell) {
        cell.textContent = "".concat(value || '');
        cell.className = 'field-cell';
        if (value) {
            cell.classList.add("field-cell--".concat(value));
        }
    }
}
;
function clearCell(field, x, y) {
    var index = field.cells.findIndex(function (cell) {
        return cell.coords.x === x && cell.coords.y === y;
    });
    var cell = document.querySelector(".field-row:nth-last-child(".concat(y, ") > .field-cell:nth-child(").concat(x));
    field.cells[index].contains = null;
}
;
function generateUnit(quantity, field) {
    var valueOptions = [2, 4];
    var coordsOptions = field.cells
        .filter(function (cell) { return !cell.contains; })
        .map(function (cell) { return cell.coords; });
    var _loop_1 = function (i) {
        var targetCoords = coordsOptions[Math.floor(Math.random() * (coordsOptions.length))];
        coordsOptions = coordsOptions.filter(function (coords) { return coords !== targetCoords; });
        var newValue = Math.floor(Math.random() * 10) < 9
            ? valueOptions[0]
            : valueOptions[1];
        var index = field.cells.findIndex(function (cell) { return cell.coords === targetCoords; });
        field.cells[index].contains = {
            coords: targetCoords,
            value: newValue
        };
        fillCell(targetCoords.x, targetCoords.y, newValue);
    };
    for (var i = 0; i < quantity; i++) {
        _loop_1(i);
    }
    ;
    return field;
}
;
function moveUnit(unit, field, direction) {
    var _a, _b, _c, _d;
    var newCoords = __assign({}, unit.coords);
    switch (direction) {
        case MoveDirection.ArrowUp:
            newCoords = {
                x: unit.coords.x,
                y: unit.coords.y + 1
            };
            break;
        case MoveDirection.ArrowDown:
            newCoords = {
                x: unit.coords.x,
                y: unit.coords.y - 1
            };
            break;
        case MoveDirection.ArrowLeft:
            newCoords = {
                x: unit.coords.x - 1,
                y: unit.coords.y
            };
            break;
        case MoveDirection.ArrowRight:
            newCoords = {
                x: unit.coords.x + 1,
                y: unit.coords.y
            };
            break;
    }
    var targetCell = field.cells.find(function (cell) {
        return cell.coords.x === newCoords.x && cell.coords.y === newCoords.y;
    });
    if (!targetCell || (((_a = targetCell.contains) === null || _a === void 0 ? void 0 : _a.value) && (((_b = targetCell.contains) === null || _b === void 0 ? void 0 : _b.value) !== unit.value))) {
        // assign current cell for the unit
        var index = field.cells.findIndex(function (cell) {
            return cell.coords.x === unit.coords.x && cell.coords.y === unit.coords.y;
        });
        field.cells[index].contains = unit;
        return unit;
    }
    else if (((_c = targetCell.contains) === null || _c === void 0 ? void 0 : _c.value) && (((_d = targetCell.contains) === null || _d === void 0 ? void 0 : _d.value) === unit.value)) {
        // merge
        clearCell(field, unit.coords.x, unit.coords.y);
        targetCell.contains.value += unit.value;
        score += targetCell.contains.value;
        return targetCell.contains;
    }
    // next move
    clearCell(field, unit.coords.x, unit.coords.y);
    moveUnit(__assign(__assign({}, unit), { coords: __assign({}, newCoords) }), field, direction);
}
;
function moveTier(i, direction, axis, field) {
    var tier = field.cells.filter(function (cell) {
        return cell.contains && cell.coords[axis] === i;
    })
        .map(function (cell) { return cell.contains; });
    tier.forEach(function (unit) {
        if (unit) {
            moveUnit(unit, field, direction);
        }
    });
}
;
function updateCells(field) {
    field.cells.forEach(function (cell) {
        var _a;
        fillCell(cell.coords.x, cell.coords.y, (_a = cell.contains) === null || _a === void 0 ? void 0 : _a.value);
    });
}
;
function checkResult(field) {
    var _a;
    if (field.cells.some(function (cell) { var _a; return ((_a = cell.contains) === null || _a === void 0 ? void 0 : _a.value) === 2048; })) {
        (_a = document.querySelector('.message-win')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
    }
}
;
// function calculateScore(field: Field) {
//   let score = 0;
//   field.cells.forEach((cell: FieldCell) => {
//     if (cell.contains) {
//       score += cell.contains.value;
//     }
//   })
//   return score;
// };
function unpdateScore(field) {
    // const score = calculateScore(field);
    var scoreElem = document.querySelector('.game-score');
    if (scoreElem) {
        scoreElem.textContent = "".concat(score);
    }
}
;
function handleKeypress(field, direction) {
    switch (direction) {
        case MoveDirection.ArrowDown:
            for (var i = 1; i <= field.height; i++) {
                moveTier(i, direction, Axis.Y, field);
            }
            break;
        case MoveDirection.ArrowUp:
            for (var i = field.height - 1; i; i--) {
                moveTier(i, direction, Axis.Y, field);
            }
            break;
        case MoveDirection.ArrowLeft:
            for (var i = 1; i <= field.height; i++) {
                moveTier(i, direction, Axis.X, field);
            }
            break;
        case MoveDirection.ArrowRight:
            for (var i = field.width - 1; i; i--) {
                moveTier(i, direction, Axis.X, field);
            }
            break;
        default:
            return field;
    }
    return field;
}
;
function isGameOver(field, score) {
    var trialField = JSON.parse(JSON.stringify(field));
    for (var direction in MoveDirection) {
        console.log(field);
        trialField = handleKeypress(trialField, MoveDirection[direction]);
        var isFull = !trialField.cells.filter(function (cell) { return !cell.contains; }).length;
        if (!isFull) {
            console.log('is not game onver');
            return false;
        }
    }
    console.log('is game onver');
    return true;
}
;
function onArrowPress(e) {
    var _a;
    if (Object.values(MoveDirection).includes(MoveDirection[e.key])) {
        handleKeypress(field, e.key);
        var isFull = !field.cells.filter(function (cell) { return !cell.contains; }).length;
        if (isFull && isGameOver(field, score)) {
            (_a = document.querySelector('.message-lose')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        }
        if (startButton === null || startButton === void 0 ? void 0 : startButton.classList.contains('start')) {
            startButton.classList.replace('start', 'restart');
            startButton.textContent = 'Restart';
        }
        if (!isFull) {
            generateUnit(1, field);
        }
        updateCells(field);
        unpdateScore(field);
        checkResult(field);
    }
}
;
var startButton = document.querySelector('.start');
var rows = document.querySelectorAll('.field-row').length;
var tiers = document.querySelectorAll('.field-row:first-child > .field-cell').length;
var field = generateField(rows, tiers);
var score;
startButton === null || startButton === void 0 ? void 0 : startButton.addEventListener('click', function () {
    var _a, _b, _c;
    score = 0;
    if (field.cells.filter(function (cell) { return cell.contains; })) {
        field = generateField(rows, tiers);
        updateCells(field);
        document.body.removeEventListener('keyup', onArrowPress);
    }
    ;
    (_a = document.querySelector('.message-start')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.querySelector('.message-lose')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
    (_c = document.querySelector('.message-win')) === null || _c === void 0 ? void 0 : _c.classList.add('hidden');
    generateUnit(2, field);
    unpdateScore(field);
    document.body.addEventListener('keyup', onArrowPress);
});
