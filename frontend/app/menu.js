
var menu = {};

menu.load = function () {
    menu.state = 'main';
    menu.playButton = {
        y: 500,
        w: 240,
        h: 80
    }
    menu.playButton.x = scaledWidth / 2 - menu.playButton.w / 2;
}

menu.update = function (dt) {
    menu.playButton.x = scaledWidth / 2 - menu.playButton.w / 2;
    if (utils.mouseInRect(menu.playButton)) {
        document.body.style.cursor = 'pointer';
    }
}

menu.mousePressed = function () {
    if (utils.mouseInRect(menu.playButton)) {
        gameState = 'playing';
        uiPressed = true;
    }
}

menu.draw = function () {
    push();
    
    background(9, 10, 49);

    // title
    fill(255, 217, 90);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('Gswitch 3', scaledWidth / 2, 160);

    // play button
    if (utils.mouseInRect(menu.playButton)) {
        fill(225, 187, 60);
    }
    let btn = menu.playButton;
    rect(scaledWidth / 2 - btn.w / 2, btn.y, btn.w, btn.h, 10);
    fill(9, 10, 49);
    textSize(32);
    text('PLAY NOW', scaledWidth / 2, 544);

    pop();
}
