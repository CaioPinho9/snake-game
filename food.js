import { onSnake, expandSnake, nextSnake } from "./snake.js";
import { randomGridPosition as randomGridPosition } from "./grid.js";

export let food;

export function resetFood() {
  food = getRandomFoodPosition();
}

export function update() {
  if (nextSnake(food)) {
    //A cobra aumenta quando detecta que no próximo passo haverá uma comida
    expandSnake();
    food = getRandomFoodPosition();
  }

  if (onSnake(food)) {
    //A comida é realocada quando ocorre a colisão com a cobra
    food = getRandomFoodPosition();
  }
}

export function draw(gameBoard) {
  //A comida é desenhada em determinada posição do grid
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

function getRandomFoodPosition() {
  let newFoodPosition;

  //A comida será realocada quando não estiver posicionada ou se estiver em cima da cobra
  //Ela irá continuar tentando até achar um local vago
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = randomGridPosition();
  }
  return newFoodPosition;
}
