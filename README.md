# Stark

Simplified separation of components into decoupled applications.

This isn't a framework (or all-encompassing suite of tools). It is a 'strategy', a pattern for handling the architecture of your code. I feel this particular strategy works very well and keeps code simple and decoupled and performant (through the use of a custom build script).

## Table of contents

- [API](#api)
- [Example](#example)
- [Conventions](#conventions)
- [CSS Design](#css-design)
- [Non-JavaScript Components](#non-javascript-components)
- [Components vs Patterns?](#components-vs-patterns)
- [Grid System](#grid-system)
- [Browser support](#browser-support)
- [Extra output in our CSS?](#extra-output-in-our-css)
- [JavaScript Design](#javascript-design)
- [JavaScript Conventions](#javascript-conventions)
- [Build Script](#build-script)
- [Example of optimised code](#example-of-optimised-code)
- [Parsing?](#parsing)
- [Component usage](#component-usage)
- [Extension usage](#extension-usage)
- [TODO](#todo)

## API

- `app.use('extension', 'extension', 'extension')` loads specified extensions
- `app.start()` goes through the HTML looking for components to load

We also use RequireJS and AMD to wrap the above API calls, for example...

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
- Components need to have an `init` method

## CSS Design

We have the following files:

- core experience (for non-js devices)
- groups 1-4 (enhanced core experience for js-enabled devices)
- components (all other functionality)

We're using a form of an inheritance pattern.

Through the use of media queries, each 'group' inherits the styles from the group before it. 

e.g. group 1 sets some styles, group 2 only sets additional styles it needs for that particular break-point, but relies on the group 1 styles that came before it.

The components encapsulate their own logic for handling viewport dimensions.

## Non-JavaScript Components

Some components you create will have no need for JavaScript. If that's the case then it's best to create them using a simple HTML class instead of a `data-component` attribute and corresponding `id`.

For example...

```html
<div class="features-and-analysis">
    ...
</div>

<div class="index">
    ...
</div>
```

## Components vs Patterns?

Just to be clear that a 'pattern' and a 'component' are two different things.

A component is a single piece of functionality. If you had a list of news articles then the list could potentially be the component. You're inserting into the page a news listing component.

As part of that component you have individual news stories that all look the same. They are a 'pattern'. We're abstracted the common design elements that make up the component as a whole into a pattern, and that pattern has been written in such a way that it is a reusable chunk of code (as we may find that the pattern we've abstracted is common across a lot of different components).

### Where is the logic held?

The way we're building our components is so that the logic is self-contained (encapsulated). The question that now comes up is: "what about the pattern within the component?".

What this means is, who should hold the logic for determining how the content should look on screen?

We feel that the 'pattern' which is being imported into the 'component' shouldn't determine how it looks at different break points. That should be handled by the component itself.

To explain: a pattern is a combination of HTML and CSS. Think of the [media object as an example](http://www.stubbornella.org/content/2010/06/25/the-media-object-saves-hundreds-of-lines-of-code/).

Now our version of the media object has the image placed above the text content by default. Not everywhere we use this pattern is going to want the image above the text. 

So imagine we now have 'component-a' and 'component-b'. Component 'a' is a list of media objects. Component 'b' is also a list of media objects. Whilst component 'a' will display the objects in a grid format (as the screen gets larger), component 'b' will keep the objects in a list but instead will place the image on the left side of the text content and not placed above it.

So the way we see it: any changes to the pattern itself (such as the image being placed on the left of the text, rather than above it) should be handled by the pattern's own code. Specifically via the use of a 'modifier' class (if you're not sure what that means then look up writing CSS using B.E.M notation).

Any changes to the layout of that pattern should be handled by the component.

## Grid System

We utilise the same grid system as suggested by the [BBC GEL guidelines](http://www.bbc.co.uk/gel). Feel free to discard it and use your own grid if you so choose, but we've included it for any one who might find it useful.

We don't use grids very often because they don't respond well (not easily anyway, not without much tweaking) in a responsive layout. For example, if you have a grid of three columns and they should display in a linear one column layout when on mobile, you then need to overwrite the specific column widths... that's messy and so we have limited use for them.

## Browser support

The only thing we're using which will be a concern to some of you is the `box-sizing` property. Which means IE8+ is all good. If you're still supporting IE7... well, I'm sorry.

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
	
	**And don't mistake the phrase "Don't pollute the global namespace" with "Don't ever use the global namespace ever ever ever" -> that's just dogmatic nonsense.**

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
