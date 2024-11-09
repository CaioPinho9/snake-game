import { food } from "./food.js";
import { outsideGrid, gridDirection } from "./grid.js";
import { setInputDirection } from "./input.js";
import { onSnake, getSnakeHead } from "./snake.js";
import { Vector2f } from "./types/vector2f.js";

const checkbox = document.getElementById("checkbox") as HTMLInputElement;

export function updateAuto() {
  //Modo automatico ativo
  if (checkbox.checked) {
    setInputDirection(checkDirection(getSnakeHead()));
  }
}

function checkDirection(position: Vector2f) {
  //Distancia entre comida e as futuras posições da cabeça da cobra
  var nextPos = nextPosition(position);
  var nextDistance = distance(nextPos);

  //O grid indica a direção que a cobra pode ir, dependendo da posição da cabeça
  var inputDirection = gridDirection(position);

  //Detecta se as duas direções são válidas
  var colision = checkDeath(position, nextPos);
  if (colision) {
    return colision;
  }

  //Caso a cobra esteja com as duas opções livres ela escolhe a mais próxima da comida
  if (nextDistance[0] < nextDistance[1]) {
    return inputDirection[0];
  } else if (nextDistance[0] > nextDistance[1]) {
    return inputDirection[1];
  } else if (nextDistance[0] == 1 && nextDistance[0] == 1) {
    return recursiveDiagonalDistanceCheck(nextPos, inputDirection);
  } else {
    //Se as duas forem igualmente próximas, é decidido aleatoriamente
    //Evitando um loop eterno
    return inputDirection[Math.round(Math.random())];
  }
}

function recursiveDiagonalDistanceCheck(
  nextPos: Vector2f[],
  inputDirection: Vector2f[],
  depth = 3
) {
  // Base case to prevent deep recursion and infinite loops
  if (depth === 0) return inputDirection[Math.round(Math.random())];

  var direction1 = checkDirection(nextPos[0]);
  var direction2 = checkDirection(nextPos[1]);

  var nextPos1 = {
    x: nextPos[0].x + direction1.x,
    y: nextPos[0].y + direction1.y,
  };
  var nextPos2 = {
    x: nextPos[1].x + direction2.x,
    y: nextPos[1].y + direction2.y,
  };

  var dist = distance([nextPos1, nextPos2]);
  if (dist[0] == 0) {
    return inputDirection[0];
  } else if (dist[1] == 0) {
    return inputDirection[1];
  }

  // Recursively check further positions
  return recursiveDiagonalDistanceCheck(
    [nextPos1, nextPos2],
    inputDirection,
    depth - 1
  );
}

function nextPosition(headPosition: { x: number; y: number }) {
  //Retorna as duas possíveis posições que a cobra pode ir, de acordo com as direções do grid

  var inputDirection = gridDirection(headPosition);
  var position = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  position[0].x = headPosition.x + inputDirection[0].x;
  position[0].y = headPosition.y + inputDirection[0].y;
  position[1].x = headPosition.x + inputDirection[1].x;
  position[1].y = headPosition.y + inputDirection[1].y;
  return position;
}

function checkDeath(headPosition: any, nextPos: any[]) {
  //Possíveis posições futuras

  var horizontalColision = false;
  var verticalColision = false;

  //Detecta se acontece colisão nos dois sentidos
  if (outsideGrid(nextPos[0]) || onSnake(nextPos[0], { ignoreHead: true })) {
    horizontalColision = true;
  }

  if (outsideGrid(nextPos[1]) || onSnake(nextPos[1], { ignoreHead: true })) {
    verticalColision = true;
  }

  //Retorna verdadeiro se houver colisão e se movimenta nesse caso
  return decidePath(horizontalColision, verticalColision, headPosition);
}

function decidePath(
  horizontalColision: boolean,
  verticalColision: boolean,
  headPosition: any
) {
  var inputDirection = gridDirection(headPosition);

  //Se acontecer uma colisão em um sentido, ela se movimenta para o outro
  if (horizontalColision && !verticalColision) {
    //Horizontal
    return inputDirection[1];
  }

  if (!horizontalColision && verticalColision) {
    //Vertical
    return inputDirection[0];
  }

  //Não havendo colisão é decidido de acordo com a distancia no update()
  if (!horizontalColision && !verticalColision) {
    return false;
  }
}

function distance(positions: { x: any; y: any }[]) {
  //Retorna a distancia entre a comida e as duas possíveis posições da cobra
  var pos1 = food;
  var pos2 = positions;
  var nextDistance = [];
  nextDistance[0] = Math.sqrt(
    Math.pow(pos2[0].x - pos1.x, 2) + Math.pow(pos2[0].y - pos1.y, 2)
  );
  nextDistance[1] = Math.sqrt(
    Math.pow(pos2[1].x - pos1.x, 2) + Math.pow(pos2[1].y - pos1.y, 2)
  );
  return nextDistance;
}
