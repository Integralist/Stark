define(['require'], function(require) {
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
            limit = components.length;

        while (limit--) {
            require(['components/' + components[limit].getAttribute('data-component') + '/component'], function(component) {
                component.init();
            });
        }
    }

    window.app = {};

    return new App();
});