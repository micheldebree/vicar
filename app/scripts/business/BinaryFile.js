/*global Uint8Array, Blob, URL */
function BinaryFile() {
    'use strict';
}

/**
 * Concatenate multiple 8-bit array buffers into one.
 */
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

/**
 * Get a URL for downloading the 'file' which consists of a list
 * of buffers.
 */
BinaryFile.prototype.toObjectUrl = function (buffers) {
    'use strict';
    return URL.createObjectURL(new Blob([this.concat(buffers)], {type: 'application/octet-binary'}));
};
