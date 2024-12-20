import { onSnake, expandSnake, nextSnake } from "./snake.js";
import { randomGridPosition as randomGridPosition } from "./grid.js";
import { Vector2f } from "./types/vector2f.js";

export let food: Vector2f;

export function resetFood() {
  food = getRandomFoodPosition();
}

export function updateFood() {
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

export function drawFood(
  context: CanvasRenderingContext2D,
  cellHeight: number,
  cellWidth: number
) {
  //A comida é desenhada em determinada posição do grid
  context.fillStyle = "red";
  context.fillRect(
    food.x * cellWidth,
    food.y * cellHeight,
    cellWidth,
    cellHeight
  );
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
