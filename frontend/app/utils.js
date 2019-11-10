
var ease = {
    inQuad: function (t) { return t * t },
    outQuad: function (t) { return t * (2 - t) },
    inOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    inCubic: function (t) { return t * t * t },
    outCubic: function (t) { return (--t) * t * t + 1 },
    inOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    inQuart: function (t) { return t * t * t * t },
    outQuart: function (t) { return 1 - (--t) * t * t * t },
    inOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    inQuint: function (t) { return t * t * t * t * t },
    outQuint: function (t) { return 1 + (--t) * t * t * t * t },
    inOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
};
