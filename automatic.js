import { food } from "./food.js";
import { gridDirection } from "./grid.js";
import { setInputDirection } from "./input.js";
import { getSnakeHead } from "./snake.js";

export function update() {
    if (checkbox.checked) {
        var nextDistance = distance()
        var inputDirection = gridDirection()
        if (nextDistance[0] < nextDistance[1] && nextDistance[0].x + nextDistance[0].y != 0) {
            setInputDirection(inputDirection[0])
        } else if (nextDistance[0] > nextDistance[1] && nextDistance[1].x + nextDistance[1].y != 0) {
            setInputDirection(inputDirection[1])
        } else {
            setInputDirection(inputDirection[Math.round(Math.random())])
        }
    }
}

function nextPosition() {
    var headPosition = getSnakeHead()
    var inputDirection = gridDirection()
    var position = [{ x: 0, y: 0 }, { x: 0, y: 0 }]
    position[0].x = headPosition.x + inputDirection[0].x
    position[0].y = headPosition.y + inputDirection[0].y
    position[1].x = headPosition.x + inputDirection[1].x
    position[1].y = headPosition.y + inputDirection[1].y
    return position
}

function checkDeath(position) {
    position.forEach(input => {
        if (outsideGrid(position) || onSnake(position, { ignoreHead: true })) {
            input.x = 0
            input.y = 0
        }
    });
}

function distance() {
    var pos1 = food
    var pos2 = nextPosition()
    var nextDistance = []
    nextDistance[0] = Math.sqrt(Math.pow(pos2[0].x-pos1.x,2) + Math.pow(pos2[0].y-pos1.y,2))
    nextDistance[1] = Math.sqrt(Math.pow(pos2[1].x-pos1.x,2) + Math.pow(pos2[1].y-pos1.y,2))
    return nextDistance
}