let inputDirection = {x: 0, y: 0}
var checkbox = document.getElementById("checkbox")
var moved = false

window.addEventListener('keydown', e => {
    //Modo manual ativo e ainda não se moveu no último update
    //Detecta a direção das setas do teclado
    //Não é possível seguir na direção oposta do update anterior
    if (!checkbox.checked && !moved) {
        switch (e.key) {
            case 'ArrowUp':
                //Cima
                if (inputDirection.x == 0 && inputDirection.y == 1) break
                inputDirection = { x: 0, y: -1}
                moved = true
                break;

            case 'ArrowDown':
                //Baixo
                if (inputDirection.x == 0 && inputDirection.y == -1) break
                inputDirection = { x: 0, y: 1}
                moved = true
                break;

            case 'ArrowLeft':
                //Esqueda
                if (inputDirection.x == 1 && inputDirection.y == 0) break    
                inputDirection = { x: -1, y: 0}
                moved = true
                break;

            case 'ArrowRight':
                //Direita
                if (inputDirection.x == -1 && inputDirection.y == 0) break
                inputDirection = { x: 1, y: 0}
                moved = true
                break;
        }
    }
})

export function getInputDirection() {
    //Retorna a direção escolhida nesse update
    return inputDirection
}

export function setInputDirection(input) {
    //A direção é definida pelo modo automatico
    inputDirection = input
}

export function updateInput() {
    //Permite que o jogador envie uma nova direção
    moved = false
}