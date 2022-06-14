import { food } from "./food.js";
import { outsideGrid, gridDirection } from "./grid.js";
import { setInputDirection } from "./input.js";
import { onSnake, getSnakeHead } from "./snake.js";

export function update() {
    //Modo automatico ativo
    if (checkbox.checked) {

        //Distancia entre comida e as futuras posições da cabeça da cobra
        var nextDistance = distance()

        //O grid indica a direção que a cobra pode ir, dependendo da posição da cabeça
        var inputDirection = gridDirection()

        //Detecta se as duas direções são válidas
        var colision = checkDeath()

        //Caso a cobra esteja com as duas opções livres ela escolhe a mais próxima da comida
        if (nextDistance[0] < nextDistance[1] && !colision) {
            setInputDirection(inputDirection[0])
        } else if (nextDistance[0] > nextDistance[1] && !colision) {
            setInputDirection(inputDirection[1])
        } else if (!colision) {
            //Se as duas forem igualmente próximas, é decidido aleatoriamente
            //Evitando um loop eterno
            setInputDirection(inputDirection[Math.round(Math.random())])
        }
    }
}

function nextPosition() {
    //Retorna as duas possíveis posições que a cobra pode ir, de acordo com as direções do grid
    var headPosition = getSnakeHead()
    
    var inputDirection = gridDirection()
    var position = [{ x: 0, y: 0 }, { x: 0, y: 0 }]
    position[0].x = headPosition.x + inputDirection[0].x
    position[0].y = headPosition.y + inputDirection[0].y
    position[1].x = headPosition.x + inputDirection[1].x
    position[1].y = headPosition.y + inputDirection[1].y
    return position
}

function checkDeath() {
    //Possíveis posições futuras
    var position = nextPosition()

    var horizontalColision = false
    var verticalColision = false
    
    //Detecta se acontece colisão nos dois sentidos
    if (outsideGrid(position[0]) || onSnake(position[0], { ignoreHead: true })) {
        horizontalColision = true
    }

    if (outsideGrid(position[1]) || onSnake(position[1], { ignoreHead: true })) {
        verticalColision = true 
    }

    //Retorna verdadeiro se houver colisão e se movimenta nesse caso
    return decidePath(horizontalColision, verticalColision)
    
}

function decidePath(horizontalColision, verticalColision) {
    var inputDirection = gridDirection()

    //Se acontecer uma colisão em um sentido, ela se movimenta para o outro
    if (horizontalColision && !verticalColision) {
        //Horizontal
        setInputDirection(inputDirection[1])
        return true
    }

    if (!horizontalColision && verticalColision) {
        //Vertical
        setInputDirection(inputDirection[0])
        return true
    }

    //Não havendo colisão é decidido de acordo com a distancia no update()
    if (!horizontalColision && !verticalColision) {
        return false
    }
}

function distance() {
    //Retorna a distancia entre a comida e as duas possíveis posições da cobra
    var pos1 = food
    var pos2 = nextPosition()
    var nextDistance = []
    nextDistance[0] = Math.sqrt(Math.pow(pos2[0].x-pos1.x,2) + Math.pow(pos2[0].y-pos1.y,2))
    nextDistance[1] = Math.sqrt(Math.pow(pos2[1].x-pos1.x,2) + Math.pow(pos2[1].y-pos1.y,2))
    return nextDistance
}