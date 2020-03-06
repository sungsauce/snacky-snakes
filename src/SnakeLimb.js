export default class SnakeLimb {
  constructor(row, col) {
    this.row = row
    this.col = col
    this.next = null
  }
  // TODO: grow method, collision method
  grow = tailDirection => {
    let newLimbRow = this.row
    let newLimbCol = this.col
    switch (tailDirection) {
      case 'ArrowUp':
        newLimbRow = this.row + 1
        break
      case 'ArrowDown':
        newLimbRow = this.row - 1
        break
      case 'ArrowLeft':
        newLimbCol = this.col + 1
        break
      case 'ArrowRight':
        newLimbCol = this.col - 1
        break
      default:
        newLimbRow = null
        newLimbCol = null
    }
    this.next = new SnakeLimb(newLimbRow, newLimbCol)
    return this.next
  }
  // grow = () => {
  //   const newLimb = new SnakeLimb(null, null)
  //   this.next = newLimb
  //   return newLimb
  // }
}