import { food } from "./food.js";
import { outsideGrid, gridDirection } from "./grid.js";
import { setInputDirection } from "./input.js";
import { onSnake, getSnakeHead, getSnakeTail, equalPositions } from "./snake.js";

export function update() {
    if (checkbox.checked) {
        var nextDistance = distance()
        var inputDirection = gridDirection()
        var colision = checkDeath()
        if (nextDistance[0] < nextDistance[1] && !colision) {
            setInputDirection(inputDirection[0])
        } else if (nextDistance[0] > nextDistance[1] && !colision) {
            setInputDirection(inputDirection[1])
        } else if (!colision) {
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

function checkDeath() {
    var position = nextPosition()
    var horizontalColision = false
    var verticalColision = false
    
    if (outsideGrid(position[0]) || onSnake(position[0], { ignoreHead: true })) {
        horizontalColision = true
    }

    if (outsideGrid(position[1]) || onSnake(position[1], { ignoreHead: true })) {
        verticalColision = true 
    }

    return decidePath(horizontalColision, verticalColision)
    
}

function decidePath(horizontalColision, verticalColision) {
    var inputDirection = gridDirection()
    if (horizontalColision && verticalColision) {
        //seguir cauda
        var position = nextPosition()
        position.forEach((pos1, index) => {
            if (equalPositions(pos1, getSnakeTail())) {
                setInputDirection(inputDirection[index])
            }
        });
        return true
    }

    if (horizontalColision && !verticalColision) {
        //horizontal
        setInputDirection(inputDirection[1])
        return true
    }

    if (!horizontalColision && verticalColision) {
        //vertical
        setInputDirection(inputDirection[0])
        return true
    }

    if (!horizontalColision && !verticalColision) {
        return false
    }
}

function distance() {
    var pos1 = food
    var pos2 = nextPosition()
    var nextDistance = []
    nextDistance[0] = Math.sqrt(Math.pow(pos2[0].x-pos1.x,2) + Math.pow(pos2[0].y-pos1.y,2))
    nextDistance[1] = Math.sqrt(Math.pow(pos2[1].x-pos1.x,2) + Math.pow(pos2[1].y-pos1.y,2))
    return nextDistance
}