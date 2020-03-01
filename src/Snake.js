import React, { useState, useEffect, useReducer } from 'react'

const initialState = {
  board: 11,
  snakeRow: 5,
  snakeCol: 5,
  snackRow: 0,
  snackCol: 0,
  // snack: [0,0], // row, col
  length: 3,
  direction: 'right',
  speed: 1000
}

// TODO: food appearance, eating, snake growth, game over (snake collision)
const reducer = (state, action) => {
  switch (action.type) {
    case 'tick':
      switch (state.direction) {
        case 'up':
          return {
            ...state,
            snakeRow: state.snakeRow === 0 ? state.board - 1 : --state.snakeRow
          }
        case 'down':
          return {
            ...state,
            snakeRow: state.snakeRow === state.board - 1 ? 0 : ++state.snakeRow
          }
        case 'left':
          return {
            ...state,
            snakeCol: state.snakeCol === 0 ? state.board - 1 : --state.snakeCol
          }
        case 'right':
          return {
            ...state,
            snakeCol: state.snakeCol === state.board - 1 ? 0 : ++state.snakeCol
          }
        default:
      }
      break
    case 'moveUp':
      return { ...state, direction: 'up' }
    case 'moveDown':
      return { ...state, direction: 'down' }
    case 'moveLeft':
      return { ...state, direction: 'left' }
    case 'moveRight':
      return { ...state, direction: 'right' }
    default:
  }
}

export default function Board() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    setInterval(() => {
      dispatch({ type: 'tick' })
    }, state.speed)
    document.addEventListener('keydown', handleKeyDown)
  }, [])

  const handleKeyDown = evt => {
    switch (evt.key) {
      case 'ArrowUp':
        dispatch({ type: 'moveUp' })
        break
      case 'ArrowDown':
        dispatch({ type: 'moveDown' })
        break
      case 'ArrowLeft':
        dispatch({ type: 'moveLeft' })
        break
      case 'ArrowRight':
        dispatch({ type: 'moveRight' })
        break
      default:
    }
  }

  let snakeHead = { row: state.snakeRow, col: state.snakeCol }
  let snakeTail

  switch (state.direction) {
    case 'right':
      snakeTail = { row: snakeHead.row, col: snakeHead.col - state.length + 1 }
      break
    case 'left':
      snakeTail = { row: snakeHead.row, col: snakeHead.col + state.length - 1 }
      break
    case 'up':
      snakeTail = { row: snakeHead.row + state.length - 1, col: snakeHead.col }
      break
    case 'down':
      snakeTail = { row: snakeHead.row - state.length + 1, col: snakeHead.col }
      break
    default:
  }

  const rowRange = [snakeHead.row, snakeTail.row].sort((a, b) => a - b)
  const colRange = [snakeHead.col, snakeTail.col].sort((a, b) => a - b)

  return (
    <div>
      <table>
        <tbody>
          {new Array(state.board).fill(0).map((row, rowIdx) => (
            <tr key={rowIdx}>
              {new Array(state.board).fill(0).map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={
                    rowIdx >= rowRange[0] &&
                    rowIdx <= rowRange[1] &&
                    colIdx >= colRange[0] &&
                    colIdx <= colRange[1]
                      ? 'snake'
                      : null
                  }
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
