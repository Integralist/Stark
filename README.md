# Stark

Simplified separation of components to being decoupled applications

## Conventions

There are some strict conventions...

1. Components need to be placed inside a `components` directory, inside a folder which matches the components name. The file itself needs to be called `component.js`. A component needs to be an object with an `init` method. See this project for examples.

2. Extensions need to be placed inside a `extensions` directory, inside a folder which matches the extension name. The file itself needs to be called `extension.js`. See this project for examples.

3. Each page should have its own bootstrap file: `boostrap-xxx.js` (where `xxx` is the page type or name). This file should include only one `require` call and that should be to the 'app' (see this project for an example) -> no other code of importance to the project should be placed inside that bootstrap file (code for the page should either be a component or a extension that is loaded by `app.js`).

...that's it.

## Design

The basic API is based off of the [Aura.js](https://github.com/aurajs/aura) project -> but 90% of the API from that project is not replicated here.

I'm looking to create a simplified project boilerplate and NOT a framework (or encompassing suite of tools).

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

`grunt` (default task calls `get-components`)
`grunt get-components` (builds the r.js configuration object and calls `requirejs`)
`grunt requirejs` (executes build and does some clean-up)