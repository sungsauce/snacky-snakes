import React, { useEffect, useReducer } from 'react'
import SnakeLimb from './SnakeLimb'

const createBoard = size => {
  const rows = new Array(size).fill()
  return rows.map((r, i) => rows[i] = new Array(size).fill(0))
}

const initialState = {
  boardSize: 11,
  board: createBoard(11),
  snakeHead: new SnakeLimb(5, 4),
  length: 1,
  // snack: [0,0], // row, col
  direction: 'ArrowRight',
  speed: 1000
}

// TODO: movement/lag, food, eating, snake growth, game over (snake collision)
const reducer = (state, action) => {
  switch (action.type) {
    case 'changeDirection':
      return { ...state, direction: action.direction }
    case 'move':
      // update the snake, given the head and direction
      const nextPos = getNextPos(state.snakeHead, state.direction, state.boardSize)
      propogate(state.snakeHead, nextPos)
      // update the board
      return { ...state, snakeHead: state.snakeHead, board: paint(state.snakeHead, state.boardSize) }
    default:
  }
}

const propogate = (limb, nextPos) => {
  const { row, col } = limb
  const { row: nextRow, col: nextCol } = nextPos
  limb.row = nextRow
  limb.col = nextCol
  if (limb.next) {
    propogate(limb.next, { row, col })
  }
}

const getNextPos = (snake, direction, boardSize) => {
  const { row, col } = snake
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
      nextPos = {row, col}
  }
  return nextPos
}
// paint the board according to the snake
const paint = (snake, boardSize) => {
  const board = createBoard(boardSize)
  let limb = snake
  while (limb) {
    board[limb.row][limb.col] = 1
    limb = limb.next
  }
  return board
}


export default function Board() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    setInterval(() => dispatch({ type: 'move' }), state.speed)
    document.addEventListener('keydown', handleKeyDown)
  }, []) // empty dependency to ensure this is only run once on component mount

  const handleKeyDown = evt => {
    const direction = evt.key
    dispatch({ type: 'changeDirection', direction })
  }


  return (
    <div>
      <table>
        <tbody>
          {state.board.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((col, colIdx) => (
                <td key={colIdx} className={col ? 'snake' : null}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
