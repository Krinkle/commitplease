# Commitplease

[![Travis](https://img.shields.io/travis/jzaefferer/commitplease.svg?maxAge=2592000)](http://travis-ci.org/jzaefferer/commitplease)
[![npm](https://img.shields.io/npm/dm/commitplease.svg?maxAge=2592000)](https://www.npmjs.com/package/commitplease)
[![npm](https://img.shields.io/npm/v/commitplease.svg?maxAge=2592000)](https://www.npmjs.com/package/commitplease)
[![npm](https://img.shields.io/npm/l/commitplease.svg?maxAge=2592000)](https://www.npmjs.com/package/commitplease)

This [node.js](http://nodejs.org/) module makes sure your git commit messages consistently follow one of these style guides:
 1. [jQuery Commit Guidelines][1]
 2. [AngularJS Commit Guidelines][2]

You can also start with one of these and customize the validation rules.

## Installation

```js
npm install commitplease --save-dev
```

A git version of 1.8.5 or newer is recommended. If you use `git commit --verbose`, it is required.

## Usage

Commit as usual. This module is triggered by a git commit-msg hook and automatically validates your messages as you commit them. Invalid messages will be rejected, with details on what's wrong and a copy of the input.

The following ways to begin a commit message are special and always valid:

 1. `0.0.1` or any other semantic version
 1. `WIP`, `Wip` or `wip` which means "work in progress"
 1. `Merge branch [...]` or `Merge <commitish> into <commitish>`
 1. `fixup!` or `squash!` which are generated by `git commit --fixup` and `--squash`

Another special scenario is to do `git commit --no-verify` which will skip the commit-msg hook and bypass commitplease.

Common commit messages follow one of the style guides ([jQuery Commit Guidelines][1] by default)

## Setup

You can configure commitplease from `package.json` of your project. Here are the options common for all style guidelines:

```json
{
  "commitplease": {
    "limits": {
      "firstLine": "72",
      "otherLine": "80"
    },
    "nohook": false,
    "markerPattern": "^(clos|fix|resolv)(e[sd]|ing)",
    "actionPattern": "^([Cc]los|[Ff]ix|[Rr]esolv)(e[sd]|ing)\\s+[^\\s\\d]+(\\s|$)",
    "ticketPattern": "^(Closes|Fixes) (.*#|gh-|[A-Z]{2,}-)[0-9]+",
  }
}
```

 * `limits.firstLine` and `limits.otherLine` are the hard limits for the number of symbols on the first line and on other lines of the commit message, respectively.
 * `"nohook": false` tells commitplease to attempt to install its own `commit-msg` hook. Setting `"nohook": true` can be used when wrapping the commitplease validation API into another module, like a [grunt plugin](https://github.com/rxaviers/grunt-commitplease/) or [husky](#husky)

The following options are experimental and are subject to change:

 * `markerPattern`: A (intentionally loose) RegExp that indicates that the line might be a ticket reference. Case insensitive.
 * `actionPattern`: A RegExp that makes a line marked by `markerPattern` valid even if the line does not fit `ticketPattern`
 * `ticketPattern`: A RegExp that detects ticket references: `Closes gh-1`, `Fixes gh-42`, `WEB-451` and similar.

The ticket reference match will fail only if `markerPattern` succeeds and __both__ `ticketPattern` and `actionPattern` fail.

When overwriting these patterns in `package.json`, remember to escape special characters.

### jQuery

Here is how to use and configure validation for [jQuery Commit Guidelines][1]:

```json
{
  "commitplease": {
    "style": "jquery",
    "component": true,
    "components": []
  }
}
```

 * `"style": "jquery"` selects [jQuery Commit Guidelines][1]
 * `"component": true` requires a component followed by a colon, like `Test:` or `Docs:`
 * `"components": []` is a list of valid components. Example: `"components": ["Test", "Docs"]`. When this list is empty, anything followed by a colon is considered to be a valid component name.

### AngularJS

Here is how to use and configure validation for [AngularJS Commit Guidelines][2]

```json
{
  "commitplease": {
    "style": "angular",
    "types": [
      "feat", "fix", "docs", "style", "refactor", "perf", "test", "chore"
    ],
    "scope": "\\S+.*"
  }
}
```

 * `"style": "angular"` selects [AngularJS Commit Guidelines][2]
 * `"types"` is an array of allowed types
 * `"scope": "\\S+.*"` is a string that is the regexp for scope. By default it means "at least one non-space character"

## Husky

When using commitplease together with [husky][3], the following will let husky manage all the hooks and trigger commitplease:

```json
{
  "scripts": {
    "commitmsg": "commitplease"
  },
  "commitplease": {
    "nohook": true
  }
}
```

However, since husky does not use npm in silent mode (and there is [no easy way](https://github.com/typicode/husky/pull/47) to make it [do so](https://github.com/npm/npm/issues/5452)), there will be a lot of additional output when a message fails validation. Therefore, using commitplease alone is recommended.

## API

```js
var validate = require('commitplease/lib/validate');
var errors = validate(commit.message);
if (errors.length) {
  postComment('This commit has ' + errors.length + ' problems!');
}
```

`validate(message[, options])`, returns `Array`

* `message` (`String`): the commit message to validate. Must use LF (`\n`) as line breaks.
* `options` (`Object`, optional): use this to override the default settings
* returns `Array`: empty for valid messages, one or more items as `String` for each problem found

## Examples

```json
{
  "name": "awesomeproject",
  "description": "described",
  "devDependencies": {
    "commitplease": "latest",
  },
  "commitplease": {
    "style": "jquery",
    "components": ["Docs", "Tests", "Build", "..."],
    "markerPattern": "^((clos|fix|resolv)(e[sd]|ing))|(refs?)",
    "ticketPattern": "^((Closes|Fixes) ([a-zA-Z]{2,}-)[0-9]+)|(Refs? [^#])"
  }
}
```

```json
{
  "name": "awesomeproject",
  "description": "described",
  "devDependencies": {
    "commitplease": "latest",
  },
  "commitplease": {
    "style": "angular",
    "markerPattern": "^((clos|fix|resolv)(e[sd]|ing))|(refs?)",
    "ticketPattern": "^((Closes|Fixes) ([a-zA-Z]{2,}-)[0-9]+)|(Refs? [^#])"
  }
}
```

## License
Copyright Jörn Zaefferer  
Released under the terms of the MIT license.

---

Support this project by [donating on Gratipay](https://gratipay.com/jzaefferer/).

[1]: http://contribute.jquery.org/commits-and-pull-requests/#commit-guidelines
[2]: https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit
[3]: https://github.com/typicode/husky