/*global describe, it, expect, Palette, PeptoPalette */
describe('Business: Palette', function () {
    'use strict';
    
    it('indexOf should return index of pixel in palette', function () {
        var palette = new PeptoPalette();
        expect(palette.indexOf([0x58, 0x8d, 0x43])).toEqual(5);
        expect(palette.indexOf([0x77, 0x77, 0x77])).toEqual(undefined);
    });

    it('adding a pixel that is not in the palette should add it', function() {
        var palette = new Palette();
        palette.pixels = [[1,2,3],[2,3,4],[3,4,5]];
        expect(palette.pixels.length).toEqual(3);
        palette.addPixel([4,5,6]);
        expect(palette.pixels.length).toEqual(4);
        expect(palette.indexOf([4,5,6])).toEqual(3);
    });

    it('adding a pixel that is already in the palette does nothing', function() {
        var palette = new Palette();
        palette.pixels = [[1,2,3],[2,3,4],[3,4,5]];
        expect(palette.pixels.length).toEqual(3);
        palette.addPixel([2,3,4]);
        expect(palette.pixels.length).toEqual(3);
        expect(palette.indexOf([2,3,4])).toEqual(1);
    });
});
         

