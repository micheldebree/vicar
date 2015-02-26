/*global Palette*/
function ViceRGBPalette() {
    'use strict';
    this.pixels = [
        [0, 0, 0], // black
        [0xff, 0xff, 0xff], // white
        [0xff, 0x00, 0x00], //red
        [0x00, 0xff, 0xff], //cyan
        [0xff, 0x00, 0xff], //purple
        [0x00, 0xff, 0x00], //green
        [0x00, 0x00, 0xff], //blue
        [0xff, 0xff, 0x00], //yellow
        [0xff, 0x67, 0x00], //orange
        [0xa7, 0x47, 0x00], //brown
        [0xff, 0x77, 0x77], //light red
        [0x50, 0x50, 0x50], //dark gray
        [0x80, 0x80, 0x80], //medium gray
        [0x97, 0xff, 0x97], //light green
        [0x97, 0x97, 0xff], //light blue
        [0xc0, 0xc0, 0xc0]  //light gray
    ];
}

ViceRGBPalette.prototype = new Palette();
ViceRGBPalette.prototype.constructor = ViceRGBPalette;