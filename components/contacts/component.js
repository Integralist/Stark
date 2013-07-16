define(['jquery'], function($) {
    return {
        createContactList: function() {
            var contactsList    = document.createElement('select');
                contactsList.id = 'js-contactsList';

            console.log(contactsList);
            console.log($);
        },

        init: function() {
            this.container = window.app.components.contacts;
            this.createContactList();
        }
    };
});