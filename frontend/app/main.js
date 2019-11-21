
var gfx = {};
var sfx = {};

var scaleFactor;
var scaledWidth, scaledHeight;
var scaledMouseX, scaledMouseY;
var defaultVolume = 0.4;
var uiPressed = false;
var gameState = 'playing';
var gameTime = 0;
var dtTimer = 0;

var width = window.innerWidth;
var height = window.innerHeight;

let sndMusic;

function preload() {
    gfx.backgrounds = [];
    
    for (let x = 0; x < Koji.config.images.backgrounds.length; x++) {
        gfx.backgrounds[x] = {};
        gfx.backgrounds[x].img = loadImage(Koji.config.images.backgrounds[x].image);
        gfx.backgrounds[x].scroll = Koji.config.images.backgrounds[x].scroll;
    }

    gfx.player = loadImage(Koji.config.images.player);
    gfx.playerMoving = loadImage(Koji.config.images.playerMoving);
    gfx.heart = loadImage(Koji.config.images.heart);
    gfx.heartGrey = loadImage(Koji.config.images.heartGrey);
    gfx.tile = loadImage(Koji.config.images.tile);
    gfx.star = loadImage(Koji.config.images.pointPickup);
    gfx.tnt = loadImage(Koji.config.images.obstacle);
    gfx.tntExplosion = loadImage(Koji.config.images.obstacleExplosion);
    gfx.shield = loadImage(Koji.config.images.shield);
    gfx.speed = loadImage(Koji.config.images.speedPickup);
    
    gfx.info = loadImage(Koji.config.images.info);
    gfx.speaker = loadImage(Koji.config.images.sound);
    gfx.speakerMute = loadImage(Koji.config.images.soundMute);

    sfx.star = loadSound(Koji.config.sounds.pointPickup);
    sfx.jump = loadSound(Koji.config.sounds.jump);
    sfx.fall = loadSound(Koji.config.sounds.fall);
    sfx.explosion = loadSound(Koji.config.sounds.obstacleHit);
    masterVolume(defaultVolume);
}

function setup() {
    const canvas = createCanvas(window.innerWidth, window.innerHeight)

    // $('canvas').bind('contextmenu', function (e) {
    //     return false;
    // });
    // $('canvas').bind('mousedown', function (e) {
    //     if (e.detail > 1) {
    //         e.preventDefault();
    //     }
    // });

    strokeJoin(ROUND);
    scaleFactor = height / 900;
    scaledWidth = width / scaleFactor;
    scaledHeight = height / scaleFactor;

    menu.load();
    player.load();
    track.load();
    info.load();
    gameOver.load();
    volume.load();

    // Sound stuffs
    function playMusic(music, volume = 0.4, loop = false) {
        if (music) {
            music.setVolume(volume)
            music.setLoop(loop)
            music.play()
        }
    }

    /**
     * Load music asynchronously and play once it's loaded
     * This way the game will load faster
     */
    if (Koji.config.sounds.backgroundMusic)
        sndMusic = loadSound(Koji.config.sounds.backgroundMusic, () =>
        playMusic(sndMusic, 0.2, true)
    )

    cam.y = -(7 * track.tileSize) / 2;
}

function update() {
    document.body.style.cursor = 'default';
    scaledMouseX = (mouseX - width / 2) / scaleFactor + scaledWidth / 2;
    scaledMouseY = (mouseY - height / 2) / scaleFactor + scaledHeight / 2;
    let fixedDt = 1 / 60;
    dtTimer += min(1 / frameRate(), 1 / 10);
    while (dtTimer > 0) {
        dtTimer -= fixedDt;
        fixedUpdate(fixedDt);
    }
}

function fixedUpdate(dt) {
    switch (gameState) {
        case 'menu':
            menu.update(dt);
            break;
        case 'playing':
            gameTime += dt;
            player.update(dt);
            track.update(dt);
            info.update(dt);
            gameOver.update(dt);
            volume.update(dt);

            cam.x = max(cam.x + player.xv * 0.8 * dt, player.x);
            break;
        case 'gameOver':
            gameTime += dt;
            player.update(dt);
            info.update(dt);
            gameOver.update(dt);
            volume.update(dt);
            break;
    }
}

