'use strict';var iconRenderBody = function iconRenderBody(stream) {return stream.write('icon');};
var renderBody = function renderBody(text) {return function (stream) {return stream.write(text);};};
var customLabel = { renderBody: renderBody('<span>customLabel</span>') };
var twoItems = [{ renderBody: renderBody('a') }, { renderBody: renderBody('b') }];
var threeItems = [{ renderBody: renderBody('a') }, { renderBody: renderBody('b') }, { renderBody: renderBody('c') }];

module.exports = { iconRenderBody: iconRenderBody, renderBody: renderBody, customLabel: customLabel, twoItems: twoItems, threeItems: threeItems };