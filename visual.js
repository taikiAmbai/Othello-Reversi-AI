



// Functions for adding/removing visual elements ___________________________

function clearCells(coordinates) { // clears all cells
    for (const [x, y] of coordinates) {
        const square = document.getElementById(`${x}${y}`);

        square.innerHTML = "";
    }
}

function addNewOutlines(coordinates) {
    for (const [x, y] of coordinates) {
        const square = document.getElementById(`${x}${y}`);

        const stone = document.createElement('div');
        stone.className = 'piece possible';
        square.appendChild(stone);
    }
}

function turnBlack(x, y){
    const square = document.getElementById(`${x}${y}`);

    square.innerHTML = "";

    const stone = document.createElement('div');
    stone.className = 'piece black';
    square.appendChild(stone);
}

function turnWhite(x, y){
    const square = document.getElementById(`${x}${y}`);

    square.innerHTML = "";

    const stone = document.createElement('div');
    stone.className = 'piece white';
    square.appendChild(stone);
}

function addRedDot(x,y){
    const square = document.getElementById(`${x}${y}`);
    const stone = square.querySelector('.piece');

    const dot = document.createElement('div');
    dot.className = 'justPlayed';
    stone.appendChild(dot);
}

function removeAllRedDots() {
    const dots = document.querySelectorAll('.justPlayed');
    dots.forEach(dot => dot.remove());
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateTurnDisplay(color) {
    const indicator = document.getElementById("turn-indicator");
    if (!indicator) return;
  
    if (color === 0) {
        const lable = document.getElementsByClassName("turn-label");
        indicator.textContent = "Game Over";
        lable.textContent = "";
        return;
    }

    // Update text
    indicator.textContent = color === -1 ? "Black" : "White";
}


function updateScore(board) {
    const outW = document.getElementById('score-white');
    const outB = document.getElementById('score-black');

    let white = 0, black = 0;
    for (const row of board) {
        for (const cell of row) {
            if (cell === 1) white++;
            else if (cell === -1) black++;
        }
    }
    outW.textContent = white;
    outB.textContent = black;
}

function clearBoardDOM() {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            clearCells([[r,c]])
        }
    }
}

function drawInitialPosition() {
    // initial four pieces
    turnWhite(3,3);
    turnWhite(4,4);
    turnBlack(3,4);
    turnBlack(4,3);
    addNewOutlines([[2,3], [3,2], [4,5], [5,4]]);
}

function resetGame() {

    // reset visuals
    clearBoardDOM();

    // reset model
    drawInitialPosition();
    board = makeInitialBoard();

    // reset turn to Black to start
    turn = -1;

    // update dashboard
    updateTurnDisplay(turn);
    updateScore(board);
}