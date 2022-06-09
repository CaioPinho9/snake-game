import { getInputDirection } from "./input.js"


export let SNAKE_SPEED = 1
export var tamanho = 1
let snakeBody = [{x: 10, y: 10}]
let newSegments = 0

export function update(speed) {
    SNAKE_SPEED = speed
    addSegments()
    const inputDirection = getInputDirection()
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] }
    }

    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y
}

export function draw(gameBoard) {
    snakeBody.forEach((segment, index) => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add('snake')
    
        color(snakeElement, index)
        
        gameBoard.appendChild(snakeElement)
    })
}

function color(snakeElement, index) {
    var colorB
    var colorG
    if (index == 0) {
        index = 0.1
    }
    var percent = 1-(index/snakeBody.length)

    colorB = 255*percent
    colorG = Math.abs(colorB - 255)

    snakeElement.style.backgroundColor = "rgb(0,"+colorG+","+colorB+")"
    
}

export function expandSnake() {
    newSegments += 1
    tamanho++
}

export function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) return false
        return equalPositions(segment, position)
    })
}

export function nextSnake(positionFood) {
    var inputDirection = getInputDirection()
    var positionHead =  { x: snakeBody[0].x + inputDirection.x, y: snakeBody[0].y + inputDirection.y }
    return equalPositions(positionFood, positionHead)
}

export function getSnakeHead() {
    return snakeBody[0]
}

export function snakeIntersection() {
    return onSnake(snakeBody[0], { ignoreHead: true })
}

export function snakeRestart() {
    snakeBody = [{x: 13, y: 13}]
    newSegments = 0
    tamanho = 1

}

export function equalPositions(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y
}

function addSegments() {
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
    }
    newSegments = 0
}


