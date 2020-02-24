import React, { useState, useEffect, useReducer } from 'react';

const initialState = {
  board: 11,
  row: 5,
  col: 5,
  length: 1,
  direction: "right"
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'tick':
      switch (state.direction) {
        case 'up':
          return {...state, row: state.row === 0 ? state.board - 1 : --state.row}
        case 'down':
          return {...state, row: state.row === state.board - 1 ? 0 : ++state.row}
        case 'left':
          return {...state, col: state.col === 0 ? state.board - 1 : --state.col}
        case 'right':
          return {...state, col: state.col === state.board - 1 ? 0 : ++state.col}
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
    }, 1000)
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
  
  return (
    <div>
      <table>
        <tbody>
          {new Array(state.board).fill(0).map((row, rowIdx) => (
            <tr key={rowIdx}>
              {new Array(state.board).fill(0).map((col, colIdx) => (
                <td key={colIdx} className={(rowIdx === state.row && colIdx === state.col) ? "snake" : null}></td>
              ))}
            </tr>      
          ))}
        </tbody>
      </table>
    </div>
  )
}