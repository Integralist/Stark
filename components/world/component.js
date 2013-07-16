define({
    init: function() {
        console.log('world component initialised');
        
        if (window.app.mediator) {
            console.log('app.mediator', app.mediator); // will be undefined for bootstrap-index.js
        }
    }
});