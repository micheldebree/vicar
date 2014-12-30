/** Create an image with access to individual pixels */
/*global document, Pixel */
function PixelImage() {
    'use strict';

    var img,
        imageData,
        onGrab = function () {},
        grabData = function () {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            imageData = context.getImageData(0, 0, img.width, img.height);
            onGrab();
        };

    this.setOnGrab = function (grabHandler) {
        onGrab = grabHandler;
    };

    this.isReady = function () {
        return imageData !== undefined;
    };

    this.getImageData = function () {
        return imageData;
    };

    /** Create new empty image */
    this.init = function (w, h) {
        'use strict';
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
        imageData = context.createImageData(w, h);
    };

    this.grab = function (imgParam) {
        'use strict';
        img = imgParam;

        if (!img.complete) {
            img.onload = grabData;
        }
        else {
            grabData();
        }
    };

    this.getWidth = function () {
        'use strict';
        return this.isReady() ? imageData.width : 0;
    };

    this.getHeight = function () {
        'use strict';
        return this.isReady() ? imageData.height : 0;
    };

    this.peek = function (x, y) {
        'use strict';
        var i = this.coordsToindex(x, y);
        return new Pixel(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]);
    };

    this.poke = function (x, y, pixel) {
        'use strict';
        if (pixel !== undefined) {
            var i = this.coordsToindex(x, y);
            imageData.data[i] = pixel.r;
            imageData.data[i + 1] = pixel.g;
            imageData.data[i + 2] = pixel.b;
            imageData.data[i + 3] = pixel.a;
        }
    };

    this.coordsToindex = function (x, y) {
        'use strict';
        var result = ~~y * (this.getWidth() << 2) + (~~x << 2);
        return result < imageData.data.length ? result : 0;
    };
}
