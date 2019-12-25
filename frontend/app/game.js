
class Game {
    constructor() {
        this.bgX = -50;
        this.bgSpeed = 140;
        
        physics.load();
        player = new Player();
        projectiles.load();
        enemies.load();
    }

    update(dt) {
        this.bgX -= this.bgSpeed * dt;
        physics.update(dt);
        enemies.update(dt);
    }

    mousePressed() {
        player.mousePressed();
    }

    mouseReleased() {
        player.mouseReleased();
    }
    
    draw() {
        // background
        let img = gfx.backgroundTile;
        for (let i = 0; i < ceil(targetWidth / img.width) + 1; i++) {
            for (let j = 0; j < ceil(targetHeight / img.height); j++) {
                let m = ceil(targetWidth / img.width + 1) * img.width;
                let x = -img.width + utils.mod(this.bgX + img.width * i, m);
                let y = img.height * j;
                image(img, x, y);
            }
        }

        player.draw();
        enemies.draw();
        projectiles.draw();
    }

    drawUI() {
        // score
        fill(0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text('Score: ' + floor(gameTime * 2), targetWidth / 2, 80);
    }

    drawSides() {
        let img = gfx.backgroundTileBlur;
        // vertical and horizontal tiles don't have to line up (never showing at same time)
        for (let i = 0; i < ceil(fullW / img.width); i++) {
            let x = fullX + img.width * i;
            // top
            for (let j = -1; j >= floor(fullY / img.height); j--) {
                let y = img.height * j;
                image(img, x, y);
            }
            // bottom
            for (let j = 0; j < ceil(-fullY / img.height); j++) {
                let y = targetHeight + img.height * j;
                image(img, x, y);
            }
        }
        for (let j = 0; j < ceil(fullH / img.height); j++) {
            let y = img.height * j;
            // left
            for (let i = -1; i >= floor(fullX / img.width); i--) {
                let x = img.width * i;
                image(img, x, y);
            }
            // right
            for (let i = 0; i < ceil(-fullX / img.width); i++) {
                let x = targetWidth + img.width * i;
                image(img, x, y);
            }
        }
        // dim sides
        fill(0, 128);
        // top/bottom
        rect(fullX, fullY, fullW, 0 - fullY);
        rect(fullX, targetHeight, fullW, fullY + fullH - targetHeight);
        // left/right
        rect(fullX, fullY, 0 - fullX, fullH);
        rect(targetWidth, fullY, fullX + fullW - targetWidth, fullH);
    }
}
