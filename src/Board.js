import React, { useEffect, useReducer } from 'react'
import SnakeLimb from './SnakeLimb'
import {createBoard, paint, getNewSnack} from './BoardHelper'

const initialBoardSize = 11
const initialSnake = new SnakeLimb(Math.floor(initialBoardSize/2), Math.floor(initialBoardSize/2) - 1)
const initialState = {
  boardSize: initialBoardSize,
  board: createBoard(initialBoardSize),
  snakeHead: initialSnake,
  snack: getNewSnack(initialBoardSize),
  direction: 'ArrowRight',
  speed: 500,
  gameover: false
}

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
      let speed = state.speed
      let grow = false
      // if snake is about to eat the snack,
      // grow tail, and replace snack with a new snack
      if (nextPos.row === snack.row && nextPos.col === snack.col) {
        grow = true
        snack = getNewSnack(state.boardSize, state.snack, state.snakeHead)
        speed = state.speed - 20 > 50 ? state.speed - 20 : 50
      }
      // if snake is about to collide with itself,
      // gameover!
      const isGameOver = state.snakeHead.move(nextPos, grow)
      return {
        ...state,
        snack,
        speed,
        board: paint(state.snakeHead, snack, state.boardSize),
        gameover: !!isGameOver
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
    // if speed changes, start a new setInterval timer at the new speed
    if (timerId) clearInterval(timerId)
    timerId = setInterval(() => dispatch({ type: 'tick' }), state.speed)
    document.addEventListener('keydown', handleKeyDown)
  }, [state.speed]) // empty dependency will ensure this is only run once on component mount

  const handleKeyDown = evt => {
    const direction = evt.key
    dispatch({ type: 'changeDirection', direction })
  }

  if (state.gameover) {
    clearInterval(timerId)
    alert("GAME OVER!!")
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
