# Stark

Simplified separation of components into decoupled applications.

This isn't a framework (or all-encompassing suite of tools). It is a 'strategy', a pattern for handling the architecture of your code. I feel this particular strategy works very well and keeps code simple and decoupled and performant (through the use of a custom build script).

## API

- `app.use('extension', 'extension', 'extension')` loads specified extensions
- `app.start()` goes through the HTML looking for components to load

Also uses RequireJS and AMD to wrap the above API calls, for example...

```js
// the only part of this code that needs to change
// is the list of extensions you want to use
// the rest is standard (read: required to be run)
require(['app', 'configuration'], function(app) {
    app.use('extension-a', 'extension-b');
    app.start();
});
```

## Example

HTML...

```html
<div data-component="hello" id="js-component-hello">hello</div>
<div data-component="world" id="js-component-world">world</div>
<script src="libs/require.js" data-main="bootstrap-about" async></script>
```

Bootstrap... 

```js
require(['app', 'configuration'], function(app) {
    app.use('mediator', 'extension-a', 'extension-b');
    app.start();
});
```

Component...

```js
define({
    init: function() {
        console.log('an example component');
    }
});
```

Extension...

```js
// Silly example
define(function(){
    if (!String.prototype.blah) {
        String.prototype.blah = function() {
            return this + ' BLAH!';
        };
    }
});
```

## Conventions

We do require you to implement a few conventions (for the build script to work properly). 

We're not talking Ruby on Rails level of 'convention over configuration', but just a few small conventions need to be adhered to and luckily none of them are confusing or complicated. 

I clarify them in more detail later, but in summary the conventions are...

- HTML components need a `data-attribute` and an `id`
- The data attribute needs to be like: `data-component="xxx"`
- The id attribute needs to be like: `id="js-component-xxx"`
- The `xxx` needs to be the name of the component
- Components are placed inside a `/components/` directory
- Extensions are placed inside a `/extensions/` directory
- Each page has its own bootstrap js file `boostrap-xxx.js`
- JavaScript needs to be loaded at the bottom of the page

## CSS Design

We have the following files:

- core experience (for non-js devices)
- groups 1-4 (enhanced core experience for js-enabled devices)
- components (all other functionality)

We're using a form of an inheritance pattern.

Through the use of media queries, each 'group' inherits the styles from the group before it. 

e.g. group 1 sets some styles, group 2 only sets additional styles it needs for that particular break-point, but relies on the group 1 styles that came before it.

The components encapsulate their own logic for handling viewport dimensions.

## Extra output in our CSS?

In our simplified example it would look like there is a lot of code being generated, but this is because our examples aren't great.

In a real project, the styles don't change that much when moving up the break-points. For example, a brand logo will generally look the same across all break-points with the exception that it might be floated or positioned different on desktop sized device compared to the rest of the devices you're testing against.

So don't take the generated CSS output from this repo as a representation of your own project.

## JavaScript Design

