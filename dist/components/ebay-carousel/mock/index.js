'use strict';var renderBody = function renderBody(stream) {return stream.write('text');};
var itemWidth = 200;
var item = { renderBody: renderBody, style: 'width:' + itemWidth + 'px' };
var threeItems = [item, item, item];
var sixItems = threeItems.concat(threeItems);
var twelveItems = sixItems.concat(sixItems);

// mocks for visual debugging
var debugItem = { renderBody: renderBody, style: 'height:200px;width:400px;background:gray' };
var debugItems = [debugItem, debugItem, debugItem, debugItem, debugItem, debugItem];

module.exports = { renderBody: renderBody, itemWidth: itemWidth, item: item, threeItems: threeItems, sixItems: sixItems, twelveItems: twelveItems, debugItems: debugItems };