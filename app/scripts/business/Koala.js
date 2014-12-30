/*global Palette*/
/*jslint plusplus: true*/
function Koala() {
    'use strict';
}

Koala.prototype.countPixels = function (imageData, x, y, w, h) {
    'use strict';
    var palette = new Palette([]),
        counts = [],
        yi,
        xi,
        pixel,
        idx;

    for (yi = 0; yi < h; yi++) {
        for (xi = 0; xi < w; xi++) {
            pixel = imageData.peek(x + xi, y + yi);
            idx = palette.indexOf(pixel);
            if (idx === undefined) {
                palette.pixels.push(pixel);
                counts.push(1);
            } else {
                counts[idx]++;
            }

        }
    }


};
