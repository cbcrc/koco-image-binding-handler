'use strict';

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _imageUtilities = require('image-utilities');

var _imageUtilities2 = _interopRequireDefault(_imageUtilities);

var _mappingUtilities = require('mapping-utilities');

var _mappingUtilities2 = _interopRequireDefault(_mappingUtilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

_knockout2.default.bindingHandlers.image = {
    update: function update(element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor(),
            conceptualImage = _mappingUtilities2.default.toJS(valueAccessor()),
            $element = (0, _jquery2.default)(element),
            options = _jquery2.default.extend({
            concreteImageOptions: _imageUtilities2.default.defaultConcreteImageOptions,
            displayMaxWidth: 480,
            displayMaxHeight: 270
        }, allBindings.imageOptions || {});

        var imageUrl = getImageUrl(conceptualImage, options);

        if (imageUrl) {
            if (options.displayMaxWidth && options.displayMaxHeight) {
                $element.css('max-width', options.displayMaxWidth);
                $element.css('max-height', options.displayMaxHeight);

                if (isPictoImage(conceptualImage)) {
                    imageUrl = updateImageUrlWithMaxDimensions(imageUrl, options.displayMaxWidth, options.displayMaxHeight);
                }
            }

            $element.attr('src', imageUrl);
            $element.show();
        } else {
            $element.hide();
            $element.removeAttr('src');
        }
    }
};

function getImageUrl(conceptualImage, options) {
    if (conceptualImage && conceptualImage.concreteImages) {
        var concreteImage = _imageUtilities2.default.getConcreteImage(conceptualImage, options.concreteImageOptions);
        if (concreteImage && concreteImage.mediaLink.href) {
            return concreteImage.mediaLink.href;
        }
    }

    return options.default;
}

function isPictoImage(conceptualImage) {
    return Boolean(conceptualImage && conceptualImage.contentType && conceptualImage.contentType.id === 19);
}

function updateImageUrlWithMaxDimensions(imageUrl, maxWidth, maxHeight) {
    var fitTransformation = '/w_' + maxWidth + ',h_' + maxHeight + ',c_fit';
    return imageUrl.replace('/v1/', fitTransformation + '/v1/');
}