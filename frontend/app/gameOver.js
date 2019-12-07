
var gameOver = {};

gameOver.load = function () {
    gameOver.t = 0;
    gameOver.y = 910;
    gameOver.w = 600;
    gameOver.h = 160;
}

gameOver.resetGame = function () {
    gameTime = 0;
    game.load();
}

gameOver.update = function (dt) {
    if (gameState === 'gameOver') {
        gameOver.t = min(gameOver.t + dt, 1);
    }
    let y1 = 910;
    let y2 = 450 - gameOver.h / 2;
    gameOver.y = lerp(y1, y2, ease.inOutCubic(gameOver.t));
}

gameOver.mousePressed = function () {
    gameState = 'playing';
    window.setScore(game.score);
    gameOver.resetGame();
    gameOver.load();
    sfx.stadium.stop();
    window.setAppView('setScore');
}

gameOver.draw = function () {
    push();

    fill(Koji.config.colors.gameOverRectangleColor);
    rect(targetWidth / 2 - gameOver.w / 2, gameOver.y, gameOver.w, gameOver.h);

    // game over text
    fill(Koji.config.colors.gameOverTextColor);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(Koji.config.strings.gameOverText, targetWidth / 2, gameOver.y + 44);

    // score
    textSize(32);
    text('SCORE: ' + game.score, targetWidth / 2, gameOver.y + 120);

    pop();
}
