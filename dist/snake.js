import { getGridSize } from "./game.js";
import { getInputDirection } from "./input.js";
import Queue from "./types/queue.js";
let snakeBody = new Queue();
let newSegments = 0;
let colisionMatrix = [];
export function updateSnake() {
    //A cabeça da cobra se move de acordo com a direção recebida
    const inputDirection = getInputDirection();
    let newHead = Object.assign({}, getSnakeHead());
    newHead.x += inputDirection.x;
    newHead.y += inputDirection.y;
    snakeBody.enqueue(newHead);
    colisionMatrix[newHead.x][newHead.y] = true;
    // A cauda é apagada
    if (snakeBody.length > 1 && !newSegments) {
        colisionMatrix[snakeBody.peek().x][snakeBody.peek().y] = false;
        snakeBody.dequeue();
    }
    newSegments = 0;
}
export function drawSnake(gameBoard, cellHeight, cellWidth) {
    //Cada parte da cobra tem uma posição no grid
    let index = 0;
    snakeBody.forEach((segment) => {
        const colorRGB = color(index);
        gameBoard.fillStyle = colorRGB;
        gameBoard.fillRect(segment.x * cellWidth, segment.y * cellHeight, cellWidth, cellHeight);
        //Altera a cor dessa parte
        index++;
    }, undefined);
}
function color(index) {
    //Cores
    var colorB;
    var colorG;
    if (snakeBody.length == 1) {
        //Se a cobra tiver apenas uma parte, a cor é fixa
        return "rgb(0,0,255)";
    }
    //Calcular porcentagem de acordo com o size
    var percent = 1 - (index + 1) / snakeBody.length;
    //Quanto mais próximo da cabeça, maior a porcentagem de azul, e menor porcetagem de verde
    colorG = 255 * percent;
    colorB = Math.abs(colorG - 255);
    return "rgb(0," + colorG + "," + colorB + ")";
}
export function expandSnake() {
    //Quando a cobra aumenta, newSegments indica que pode criar uma nova cauda
    newSegments += 1;
}
export function onSnake(position, { ignoreHead = false } = {}) {
    //Detecta se a posição está na cobra
    if (ignoreHead && equalPositions(getSnakeHead(), position))
        return false;
    if (colisionMatrix[position.x] === undefined) {
        return false;
    }
    return colisionMatrix[position.x][position.y];
}
export function nextSnake(positionFood) {
    //Detecta se a comida e a cabeça irão se encontrar no próximo passo
    //A cobra cresce quando essa função é verdadeira
    //Dessa forma a cobra já está crescida quando colide com a comida
    //Evitando que a cobra morra por falta de espaço ao crescer
    var inputDirection = getInputDirection();
    var positionHead = {
        x: getSnakeHead().x + inputDirection.x,
        y: getSnakeHead().y + inputDirection.y,
    };
    return equalPositions(positionFood, positionHead);
}
export function getSnakeHead() {
    //Retorna a cabeça
    return snakeBody.peekBack();
}
export function snakeIntersection() {
    //Detecta se a cobra acertou ela mesma
    //A cabeça é ignorada, pois ela é o alvo da colisão
    return onSnake(getSnakeHead(), { ignoreHead: true });
}
export function equalPositions(pos1, pos2) {
    //Retorna verdadeiro se as duas posições forem iguais
    return pos1.x === pos2.x && pos1.y === pos2.y;
}
export function resetSnake() {
    //Reseta a cobra
    var gridSize = getGridSize();
    var startPosition = gridSize % 2 === 0
        ? Math.random() < 0.5
            ? Math.floor(gridSize / 2)
            : Math.ceil(gridSize / 2)
        : Math.round(gridSize / 2);
    snakeBody = new Queue();
    snakeBody.enqueue({ x: startPosition, y: startPosition });
    newSegments = 0;
    colisionMatrix = Array.from({ length: getGridSize() }, () => Array.from({ length: getGridSize() + 1 }, () => false));
    colisionMatrix[startPosition][startPosition] = true;
}
export function getSnakeSize() {
    return snakeBody.length;
}