function updateMouse() {
    scaledMouseX = (mouseX - width / 2)
    scaledMouseX /= scaleFactor
    scaledMouseX += scaledWidth / 2;
    scaledMouseX -= (scaledWidth - targetWidth) / 2;

    scaledMouseY = (mouseY - height / 2)
    scaledMouseY /= scaleFactor
    scaledMouseY += scaledHeight / 2;
    scaledMouseY -= (scaledHeight - targetHeight) / 2
}

function mousePressed() {
    uiPressed = false;
    switch (gameState) {
        case 'menu':
            volume.mousePressed();
            menu.mousePressed();
            break;
        case 'playing':
            volume.mousePressed();
            if (!uiPressed) {
                player.mousePressed();
            }
            break;
        case 'gameOver':
            volume.mousePressed();
            if (!uiPressed) {
                gameOver.mousePressed();
            }
            break;
    }
}
function touchStarted() {
    if (touches.length === 1) {
        mousePressed();
    }
}

function mouseReleased() {

}
function touchEnded() {
    if (touches.length === 0) {
        mouseReleased();
    }
}

function keyPressed() {
    switch (gameState) {
        case 'playing':
            player.keyPressed();
            break;
    }
}

function draw() {
    update();
    noStroke();
    
    push();
    translate(width / 2, height / 2);
    scale(scaleFactor, scaleFactor);
    translate(-scaledWidth / 2, -scaledHeight / 2);

    switch (gameState) {
        case 'menu':
            menu.draw();
            break;
        case 'playing':
        case 'gameOver':
           console.log('c', cam);

            for (let x = 0; x < gfx.backgrounds.length; x++) {
                if (typeof gfx.backgrounds[x].x1 === 'undefined') {
                    gfx.backgrounds[x].x1 = 0;
                    gfx.backgrounds[x].x2 = scaledWidth;
                }
                
                gfx.backgrounds[x].x1 -= player.lives === 0 ? 0 : player.xv * 0.03 * gfx.backgrounds[x].scroll;
                gfx.backgrounds[x].x2 -= player.lives === 0 ? 0 : player.xv * 0.03 * gfx.backgrounds[x].scroll;
                
                if (gfx.backgrounds[x].x1 < -scaledWidth) {
                    gfx.backgrounds[x].x1 = scaledWidth;
                }

                if (gfx.backgrounds[x].x2 < -scaledWidth) {
                    gfx.backgrounds[x].x2 = scaledWidth;
                }

                image(gfx.backgrounds[x].img, gfx.backgrounds[x].x1, 0, scaledWidth, scaledHeight);
                image(gfx.backgrounds[x].img, gfx.backgrounds[x].x2, 0, scaledWidth, scaledHeight);
            }

            cam.set();
            track.draw();
            player.draw();
            cam.reset();

            push();

            // score
            fill(Koji.config.colors.scoreColor);
            textSize(64);
            textAlign(CENTER, CENTER);
            text(player.score, scaledWidth / 2, 80);

            // hp
            for (let i = -1; i <= 1; i++) {
                let img = i + 1 < player.lives ? gfx.heart : gfx.heartGrey;
                image(img, scaledWidth / 2 + i * 40 - 16, 120);
            }

            // shield notification
            if (gameTime - player.shieldTime < player.shieldMaxTime) {
                textSize(48);
                fill(Koji.config.colors.shieldProgressBarColor)
                text(Koji.config.strings.shieldText, scaledWidth / 2, scaledHeight - 64);
                stroke(Koji.config.colors.shieldProgressBarColor);
                strokeWeight(2);
                noFill();
                rect(scaledWidth / 2 - 100, scaledHeight - 32, 200, 16);
                noStroke();
                fill(Koji.config.colors.shieldProgressBarColor);
                let t = 1 - (gameTime - player.shieldTime) / player.shieldMaxTime;
                rect(scaledWidth / 2 - 100, scaledHeight - 32, 200 * t, 16);
            }
            pop();

            info.draw();
            gameOver.draw();
            volume.draw();
            break;
    }

    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    scaleFactor = height / 900;
    scaledWidth = width / scaleFactor;
    scaledHeight = height / scaleFactor;
}
