// http://speakingjs.com/es5/ch24.html

function toUTF16(codePoint) {
    var TEN_BITS = parseInt('1111111111', 2);
    function u(codeUnit) {
        return '\\u' + codeUnit.toString(16).toUpperCase();
    }

    if (codePoint <= 0xFFFF) {
        return u(codePoint);
    }
    codePoint -= 0x10000;

    // Shift right to get to most significant 10 bits
    var leadingSurrogate = 0xD800 | (codePoint >> 10);

    // Mask to get least significant 10 bits
    var trailingSurrogate = 0xDC00 | (codePoint & TEN_BITS);

    return u(leadingSurrogate) + u(trailingSurrogate);
}

console.log(toUTF16(0x1F540))
console.log(toUTF16(0x1F541))
console.log(toUTF16(0x1F542))
console.log(toUTF16(0x1F543))
console.log(toUTF16(0x1F544))
console.log(toUTF16(0x1F545))