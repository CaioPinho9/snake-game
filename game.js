import { update as updateSnake, draw as drawSnake, SNAKE_SPEED, getSnakeHead, snakeIntersection, snakeRestart, tamanho } from "./snake.js"
import { update as updateFood, draw as drawFood} from "./food.js"
import { outsideGrid } from "./grid.js"
import { getInputDirection, inputRestart } from "./input.js";

let lastRenderTime = 0
let gameOver = false;
const gameBoard = document.getElementById("game-board")
var slider = document.getElementById("myRange");
var output = document.getElementById("mostrarVelocidade");


function main(currentTime) {
    if (gameOver) {
        if (confirm("Aperte OK para reiniciar.")) {
            restart()
        }
    } 
    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) /1000
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return

    lastRenderTime = currentTime

    update()
    draw()
}

window.requestAnimationFrame(main)

function update() {
    var speed = slider.value
    updateSnake(speed)
    updateFood()
    checkDeath()
    updateStatus()
}

function draw() {
    gameBoard.innerHTML = ""
    drawSnake(gameBoard)
    drawFood(gameBoard)
}

function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}



var tamanhoStatus = document.getElementById("tamanho")
var passosStatus = document.getElementById("passos")
var passos = 0

function updateStatus() {
    var input = getInputDirection()
    if (input.x != 0 || input.y != 0) {
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
    gameOver = false
    snakeRestart()
    inputRestart()
    passos = 0

}