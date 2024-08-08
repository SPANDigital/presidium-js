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

---

## Conventional Commits

At SPAN we use [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) to make our commit messages more useful.

### Installation

To install the dependencies for the conventional commits, please use:
```bash
make commitlint
```

### Usage

After installation you can use `git cz` and run through the options, it will build your commit message. For example:

```
? Select the type of change that you're committing: refactor: A code change that neither fixes a bug nor adds a feature (formatting, performance improvement, etc)
? Enter JIRA issue (AK-12345) (optional): PRSDM-5026
? What is the scope of this change (e.g. component or file name): (press enter to skip) 
? Write a short, imperative tense description of the change: 
  [------------------------------------------------------------------------] 51 chars left
   refactor: PRSDM-5026 update makefile and readme
? Provide a longer description of the change: (press enter to skip)
 
? Are there any breaking changes? No
? Does this change affect any open issues? No
```

> **Important!** Any use of `breaking changes` needs to be confirmed with the team as this increments the major version number.

### Commitizen

[Commitizen](http://commitizen.github.io/cz-cli/) is a CLI tool that prompts you to fill in the required commit fields at commit time.
After the setup, you should be able to use `git cz` to build your commit messages.

[Commitizen Jira Smart Commit Plugin](https://github.com/anastariqkhan/cz-conventional-changelog-jira-smart-commits) expands to traditional
commitizen prompt to also prompts for a Jira issue and how you would like update the Jira issue. 

### Conventional Commit Intellij Plugin

If you use Intellij IDEA as your IDE, you could install the [Conventional Commit Plugin](https://plugins.jetbrains.com/plugin/13389-conventional-commit), and then
you can build your conventional commit messages directly in the IDE.

### Commit Linting

[Commitlint](https://commitlint.js.org/#/) is used for linting the commit messages on the CI pipeline to ensure that all commit messages adhere to the Conventional Commits 1.0.0 specification.

[Husky](https://typicode.github.io/husky/) is used for a [commit hook](https://commitlint.js.org/guides/local-setup.html#using-a-git-hooks-manager).

---

## Semantic Releases

This repository uses [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) tool to automate version management and package publishing.

Upon merging into to the main or develop branch, Semantic Release tool will:
- Calculate the new release version based on the commits
- Create a git commit and a git tag for the release
- Create a Release with release notes from the commit messages
- Create and publish the container images

---

## Branching

Please see this [Presidium Git Strategy Miro board](https://miro.com/app/board/uXjVPK0XxiU=/).

In summary:
- `main` ⇾ production
  - Only hotfixes or `develop` get merged into `main`
- `develop`
  - Feature branches and bug fixes are branched from and merged into `develop`
- `feat/<TITLE>`
  - If there is a feature in development it will be on a feature branch

---
