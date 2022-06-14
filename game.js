import { update as updateSnake, draw as drawSnake, SNAKE_SPEED, getSnakeHead, snakeIntersection, tamanho } from "./snake.js"
import { update as updateFood, draw as drawFood} from "./food.js"
import { outsideGrid } from "./grid.js"
import { getInputDirection, updateInput } from "./input.js";
import { update as updateAuto } from "./automatic.js"

let lastRenderTime = 0
let gameOver = false;
const gameBoard = document.getElementById("game-board")
var slider = document.getElementById("myRange");
var output = document.getElementById("mostrarVelocidade");

function main(currentTime) {
    //Função principal, é repetida constantemente

    //Reiniciar o jogo
    document.getElementById('button').onclick = function() {
        restart()
    }

    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) /1000
    //Não da update quando desnecessário, o tempo é menor quanto maior a velocidade da cobra
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return

    lastRenderTime = currentTime

    //Jogo para de ser atualizado quando é finalizado
    if (!gameOver) {
        update()
    } 
    draw()
}

//Inicia a função principal
window.requestAnimationFrame(main)

function update() {
    //Atualização dos itens do jogo
    //O slider da velocidade indica a velocidade da cobra
    var speed = slider.value
    updateInput()
    updateAuto()
    updateFood()
    updateSnake(speed)
    updateStatus()
    checkDeath()
}

function draw() {
    //A tela é apagada para depois desenhar a cobra e a comida
    gameBoard.innerHTML = ""
    drawFood(gameBoard)
    drawSnake(gameBoard)
}

function checkDeath() {
    //O jogo acaba se a cabeça da cobra for detectada fora do grid ou dentro de si mesma
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
    //O jogo se encerra quando a cobra fica no tamanho máximo
    if (tamanho == 400) {
        gameOver = true
    }
}

//Estátisticas do jogo
var tamanhoStatus = document.getElementById("tamanho")
var passosStatus = document.getElementById("passos")
var passos = 0

function updateStatus() {
    //Se a cobra estiver em movimento a quantidade de passos aumenta
    var input = getInputDirection()
    if ((input.x != 0 || input.y != 0) && tamanho < 400) {
        passos++
    }
    //As estátisticas são alteradas
    tamanhoStatus.innerHTML = "Tamanho: " + tamanho
    passosStatus.innerHTML = "Passos: " + passos
}

//Slider de velocidade
output.innerHTML = "Velocidade " + slider.value + "x";
slider.oninput = function() {
    output.innerHTML = "Velocidade " + this.value + "x";
} 


function restart() {
    //Recarregar página ao resetar o jogo
    window.location.reload()
}