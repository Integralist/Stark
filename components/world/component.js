define(function(){
    var mediator;

    return {
        init: function() {
            mediator = window.app.mediator;
            console.log('world component initialised');
            
            if (mediator) {
                mediator.subscribe('contacts:updated', function(data) {
                    console.log('No idea why the "world" component needs to know about the contacts component, but meh here it is:', data);
                });

                console.log('app.mediator', app.mediator); // will be undefined for bootstrap-index.js
            }
        }
    };
});