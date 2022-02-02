export const readyStates = {
  'uninitialized': 0, // - Has not started loading yet
  'loading': 1,       // - Object is loading its data
  'interactive': 2,   // - Has loaded enough and the user can interact with it
  'loaded': 3,        // - Object has finished loading its data
  'complete': 4,      // - Fully loaded
};

class Observable
{
  _callbacks = new Set();
  _resolved = false;

  subscribe(fn)
  {
    this._callbacks.add(fn);

    if(this._resolved)
    {
      fn();
    }
    return this;
  }

  unsubscribe(fn)
  {
    this._callbacks.delete(fn);
    return this;
  }

  complete()
  {
    if(!this._resolved)
    {
      this._resolved = true;
      this._callbacks.forEach(fn => fn());
    }
    return this;
  }
}

/**
 * @type {Map<number, Observable>}
 * @private
 */
const _readyStateObservers = new Map(
  [
    [readyStates.uninitialized, new Observable()],
    [readyStates.loading, new Observable()],
    [readyStates.interactive, new Observable()],
    [readyStates.loaded, new Observable()],
    [readyStates.complete, new Observable()],
  ],
);

let _currentReadyState = -1;

/**
 * @param {string|number} state
 * @return {Observable}
 */
export function onReadyState(state = readyStates.loaded)
{
  state = readyStates[state] || state;
  if(typeof state !== 'number' || !_readyStateObservers.has(state))
  {
    throw new Error('not a valid state');
  }

  return _readyStateObservers.get(state);
}

function _setCurrentReadyState(state)
{
  state = readyStates[state] || state;
  if(state > _currentReadyState)
  {
    _currentReadyState = state;
    Object.entries(readyStates).forEach(
      ([, s]) =>
      {
        if(s <= _currentReadyState && _readyStateObservers.has(state))
        {
          _readyStateObservers.get(s).complete();
        }
      });
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
