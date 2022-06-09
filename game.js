import { update as updateSnake, draw as drawSnake, SNAKE_SPEED, getSnakeHead, snakeIntersection, tamanho } from "./snake.js"
import { update as updateFood, draw as drawFood} from "./food.js"
import { outsideGrid } from "./grid.js"
import { getInputDirection, updateInput } from "./input.js";
import { finish, update as updateAuto } from "./automatic.js"

let lastRenderTime = 0
let gameOver = false;
const gameBoard = document.getElementById("game-board")
var slider = document.getElementById("myRange");
var output = document.getElementById("mostrarVelocidade");

function main(currentTime) {
    if (finish) {
        if (confirm("Parabéns, você venceu!")) {
            restart()
        }
    } 
    if (gameOver) {
        if (confirm("Aperte OK para reiniciar.")) {
            restart()
        }
    } 
    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) /1000
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return

    lastRenderTime = currentTime

    if (!gameOver && !finish) {
        update()
    } 
    draw()
}

window.requestAnimationFrame(main)

function update() {
    var speed = slider.value
    updateInput()
    updateAuto()
    updateFood()
    updateSnake(speed)
    updateStatus()
    checkDeath()
}

function draw() {
    gameBoard.innerHTML = ""
    drawFood(gameBoard)
    drawSnake(gameBoard)
}

function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
    if (tamanho == 400) {
        finish = true
    }
}

var tamanhoStatus = document.getElementById("tamanho")
var passosStatus = document.getElementById("passos")
var passos = 0

function updateStatus() {
    var input = getInputDirection()
    if ((input.x != 0 || input.y != 0) && tamanho < 400) {
        passos++
    }
    tamanhoStatus.innerHTML = "Tamanho: " + tamanho
    passosStatus.innerHTML = "Passos: " + passos
    
}

output.innerHTML = "Velocidade " + slider.value + "x";
slider.oninput = function() {
    output.innerHTML = "Velocidade " + this.value + "x";
} 

function restart() {
    window.location.reload()

}