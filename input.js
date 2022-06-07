let inputDirection = {x: 0, y: 0}
var checkbox = document.getElementById("checkbox")
var moved = false

window.addEventListener('keydown', e => {
    if (!checkbox.checked && !moved)
    switch (e.key) {
        case 'ArrowUp':
            if (inputDirection.x == 0 && inputDirection.y == 1) break
            inputDirection = { x: 0, y: -1}
            moved = true
            break;

        case 'ArrowDown':
            if (inputDirection.x == 0 && inputDirection.y == -1) break
            inputDirection = { x: 0, y: 1}
            moved = true
            break;

        case 'ArrowLeft':
            if (inputDirection.x == 1 && inputDirection.y == 0) break    
            inputDirection = { x: -1, y: 0}
            moved = true
            break;

        case 'ArrowRight':
            if (inputDirection.x == -1 && inputDirection.y == 0) break
            inputDirection = { x: 1, y: 0}
            moved = true
            break;
    }
})

export function getInputDirection() {
    return inputDirection
}

export function inputRestart () {
    inputDirection = { x: 0, y: 0}
}

export function updateInput() {
    moved = false
}