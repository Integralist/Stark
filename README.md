# Stark

Simplified separation of components to being decoupled applications

## Conventions

There are some strict conventions...

1. Components need to be placed inside a `components` directory, inside a folder which matches the components name, and the file itself needs to be called `component.js`

2. Extensions need to be placed inside a `extensions` directory, inside a folder which matches the extension name, and the file itself needs to be called `extension.js`

3. Each `boostrap-xxx.js` file should include only one `require` call and that should be to the 'app' (see this project's code for an example) -> no other code of importance to the project should be placed inside that bootstrap file (important code should be a component that is loaded by `app.js`)

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