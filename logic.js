// board

turn = 1

//white = 1, black = -1
board = [[0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, -1, 0, 0, 0],
        [0, 0, 0, -1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]]

// Select all buttons with the class "square"
const squares = document.querySelectorAll(".square");
console.log(squares)


// Loop through each square and add listener for clicks
squares.forEach(square => {
  square.addEventListener("click", () => {
    const row = Math.floor(square.id/10)
    const column = square.id % 10

    if(board[row][column] != 0){
        console.log("already a stone!")
    } else if (turn == 1){
        const stone = document.createElement('div');
        stone.className = 'piece black';
        square.appendChild(stone);
    } else {
        const stone = document.createElement('div');
        stone.className = 'piece white';
        square.appendChild(stone);
    }
    

    turn = turn * -1;


    console.log(row, column)
  });
});