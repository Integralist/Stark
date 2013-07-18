define(function(){
    /*
        Example usage:

        mediator.name = 'tim';
        mediator.subscribe('nameChange', function(arg) {
                console.log(this.name);
                this.name = arg;
                console.log(this.name);
        });
         
        mediator.publish('nameChange', 'david'); // tim, david
         
        // Pub/sub via third party mediator
         
        var obj = { name: 'sam' };
        
        mediator.wrap(obj);
        
        obj.subscribe('nameChange', function(arg) {
            console.log(this.name);
            this.name = arg;
            console.log(this.name);
        });
         
        obj.publish('nameChange', 'john'); // sam, john
     */
    var mediator = (function(){
        function subscribe(channel, fn) {
            if (!mediator.channels[channel]) {
                mediator.channels[channel] = [];
            }
            
            mediator.channels[channel].push({ context: this, callback: fn });
            
            return this;
        };
     
        function publish(channel) {
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
            wrap: function(obj) {
                obj.subscribe = subscribe;
                obj.publish = publish;
            }
        };
     
    }());

    window.app.mediator = mediator;

    return mediator;
});