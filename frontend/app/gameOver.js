
var gameOver = {};

gameOver.load = function () {
    gameOver.t = 0;
    gameOver.y = 910;
    gameOver.w = 600;
    gameOver.h = 160;

    gameOver.enemyId = 0;
    gameOver.enemyHitPosition = { x: 0, y: 0 };
    gameOver.enemyAnimationLength = 2;
}

gameOver.resetGame = function () {
    gameTime = 0;
    countdownTimer = 3;
    game = new Game();
}

gameOver.update = function (dt) {
    gameOver.t = min(gameOver.t + dt, gameOver.enemyAnimationLength + 1);
    let y1 = 910;
    let y2 = 450 - gameOver.h / 2;
    gameOver.y = lerp(y1, y2, ease.inOutCubic(max(gameOver.t - gameOver.enemyAnimationLength, 0)));
}

gameOver.mousePressed = function () {
    if (gameOver.t === gameOver.enemyAnimationLength + 1) {
        gameState = 'menu';
        gameOver.resetGame();
        gameOver.load();
    }
}

gameOver.draw = function () {
    push();

    // enemy
    {
        let img = gfx.cheese;
        let x1 = gameOver.enemyHitPosition.x;
        let y1 = gameOver.enemyHitPosition.y;
        let t1 = ease.inOutQuad(min(gameOver.t, 1));
        let x = lerp(x1, targetWidth / 2, t1);
        let y = lerp(y1, targetHeight / 2, t1);
        let t2 = ease.inOutQuad(constrain(gameOver.t - 0.25, 0, 1));
        let s = lerp(1, 1.5, t2);
        let t3 = ease.inOutQuad(constrain(gameOver.t - 0.5, 0, 1));
        let a = lerp(0, sin(gameOver.t * PI * 6) * PI / 8, t3);
        push();
        translate(x, y);
        rotate(a);
        scale(s);
        image(img, -img.width / 2, -img.height / 2);
        pop();
    }

    // red overlay
    fill(240, 0, 0, min(gameOver.t / gameOver.enemyAnimationLength, 1) * 160);
    rect(0, 0, targetWidth, targetHeight);

    // background rect
    fill(9, 10, 49);
    rect(targetWidth / 2 - gameOver.w / 2, gameOver.y, gameOver.w, gameOver.h);

    // game over text
    fill(255, 217, 90);
    textSize(48);
    textAlign(CENTER, CENTER);
    text('GAME OVER', targetWidth / 2, gameOver.y + gameOver.h / 2);

    pop();
}
