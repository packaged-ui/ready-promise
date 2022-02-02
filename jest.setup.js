let _state = 'uninitialized';

Object.defineProperty(document, 'readyState', {
  get() { return _state; },
  set(v)
  {
    _state = v;
    document.dispatchEvent(new CustomEvent('readystatechange'));
  },
});
