
var menu = {};

menu.load = function() {
    menu.state = 'main';
}

menu.mousePressed = function() {
    if (scaledMouseX > scaledWidth / 2 - 120 && scaledMouseX < scaledWidth / 2 + 120
    && scaledMouseY > 500 && scaledMouseY < 580) {
        gameState = 'playing';
        document.body.style.cursor = 'default';
    }
}

menu.draw = function() {
    push();
    background(9, 10, 49);
    document.body.style.cursor = 'default';

    fill(255, 217, 90);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('Swing Star', scaledWidth / 2, 160);

    if (scaledMouseX > scaledWidth / 2 - 120 && scaledMouseX < scaledWidth / 2 + 120
    && scaledMouseY > 500 && scaledMouseY < 580) {
        fill(225, 187, 60);
        document.body.style.cursor = 'pointer';
    }
    rect(scaledWidth / 2 - 120, 500, 240, 80, 10);
    fill(9, 10, 49);
    textSize(32);
    text('PLAY NOW', scaledWidth / 2, 544);

    pop();
}