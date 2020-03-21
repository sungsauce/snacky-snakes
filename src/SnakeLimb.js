export default class SnakeLimb {
  constructor(row, col) {
    this.row = row
    this.col = col
    this.next = null
  }

  /**
   * call on snakeHead to find out next position,
   * given the boardSize and direction
   */
  getNextPos(direction, boardSize) {
    const { row, col } = this
    let nextPos
    switch (direction) {
      case 'ArrowUp':
        nextPos = { row: row === 0 ? boardSize - 1 : row - 1, col }
        break
      case 'ArrowDown':
        nextPos = { row: row === boardSize - 1 ? 0 : row + 1, col }
        break
      case 'ArrowLeft':
        nextPos = { row, col: col === 0 ? boardSize - 1 : col - 1 }
        break
      case 'ArrowRight':
        nextPos = { row, col: col === boardSize - 1 ? 0 : col + 1 }
        break
      default:
        nextPos = { row, col }
    }
    return nextPos
  }

  /**
   * Call on snakeHead, given nextPos
   * Return true (gameover) if collision with self is imminent
   */
  move(nextPos, grow = false, headPos = null) {
    // if head's nextPos matches any of its limbs' nextPos
    if (headPos && nextPos.row === headPos.row && nextPos.col === headPos.col) {
      return true
    }

    // on initial call, set headPos parameter to the head's next position
    if (!headPos) {
      headPos = nextPos
    }

    const { row, col } = this
    const { row: nextRow, col: nextCol } = nextPos
    this.row = nextRow
    this.col = nextCol

    if (this.next) {
      return this.move.call(this.next, { row, col }, grow, headPos)
    } else if (grow) {
      this.next = new SnakeLimb(row, col)
    }
  }
}
