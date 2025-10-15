// Variables and Constants ___________________________

//white = 1, black = -1
let turn = -1

// board
let board = [[0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 1, -1, 0, 0, 0],
             [0, 0, 0, -1, 1, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0]]

// check if in bound
const inb = (r,c) => r >= 0 && r < 8 && c >= 0 && c < 8;

// all directions one could go from a cell
const directions = [
    [-1,-1], [-1,0], [-1,1],
    [ 0,-1],         [ 0,1],
    [ 1,-1], [ 1,0], [ 1,1]
];




// Functions essential to the game ___________________________

function checkAllDir(board, color, x, y){ 
    // for a given spot and colour, checks if a move there will result in capture
    // returns all stones that would be captured

    const surroundedLines = []
    for (const [xd, yd] of directions) {
        const surroundedLine = []

        // first step must be opponent
        let xx = x+xd, yy = y+yd;
        if (!inb(xx, yy) || board[xx][yy] != -color) continue;

        // keep taking steps if stones are different color
        while (inb(xx,yy) && board[xx][yy] == -color) {
            surroundedLine.push([xx,yy]);
            xx += xd; yy += yd;
        }

        // legal if last stone is our color
        if (inb(xx,yy) && board[xx][yy] == color && surroundedLine.length) {
            surroundedLines.push(surroundedLine);
        }
    }
    return surroundedLines;
}

function Moves(board, color){ // all possible moves
    const valids = [];

    // loop through all possible coordinates
    for (let x=0; x<8; x++){
        for (let y=0; y<8; y++){

            // if slot already has a stone, skip
            if (board[x][y] != 0) continue;

            if (checkAllDir(board, color, x, y).length != 0) valids.push([x,y]);
        }
    }
    return valids;
}

function Flip(board, color, x, y){
    surroundedLines = checkAllDir(board, color, x, y)
    for (const line of surroundedLines) {
        for (const [xx,yy] of line) {
            if (color == 1){
                turnWhite(xx,yy);
                board[xx][yy] = 1
            }
            else if (color == -1){
                turnBlack(xx,yy);
                board[xx][yy] = -1
            }
        }
    }
}




// When a button is clicked ___________________________

// Select all buttons with the class "square"
const squares = document.querySelectorAll(".square");


// Loop through each square and add listener for clicks
squares.forEach(square => {
  square.addEventListener("click", async () => {
    
    //get coordinates of the clicked stone
    const row = Math.floor(square.id/10)
    const column = square.id % 10


    const moves = Moves(board, turn); // get all possible moves
    const is_valid = moves.some(([x, y]) => x == row && y == column) // check if move is valid
    if (!is_valid) return; // if its an invalid move, quit
    
    deleteOutlines(moves);

    if (board[row][column] != 0) return; // stone already there

    if (turn == -1){ // place a black
        turnBlack(row, column)
        board[row][column] = -1
    } 
    else { // place a white
        turnWhite(row, column)
        board[row][column] = 1
    }

    // brief pause before flipping to show the placed piece
    await sleep(200);
    Flip(board, turn, row, column)

    turn = turn * -1;
    
    const next = Moves(board, turn);
    addNewOutlines(next);

    // if opponent has no possible moves, it skips
    if (next.length === 0) {
        console.log("SKIP!!")
        turn *= -1;
        addNewOutlines(Moves(board, turn));
    }

  });
});


function deleteOutlines(coordinates) { // clears the possible move outlines
    for (const [x, y] of coordinates) {
        const square = document.getElementById(`${x}${y}`);
        if (!square) return;

        square.innerHTML = "";
    }
}

function addNewOutlines(coordinates) {
    for (const [x, y] of coordinates) {
        const square = document.getElementById(`${x}${y}`);
        if (!square) return;

        const stone = document.createElement('div');
        stone.className = 'piece possible';
        square.appendChild(stone);
    }
}

function turnBlack(x, y){
    const square = document.getElementById(`${x}${y}`);
    if (!square) return;

    square.innerHTML = "";

    const stone = document.createElement('div');
    stone.className = 'piece black';
    square.appendChild(stone);
}

function turnWhite(x, y){
    const square = document.getElementById(`${x}${y}`);
    if (!square) return;

    square.innerHTML = "";

    const stone = document.createElement('div');
    stone.className = 'piece white';
    square.appendChild(stone);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }