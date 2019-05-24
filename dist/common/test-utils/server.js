'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}var cheerio = require('cheerio');
var expect = require('chai').expect;
var prettyPrint = require('marko-prettyprint').prettyPrintAST;
var markoCompiler = require('marko/compiler');
var CompileContext = void 0;
var Builder = void 0;

try {
    // v3 paths
    CompileContext = require('marko/compiler/CompileContext');
    Builder = require('marko/compiler/Builder');
} catch (e) {
    // v4 paths
    var target = require('marko/env').isDebug ? 'src' : 'dist';
    CompileContext = require('marko/' + target + '/compiler/CompileContext');
    Builder = require('marko/' + target + '/compiler/Builder');
}

/**
   * Get Cheerio instance based on output object from rendering
   * @param {Object} output
   */
function getCheerio(output) {
    return cheerio.load(output.html.toString());
}

/**
   * Create input to be used for rendering through test utils
   * @param {Object} input: additional input to use with test utils
   * @param {String} arrayKey: if provided, assign input as a single-entry array (for marko nested tags)
   * @param {String} baseInput: if provided, use as base for additional input
   * @param {String} parentInput: use to modify base input of parent, rather than that of arrayKey
   */
function setupInput(input, arrayKey, baseInput) {var parentInput = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var newInput = baseInput ? _extends(baseInput, input) : input;

    if (arrayKey) {
        newInput = _extends(parentInput, _defineProperty({}, arrayKey, [newInput]));
    }

    return newInput;
}

function testClassAndStyle(context, selector, arrayKey, baseInput, parentInput) {
    [
    { input: { class: { class1: true, class2: true } }, test: '.class1.class2' },
    { input: { style: { color: 'red' } }, test: '[style*="color:red"]' }].
    forEach(function (scenario) {
        var input = setupInput(scenario.input, arrayKey, baseInput, parentInput);
        var $ = getCheerio(context.render(input));
        expect($('' + selector + scenario.test).length).to.equal(1);
    });
}

function testHtmlAttributes(context, selector, arrayKey, baseInput, parentInput) {
    // check that each method is correctly supported
    ['*', 'htmlAttributes'].forEach(function (key) {
        var input = setupInput(_defineProperty({}, key, { 'aria-role': 'link' }), arrayKey, baseInput, parentInput);
        var $ = getCheerio(context.render(input));
        expect($(selector + '[aria-role=link]').length).to.equal(1);
    });
}

function getTransformerData(srcString, componentPath) {
    var templateAST = markoCompiler.parseRaw(
    srcString,
    componentPath);

    var context = new CompileContext(
    srcString,
    componentPath,
    Builder.DEFAULT_BUILDER);


    return { context: context, templateAST: templateAST };
}

function getTransformedTemplate(transformer, srcString, componentPath) {var _getTransformerData =
    getTransformerData(srcString, componentPath),context = _getTransformerData.context,templateAST = _getTransformerData.templateAST;
    context.root = templateAST;
    transformer(templateAST.body.array[0], context);
    return prettyPrint(templateAST).replace(/\n/g, '').replace(/\s{4}/g, '');
}

function runTransformer(transformer, srcString, componentPath) {var _getTransformerData2 =
    getTransformerData(srcString, componentPath),context = _getTransformerData2.context,templateAST = _getTransformerData2.templateAST;
    transformer(templateAST.body.array[0], context);
    return {
        context: context,
        el: templateAST.body.array[0] };

}

module.exports = {
    getCheerio: getCheerio,
    testClassAndStyle: testClassAndStyle,
    testHtmlAttributes: testHtmlAttributes,
    getTransformedTemplate: getTransformedTemplate,
    runTransformer: runTransformer };