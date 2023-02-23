const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const BLOCK_SIZE = 30;
const COLUMN = 10;
const ROW = 20;
const SHAPES = [
  [
    [1, 1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [1, 0, 0],
    [1, 1, 1]
  ],
  [
    [0, 0, 1],
    [1, 1, 1]
  ],
  [
    [1, 1],
    [1, 1]
  ]
];
const COLORS = [
  "cyan",
  "blue",
  "orange",
  "yellow",
  "green",
  "purple",
  "red"
];
const FPS = 60;
let board = [];
let currentPiece;
let gameOver = false;
let score = 0;

// Initialize the game board
for (let r = 0; r < ROW; r++) {
  let row = [];
  for (let c = 0; c < COLUMN; c++) {
    row.push(0);
  }
  board.push(row);
}

// Generate a new random piece
function newPiece() {
  let shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  let color = COLORS[SHAPES.indexOf(shape)];
  currentPiece = {
    shape: shape,
    x: Math.floor((COLUMN - shape[0].length) / 2),
    y: 0,
    color: color
  };
  if (!canMove(currentPiece, 0, 0)) {
    gameOver = true;
  }
}

// Game loop
function gameLoop() {
  // Move the current piece down one row
  moveDown();

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the game board
  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COLUMN; c++) {
      if (board[r][c]) {
        let color = COLORS[board[r][c] - 1];
        drawBlock(c, r, color);
      }
    }
  }

  // Draw the current piece
  drawPiece(currentPiece);

  // Draw the score
  context.fillStyle = "black";
  context.font = "24px Arial";
  context.fillText("Score: " + score, 10, 30);

  // Draw game over message if the game is over
  if (gameOver) {
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.font = "48px Arial";
    context.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
  }
}

// Draw a block at a given position with a given color
function drawBlock(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  context.strokeStyle = "black";
  context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw a piece at its current position
function drawPiece(piece) {
    let shape = piece.shape;
    let color = piece.color;
    let x = piece.x;
    let y = piece.y;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          drawBlock(x + c, y + r, color);
        }
      }
    }
  }
  
  // Move the current piece left one column
  function moveLeft() {
    if (canMove(currentPiece, -1, 0)) {
      currentPiece.x--;
    }
  }
  
  // Move the current piece right one column
  function moveRight() {
    if (canMove(currentPiece, 1, 0)) {
      currentPiece.x++;
    }
  }
  
  // Move the current piece down one row
  function moveDown() {
    if (canMove(currentPiece, 0, 1)) {
      currentPiece.y++;
    } else {
      // Add the current piece to the game board
      let shape = currentPiece.shape;
      let color = currentPiece.color;
      let x = currentPiece.x;
      let y = currentPiece.y;
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            board[y + r][x + c] = SHAPES.indexOf(shape) + 1;
          }
        }
      }
  
      // Check for completed rows
      let rowsCleared = 0;
      for (let r = 0; r < ROW; r++) {
        if (board[r].every(block => block !== 0)) {
          board.splice(r, 1);
          board.unshift(new Array(COLUMN).fill(0));
          rowsCleared++;
          r--;
        }
      }
  
      // Update the score
      if (rowsCleared > 0) {
        score += 10 * Math.pow(2, rowsCleared - 1);
      }
  
      // Generate a new random piece
      newPiece();
    }
  }
  
  // Rotate the current piece 90 degrees clockwise
  function rotate() {
    let newShape = [];
    for (let c = 0; c < currentPiece.shape[0].length; c++) {
      let newRow = [];
      for (let r = currentPiece.shape.length - 1; r >= 0; r--) {
        newRow.push(currentPiece.shape[r][c]);
      }
      newShape.push(newRow);
    }
    if (canMove({shape: newShape, x: currentPiece.x, y: currentPiece.y}, 0, 0)) {
      currentPiece.shape = newShape;
    }
  }
  
  // Check if a piece can be moved by the given amount
  function canMove(piece, dx, dy) {
    let shape = piece.shape;
    let x = piece.x + dx;
    let y = piece.y + dy;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          let newX = x + c;
          let newY = y + r;
          if (newX < 0 || newX >= COLUMN || newY >= ROW) {
            return false;
        }
        if (newY < 0) {
          continue;
        }
        if (board[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
}

// Handle keyboard input
document.addEventListener('keydown', event => {
  switch (event.keyCode) {
    case 37: // Left arrow
      moveLeft();
      break;
    case 39: // Right arrow
      moveRight();
      break;
    case 40: // Down arrow
      moveDown();
      break;
    case 38: // Up arrow
      rotate();
      break;
  }
});

function draw() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the game board
    for (let r = 0; r < ROW; r++) {
      for (let c = 0; c < COLUMN; c++) {
        if (board[r][c]) {
          let colorIndex = board[r][c] - 1;
          let color = COLORS[colorIndex];
          drawBlock(c, r, color);
        }
      }
    }
  
    // Draw the current piece
    if (currentPiece) {
      for (let r = 0; r < currentPiece.shape.length; r++) {
        let row = currentPiece.shape[r];
      for (let c = 0; c < row.length; c++) {
        if (row[c]) {
          let color = currentPiece.color;
          drawBlock(currentPiece.x + c, currentPiece.y + r, color);
        }
      }
    }
  }
}

// Initialize the game
newPiece();
setInterval(() => {
  draw();
  moveDown();
}, 10000 / FPS);