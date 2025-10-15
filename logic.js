
//white = 1, black = -1
turn = -1

// board
board = [[0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 1, -1, 0, 0, 0],
         [0, 0, 0, -1, 1, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0]]


function Moves(board, color){ // all possible moves
    const directions = [
        [-1,-1], [-1,0], [-1,1],
        [ 0,-1],         [ 0,1],
        [ 1,-1], [ 1,0], [ 1,1]
    ];

    const valids = [];

    // loop through all possible coordinates
    for (let x=0; x<8; x++){
        for (let y=0; y<8; y++){

            // if slot already has a stone, skip
            if (board[x][y] != 0) continue;

            let legal = false;

            //loop through all items in list directions to check all surrounding slots
            for (const [xd, yd] of directions) {
                // take a step
                let xx = x+xd, yy = y+yd;

                // first step must be opponent
                if (!inb(xx, yy) || board[xx][yy] != -color) continue

                // keep taking steps if stones are different color
                xx += xd; yy += yd;
                while (inb(xx,yy) && board[xx][yy] == -color) {
                    xx += xd; yy += yd;
                }

                // legal if last stone is our color
                if (inb(xx,yy) && board[xx][yy] == color) {
                    legal = true;
                    break;
                }
            }
            if (legal) {
                valids.push([x,y]);
            }
        }
    }

    return valids

}

function inb(x, y){ // tells if coords are in bound
    if (0 <= x && x <= 7 && 0 <= y && y <= 7) return true;
    return false 
}


// Select all buttons with the class "square"
const squares = document.querySelectorAll(".square");
console.log(squares)


// Loop through each square and add listener for clicks
squares.forEach(square => {
  square.addEventListener("click", () => {
    
    //get coordinates of the clicked stone
    const row = Math.floor(square.id/10)
    const column = square.id % 10


    const moves = Moves(board, turn); // get all possible moves
    const is_valid = moves.some(([x, y]) => x == row && y == column) // check if move is valid
    if (!is_valid) return; // if its an invalid move, quit

    if (board[row][column] != 0) return; // stone already there

    if (turn == -1){ // place a black
        const stone = document.createElement('div');
        stone.className = 'piece black';
        square.appendChild(stone);

        board[row][column] = -1
    } 
    else { // place a white
        const stone = document.createElement('div');
        stone.className = 'piece white';
        square.appendChild(stone);

        board[row][column] = 1
    }

    turn = turn * -1;

    deleteOutlines(moves);
    addNewOutlines(Moves(board, turn));

  });
});


function deleteOutlines(coordinates) { // clears the possible move outlines
    for (const [x, y] of coordinates) {
        const square = document.getElementById(`${x}${y}`);
        if (!square) return;

        // Remove any grey hint circles in this square
        square.querySelectorAll('.piece.possible').forEach(el => el.remove());
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