import { getInputDirection } from "./input.js"


export let SNAKE_SPEED = 1
export var tamanho = 1
let snakeBody = [{x: 10, y: 10}]
let newSegments = 0

export function update(speed) {
    //Aumentando a velocidade de acordo com o slider
    SNAKE_SPEED = speed

    //Aumentar o tamanho da cobra
    addSegments()

    //A cauda é apagada e as partes do corpo pulam para a proxima posição
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] }
    }
    
    //A cabeça da cobra se move de acordo com a direção recebida
    const inputDirection = getInputDirection()
    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y
}

export function draw(gameBoard) {
    //Cada parte da cobra tem uma posição no grid
    snakeBody.forEach((segment, index) => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add('snake')
    
        //Altera a cor dessa parte
        color(snakeElement, index)
        
        gameBoard.appendChild(snakeElement)
    })
}

function color(snakeElement, index) {
    //Cores
    var colorB
    var colorG
    if (index == 0) {
        index = 0.1
    }
    //Calcular porcentagem de acordo com o tamanho
    var percent = 1-(index/snakeBody.length)
    
    //Quanto mais próximo da cabeça, maior a porcentagem de azul, e menor porcetagem de verde
    colorB = 255*percent
    colorG = Math.abs(colorB - 255)

    snakeElement.style.backgroundColor = "rgb(0,"+colorG+","+colorB+")"
}

export function expandSnake() {
    //Quando a cobra aumenta, newSegments indica que pode criar uma nova cauda
    newSegments += 1
    //E as estátisticas aumentam
    tamanho++
}

export function onSnake(position, { ignoreHead = false } = {}) {
    //Detecta se determinada posição está em cima da cobra
    //Podendo ignorar a cabeça de acordo com os parametros
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) return false
        return equalPositions(segment, position)
    })
}

export function nextSnake(positionFood) {
    //Detecta se a comida e a cabeça irão se encontrar no próximo passo
    //A cobra cresce quando essa função é verdadeira
    //Dessa forma a cobra já está crescida quando colide com a comida
    //Evitando que a cobra morra por falta de espaço ao crescer
    var inputDirection = getInputDirection()
    var positionHead =  { x: snakeBody[0].x + inputDirection.x, y: snakeBody[0].y + inputDirection.y }
    return equalPositions(positionFood, positionHead)
}

export function getSnakeHead() {
    //Retorna a cabeça
    return snakeBody[0]
}

export function snakeIntersection() {
    //Detecta se a cobra acertou ela mesma
    //A cabeça é ignorada, pois ela é o alvo da colisão
    return onSnake(snakeBody[0], { ignoreHead: true })
}

export function equalPositions(pos1, pos2) {
    //Retorna verdadeiro se as duas posições forem iguais
    return pos1.x === pos2.x && pos1.y === pos2.y
}

function addSegments() {
    //A calda criada é uma cópia na última posição que a calda esteve antes de crescer
    //newSegments determina se ela cresceu ou não nesse update
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
    }
    newSegments = 0
}


