# ready-promise

Provides a promise backed mechanism to hook into document ReadyState changes.

DOMContentLoaded is also seamlessly blended in as `readyStates.loaded`.

## Installation

```
npm i @packaged-ui/ready-promise
```

## Usage

The function `onReadyState` takes one argument of the ReadyState you want to wait for. This argument defaults
to `loaded`. It returns a promise that will resolve as soon as the document ReadyState reaches the specified value.

## Example

```javascript
import {onReadyState, readyStates} from "@packaged-ui/ready-promise";

onReadyState(readyStates.complete)
  .then(() =>
        {
          // do something ...
        }
  );
```
