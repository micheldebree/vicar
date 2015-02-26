/*global describe, it, expect, PixelCalculator */
describe('Business: PixelCalculator', function () {
    'use strict';
    
    it('add method should add individual channels', function () {
        var result = PixelCalculator.add([1, 2, 3], [4, 5, 6]);
        expect(result).toEqual([5, 7, 9]);
    });
    
    it('clone can be changed independent from original', function () {
        var pixel = [1, 2, 3],
            clone = PixelCalculator.clone(pixel);
        
        expect(clone).toEqual([1, 2, 3]);
        
        clone[0] = 2;
        clone[1] = 3;
        clone[2] = 4;
        
        expect(clone).toEqual([2, 3, 4]);
        expect(pixel).toEqual([1, 2, 3]);
        
    });
});
         