var Key1 = {
  _pressed: {},

  W: 87, 
  S: 83,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

var Key2 = {
  _pressed: {},

  UP_ARROW: 38,
  DOWN_ARROW: 40,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

window.addEventListener('keyup', function(event) { Key1.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key1.onKeydown(event); }, false);

window.addEventListener('keyup', function(event) { Key2.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key2.onKeydown(event); }, false);