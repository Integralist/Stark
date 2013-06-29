define(['require'], function(require) {
    function App() {}

    App.prototype.use = function(component) {
        console.log('use component:', component);
    }

    App.prototype.start = function() {
        console.log('start application');
        var components = document.querySelectorAll('[data-component]'),
            limit = components.length;

        while (limit--) {
            require(['components/' + components[limit].getAttribute('data-component') + '/component'], function(component) {
                component.init();
            });
        }
    }

    return new App();
});