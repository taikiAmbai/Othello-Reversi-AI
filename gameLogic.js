// Variables and Constants ___________________________

//white = 1, black = -1


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

function possibleMoves(board, color){ // all possible moves
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


// flips all stones that are surrounded due to a specific move
function flip(board, color, x, y, show){
    surroundedLines = checkAllDir(board, color, x, y)
    for (const line of surroundedLines) {
        for (const [xx,yy] of line) {
            if (color == 1){
                if (show) turnWhite(xx,yy);
                board[xx][yy] = 1;
            }
            else if (color == -1){
                if (show) turnBlack(xx,yy);
                board[xx][yy] = -1;
            }
        }
    }
}


function validMove(board, x, y, color){
    if (board[x][y] != 0) return false; // stone already there

    const moves = possibleMoves(board, color); // get all possible moves
    const is_valid = moves.some(([a, b]) => a == x && b == y) // check if move is valid

    return is_valid
}

function moveExists(board, color){
    return !possibleMoves(board,color).length == 0;
}


function commitMove(board, x, y, color){
    // this is called to show a move on the board

    const moves = possibleMoves(board, color); // get all possible moves
    clearCells(moves); //remove the outline
    removeAllRedDots(); //remove red dot for just played

    if (color == -1){ // place a black
        turnBlack(x, y);
        board[x][y] = -1;
    } 
    else { // place a white
        turnWhite(x, y);
        board[x][y] = 1;
    }

    addRedDot(x,y); // add red dot to spot just played

    flip(board, color, x, y, true); //flip the stones it now surrounds
    updateScore(board);

    //check if that causes the game to end, or if the 
    //  opponent has no possible moves
    color *= -1;
    if (!moveExists(board, color)){
        if (!moveExists(board, color*-1)) {
            console.log("game over!");
            color = 0;
        }
        else {
            console.log("SKIP!!");
        }
        color *= -1;
    }

    updateTurnDisplay(color);

    return(board, color);
}