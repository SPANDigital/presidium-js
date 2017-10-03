# presidium-js

React.js components for Presidium.

## Build and Publish

Requires `npm` to build, test and publish components to a local instance of `presidium-core`.

Install required dependencies:

```
$ npm install
```

To start a local server for testing components:

```
$ npm start
```

To watch changes and automatically copy bundle to `../presidium-template` (or any other library that uses `presidium.js`):

```
$ npm run watch:local-copy

//Note: the file copy defaults to "presidium-template". To update, simply edit "webpack.config.js".
```



To publish components to a local instance of `../presidium-core`:

```
$ npm run publish:core
```

To watch changes and automatically publish to `../presidium-core`:

```
$ npm run watch:local
and
$ npm run watch:core
```




## Test

```bash
$ mocha --compilers js:babel-core/register --recursive test/
```
