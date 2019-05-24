'use strict';var ebayUIAttributeTransformer = require('../../common/transformers/ebayui-attribute');

// Transforms an `icon` attribute into an `<ebay-menu:icon>` tag
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
            value: builder.literal('inline') }]);


        var menuIconTag = context.createNodeForEl('ebay-menu:icon');
        menuIconTag.appendChild(iconTag);
        el.prependChild(menuIconTag);
    }
}

module.exports = transform;