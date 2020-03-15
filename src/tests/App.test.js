import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import {getNewSnack, moveSnake} from '../Board'
import SnakeLimb from '../SnakeLimb'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('getNewSnack works', () => {
  const boardSize = 2
  const snack = {row: 0, col: 0}
  const snake = new SnakeLimb(1, 1)
  
  let newSnack = getNewSnack(boardSize, snack, snake)
  expect(newSnack).not.toMatchObject(snack)
  expect(newSnack).not.toMatchObject(snake)

  newSnack = getNewSnack(boardSize, snack, snake)
  expect(newSnack).not.toMatchObject(snack)
  expect(newSnack).not.toMatchObject(snake)

  newSnack = getNewSnack(boardSize, snack, snake)
  expect(newSnack).not.toMatchObject(snack)
  expect(newSnack).not.toMatchObject(snake)

  newSnack = getNewSnack(boardSize, snack, snake)
  expect(newSnack).not.toMatchObject(snack)
  expect(newSnack).not.toMatchObject(snake)
})

// it('moveSnake works', () => {
//   const snakeHead = new SnakeLimb(1, 1)
//   const snakeTail = snakeHead.grow('ArrowRight')
//   const nextPos = {row: 1, col: 2}
//   let newTail = moveSnake(snakeHead, nextPos)

//   expect(newTail).toMatchObject({row: 1, col: 1})
// })

it('move works', () => {
  const snakeHead = new SnakeLimb(1, 1)
  const snakeTail = new SnakeLimb(1, 0)
  snakeHead.next = snakeTail
  const nextPos = {row: 1, col: 2}

  snakeHead.move(nextPos)
  expect(snakeHead).toMatchObject({row: 1, col: 2})
  expect(snakeTail).toMatchObject({row: 1, col: 1})
})

it('move works when grow is passed in', () => {
  const snakeHead = new SnakeLimb(1, 1)
  const nextPos = {row: 1, col: 2}

  snakeHead.move(nextPos, true)
  expect(snakeHead).toMatchObject({row: 1, col: 2})
  expect(snakeHead.next).toMatchObject({row: 1, col: 1})

  snakeHead.move({row: 1, col: 3})
  expect(snakeHead).toMatchObject({row: 1, col: 3})
  expect(snakeHead.next).toMatchObject({row: 1, col: 2})
  expect(snakeHead.next.next).toBe(null)
})