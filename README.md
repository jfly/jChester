jChester [![Build Status](https://travis-ci.org/jfly/jChester.png?branch=master)](https://travis-ci.org/jfly/jChester)
========

## Setup

- `npm install` - Install project dependencies

## To develop

- `npm start` (or `grunt serve` if you've installed
  [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli)) - Starts
  a server with livereload configured. Great for development!

## To update gh-pages or release

- Update "version" in `package.json`
- `grunt publish`
- cd into `.grunt/grunt-gh-pages/gh-pages/src` and push commits to the remote
  gh-pages branch. Don't forget to push tags if doing a new release!
