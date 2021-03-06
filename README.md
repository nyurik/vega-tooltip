# Tooltip for Vega & Vega-Lite
[![npm version](https://img.shields.io/npm/v/vega-tooltip.svg)](https://www.npmjs.com/package/vega-tooltip)
[![](https://data.jsdelivr.com/v1/package/npm/vega-tooltip/badge)](https://www.jsdelivr.com/package/npm/vega-tooltip)
[![Build Status](https://travis-ci.org/vega/vega-tooltip.svg?branch=master)](https://travis-ci.org/vega/vega-tooltip)

A tooltip plugin for [Vega](http://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) visualizations. This plugin implements a [custom tooltip handler](https://vega.github.io/vega/docs/api/view/#view_tooltip) for Vega that uses custom HTML tooltips instead of the HTML [`title` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/title).

![demo image](demo.png "a tooltip for a Vega-Lite scatterplot")

## Demo

http://vega.github.io/vega-tooltip/

## Installing

### NPM or Yarn

Use `npm install vega-tooltip` or `yarn add vega-tooltip`.

### Using Vega-tooltip with a CDN

You can import `vega-tooltip` directly from [`jsDelivr`](https://www.jsdelivr.com/package/npm/vega-tooltip). Replace `[VERSION]` with the version that you want to use.

```html
<!-- Import Vega 3 & Vega-Lite 2 (does not have to be from CDN) -->
<script src="https://cdn.jsdelivr.net/npm/vega@3"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@2"></script>

<script src="https://cdn.jsdelivr.net/npm/vega-tooltip@[VERSION]"></script>
```

## Usage and APIs

The simplest example is to use [Vega-Embed](https://github.com/vega/vega-embed). 

```js
vegaEmbed("#vis", spec)
  .then(function(result) {
    vegaTooltip.default(result.view);
  })
  .catch(console.error);
```

See the [API documentation](docs/APIs.md) for details.

## Tutorials

1. [Creating Your Tooltip](docs/creating_your_tooltip.md)
2. [Customizing Your Tooltip](docs/customizing_your_tooltip.md)

## Run Instructions

1. In the project folder `vega-tooltip`, type command `yarn` to install dependencies.
2. Then, type `yarn start`. This will build the library and start a web server.
3. In your browser, navigate to `http://localhost:8000/`, where you can see various Vega-Lite and Vega visualizations with tooltip interaction.
