//white = 1, black = -1
let turn = -1

// board
let initialBoard = [[0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, -1, 0, 0, 0],
                    [0, 0, 0, -1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0]]

let board = initialBoard


// When a button is clicked ___________________________

// Select all buttons with the class "square"
const squares = document.querySelectorAll(".square");


// Loop through each square and add listener for clicks
squares.forEach(square => {
  square.addEventListener("click", async () => {
    
    if (turn == -1){
        //get coordinates of the clicked stone
        const row = Math.floor(square.id/10)
        const column = square.id % 10
        
        if (!validMove(board, row, column, turn)) return board; // if its an invalid move, quit
        board, turn = commitMove(board, row, column, turn); // if successful, returns new board state, if not just the current one

        // brief pause before flipping to show the placed piece
        await sleep(300);

        if (turn == 1){
            board, turn = playRandom(board, turn)
        }
    
        const next = possibleMoves(board, turn);
        addNewOutlines(next);

    }
  });
});

function playRandom(board, turn){
    const options = possibleMoves(board, turn)
    move = options[Math.floor(Math.random() * (options.length-1))]

    board, turn = commitMove(board, move[0], move[1], turn);
    
    return board, turn
}

function minimax(board, turn) {
    const options = possibleMoves(board, turn)
    Math.floor(Math.random() * (options.length-1))
}