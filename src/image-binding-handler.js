// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import ko from 'knockout';
import $ from 'jquery';
import imageUtilities from 'image-utilities';
import mappingUtilities from 'mapping-utilities';


ko.bindingHandlers.image = {
    update: function(element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor(),
            conceptualImage = mappingUtilities.toJS(valueAccessor()),
            $element = $(element),
            options = $.extend({
                concreteImageOptions: imageUtilities.defaultConcreteImageOptions,
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
        var concreteImage = imageUtilities.getConcreteImage(conceptualImage, options.concreteImageOptions);
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
