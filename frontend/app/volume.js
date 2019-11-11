
var volume = {};

volume.load = function() {
    volume.muted = false;
    volume.w = 75;
    volume.h = 75;
    volume.x = scaledWidth - 30 - volume.w;
    volume.y = 30;
}

volume.update = function(dt) {
    volume.x = scaledWidth - 30 - volume.w;
    if (utils.mouseInRect(volume)) {
        document.body.style.cursor = 'pointer';
    }
}

volume.mousePressed = function() {
    if (utils.mouseInRect(volume)) {
        volume.muted = !volume.muted;
        if (volume.muted) {
            masterVolume(0);
        } else {
            masterVolume(defaultVolume);
        }
        uiPressed = true;
    }
}

volume.draw = function() {
    image(volume.muted ? gfx.speakerMute : gfx.speaker, volume.x, volume.y, volume.w, volume.h);
}
