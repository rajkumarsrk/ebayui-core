"use strict";function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} // returns index of first node in NodeList with matching first character (case-insenstive)
function findNodeWithFirstChar(nodeList, char) {
    return [].concat(_toConsumableArray(nodeList)).findIndex(function (el) {return el.innerText.charAt(0).toLowerCase() === char.toLowerCase();});
}

module.exports = {
    findNodeWithFirstChar: findNodeWithFirstChar };