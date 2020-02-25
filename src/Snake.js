import React, { useState, useEffect, useReducer } from 'react';

const initialState = {
  board: 11,
  // snake: [5,5], // row, col
  snakeRow: 5,
  snakeCol: 5,
  snackRow: 0,
  snackCol: 0,
  // snack: [0,0], // row, col
  length: 1,
  direction: "right",
  speed: 1000,
}

// TODO: food appearance, eating, snake growth, game over (snake collision)
const reducer = (state, action) => {
  switch (action.type) {
    case 'tick':
      switch (state.direction) {
        case 'up':
          return {...state, snakeRow: state.snakeRow === 0 ? state.board - 1 : --state.snakeRow}
        case 'down':
          return {...state, snakeRow: state.snakeRow === state.board - 1 ? 0 : ++state.snakeRow}
        case 'left':
          return {...state, snakeCol: state.snakeCol === 0 ? state.board - 1 : --state.snakeCol}
        case 'right':
          return {...state, snakeCol: state.snakeCol === state.board - 1 ? 0 : ++state.snakeCol}
        default:
      }
      break
    case 'moveUp':
      return {...state, direction: 'up'}
    case 'moveDown':
      return {...state, direction: 'down'}
    case 'moveLeft':
      return {...state, direction: 'left'}
    case 'moveRight':
      return {...state, direction: 'right'}
    default:
  }
}

export default function Board() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    setInterval(() => {
      dispatch({type: "tick"})
    }, state.speed)
    document.addEventListener("keydown", handleKeyDown)
  }, []);
  
  const handleKeyDown = (evt) => {
    switch (evt.key) {
      case "ArrowUp":
        dispatch({type: 'moveUp'})
        break
      case "ArrowDown":
        dispatch({type: 'moveDown'})
        break
      case "ArrowLeft":
        dispatch({type: 'moveLeft'})
        break
      case "ArrowRight":
        dispatch({type: 'moveRight'})
        break
      default:
    }
  }

  switch (state.direction) {
    case 'right':
      
      break
    default:
  }
  
  return (
    <div>
      <table>
        <tbody>
          {new Array(state.board).fill(0).map((row, rowIdx) => (
            <tr key={rowIdx}>
              {new Array(state.board).fill(0).map((col, colIdx) => (
                <td key={colIdx} className={(rowIdx === state.snakeRow && colIdx === state.snakeCol) ? "snake" : null}></td>
              ))}
            </tr>      
          ))}
        </tbody>
      </table>
    </div>
  )
}