# ready-promise

Provides an observable mechanism to hook into document ReadyState changes.

DOMContentLoaded is also seamlessly blended in as `readyStates.loaded`.

## Installation

```
npm i @packaged-ui/ready-promise
```

## Usage

The function `onReadyState` takes one argument of the ReadyState you want to wait for. This argument defaults
to `loaded`. It returns an observable object that will complete as soon as the document ReadyState reaches the specified
value.

Each observable state exposes `subscribe` and `unsubscribe` methods which accept a callback that will be called on
completion.

## Example

```javascript
import {onReadyState, readyStates} from "@packaged-ui/ready-promise";

onReadyState(readyStates.complete)
  .subscribe(
    () =>
    {
      // do something ...
    }
  )
  .unsubscribe(fn);
```
