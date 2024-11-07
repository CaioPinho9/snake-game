import {
  update as updateSnake,
  draw as drawSnake,
  getSnakeHead,
  snakeIntersection,
  resetSnake,
  size,
} from "./snake.js";
import { update as updateFood, draw as drawFood, resetFood } from "./food.js";
import { outsideGrid } from "./grid.js";
import { getInputDirection, updateInput } from "./input.js";
import { update as updateAuto } from "./automatic.js";

const gameBoard = document.getElementById("game-board");
var speedSlider = document.getElementById("speedSlider");
var speedOutput = document.getElementById("speedOutput");

var sizeSlider = document.getElementById("sizeSlider");
var sizeOutput = document.getElementById("sizeOutput");

let startTime = Date.now();

let gameOver = false;
let lastRenderTime = 0;
let lastUpdateTime = 0;
let lastAuto = false;
let lastTime = 0;
let lastSteps = 0;
let stepsPerSecondList = [];

let gridSize = sizeSlider.value;
let speed = speedSlider.value;
let lastGridSize = 0;

resetSnake();
resetFood();

function main(currentTime) {
  //O slider da velocidade indica a speed da cobra
  speed = speedSlider.value;
  updateGridSize();

  if (checkbox.checked && !lastAuto) {
    startTime = Date.now();
    lastAuto = true;
  }

  window.requestAnimationFrame(main);
  const secondsSinceLastRender = currentTime - lastRenderTime;

  // Render only when necessary
  if (secondsSinceLastRender < 1000 / speed) return;

  lastRenderTime = currentTime;
  draw(); // Handle drawing in the main render loop
}

function startUpdateLoop() {
  // Track the time manually to ensure accurate update intervals
  setInterval(() => {
    const currentTime = Date.now();
    const secondsSinceLastUpdate = (currentTime - lastUpdateTime) / 1000;

    if (secondsSinceLastUpdate >= 1 / speed) {
      lastUpdateTime = currentTime;
      if (!gameOver) {
        update();
      }
    }
  }, 1); // Set a very short interval to check frequently
}

// Restart button to reset the game
document.getElementById("button").onclick = function () {
  restart();
};

//Inicia a função principal
window.requestAnimationFrame(main);
startUpdateLoop();

function update() {
  //Atualização dos itens do jogo
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
  //O jogo se encerra quando a cobra fica no size máximo
  if (size == gridSize * gridSize) {
    gameOver = true;
  }
}

//Estátisticas do jogo
var sizeStatus = document.getElementById("size");
var stepsPerSecondtatus = document.getElementById("steps");
var stepsPerSecondStatus = document.getElementById("stepsPerSecond");
var timeStatus = document.getElementById("time");
var steps = 0;

function updateStatus() {
  //Se a cobra estiver em movimento a quantidade de steps aumenta
  var input = getInputDirection();
  if ((input.x != 0 || input.y != 0) && size < gridSize * gridSize) {
    steps++;
  }
  //As estátisticas são alteradas
  sizeStatus.innerHTML = "Tamanho: " + size;
  stepsPerSecondtatus.innerHTML = "Passos: " + steps;

  let time = (Date.now() - startTime) / 1000;

  if (time > 0 && time - lastTime > 1) {
    let stepsPerSecond = (steps - lastSteps) / (time - lastTime);
    lastSteps = steps;
    lastTime = time;
    stepsPerSecondList.push(stepsPerSecond);
    if (stepsPerSecondList.length > 10) {
      stepsPerSecondList.shift();
    }
    let avgstepsPerSecond = Math.round(
      stepsPerSecondList.reduce((a, b) => a + b, 0) / stepsPerSecondList.length
    );

    stepsPerSecondStatus.innerHTML = "Passos/s: " + avgstepsPerSecond;
  }

  if (size < gridSize * gridSize - 1)
    timeStatus.innerHTML = "Tempo: " + Math.round(time) + "s";
}

//Slider de velocidade
speedOutput.innerHTML = "Velocidade " + speedSlider.value + "x";
speedSlider.oninput = function () {
  speedOutput.innerHTML = "Velocidade " + this.value + "x";
};

//Slider de tamanho
sizeOutput.innerHTML = "Tamanho " + sizeSlider.value;
sizeSlider.oninput = function () {
  sizeOutput.innerHTML = "Tamanho " + this.value;
};

export function getGridSize() {
  return gridSize;
}

function updateGridSize() {
  gridSize = Number(sizeSlider.value);

  if (gridSize % 2 != 0) {
    gridSize++;
    sizeSlider.value = gridSize;
    sizeOutput.innerHTML = "Tamanho " + gridSize;
  }

  if (gridSize != lastGridSize) {
    lastGridSize = gridSize;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    restart();
  }
}

function restart() {
  //Recarregar página ao resetar o jogo
  resetSnake();
  resetFood();
  steps = 0;
  stepsPerSecondList = [];
  lastTime = 0;
  lastSteps = 0;
  gameOver = false;
  startTime = Date.now();
}
