# Stark

Simplified separation of components to being decoupled applications

## Design

The basic API is based off of the [Aura.js](https://github.com/aurajs/aura) project, but 99% of that API is not replicated here.

I'm looking to create a simplified project boilerplate and NOT a framework (or encompassing suite of tools).

## Conventions

There are three conventions that need to be adhered to...

1. Components need to be placed inside a `components` directory, inside a folder which matches the components name. The file itself needs to be called `component.js`. A component needs to be an object with an `init` method. See this project for examples.

2. Extensions need to be placed inside a `extensions` directory, inside a folder which matches the extension name. The file itself needs to be called `extension.js`. See this project for examples.

3. Each page should have its own bootstrap file: `boostrap-xxx.js` (where `xxx` is the page type or name). This file should include only one `require` call and that should be to the 'app' (see this project for an example) -> no other code of importance to the project should be placed inside that bootstrap file (code for the page should either be a component or a extension that is loaded by `app.js`).

...that's it.

## Example

In this example project we have two pages:

1. `index.html`
2. `about.html`

The index page loads two components:

1. 'hello' `<div data-component="hello"></div>`
2. 'world' `<div data-component="world"></div>`

The about page loads just one component:

'world' `<div data-component="world"></div>`

But the index page also uses a extension called `blah` which modifies the `String` prototype to provide an enhancement required by the index page (in this silly example, our `blah` extension just adds `BLAH!` to the end of a String.

Each page loads its own 'bootstrap' library which fires up the application and loads the relevant extensions and components.

## Build Script

We rely heavily on the conventions defined above and [Grunt](http://gruntjs.com/) to build (concatenate + minify) our components and extensions into single page specific modules.

To build the page specific modules simply run `grunt`.

### Breakdown of the custom grunt tasks

`grunt` (default task calls `get-components`)  
`grunt get-components` (builds the r.js configuration object and calls `requirejs`)  
`grunt requirejs` (executes build and does some clean-up)

## Example of optimised code

### Original `bootstrap-index`...

```js
require(['app'], function(app) {
    app.use('blah');
    app.start();
});
```

...in development this would asynchronously load both the `blah` extension and any components found within `index.html`.

### The resulting optimised `bootstrap-index`...

```js
define("bootstrap-index", function(){});

define('extensions/blah/extension',[],function(){
    if (!String.prototype.blah) {
        String.prototype.blah = function() {
            return this + ' BLAH!';
        };
    }
});

define('components/hello/component',{
    init: function() {
        console.log('hello component initialised'.blah());
    }
});

define('components/world/component',{
    init: function() {
        console.log('world component initialised');
    }
});

require(["extensions/blah/extension", "components/hello/component", "components/world/component"], function(a,b,c){
    b.init();
    c.init();
});

```