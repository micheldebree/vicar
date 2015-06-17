/*global Uint8Array, Blob, URL*/
function KoalaPicture() {

    'use strict';
    
    // 2 bytes load address (default $6000)
    this.loadAddress = new Uint8Array(2);
    this.loadAddress[0] = 0;
    this.loadAddress[1] = 0x60;
    
    // 8000 bytes bitmap data
    this.bitmap = new Uint8Array(8000);
    // 1000 bytes of screenram ($0400)
    this.screenRam = new Uint8Array(1000);
    // 1000 bytes of colorram ($d800)
    this.colorRam = new Uint8Array(1000);
    
    // 1 byte background color
    this.background = new Uint8Array(1);
    
}

KoalaPicture.prototype.read = function (arrayBuffer) {
    
    'use strict';
    
    this.loadAddress = new Uint8Array(arrayBuffer, 0, 2);
    this.bitmap = new Uint8Array(arrayBuffer, 2, 8000);
    this.screenRam = new Uint8Array(arrayBuffer, 8002, 1000);
    this.colorRam = new Uint8Array(arrayBuffer, 9002, 1000);
    this.background = new Uint8Array(arrayBuffer, 10002, 1);
};

KoalaPicture.prototype.concat = function (arrayBuffers) {
    
    'use strict';
    
    var i,
        ii,
        iii,
        outputLength = 0,
        result;
       
    // measure final size
    for (i = 0; i < arrayBuffers.length; i += 1) {
        outputLength += arrayBuffers[i].length;
    }
    
    result = new Uint8Array(outputLength);
    
    for (i = 0; i < arrayBuffers.length; i += 1) {
        for (ii = 0; ii < arrayBuffers[i].length; ii += 1) {
            result[iii] = arrayBuffers[i][ii];
            iii += 1;
        }
    }
    
    return result;
    
    
};

KoalaPicture.prototype.toUrl = function () {
    
    'use strict';
    
    var buffers = [],
        koalaStream,
        blob;
    
    buffers.push(this.loadAddress);
    buffers.push(this.bitmap);
    buffers.push(this.screenRam);
    buffers.push(this.colorRam);
    buffers.push(this.background);
    
    koalaStream = this.concat(buffers);
    
    blob = new Blob(koalaStream, {type: 'application/octet-binary'});
    
    return URL.createObjectURL(blob);

};