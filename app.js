define(['require'], function(require) {
    window.app = {
        components: {}
    };

    function App() {}

    App.prototype.use = function(extension) {
        console.log('use extension:', extension);
        
        var limit = arguments.length;

        while (limit--) {
            require(['extensions/' + arguments[limit] + '/extension']);
        }
    }

    App.prototype.start = function() {
        console.log('start application');
        
        var components = document.querySelectorAll('[data-component]'),
            limit = components.length,
            componentName;

        while (limit--) {
            componentName = components[limit].getAttribute('data-component');

            window.app.components[componentName] = components[limit];

            require(['components/' + componentName + '/component'], function(component) {
                component.init();
            });
        }
    }

    return new App();
});