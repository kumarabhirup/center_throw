
var gameOver = {};

gameOver.load = function() {
    gameOver.t = 0;
    gameOver.y = 910;
    gameOver.w = 600;
    gameOver.h = 160;
}

gameOver.resetGame = function() {
    let highscore = player.highscore;
    player.load();
    player.highscore = highscore;
    ground.load();
    swingPoints.load();
    obstacles.load();
    stars.load();
}

gameOver.update = function(dt) {
    if (gameState === 'gameOver') {
        gameOver.t = min(gameOver.t + dt, 1);
    }
    let y1 = 910;
    let y2 = 450 - gameOver.h / 2;
    gameOver.y = lerp(y1, y2, ease.inOutCubic(gameOver.t));
}

gameOver.mousePressed = function() {
    gameState = 'playing';
    gameOver.resetGame();
    gameOver.load();
    window.setAppView('setScore')
}

gameOver.draw = function() {
    push();

    fill(9, 10, 49);
    rect(scaledWidth / 2 - gameOver.w / 2, gameOver.y, gameOver.w, gameOver.h);

    fill(255, 217, 90);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('GAME OVER', scaledWidth / 2, gameOver.y + gameOver.h / 2);

    pop();
}