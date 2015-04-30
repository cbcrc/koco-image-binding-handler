# koco-image-binding-handler
Knockout image binding handler.

## Installation

```bash
bower install koco-image-binding-handler
```

## Usage with KOCO

This is a shared module that is used in many other module. The convention is to configure an alias in the `require.configs.js` with the name `string-utilties` like so:

```javascript
paths: {
  ...
  'knockout-image-binding-handler' : 'bower_components/koco-image-binding-handler/src/image-binding-handler'
  ...
}
```