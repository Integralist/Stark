# Stark

Simplified separation of components into decoupled applications.

This isn't a framework (or all-encompassing suite of tools). It is a 'strategy', a pattern for handling the architecture of your code. I feel this particular strategy works very well and keeps code simple and decoupled and performant (through the use of a custom build script).

## CSS Design

We're using an inheritance pattern, which means we have the following files:

- core experience (for non-js devices)
- groups 1-4 (enhanced core experience for js-enabled devices)
- components (all other functionality)

Each 'group' inherits the styles from the group before it.

The components encapsulate their own logic for handling viewport dimensions.

## Extra output in our CSS?

In our simplified example it would look like there is a lot of code being generated, but this is because our examples are bad.

In a real project, the styles don't change that much when moving up the break-points. For example, a brand logo will generally look the same across all break-points with the exception that it might be floated or positioned different on desktop sized device compared to the rest of the devices you're testing against.

So don't take the generated CSS output from this repo as a representation of your own project.

## JavaScript Design

The basic API is based off of the [Aura.js](https://github.com/aurajs/aura) project, but 99% of that API is not replicated here.

I'm looking to create a simplified project boilerplate and NOT a framework (or encompassing suite of tools).

## JavaScript Conventions

There are three conventions that need to be adhered to...

1. Components need to be placed inside a `components` directory, inside a folder which matches the components name. The file itself needs to be called `component.js`. A component needs to be an object with an `init` method. See this project for examples.

2. Extensions need to be placed inside a `extensions` directory, inside a folder which matches the extension name. The file itself needs to be called `extension.js`. See this project for examples. 

	Note: extensions can't be passed to a component so make sure your 'extensions' are globally available by attaching them to a single global namespace called `app` (defined inside the app.js file). 
	
	**And don't mistake the phrase "Don't polute the global namespace" with "Don't ever use the global namespace ever ever ever" -> that's just dogmatic nonsense.**

3. Each page should have its own bootstrap file: `boostrap-xxx.js` (where `xxx` is the page type or name). This file should include only one `require` call and that should be to the 'app' (see this project for an example) -> no other code of importance to the project should be placed inside that bootstrap file (code for the page should either be a component or a extension that is loaded by `app.js`).

...that's it.

## JavaScript Example

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

`grunt build` (calls custom task `get-components`)  
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

### The resulting concatenated `bootstrap-index`...

Note: this would be minified but for the sake of readability I turned off the minification process.

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

## Parsing?

In this build script I read the `.html` files looking for components. But if all your components are dynamically inserted server-side by a config file (like BBC News) then you just need to change the build script to look at your config file instead (you'd need to enforce a naming convention to make it easy for the build script to parse the config file)

## API

- `app.use('extension', 'extension', 'extension')` loads specified extensions
- `a.start()` goes through the HTML looking for components to load

## Component usage

It's fine for Components to specify their own dependencies. So if all your dependencies require jQuery then it's ok to specifically inject that dependency into each module. When it comes to running the build script the jQuery module will only be included once, and being explicit with your dependencies means the component is easier to move into another project as the dependencies are clearly stated.

## Extension usage

Extensions aren't injectable into a component so they need to be made available on the single global namespace `window.app`.

The app.js module declares `window.app` (which is an object you can hook onto). The mediator library is an example of using this hook to make the mediator code available within a component.

## TODO

- Move from Sass to Stylus
- Integrate Mediator pattern into new components to demonstrate how they can work