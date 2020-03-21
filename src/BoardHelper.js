import SnakeLimb from './SnakeLimb'

export const createBoard = size => {
  const rows = new Array(size).fill()
  return rows.map((r, i) => (rows[i] = new Array(size).fill(0)))
}

export const paint = (snake, snack, boardSize) => {
  const board = createBoard(boardSize)
  board[snack.row][snack.col] = 2
  let limb = snake
  while (limb) {
    board[limb.row][limb.col] = 1
    limb = limb.next
  }
  return board
}

/**
 * get a new snack that is not at the same
 * location as either the snack OR the snake
 * @param {number} boardSize 
 * @param {object} snack 
 * @param {SnakeLimb} snake 
 */
export const getNewSnack = (boardSize, snack = {row: null, col: null}, snake = new SnakeLimb()) => {

  function getNewLoc() {
    let row = Math.floor(Math.random() * boardSize)
    let col = Math.floor(Math.random() * boardSize)
    return {row, col}
  }

  let {row, col} = getNewLoc()
  
  // if after checking snake and no collisions there, return location
  while (true) {
    let snackCollision = row === snack.row && col === snack.col
    let snakeCollision = true // possibly true
    
    // if there's a snack collision, get a new location
    if (snackCollision) {
      let newLoc = getNewLoc()
      row = newLoc.row
      col = newLoc.col
    // if there's NO snack collision, loop through snake to check
    } else {
      let limb = snake
      while (limb) {
        if (row === limb.row && col === limb.col) {
          let newLoc = getNewLoc()
          row = newLoc.row
          col = newLoc.col
          // stop looping through snake if collision is found
          break
        // if at the tail and no collisions, can safely say so
        } else if (!limb.next) {
          snakeCollision = false
        }
        limb = limb.next
      }
    }
    if (!snakeCollision && !snackCollision) break
  }

  return {row, col}
}
