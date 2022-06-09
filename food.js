import { onSnake, expandSnake, nextSnake, tamanho } from "./snake.js"
import { randomGridPosition as randomGridPosition} from "./grid.js"

export let food = getRandomFoodPosition()

export function update() {
    if (nextSnake(food) || tamanho == 399) {
        expandSnake()
    }

    if (onSnake(food)) {
        food = getRandomFoodPosition()
    }
}

export function draw(gameBoard) {
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    gameBoard.appendChild(foodElement)
}

function getRandomFoodPosition() {
    let newFoodPosition

    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition()
    }
    return newFoodPosition
}