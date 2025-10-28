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

    if (blackP == "Human" && whiteP == "Human") {
      // if both human
      return;
    }
    else if (blackP == "Human") {
      // if black (first move) is human
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
        await sleep(100);
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
        board, turn = botMove(board, turn);
      }

      addNewOutlines(possibleMoves(board, turn));
    }
  });
});

function botMove(board, turn){
  botName = players[1+turn];

  if (botName == "Random"){
    console.log("random")
    return random(board, turn);
  }
  else if (botName == "Greedy"){
    return greedy(board, turn);
  }
  else if (botName == "Minimax-4"){
    return minimaxMove(board, turn, 4);
  }
  else if (botName == "Minimax-10"){
    return minimaxMove(board, turn, 10);
  }
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


// -------- Minimax (depth-limited) --------
// Heuristic evaluation of a board state from Black's perspective (Black = -1, White = 1)
function evaluate(board) {
  let blackScore = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === -1) blackScore++;
      else if (board[r][c] === 1) blackScore--;
    }
  }

  return blackScore;
}


function cloneBoard(board) {
  return board.map(row => row.slice());
}

// Returns {score, move} where move is [r, c] for the player `turn` at this node.
function minimaxSearch(board, turn, depth, alpha, beta) {
  const moves = possibleMoves(board, turn);

  // Check for terminal: no moves for this player
  if (moves.length == 0) {
    const oppMoves = possibleMoves(board, -turn);
    if (oppMoves.length == 0) {
      // Game over: evaluate final score
      const score = evaluate(board);
      return { score, move: null };
    }
    // Pass turn without consuming depth
    return minimaxSearch(board, -turn, depth, alpha, beta);
  }

  // if wanted depth reached
  if (depth === 0) return { score: evaluate(board), move: null };
  
  // for Black, max, for White, we minimize.
  
  // Black: maximize
  if (turn == -1) {
    
    let best = { score: -Infinity, move: moves[0] };
    
    for (const [x, y] of moves) {
      const nBoard = flip(cloneBoard(board), turn, x, y, false)
      const child = minimaxSearch(nBoard, turn*-1, depth-1, alpha, beta);

      if (child.score > best.score) best = { score: child.score, move: [x, y] };
      if (child.score >= beta) return best;
      if (child.score >= alpha) alpha = child.score;
    }
    return best;
  }

  // White: minimize
  if (turn == 1) {
    
    let best = { score: Infinity, move: moves[0] };
    
    for (const [x, y] of moves) {
      const nBoard = flip(cloneBoard(board), turn, x, y, false)
      const child = minimaxSearch(nBoard, turn*-1, depth-1, alpha, beta);

      if (child.score < best.score) best = { score: child.score, move: [x, y] };
      if (child.score <= alpha) return best;
      if (child.score <= beta) beta = child.score;
    }
    return best;
  }
}

// Choose a move for the current player using minimax with a given depth.
function minimaxMove(board, turn, depth) {
  optimal = minimaxSearch(board, turn, depth, -Infinity, Infinity);
  console.log(optimal.move)
  // commit the best move
  board, turn = commitMove(board, optimal.move[0], optimal.move[1], turn);
  return board, turn;
}