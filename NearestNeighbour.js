function NearestNeighbour() {

    this.Downsize = function(srcImage, w, h) {

        var pw = srcImage.getWidth() / w,
            ph = srcImage.getHeight() / h,
            result = new PixelImage();

        result.init(w, h);

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                result.poke(x, y, this.sample(srcImage, x * pw, y * ph))
            }
        }

        return result;

    };

    this.sample = function(srcImage, x, y) {
        return srcImage.peek(x, y);
    }

}
