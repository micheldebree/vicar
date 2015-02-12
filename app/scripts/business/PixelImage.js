/** Create an image with access to individual pixels */
/*global document, PixelCalculator */
/*jslint bitwise: true */
/*exported PixelImage*/
function PixelImage() {
    'use strict';

    var img,
        imageData,
        onLoad,
        grabData = function () {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            imageData = context.getImageData(0, 0, img.width, img.height);
            if (onLoad !== undefined) {
                onLoad();
            }
        };

    /**
     * @returns {Boolean} Is the image ready to be used?
     */
    this.isReady = function () {
        return imageData !== undefined;
    };

    /**
     * @returns {ImageData} The actual image data.
     */
    this.getImageData = function () {
        return imageData;
    };

    /** Clone an existing image */
    this.clone = function (pixelImage) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
        canvas.width = pixelImage.getWidth();
        canvas.height = pixelImage.getHeight();
        context.putImageData(pixelImage.getImageData(), 0, 0);
        imageData = context.getImageData(0, 0, img.width, img.height);
    };

    /** Create new empty image */
    this.init = function (w, h) {

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
        imageData = context.createImageData(w, h);
    };

    /**
        Grab image data from an image. Grabbing is defered until the image is loaded.
        @param {Image} imgParam - The image from which to grab the data.
        @param {Function} onLoadHandler - Handler executed after data has been grabbed.
    */
    this.grab = function (imgParam, onLoadHandler) {
        
        onLoad = onLoadHandler;

        img = imgParam;

        if (!img.complete) {
            img.onload = grabData;
        } else {
            grabData();
        }
    };

    this.getWidth = function () {
        return this.isReady() ? imageData.width : 0;
    };

    this.getHeight = function () {
        return this.isReady() ? imageData.height : 0;
    };

    this.peek = function (x, y) {
        var i = this.coordsToindex(x, y);
        return [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]];
    };

    this.poke = function (x, y, pixel) {

        if (pixel !== undefined) {
            var i = this.coordsToindex(x, y);
            imageData.data[i] = pixel[0];
            imageData.data[i + 1] = pixel[1];
            imageData.data[i + 2] = pixel[2];
            imageData.data[i + 3] = pixel[3];
        }
    };

    this.coordsToindex = function (x, y) {

        var result = Math.floor(y) * (this.getWidth() << 2) + (x << 2);
        return result < imageData.data.length ? result : 0;
    };
}
