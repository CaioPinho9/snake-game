import { getSnakeHead } from "./snake.js"

const GRID_SIZE = 20

export function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * GRID_SIZE) + 1,
        y: Math.floor(Math.random() * GRID_SIZE) + 1
    }
}

export function outsideGrid(position) {
    return (
        position.x < 1 || position.x > GRID_SIZE ||
        position.y < 1 || position.y > GRID_SIZE
    )
}

export function gridDirection() {
    var position = getSnakeHead()
    var inputDirection = [{ x: 0, y: 0}, { x: 0, y: 0}]
    if (checkbox.checked) {
        if (position.y % 2 != 0) {
            inputDirection[0].x = 1
        } else {
            inputDirection[0].x = -1
        }

        if (position.x % 2 == 0) {
            inputDirection[1].y = 1
        } else {
            inputDirection[1].y = -1
        }
        return inputDirection
    }
}