The basic API is based off of the [Aura.js](https://github.com/aurajs/aura) project, but 99% of that API is not replicated here.

I'm looking to create a simplified project boilerplate and NOT a framework (or encompassing suite of tools).

## JavaScript Conventions

There are few conventions that need to be adhered to...

1. Components need to be placed inside a `components` directory, inside a folder which matches the components name. The file itself needs to be called `component.js`. A component needs to be an object with an `init` method. See this project for examples.

    Note: we store off the component's container (e.g. `<div data-component="xxx">`) in the global app namespace `window.app.components.xxx` so you can do what you like with it within the component (e.g. you might want to completely replace that container for some new HTML). For the build script to be able to do this you need to have added an `id` to your component container that matches your component name (e.g. `<div data-component="xxx" id="js-component-xxx">"`) -> notice the naming convention of `js-component-nameOfComponent`.

    When we create HTML elements and inject them into the DOM we use `id` attributes for referencing those elements (as that is the quickest and most efficient way to access a DOM node). We also use the following naming convention: `js-nameImGoingToUse` (notice the camelCase)

2. Extensions need to be placed inside a `extensions` directory, inside a folder which matches the extension name. The file itself needs to be called `extension.js`. See this project for examples. 

	Note: extensions can't be passed to a component so make sure your 'extensions' are globally available by attaching them to a single global namespace called `app` (defined inside the app.js file). If you change the name then remember to update the grunt-customtasks.js as well.
	
	**And don't mistake the phrase "Don't polute the global namespace" with "Don't ever use the global namespace ever ever ever" -> that's just dogmatic nonsense.**

3. Each page should have its own bootstrap file: `boostrap-xxx.js` (where `xxx` is the page type or name). This file should include only one `require` call and that should be to the 'app' (see this project for an example) -> no other code of importance to the project should be placed inside that bootstrap file (code for the page should either be a component or a extension that is loaded by `app.js`).

4. JavaScript needs to be loaded at the bottom of the page. This is because when running our code in development we are asynchronously loading modules and then storing off the relevant HTML elements in a global namespace for our components to utilise however they need to. But this creates a waterfall effect for our network loading and so in production we don't want that -> hence our build script takes care of that. But for the code not to error we need to grab the elements in the page and store them off using `getElementById` and so the scripts need to be loaded at the bottom of the page for that to work.

...that's it.

## Build Script

We rely heavily on the conventions defined above and [Grunt](http://gruntjs.com/) to build (concatenate + minify) our components and extensions into single page specific modules.

To build the page specific modules simply run `grunt build`.

### Breakdown of the custom grunt tasks

`grunt build` (calls custom task `get-components`)  
`grunt get-components` (builds the r.js configuration object and calls `requirejs`)  
`grunt requirejs` (executes build and does some clean-up)

## Example of optimised code

### HTML for 'about' page...

```html
<div data-component="world" id="js-component-world">World</div>
<div data-component="contacts" id="js-component-contacts"></div>
```

note: the `contacts` component has a dependency on jQuery

### Original `bootstrap-about`...

```js
require(['app', 'configuration'], function(app) {
    app.use('blah', 'mediator');
    app.start();
});
```

...in development this would asynchronously load both the `blah` and `mediator` extensions and any components found within `index.html`.

### The resulting concatenated `bootstrap-about`...

Note: this would be minified but for the sake of readability I turned off the minification process.

```js
window.app = {
    components: {
        "world": document.getElementById("js-component-world"),
        "contacts": document.getElementById("js-component-contacts")
    }
};

define("bootstrap-about", function () {});

define('extensions/blah/extension', [], function () {
    if (!String.prototype.blah) {
        String.prototype.blah = function () {
            return this + ' BLAH!';
        };
    }
});

define('extensions/mediator/extension', [], function () {
    var mediator = (function () {
        var subscribe = function (channel, fn) {
            if (!mediator.channels[channel]) {
                mediator.channels[channel] = [];
            }

            mediator.channels[channel].push({
                context: this,
                callback: fn
            });

            return this;
        },

            publish = function (channel) {
                if (!mediator.channels[channel]) {
                    return false;
                }

                var args = Array.prototype.slice.call(arguments, 1);

                for (var i = 0, l = mediator.channels[channel].length; i < l; i++) {
                    var subscription = mediator.channels[channel][i];
                    subscription.callback.apply(subscription.context, args);
                }

                return this;
            };

        return {
            channels: {},
            publish: publish,
            subscribe: subscribe,
            wrap: function (obj) {
                obj.subscribe = subscribe;
                obj.publish = publish;
            }
        };

    }());

    window.app.mediator = mediator;

    return mediator;
});

define('components/world/component', {
    init: function () {
        console.log('world component initialised');

        if (window.app.mediator) {
            console.log('app.mediator', app.mediator);
        }
    }
});

/*!
 * jQuery JavaScript Library v2.0.3 -sizzle,-event-alias,-effects,-deprecated
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-07T17:13Z
 */
(function (window, undefined) {

    // jQuery code

})(window);

define('components/contacts/component', ['jquery'], function ($) {
    return {
        init: function () {
            this.container = window.app.components.contacts;
        }
    };
});
require(["extensions/blah/extension", "extensions/mediator/extension", "components/world/component", "components/contacts/component"], function (a, b, c, d) {
    c.init();
    d.init();
});
```

## Parsing?

In this build script I read the `.html` files looking for components. But if all your components are dynamically inserted server-side by a config file (like BBC News) then you would need to change the build script to look at a config file and parse that type of file instead (you'd also need to enforce a naming convention to make it easy for the build script to parse the config file)

## Component usage

It's fine for Components to specify their own dependencies. So if all your dependencies require jQuery then it's ok to specifically inject that dependency into each module. 

When it comes to running the build script the jQuery module will only be included once, and being explicit with your dependencies means the component is easier to move into another project as the dependencies are clearly stated.

## Extension usage

Extensions aren't injectable into a component so they need to be made available on the single global namespace `window.app`.

The app.js module declares `window.app` (which is an object you can hook onto). The mediator library is an example of using this hook to make the mediator code available within a component.

## TODO

- Fix issue with build script where we grab references to all components where we should only be getting references to components on a specific page (this is a flaw that I'm not sure yet how to resolve as we're using a r.js' `wrap` property to inject the global property at the top of the concatenated file) -> Possibly, use `wrap` to inject the window.app.component and then for each bootstrap-xxx read we determine the component elements to grab
- Start building out common components based on BBC News website -> ensuring they are flexible and adaptable to different break-points and that they communicate efficiently via the mediator communication object.
- Move from Sass to Stylus (can't do until Stylus gets support for passing code blocks)