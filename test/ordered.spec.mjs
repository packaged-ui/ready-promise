import jest from 'jest-mock';
import {onReadyState, readyStates} from '../src/index.mjs';

it('invalid', () =>
{
  expect(() => onReadyState('not-valid'))
    .toThrowError('not a valid state');
});

it('initial', () =>
{
  const cb = jest.fn();

  _setState(readyStates.uninitialized);
  expect(cb).not.toBeCalledWith(readyStates.uninitialized);
  onReadyState(readyStates.uninitialized).subscribe(() => cb(readyStates.uninitialized));
  expect(cb).toBeCalledWith(readyStates.uninitialized);

  // these will run when the state changes. even though we add them in reverse order they will be run in the correct order
  onReadyState(readyStates.interactive).subscribe(() => cb(readyStates.interactive));
  onReadyState(readyStates.loading).subscribe(() => cb(readyStates.loading));
  expect(cb).not.toBeCalledWith(readyStates.interactive);
  expect(cb).not.toBeCalledWith(readyStates.loading);
  _setState(readyStates.interactive);
  expect(cb).toBeCalledWith(readyStates.interactive);
  expect(cb).toBeCalledWith(readyStates.loading);

  _setState(readyStates.complete);
  expect(cb).not.toBeCalledWith(readyStates.complete);
  expect(cb).not.toBeCalledWith(readyStates.loaded);
  expect(cb).not.toBeCalledWith('default');
  // these will all execute immediately because we have already set the state
  onReadyState(readyStates.complete).subscribe(() => cb(readyStates.complete));
  onReadyState(readyStates.loaded).subscribe(() => cb(readyStates.loaded));
  onReadyState().subscribe(() => cb('default'));
  expect(cb).toBeCalledWith(readyStates.complete);
  expect(cb).toBeCalledWith(readyStates.loaded);
  expect(cb).toBeCalledWith('default');

  expect(cb).toHaveBeenNthCalledWith(1, readyStates.uninitialized);
  expect(cb).toHaveBeenNthCalledWith(2, readyStates.loading);
  expect(cb).toHaveBeenNthCalledWith(3, readyStates.interactive);
  expect(cb).toHaveBeenNthCalledWith(4, readyStates.complete);
  expect(cb).toHaveBeenNthCalledWith(5, readyStates.loaded);
  expect(cb).toHaveBeenNthCalledWith(6, 'default');
});

function _setState(state)
{
  document.readyState = state;
}
