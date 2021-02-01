'use strict'

var gBoard = [];
var gIndxI;
var gShapeInterval;
var gShouldHideShape;
var gTimerInterval;
var gStartTime;
var SIZEI = 28;
var SIZEJ = 14;
var gIndxJ;
var gGame = {
    isOn: false,
    score: 0
}


function init() {
    gShouldHideShape = false;
    gIndxI = 0;
    gIndxJ = getRandomIntInclusive(0, SIZEJ - 2);
    gBoard = buildBoard();
    renderBoard(gBoard, '.board');
    var date = new Date();
    gStartTime = date.getTime();
    gGame.isOn = true;
    gShapeInterval = setInterval(moveDownShape, 1000);
    gTimerInterval = setInterval(countTimer, 1);
    gGame.score = 0;
    updateScore(gGame.score);
    var elGameOver = document.querySelector('.gameOver');
    elGameOver.style.display = 'none';
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < SIZEI; i++) {
        board.push([]);
        for (var j = 0; j < SIZEJ; j++) {
            board[i][j] = {
                isShape: false,
            }
        }
    }
    return board;
}

function renderBoard(mat, selector) {
    var strHTML = '';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            // var cell = mat[i][j];
            var cell = '';
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td class="${className}" onclick="cellClicked(${j})">${cell}</td>`;
        }
        strHTML += '</tr>'
    }
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function cellClicked(j) {
    if (!gGame.isOn) {
        return;
    }
    if (j === SIZEJ - 1) {
        j = SIZEJ - 2
    }
    if (j === gIndxJ + 2) {
        j -= 1;
    }
    renderShape(gIndxI, gIndxJ, gBoard, false);
    for (var i = gIndxI; i <= gIndxI + 1; i++) {
        for (var k = j; k <= j + 1; k++) {
            if (gBoard[i][k].isShape) {
                renderShape(gIndxI, gIndxJ, gBoard, true);
                return;
            }
        }
    }
    gIndxJ = j;
    renderShape(gIndxI, gIndxJ, gBoard, true);
}

function checkIfIndexJ(cellI, cellJ) {
    if (gBoard[cellI][cellJ].isShape || gBoard[cellI][cellJ + 1].isShape) {

    }
}


function showCell(i, j, isShow) {
    var elCell = document.querySelector(`.cell${i}-${j}`);
    if (isShow) {
        elCell.style.backgroundColor = 'rgba(90, 39, 100, 0.7)';
    } else {
        elCell.style.backgroundColor = 'rgba(196, 233, 255, 0.6)';
    }
}

function renderShape(indxI, indxJ, mat, isShow) {
    for (var i = indxI; i < indxI + 2; i++) {
        for (var j = indxJ; j < indxJ + 2; j++) {
            if (isShow) {
                mat[i][j].isShape = true;
                showCell(i, j, true);
            } else {
                mat[i][j].isShape = false;
                showCell(i, j, false);
            }
        }
    }
}

function moveDownShape(indxI = gIndxI, indxJ = gIndxJ) {
    var isShape = checkIfShapeIndxI();
    if (isShape) {
        renderShape(indxI, indxJ, gBoard, true);
        if (indxI === 0) {
            gameOver();
        }
        return;
    }
    if (gShouldHideShape) {
        renderShape(indxI, indxJ, gBoard, false);
        if (gIndxI < SIZEI - 2) {
            gIndxI++;
        }
    }
    renderShape(gIndxI, indxJ, gBoard, true);
    gShouldHideShape = true;
    checkIfShapeIndxI();
}

function checkIfShapeIndxI() {
    if (gIndxI == SIZEI - 2 || gBoard[gIndxI + 2][gIndxJ].isShape ||
        gBoard[gIndxI + 2][gIndxJ + 1].isShape) {
        checkIfIsLine();
        gShouldHideShape = false;
        gIndxI = 0;
        gIndxJ = getRandomIntInclusive(0, SIZEJ - 2);
        return true;
    }
    return false;
}

function checkIfIsLine() {
    var isFullLineFound = true;
    for (var i = SIZEI - 1; i > 1; i--) {
        isFullLineFound = true;
        for (var j = 0; j < SIZEJ - 1; j++) {
            if (!gBoard[i][j].isShape) {
                isFullLineFound = false;
                break;
            }
        }
        if (isFullLineFound) {
            for (var j = 0; j < SIZEJ; j++) {
                gBoard[i][j].isShape = false;
                showCell(i, j, false);
            }
            gGame.score += 100;
            updateScore();
            moveShapesDown(i++);
        }
    }
}

function playAgain() {
    clearInterval(gShapeInterval);
    clearInterval(gTimerInterval);
    init();
}

function gameOver() {
    gGame.isOn = false;
    clearInterval(gShapeInterval);
    clearInterval(gTimerInterval);
    var elGameOver = document.querySelector('.gameOver');
    elGameOver.style.display = 'block';
}

function moveShapesDown(indxI) {
    for (var i = indxI - 1; i > 0; i--) {
        for (var j = 0; j < SIZEJ; j++) {
            if (gBoard[i][j].isShape) {
                gBoard[i][j].isShape = false;
                showCell(i, j, false);
                gBoard[i + 1][j].isShape = true;
                showCell(i + 1, j, true);
            }
        }
    }
}


function leftButton() {
    var check = checkIfNotShapeHit(gIndxI, gIndxJ, gBoard);
    if (check) {
        renderShape(gIndxI, gIndxJ, gBoard, false)
        if (gIndxJ > 0) {
            gIndxJ--;
        }
        renderShape(gIndxI, gIndxJ, gBoard, true);
    }
}


function rightButton() {
    var check = checkIfNotShapeHit(gIndxI, gIndxJ, gBoard);
    if (check) {
        renderShape(gIndxI, gIndxJ, gBoard, false);
        if (gIndxJ < SIZEJ - 2) {
            gIndxJ++;
        }
        renderShape(gIndxI, gIndxJ, gBoard, true);
    }
}

function downButton() {
    if (!gGame.isOn) return;
    moveDownShape();
}

function checkIfNotShapeHit(cellI, cellJ, mat) {
    for (var i = cellI; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 2; j++) {
            // same cell
            if (i === cellI && j === cellJ) continue;
            if (i === cellI && j === cellJ + 1) continue;
            if (i === cellI + 1 && j === cellJ) continue;
            if (i === cellI + 1 && j === cellJ + 1) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isShape) {
                return false;
            }
        }
    }
    return true;
}

function KeyPressed(eventKeyboard) {
    switch (eventKeyboard.key) {
        case 'ArrowRight':
            rightButton();
            break;
        case 'ArrowLeft':
            leftButton();
            break;
        case 'ArrowDown':
            downButton();
            break;
        default:
            break
    }
}

function updateScore() {
    document.querySelector('h3 span').innerText = gGame.score;
}


function countTimer() {
    var date = new Date();
    var newDate = (date.getTime()) - gStartTime;
    var seconds = newDate / 1000;
    var milliseconds = seconds - Math.floor(seconds);
    milliseconds = Math.floor(milliseconds * 1000);
    if (milliseconds < 10) {
        milliseconds = "00" + milliseconds;
    } else if (milliseconds < 100) {
        milliseconds = "0" + milliseconds
    }
    document.querySelector('.timer').innerHTML = Math.floor(seconds) + "." + milliseconds;
    gGame.secsPassed = Math.floor(seconds) + "." + milliseconds;
}