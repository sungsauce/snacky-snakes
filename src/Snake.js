import React, { useState, useEffect, useReducer } from 'react'
import SnakeLimb from './SnakeLimb'

const initialState = {
  boardSize: 11,
  board: new Array(11).fill(new Array(11).fill(0)),
  snakeHead: new SnakeLimb(5, 5),
  length: 1,
  // snack: [0,0], // row, col
  // direction: 'right',
  speed: 1000
}

// TODO: movement/lag, food, eating, snake growth, game over (snake collision)
const reducer = (state, action) => {
  switch (action.type) {
    case 'move':
      propogate(state.snakeHead, action.nextPos)
      return { ...state, snakeHead: state.snakeHead }
    case 'tick':
      return { ...state, board: paint(state.snakeHead) }
    default:
  }
}

// paint the board according to the snake
function paint(snake) {
  const board = initialState.board

  let limb = snake
  console.log('snake: ', limb)
  while (limb) {
    board[limb.row][limb.col] = 1
    limb = limb.next
    // console.log("board in while loop: ", board)
  }
  return board
}

function propogate(limb, nextPos) {
  const { row, col } = limb
  const { nextRow = row, nextCol = col } = nextPos
  limb.row = nextRow
  limb.col = nextCol
  if (limb.next) {
    propogate(limb.next, { row, col })
  }
}

export default function Board() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    setInterval(() => dispatch({ type: 'tick' }), state.speed)
    document.addEventListener('keydown', handleKeyDown)
  }, []) // empty dependency to ensure this is only run once on component mount

  const handleKeyDown = evt => {
    const { row, col } = state.snakeHead
    let nextPos
    switch (evt.key) {
      case 'ArrowUp':
        nextPos = { row: row === 0 ? state.boardSize - 1 : row - 1, col }
        break
      case 'ArrowDown':
        nextPos = { row: row === state.boardSize - 1 ? 0 : row + 1, col }
        break
      case 'ArrowLeft':
        nextPos = { row, col: col === 0 ? state.boardSize - 1 : col - 1 }
        break
      case 'ArrowRight':
        nextPos = { row, col: col === state.boardSize - 1 ? 0 : col + 1 }
        break
      default:
    }

    if (nextPos) dispatch({ type: 'move', nextPos })
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
