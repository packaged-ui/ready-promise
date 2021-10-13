export const readyStates = {
  'uninitialized': 0, // - Has not started loading yet
  'loading': 1,       // - Object is loading its data
  'interactive': 2,   // - Has loaded enough and the user can interact with it
  'loaded': 3,        // - Object has finished loading its data
  'complete': 4,      // - Fully loaded
};

/**
 * @param {string|number} state
 * @return {Promise}
 */
export function onReadyState(state = readyStates.loaded)
{
  state = readyStates[state] || state;
  if(typeof state !== 'number')
  {
    throw new Error('not a valid state');
  }

  let promise;
  if(!_readyStatePromises.has(state))
  {
    promise = _deferredPromise();
    _readyStatePromises.set(state, promise);

    if(_currentReadyState >= state)
    {
      // immediately resolve
      promise.resolve();
    }
  }
  else
  {
    promise = _readyStatePromises.get(state);
  }
  return promise;
}

/**
 * @type {Map<number, Promise>}
 * @private
 */
const _readyStatePromises = new Map();
let _currentReadyState = 0;

function _setCurrentReadyState(state)
{
  state = readyStates[state] || state;
  if(state > _currentReadyState)
  {
    _currentReadyState = state;
    if(_readyStatePromises.has(state))
    {
      _readyStatePromises.get(state).resolve();
    }
  }
}

document.addEventListener(
  'readystatechange', () =>
  {
    _setCurrentReadyState(document.readyState);
  },
);

document.addEventListener(
  'DOMContentLoaded', () =>
  {
    _setCurrentReadyState(readyStates.loaded);
  },
);

// initialize to current state
_setCurrentReadyState(document.readyState);

function _deferredPromise()
{
  let _resolve, _resolved = false;
  let _then = null;
  const promise = new Promise((resolve) => _resolve = resolve);
  _then = promise.then;
  promise.then = (onfulfilled, onrejected) =>
  {
    if(_resolved)
    {
      onfulfilled();
    }
    else
    {
      _then.call(promise, onfulfilled, onrejected);
    }
  };
  promise.resolve = () =>
  {
    if(!_resolved)
    {
      _resolved = true;
      _resolve();
    }
  };
  return promise;
}
