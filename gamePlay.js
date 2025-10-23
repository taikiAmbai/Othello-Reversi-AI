//white = 1, black = -1
let turn = -1

// board
function makeInitialBoard() {
  const b = Array.from({length: 8}, () => Array(8).fill(0));
  b[3][3] = 1;  b[4][4] = 1;  // white
  b[3][4] = -1; b[4][3] = -1; // black
  return b;
}

let board = makeInitialBoard()


let blackP = "Human"
let whiteP = "Human"
//trick so that players[1+turn] will return the player of that turn
let players = [blackP, 0, whiteP]

// When game started   ___________________________
document.getElementById("new-game").addEventListener("click", async () => {
    resetGame();
    blackP = document.getElementById("ai-black").value;
    whiteP = document.getElementById("ai-white").value;
    players = [blackP, 0, whiteP]

    console.log("Black player:", blackP);
    console.log("Black player:", players[1-1]);
    console.log("White player:", whiteP);
    console.log("White player:", players[1+1]);

    if (blackP == "Human" && whiteP == "Human") {
      // if both human
      return;
    } 
    else if (whiteP == "Human") {
      // if just white is human
      await sleep(300);
      board, turn = botMove(board, turn);

      const next = possibleMoves(board, turn);
      addNewOutlines(next);
    } 
    else {
      //both bots, so take turn making moves!
      while (turn != 0) {
        board, turn = botMove(board, turn);
        // await sleep(300);
      }
    }

    
});

// When a box is clicked ___________________________

// Select all buttons with the class "square"
const squares = document.querySelectorAll(".square");


// Loop through each square and add listener for clicks
squares.forEach(square => {
  square.addEventListener("click", async () => {
    
    if ((players[1+turn] == "Human")) {
      // if its the humans turn
      
      //get coordinates of the clicked stone
      const row = Math.floor(square.id/10)
      const column = square.id % 10

      if (!validMove(board, row, column, turn)) return board; // if its an invalid move, quit
      board, turn = commitMove(board, row, column, turn); // if successful, returns new board state, if not just the current one

      if (players[1+turn] != "Human") {
        await sleep(300);
        //if its not the humans turn again
        board,turn = botMove(board, turn)
      }

      const next = possibleMoves(board, turn);
      addNewOutlines(next);
    }
  });
});

function botMove(board, turn){
  botName = players[1+turn];

  if (botName == "Random"){
    board, turn = random(board, turn);
  }
  else if (botName == "Greedy") {
    board, turn = greedy(board, turn);
  }

  return board, turn;
  
}

function random(board, turn){
  const options = possibleMoves(board, turn)
  move = options[Math.floor(Math.random() * (options.length-1))]

  board, turn = commitMove(board, move[0], move[1], turn);
    
  return board, turn
}


function greedy(board, turn) {
  const options = possibleMoves(board, turn)

  let bestMove = null;
  let bestScore = -Infinity;

  for (const [x, y] of options) {
    // determine how many stones would flip for this move
    const captured = checkAllDir(board, turn, x, y);
    let flipCount = 0;
    for (const line of captured) {
      flipCount += line.length;
    }

    if (flipCount > bestScore) {
      bestScore = flipCount;
      bestMove = [x, y];
    }
  }

  // commit the best move
  board, turn = commitMove(board, bestMove[0], bestMove[1], turn);
  return board, turn;
}


function minimax(board, turn) {
    const options = possibleMoves(board, turn)
    Math.floor(Math.random() * (options.length-1))
}