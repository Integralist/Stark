define(['jquery'], function($) {
    var mediator;

    return {
        populateContactList: function(data) {
            $.each(data, $.proxy(function(key, value) {
                var option           = document.createElement('option');
                    option.value     = value.name;
                    option.innerHTML = value.name;

                this.contactsList.appendChild(option);
            }, this));

            this.publish('contacts:updated', this.contactsList);
        },

        getContactData: function(){
            $.ajax({
                url: 'fixtures/contacts.json',
                dataType: 'json',
                success: $.proxy(this.populateContactList, this)
            });
        },

        createContactList: function() {
            this.contactsList    = document.createElement('select');
            this.contactsList.id = 'js-contactsList';
            this.contactsList.setAttribute('data-component', 'contacts');
            
            $(this.container).replaceWith(this.contactsList);

            this.getContactData();
        },

        bindEvents: function() {
            //
        },

        init: function() {
            mediator = window.app.mediator;
            mediator.wrap(this);

            this.bindEvents();
            this.container = window.app.components.contacts;
            this.createContactList();
        }
    };
});