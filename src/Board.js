import React, { useEffect, useReducer } from 'react'
import SnakeLimb from './SnakeLimb'

const createBoard = size => {
  const rows = new Array(size).fill()
  return rows.map((r, i) => (rows[i] = new Array(size).fill(0)))
}

// TODO: make this work
const getSnackLoc = (boardSize, snack = {row: null, col: null}, snake = {row: null, col: null, next: null}) => {
  let row = snack.row
  let col = snack.col

  // new snack should be in a different location,
  // and not overlap with the snake body
  while (row === snack.row && col === snack.col) {
    row = Math.floor(Math.random() * boardSize)
    col = Math.floor(Math.random() * boardSize)
  }
  
  let limb = snake

  while (limb) {
    if (row === limb.row && col === limb.col) {
      row = Math.floor(Math.random() * boardSize)
      col = Math.floor(Math.random() * boardSize)
    }
    limb = limb.next
  }

  return {row, col}
}

const initialBoardSize = 5
const initialSnake = new SnakeLimb(Math.floor(initialBoardSize/2), Math.floor(initialBoardSize/2) - 1)
const initialState = {
  boardSize: initialBoardSize,
  board: createBoard(initialBoardSize),
  snakeHead: initialSnake,
  snakeTail: initialSnake,
  snack: getSnackLoc(initialBoardSize),
  direction: 'ArrowRight',
  speed: 500
}

// TODO: game over (snake collision)
const reducer = (state, action) => {
  switch (action.type) {
    case 'changeDirection':
      return { ...state, direction: action.direction }
    case 'tick':
      // find out the snake's next position,
      // given the current position and direction
      const nextPos = getNextHeadPos(
        state.snakeHead,
        state.direction,
        state.boardSize
      )
      // if snake is about to eat the snack,
      // grow tail, eat snack and create a new snack
      let tail = state.snakeTail
      let snack = state.snack
      if (nextPos.row === state.snack.row && nextPos.col === state.snack.col) {
        tail = state.snakeTail.grow()
        snack = getSnackLoc(state.boardSize, state.snack, state.snakeHead)
      }
      // update the snake LL
      moveSnake(state.snakeHead, nextPos)
      return {
        ...state,
        snakeTail: tail,
        snack: snack,
        board: paint(state.snakeHead, snack, state.boardSize)
      }
    default:
  }
}

const getNextHeadPos = (snake, direction, boardSize) => {
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
      nextPos = { row, col }
  }
  return nextPos
}

const moveSnake = (limb, nextPos) => {
  const { row, col } = limb
  const { row: nextRow, col: nextCol } = nextPos
  limb.row = nextRow
  limb.col = nextCol
  if (limb.next) {
    moveSnake(limb.next, { row, col })
  }
}

// paint the board according to the snake
const paint = (snake, snack, boardSize) => {
  const board = createBoard(boardSize)
  board[snack.row][snack.col] = 2
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
    setInterval(() => dispatch({ type: 'tick' }), state.speed)
    document.addEventListener('keydown', handleKeyDown)
  }, [state.speed]) // empty dependency to ensure this is only run once on component mount

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
                <td key={colIdx} className={col ? (col > 1 ? 'snack' : 'snake') : null}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
