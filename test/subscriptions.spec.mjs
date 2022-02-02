import jest from 'jest-mock';
import {onReadyState, readyStates} from '../src/index.mjs';

it('unsubscribe', () =>
{
  // this test will register two callbacks, but the first will unregister the second
  // the second should never be called
  const cb = jest.fn();

  _setState(readyStates.uninitialized);

  const loadedCb = () => cb(readyStates.loaded);
  const completeCb = () => cb(readyStates.complete);

  onReadyState(readyStates.loaded).subscribe(
    () =>
    {
      loadedCb();
      onReadyState(readyStates.complete).unsubscribe(completeCb);
    });
  onReadyState(readyStates.complete).subscribe(completeCb);

  expect(cb).not.toBeCalledWith(readyStates.loaded);
  expect(cb).not.toBeCalledWith(readyStates.complete);

  // trigger DOMContentLoaded instead of forcibly setting readyState
  document.dispatchEvent(new CustomEvent('DOMContentLoaded'));

  expect(cb).toBeCalledWith(readyStates.loaded);
  expect(cb).not.toBeCalledWith(readyStates.complete);

  _setState(readyStates.complete);

  expect(cb).toBeCalledWith(readyStates.loaded);
  expect(cb).not.toBeCalledWith(readyStates.complete);

});

function _setState(state)
{
  document.readyState = state;
}
