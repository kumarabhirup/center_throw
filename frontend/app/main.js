
var gfx = {};
var sfx = {};

var targetWidth = 500;
var targetHeight = 900;
var scaleFactor;
var fullX, fullY, fullW, fullH;
var scaledMouseX, scaledMouseY;
var defaultVolume = 0.4;
var uiPressed = false;
var gameState = 'playing';
var gameTime = 0;
var dtTimer = 0;
var fixedDt = 1 / 60;

var countdownTimer = 3;

function preload() {
    // Kumar - Load the background images
    gfx.backgroundImages = [];
    Koji.config.strings.levels.forEach((level, idx) => {
        gfx.backgroundImages[idx] =  loadImage(level.background);
    });

    gfx.arrow = loadImage(Koji.config.images.arrow);
    gfx.ball = loadImage(Koji.config.images.ball);
    gfx.powerLine = loadImage(Koji.config.images.powerline)
    gfx.speakerMuteWhite = loadImage(Koji.config.images.soundMute);
    gfx.speakerWhite = loadImage(Koji.config.images.sound);
    gfx.logo1 = loadImage(Koji.config.images.sponsorship.left);
    gfx.logo2 = loadImage(Koji.config.images.sponsorship.right);

    sfx.stadium = loadSound(Koji.config.sounds.backgroundMusic);
    sfx.stadium.setLoop(true);
    sfx.stadium.setVolume(0.2);

    sfx.boo = loadSound(Koji.config.sounds.boo);
    sfx.clap = loadSound(Koji.config.sounds.clap);
    sfx.whoosh = loadSound(Koji.config.sounds.whoosh);
    sfx.impact = loadSound(Koji.config.sounds.impact);

    masterVolume(defaultVolume);
}

function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerHeight);

    strokeJoin(ROUND);
    scaleFactor = min(width / targetWidth, height / targetHeight);
    fullW = width / scaleFactor;
    fullH = height / scaleFactor;
    fullX = targetWidth / 2 - fullW / 2;
    fullY = targetHeight / 2 - fullH / 2;

    menu.load();
    volume.load();
    game.load();
    popupText.load();
    gameOver.load();

    cam.x = targetWidth / 2;
    cam.y = targetHeight / 2;

    sfx.stadium.play()
    game.start()
}

function update() {
    document.body.style.cursor = 'default';
    scaledMouseX = (mouseX - width / 2) / scaleFactor + targetWidth / 2;
    scaledMouseY = (mouseY - height / 2) / scaleFactor + targetHeight / 2;

    let dt = min(1 / frameRate(), 1 / 10);
    dtTimer += dt;
    while (dtTimer > 0) {
        dtTimer -= fixedDt;
        fixedUpdate(fixedDt);
    }

    if (touchIsPressed) {
        touchTimer = 0;
    } else {
        touchTimer += dt;
    }
}


function fixedUpdate(dt) {
    switch (gameState) {
        case 'menu':
            menu.update(dt);
            volume.update(dt);
            break;
        case 'playing':
            volume.update(dt);
            countdownTimer -= dt;
            if (countdownTimer < 0) {
                gameTime += dt;
                game.update(dt);
            }
            popupText.update(dt);
            break;
        case 'gameOver':
            volume.update(dt);
            gameOver.update(dt);
            popupText.update(dt);
            break;
    }
}

function pressed() {
    uiPressed = false;
    switch (gameState) {
        case 'menu':
            menu.mousePressed();
            volume.mousePressed();
            break;
        case 'playing':
            volume.mousePressed();
            if (!uiPressed && countdownTimer < 0) {
                game.mousePressed();
            }
            break;
        case 'gameOver':
            volume.mousePressed();
            if (!uiPressed) {
                gameOver.mousePressed();
            }
    }
}

function released() {

}

var touchIsPressed = false;
// used to disable mouse inputs if touch used in last 0.5 seconds
var touchTimer = 1;

function mousePressed() {
    if (touchTimer > 0.5) {
        pressed();
    }
}
function touchStarted() {
    if (touches.length === 1) {
        touchIsPressed = true;
        mouseX = touches[0].x;
        mouseY = touches[0].y;
        scaledMouseX = (mouseX - width / 2) / scaleFactor + targetWidth / 2;
        scaledMouseY = (mouseY - height / 2) / scaleFactor + targetHeight / 2;
        pressed();
    }
}

