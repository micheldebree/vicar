/*global Uint8Array, Blob, URL */
function BinaryFile() {
    'use strict';
}

BinaryFile.prototype.concat = function (arrayBuffers) {
    
    'use strict';
    
    var i,
        ii,
        iii = 0,
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


BinaryFile.prototype.toObjectUrl = function (buffers) {

    'use strict';
    
    var stream = this.concat(buffers),
        blob = new Blob([stream], {type: 'application/octet-binary'});
    
    return URL.createObjectURL(blob);
    
};