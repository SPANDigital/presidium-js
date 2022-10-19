# presidium-js

React.js components for Presidium.

## Build and Publish

Requires `npm` to build, test and publish components to a local instance of `presidium-services`.

Install required dependencies:

```
$ npm install
```

Provide the location of the Presidium Services repo in your local machine:

- Create a new `.env` file in the root of presidium-js-enterprise (it will automatically be ignored by Git).
- Add a new environment variable called `API_LOCATION`.
- Set its value equal to the path of Presidium Services on your local machine. Example: `API_LOCATION = /Users/john/presidium-services`

To watch changes and automatically copy bundle to Presidium Services (or any other library that uses `presidium.js`):


```
$ npm run start
```

## Test

```bash
$ mocha --compilers js:babel-core/register --recursive test/
```
