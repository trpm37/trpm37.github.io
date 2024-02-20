(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('pickerjs')) :
  typeof define === 'function' && define.amd ? define(['pickerjs'], factory) :
  (factory(global.Picker));
}(this, (function (Picker) {

  'use strict';

  Picker.languages['en-US'] = {
    format: 'MM/DD/YYYY HH:mm'
  };
})));
