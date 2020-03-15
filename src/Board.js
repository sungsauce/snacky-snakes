import React, { useEffect, useReducer } from 'react'
import SnakeLimb from './SnakeLimb'

const createBoard = size => {
  const rows = new Array(size).fill()
  return rows.map((r, i) => (rows[i] = new Array(size).fill(0)))
}

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


const initialBoardSize = 5
const initialSnake = new SnakeLimb(Math.floor(initialBoardSize/2), Math.floor(initialBoardSize/2) - 1)
const initialState = {
  boardSize: initialBoardSize,
  board: createBoard(initialBoardSize),
  snakeHead: initialSnake,
  snack: getNewSnack(initialBoardSize),
  direction: 'ArrowRight',
  speed: 500
}

// TODO: game over (snake collision)
const reducer = (state, action) => {
  switch (action.type) {
    case 'changeDirection':
      return { ...state, direction: action.direction }
    case 'tick':
      const nextPos = state.snakeHead.getNextPos(
        state.direction,
        state.boardSize
      )

      let snack = state.snack
      let grow = false
      let speed = state.speed
      // if snake is about to eat the snack,
      // grow tail, and replace snack with a new snack
      if (nextPos.row === state.snack.row && nextPos.col === state.snack.col) {
        grow = true
        snack = getNewSnack(state.boardSize, state.snack, state.snakeHead)
        speed = state.speed - 20 > 50 ? state.speed - 20 : 50
      }
      state.snakeHead.move(nextPos, grow)
      return {
        ...state,
        snack,
        speed,
        board: paint(state.snakeHead, snack, state.boardSize)
      }
    default:
  }
}

// store it in a useRef Hook and keep the mutable value in the '.current' property.
let timerId
export default function Board() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    if (timerId) clearInterval(timerId)
    timerId = setInterval(() => dispatch({ type: 'tick' }), state.speed)
    document.addEventListener('keydown', handleKeyDown)
  }, [state.speed]) // empty dependency will ensure this is only run once on component mount

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
