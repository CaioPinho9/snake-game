import {
  update as updateSnake,
  draw as drawSnake,
  SNAKE_SPEED,
  getSnakeHead,
  snakeIntersection,
  tamanho,
} from "./snake.js";
import { update as updateFood, draw as drawFood } from "./food.js";
import { outsideGrid, GRID_SIZE } from "./grid.js";
import { getInputDirection, updateInput } from "./input.js";
import { update as updateAuto } from "./automatic.js";

let lastRenderTime = 0;
let gameOver = false;
const gameBoard = document.getElementById("game-board");
var slider = document.getElementById("myRange");
var output = document.getElementById("mostrarVelocidade");

var tamanhoSlider = document.getElementById("myRange2");
var outputTamanho = document.getElementById("mostrarTamanho");

let startTime = Date.now();

let lastAuto = false;
let passossList = [];
let lastPassos = 0;
let lastTime = 0;

function main(currentTime) {
  //Função principal, é repetida constantemente

  //Reiniciar o jogo
  document.getElementById("button").onclick = function () {
    restart();
  };

  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  //Não da update quando desnecessário, o tempo é menor quanto maior a velocidade da cobra
  if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;

  lastRenderTime = currentTime;

  //Jogo para de ser atualizado quando é finalizado
  if (!gameOver) {
    update();
  }
  draw();
}

//Inicia a função principal
window.requestAnimationFrame(main);

function update() {
  //Atualização dos itens do jogo
  //O slider da velocidade indica a velocidade da cobra
  var speed = (slider.value * 61) / 100;

  if (checkbox.checked && !lastAuto) {
    startTime = Date.now();
    lastAuto = true;
  }
  updateInput();
  updateAuto();
  updateFood();
  updateSnake(speed);
  updateStatus();
  checkDeath();
}

function draw() {
  //A tela é apagada para depois desenhar a cobra e a comida
  gameBoard.innerHTML = "";
  drawFood(gameBoard);
  drawSnake(gameBoard);
}

function checkDeath() {
  //O jogo acaba se a cabeça da cobra for detectada fora do grid ou dentro de si mesma
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
  //O jogo se encerra quando a cobra fica no tamanho máximo
  if (tamanho == GRID_SIZE * GRID_SIZE) {
    gameOver = true;
  }
}

//Estátisticas do jogo
var tamanhoStatus = document.getElementById("tamanho");
var passosStatus = document.getElementById("passos");
var passosSStatus = document.getElementById("passoss");
var timeStatus = document.getElementById("time");
var passos = 0;

function updateStatus() {
  //Se a cobra estiver em movimento a quantidade de passos aumenta
  var input = getInputDirection();
  if ((input.x != 0 || input.y != 0) && tamanho < GRID_SIZE * GRID_SIZE) {
    passos++;
  }
  //As estátisticas são alteradas
  tamanhoStatus.innerHTML = "Tamanho: " + tamanho;
  passosStatus.innerHTML = "Passos: " + passos;

  let time = (Date.now() - startTime) / 1000;

  if (time > 0 && time - lastTime > 1) {
    let passoss = (passos - lastPassos) / (time - lastTime);
    lastPassos = passos;
    lastTime = time;
    passossList.push(passoss);
    if (passossList.length > 10) {
      passossList.shift();
    }
    let avgPassoss = Math.round(
      passossList.reduce((a, b) => a + b, 0) / passossList.length
    );

    passosSStatus.innerHTML = "Passos/s: " + avgPassoss;
  }

  if (tamanho < GRID_SIZE * GRID_SIZE - 1)
    timeStatus.innerHTML = "Tempo: " + Math.round(time) + "s";
}

//Slider de velocidade
output.innerHTML = "Velocidade " + slider.value + "x";
slider.oninput = function () {
  output.innerHTML = "Velocidade " + this.value + "x";
};

//Slider de tamanho
outputTamanho.innerHTML = "Tamanho " + tamanhoSlider.value;
tamanhoSlider.oninput = function () {
  outputTamanho.innerHTML = "Tamanho " + this.value;
};

// Set game-board grid size
gameBoard.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;
gameBoard.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

function restart() {
  //Recarregar página ao resetar o jogo
  window.location.reload();
}
