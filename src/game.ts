import {
  updateSnake as updateSnake,
  drawSnake as drawSnake,
  getSnakeHead,
  snakeIntersection,
  resetSnake,
  getSnakeSize,
} from "./snake.js";
import { outsideGrid } from "./grid.js";
import { getInputDirection, updateInput } from "./input.js";
import { drawFood, resetFood, updateFood } from "./food.js";
import { updateAuto } from "./automatic.js";

const gameBoard = document.getElementById("game-board")! as HTMLCanvasElement;
const canvasContext = gameBoard.getContext("2d")!;
const restartButton = document.getElementById("button")!;
const automatic = document.getElementById("automatic")! as HTMLInputElement;

const speedSlider = document.getElementById("speedSlider")! as HTMLInputElement;
const speedOutput = document.getElementById("speedOutput")!;

const sizeSlider = document.getElementById("sizeSlider")! as HTMLInputElement;
const sizeOutput = document.getElementById("sizeOutput")!;

//Estátisticas do jogo
const sizeStatus = document.getElementById("size")!;
const stepsPerSecondtatus = document.getElementById("steps")!;
const stepsPerSecondStatus = document.getElementById("stepsPerSecond")!;
const timeStatus = document.getElementById("time")!;

let startTime = Date.now();

let gameOver = false;
let lastRenderTime = 0;
let lastUpdateTime = 0;
let lastAuto = false;
let lastTime = 0;
let lastSteps = 0;
let lastGridSize = 0;

let stepsPerSecondList: number[] = [];
var steps = 0;
let gridSize: number = Number(sizeSlider.value);
let cellWidth: number = canvasContext.canvas.width / gridSize;
let cellHeight: number = canvasContext.canvas.height / gridSize;

let speed: number = Number(speedSlider.value);

resetSnake();
resetFood();

function main(currentTime: number) {
  //O slider da velocidade indica a speed da cobra
  speed = Number(speedSlider.value);
  updateGridSize();

  if (automatic.checked && !lastAuto) {
    startTime = Date.now();
    lastAuto = true;
  }

  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;

  // Render only when necessary
  if (secondsSinceLastRender < 1 / 24) return;

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
restartButton.onclick = function () {
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
  updateSnake();
  updateStatus();
  checkDeath();
}

function draw() {
  //A tela é apagada para depois desenhar a cobra e a comida
  canvasContext.clearRect(
    0,
    0,
    canvasContext.canvas.width,
    canvasContext.canvas.height
  );

  drawFood(canvasContext, cellHeight, cellWidth);
  drawSnake(canvasContext, cellHeight, cellWidth);
}

function checkDeath() {
  //O jogo acaba se a cabeça da cobra for detectada fora do grid ou dentro de si mesma
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
  //O jogo se encerra quando a cobra fica no size máximo
  if (getSnakeSize() == gridSize * gridSize) {
    gameOver = true;
  }
}

function updateStatus() {
  //Se a cobra estiver em movimento a quantidade de steps aumenta
  var input = getInputDirection();
  if ((input.x != 0 || input.y != 0) && getSnakeSize() < gridSize * gridSize) {
    steps++;
  }
  //As estátisticas são alteradas
  sizeStatus.innerHTML = "Snake Size: " + getSnakeSize();
  stepsPerSecondtatus.innerHTML = "Steps: " + steps;

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

    stepsPerSecondStatus.innerHTML = "Steps/s: " + avgstepsPerSecond;
  }

  if (getSnakeSize() < gridSize * gridSize - 1)
    timeStatus.innerHTML = "Time: " + Math.round(time) + "s";
}

//Slider de velocidade
speedOutput.innerHTML = "Speed " + speedSlider.value + "x";
speedSlider.oninput = function () {
  speedOutput.innerHTML = "Speed " + (this as HTMLInputElement).value + "x";
};

//Slider de tamanho
sizeOutput.innerHTML = "Grid Size " + sizeSlider.value;
sizeSlider.oninput = function () {
  sizeOutput.innerHTML = "Grid Size " + (this as HTMLInputElement).value;
};

export function getGridSize() {
  return gridSize;
}

function updateGridSize() {
  gridSize = Number(sizeSlider.value);
  cellWidth = canvasContext.canvas.width / gridSize;
  cellHeight = canvasContext.canvas.height / gridSize;

  if (gridSize % 2 != 0) {
    gridSize++;
    sizeSlider.value = String(gridSize);
    sizeOutput.innerHTML = "Grid Size " + gridSize;
  }

  if (gridSize != lastGridSize) {
    lastGridSize = gridSize;
    restart();
  }
}

function restart() {
  //Recarregar página ao resetar o jogo
  resetSnake();
  resetFood();

  canvasContext.clearRect(
    0,
    0,
    canvasContext.canvas.width,
    canvasContext.canvas.height
  );
  steps = 0;
  stepsPerSecondList = [];
  lastTime = 0;
  lastSteps = 0;
  gameOver = false;
  startTime = Date.now();
}

function resizeCanvas() {
  const parent = gameBoard.parentElement!;
  const size = Math.min(parent.offsetWidth, parent.offsetHeight); // Maintain square aspect ratio
  gameBoard.width = size;
  gameBoard.height = size;
}

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);
