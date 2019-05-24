'use strict';var ebayUIAttributeTransformer = require('../../common/transformers/ebayui-attribute');

// Transforms an `icon` attribute into an `<ebay-textbox:icon>` tag
function transform(el, context) {
    ebayUIAttributeTransformer(el, context);

    var builder = context.builder;
    var iconAttribute = el.getAttribute('icon');
    var iconName = iconAttribute && iconAttribute.value.value;
    if (iconName) {
        var iconTag = context.createNodeForEl('ebay-icon', [
        {
            name: 'name',
            value: builder.literal(iconName) },

        {
            name: 'type',
            value: builder.literal('inline') },

        {
            name: 'no-skin-classes',
            value: builder.literalTrue() },

        {
            name: 'class',
            value: builder.literal('textbox__icon') }]);


        var ebayTextIconTag = context.createNodeForEl('ebay-textbox:icon');
        ebayTextIconTag.appendChild(iconTag);
        el.prependChild(ebayTextIconTag);
    }
}

module.exports = transform;