//Tamanho do grid
export const GRID_SIZE = 20;

export function randomGridPosition() {
  //Envia uma coordenada aleatória, para realocar a comida
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1,
  };
}

export function outsideGrid(position) {
  //Detecta se uma posição está fora do grid
  return (
    position.x < 1 ||
    position.x > GRID_SIZE ||
    position.y < 1 ||
    position.y > GRID_SIZE
  );
}

export function gridDirection(position) {
  //Limita o movimento da cobra
  //Permite que a cobra sempre tenha um caminho até a cauda
  var inputDirection = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  //Apenas no modo automatico
  if (checkbox.checked) {
    //Cada fileira e coluna só possuem um sentido horizontal e vertical
    if (position.y % 2 != 0) {
      inputDirection[0].x = 1;
    } else {
      inputDirection[0].x = -1;
    }

    if (position.x % 2 == 0) {
      inputDirection[1].y = 1;
    } else {
      inputDirection[1].y = -1;
    }
    //Retorna duas possíveis direções que a cobra pode andar
    return inputDirection;
  }
}