function mouseReleased() {
    if (touchTimer > 0.5) {
        released();
    }
}
function touchEnded() {
    if (touches.length === 0) {
        touchIsPressed = false;
        released();
    }
}

function keyPressed() {
    switch (gameState) {
        case 'playing':
            game.keyPressed();
            break;
    }
}

function draw() {
    update();
    noStroke()

    push();
    translate(width / 2, height / 2);
    scale(scaleFactor, scaleFactor);
    translate(-targetWidth / 2, -targetHeight / 2);

    background('#1F1F1F');

    switch (gameState) {
        case 'menu':
            menu.draw();
            volume.draw();
            break;
        case 'playing':
        case 'gameOver':
            cam.set();

            let bg = game.stages[game.stage].background;
            let h = targetHeight;
            let w = bg.width * h / bg.height;
            image(bg, targetWidth / 2 - w / 2, 0, w, h);
            fill(0, 128);
            rect(targetWidth / 2 - w / 2, 0, w, h);
            
            game.draw();
            popupText.draw();

            cam.reset();

            push();
            // numBalls
            fill(0);
            for (let i = 0; i < game.stages[game.stage].numBalls; i++) {
                push();
                translate(targetWidth - 30 - i * 20, targetHeight - 26);
                rotate(PI / 5);
                image(gfx.ball, -12, -18, 24, 36);
                pop();
            }

            // scoreboard
            fill(Koji.config.colors.scoreboardBackgroundColor);
            rect(targetWidth / 2 - 230 / 2, 0, 230, 135);
            stroke(58);
            strokeWeight(2);
            line(targetWidth / 2 - 186 / 2, 50, targetWidth / 2 + 186 / 2, 50);
            line(targetWidth / 2 - 186 / 2, 84, targetWidth / 2 + 186 / 2, 84);
            noStroke();
            // time
            fill(Koji.config.colors.scoreboardTextColor);
            textSize(30);
            textAlign(LEFT, TOP);
            let sMinutes = String(floor(gameTime / 60)).padStart(2, '0');
            let sSeconds = String(floor(gameTime % 60)).padStart(2, '0');
            text(sMinutes + ':' + sSeconds, targetWidth / 2 - (textWidth(sMinutes) + textWidth(':') / 2), 11);
            // stage/score labels
            textSize(15);
            textAlign(CENTER, TOP);
            text(Koji.config.strings.stageText, targetWidth / 2 - 50, 60);
            text(Koji.config.strings.scoreText, targetWidth / 2 + 50, 60);
            // stage
            textSize(30);
            text(game.stage + 1, targetWidth / 2 - 50, 93);
            // score
            let t = constrain((game.kickAnimationTimer - 1) * 2, 0, 1);
            let shownScore = floor(lerp(game.lastScore, game.score, ease.inOutCubic(t)));
            text(shownScore, targetWidth / 2 + 50, 93);
            pop();

            // logos
            {
                let w = (targetWidth - 230) / 2;
                let s = w / gfx.logo1.width;
                let h = gfx.logo1.height * s;
                let x = 0;
                let y = 135 / 2 - h / 2;
                image(gfx.logo1, x, y, w, h);

                s = w / gfx.logo2.width;
                h = gfx.logo2.height * s;
                x = targetWidth / 2 + 230 / 2;
                y = 135 / 2 - h / 2;
                image(gfx.logo2, x, y, w, h);
            }

            // countdown
            if (countdownTimer >= 0) {
                fill(0);
                textSize(lerp(64, 96, ease.outCubic(utils.pingPong(countdownTimer * 2))));
                textAlign(CENTER, CENTER);
                text(floor(countdownTimer) + 1, targetWidth / 2, targetHeight / 2);
            }

            if (gameState === 'gameOver'){
                gameOver.draw();
            }
            
            volume.draw();
            break;
    }

    // cover top/bottom off-screen graphics
    fill('#1F1F1F');
    rect(fullX, fullY, fullW, 0 - fullY);
    rect(fullX, targetHeight, fullW, fullY + fullH - targetHeight);

    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    scaleFactor = min(width / targetWidth, height / targetHeight);
    fullW = width / scaleFactor;
    fullH = height / scaleFactor;
    fullX = targetWidth / 2 - fullW / 2;
    fullY = targetHeight / 2 - fullH / 2;
}
