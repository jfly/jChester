jChester [![Build Status](https://travis-ci.org/jfly/jChester.png?branch=master)](https://travis-ci.org/jfly/jChester)
========

## Setup

- `npm install` - Install project dependencies

## To develop

- `npm start` (or `grunt serve` if you've installed
  [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli)) - Starts
  a server with livereload configured. Great for development!

## To update gh-pages or release

1. If doing a release, update "version" in `package.json`
2. `grunt publish`
3. cd into `.grunt/grunt-gh-pages/gh-pages/src` and push commits to the remote
  gh-pages branch. If you updated the version in step 1, don't forget to push
  tags as well.
