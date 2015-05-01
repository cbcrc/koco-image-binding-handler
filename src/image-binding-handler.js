// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['knockout', 'jquery', 'image-utilities',
    'knockout-mapping-utilities'],
    function(ko, $, imageUtilities, mappingUtilities) {
        'use strict';

        //Afficher un loading spinner pendant que l'image load jQuery et utiliser le width et le height de l'image loadée pour faire le redimensionnement

        ko.bindingHandlers.image = {
            update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                var value = valueAccessor(),
                    allBindings = allBindingsAccessor(),
                    valueUnwrapped = mappingUtilities.toJS(value),
                    $element = $(element),
                    options = $.extend({
                        concreteImageOptions: imageUtilities.defaultConcreteImageOptions,
                        displayMaxWidth: 480,
                        displayMaxHeight: 270
                    }, allBindings.imageOptions || {});

                var src = null;

                if (options.default) {
                    src = options.default;
                }

                if (valueUnwrapped && valueUnwrapped.concreteImages) {
                    var concreteImage = imageUtilities.getConcreteImage(valueUnwrapped, options.concreteImageOptions);

                    if (concreteImage) {
                        if (concreteImage.mediaLink.href) {
                            src = concreteImage.mediaLink.href;
                        }
                    }
                }

                if (src) {
                    if (options.displayMaxWidth && options.displayMaxHeight) {
                        var fake = document.createElement('img');

                        fake.onload = function() {
                            //http://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio

                            var maxWidth = options.displayMaxWidth; // Max width for the image
                            var maxHeight = options.displayMaxHeight; // Max height for the image

                            var width = this.width; // Current image width
                            var height = this.height; // Current image height

                            var isLandscape = width >= height;

                            var ratio = 0;

                            if (isLandscape) {
                                ratio = maxWidth / width;
                                height = height * ratio;
                                width = maxWidth;

                                if (height > maxHeight) {
                                    ratio = maxHeight / height;
                                    width = width * ratio;
                                    height = maxHeight;
                                }

                            } else {
                                ratio = maxHeight / height;
                                width = width * ratio;
                                height = maxHeight;

                                if (width > maxWidth) {
                                    ratio = maxWidth / width;
                                    height = height * ratio;
                                    width = maxWidth;
                                }
                            }

                            $element.css('max-height', height);
                            $element.css('max-width', width);

                            $element.attr('src', src);
                            $element.show();
                        };

                        //preload
                        fake.src = src;
                    } else {
                        $element.attr('src', src);
                        $element.show();
                    }
                } else {
                    $element.hide();
                    $element.removeAttr('src');
                }
            }
        };
});
