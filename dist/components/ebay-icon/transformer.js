'use strict';var path = require('path');

/**
                                          * @description
                                          * Inlines the symbol component as the body of the `ebay-icon` component (inline components only).
                                          *
                                          * @example
                                          * <ebay-icon type="inline" name="close"/>
                                          *
                                          * Becomes
                                          *
                                          * <ebay-icon type="inline" name="close"><include('$DIRNAME/symbols/close.marko')/></ebay-icon>
                                          */

function transform(el, context) {var
    builder = context.builder;
    var nameAttribute = el.getAttribute('name');
    var typeAttribute = el.getAttribute('type');
    var isInline = typeAttribute && typeAttribute.value.value === 'inline';
    var iconName = nameAttribute && nameAttribute.value.value;
    if (isInline && iconName) {
        var iconPath = path.join(__dirname, 'symbols', iconName);
        var ds4Path = path.join(iconPath, 'ds4.marko');
        var ds6Path = path.join(iconPath, 'ds6.marko');
        el.setAttributeValue('_themes', context.addStaticVar('icon_' + iconName, builder.arrayExpression([
        toRequire(ds4Path),
        toRequire(ds6Path)])));

    }

    return context;

    function toRequire(file) {
        return 'require(' + JSON.stringify(context.getRequirePath(file)) + ')';
    }
}

module.exports = transform;