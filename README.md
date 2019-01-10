# presidium-js

React.js components for Presidium.

## Build and Publish

Requires `yarn` to build, test and publish components to a local instance of `presidium-core`.

Install required dependencies:

```
$ yarn install
```

To start a local server for testing components:

```
$ yarn start
```

To watch changes and automatically copy bundle to `../presidium-template` (or any other library that uses `presidium.js`):

```
$ yarn run watch:local-copy

//Note: the file copy defaults to "presidium-template". To update, simply edit "webpack.config.js".
```

To publish components to a local instance of `../presidium-core`:

```
$ yarn run publish:core
```

To watch changes and automatically publish to `../presidium-core`:

```
$ yarn run watch:local
and
$ yarn run watch:core
```

## Stats 

To see stats for the Webpack bundle size, run:

```
$ yarn run bundle-stats
```


## Test

```bash
$ mocha --compilers js:babel-core/register --recursive test/
```
