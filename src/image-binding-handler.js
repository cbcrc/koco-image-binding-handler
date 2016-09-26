// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import ko from 'knockout';
import $ from 'jquery';
import imageUtilities from 'koco-image-utilities';

const defaultImageOptions = {
  concreteImageOptions: imageUtilities.defaultConcreteImageOptions,
  displayMaxWidth: 480,
  displayMaxHeight: 270
};

function getImageUrl(conceptualImage, options) {
  if (conceptualImage && conceptualImage.concreteImages) {
    const concreteImage = imageUtilities.getConcreteImage(conceptualImage, options.concreteImageOptions);
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
  const fitTransformation = `/w_${maxWidth},h_${maxHeight},c_limit`;
  return imageUrl.replace('/v1/', `${fitTransformation}/v1/`);
}

function setImage($element, conceptualImage, imageOptions) {
  const options = $.extend({}, defaultImageOptions, ko.toJS(imageOptions));
  let imageUrl = getImageUrl(conceptualImage, options);

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

ko.bindingHandlers.image = {
  update(element, valueAccessor, allBindingsAccessor) {
    const $element = $(element);
    const conceptualImage = ko.toJS(valueAccessor());
    const imageOptionsBinding = allBindingsAccessor.get('imageOptions');
    const imageOptions = ko.toJS(imageOptionsBinding);

    setImage($element, conceptualImage, imageOptions);

    if (ko.isObservable(imageOptionsBinding)) {
      const subscription = imageOptionsBinding.subscribe(newOptions => setImage($element, conceptualImage, newOptions));
      ko.utils.domNodeDisposal.addDisposeCallback(element, () => { subscription.dispose(); });
    }
  }
};
