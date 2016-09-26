(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['knockout', 'jquery', 'koco-image-utilities'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('knockout'), require('jquery'), require('koco-image-utilities'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.knockout, global.jquery, global.kocoImageUtilities);
    global.imageBindingHandler = mod.exports;
  }
})(this, function (_knockout, _jquery, _kocoImageUtilities) {
  'use strict';

  var _knockout2 = _interopRequireDefault(_knockout);

  var _jquery2 = _interopRequireDefault(_jquery);

  var _kocoImageUtilities2 = _interopRequireDefault(_kocoImageUtilities);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var defaultImageOptions = {
    concreteImageOptions: _kocoImageUtilities2.default.defaultConcreteImageOptions,
    displayMaxWidth: 480,
    displayMaxHeight: 270
  }; // Copyright (c) CBC/Radio-Canada. All rights reserved.
  // Licensed under the MIT license. See LICENSE file in the project root for full license information.

  function getImageUrl(conceptualImage, options) {
    if (conceptualImage && conceptualImage.concreteImages) {
      var concreteImage = _kocoImageUtilities2.default.getConcreteImage(conceptualImage, options.concreteImageOptions);
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
    var fitTransformation = '/w_' + maxWidth + ',h_' + maxHeight + ',c_limit';
    return imageUrl.replace('/v1/', fitTransformation + '/v1/');
  }

  function setImage($element, conceptualImage, imageOptions) {
    var options = _jquery2.default.extend({}, defaultImageOptions, _knockout2.default.toJS(imageOptions));
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

  _knockout2.default.bindingHandlers.image = {
    update: function update(element, valueAccessor, allBindingsAccessor) {
      var $element = (0, _jquery2.default)(element);
      var conceptualImage = _knockout2.default.toJS(valueAccessor());
      var imageOptionsBinding = allBindingsAccessor.get('imageOptions');
      var imageOptions = _knockout2.default.toJS(imageOptionsBinding);

      setImage($element, conceptualImage, imageOptions);

      if (_knockout2.default.isObservable(imageOptionsBinding)) {
        (function () {
          var subscription = imageOptionsBinding.subscribe(function (newOptions) {
            return setImage($element, conceptualImage, newOptions);
          });
          _knockout2.default.utils.domNodeDisposal.addDisposeCallback(element, function () {
            subscription.dispose();
          });
        })();
      }
    }
  };
});