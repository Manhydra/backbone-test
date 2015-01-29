$(function () {

'use strict';

// Global-Closure Namespace construction and initialization
var RPGNS = (function () {

  // Model Capsule
  var Model = (function () {
    // Private Model to represent a character
    var _Character = Backbone.Model.extend({
      defaults: function () {
        return {
          name: '',
          race: 'Human',
          charClass: 'Rogue',
          level: 1
        };
      }
    });

    // Collection of characters
    var _Party = Backbone.Collection.extend({
      model: _Character
    });

    return {
      // Public visibility of our character collection, populated with default characters
      Party: new _Party([
        { name: 'Marc', charClass: 'Figher'},
        { name: 'Omar', charClass: 'Wizard'},
        { name: 'Stagmel', race: 'Dwarf', charClass: 'Figher'},
        { name: 'Llanowar', race: 'Elf', charClass: 'Thief'}
      ])
    };
  })();

  // View Capsule
  var View = (function () {

    // View of character data
    var _CharData = Backbone.View.extend({
      tagName: 'tr',
      template: _.template($('#pcs-list-template').html()),

      events: {
        'click button': 'removeCharacter'
      },

      initialize: function () {
        this.listenTo(this.model, 'change', this.render);
      },

      render: function () {
        this.$el.append(this.template(this.model.toJSON()));
        return this;
      },

      removeCharacter: function () {
        this.model.destroy();
      }
    });

    // List of character data
    var _CharListView = Backbone.View.extend({
      el: 'main',

      events: {
        'keypress #newCharacter': 'addCharacter'
      },

      initialize: function () {
        // Our input box to enter the details of a new character
        this.input = this.$('#newCharacter');

        this.listenTo(this.model, 'add', this.addCharacter);
        this.listenTo(this.model, 'all', this.render);
        this.render();
      },

      render: function () {
        this.$('tbody').html('');
        for (var i = 0; i < this.model.length; i++) {
          var item = this.model.models[i];
          var view = new _CharData({ model: item });
          this.$('tbody').append(view.render().el);
        }
      },

      // Create a new character and add it to the list
      addCharacter: function(event) {
        console.log('addCharacter');
        if (event.keyCode != 13) return;
        if (this.input.val() == '') return;

        var attrList = ['name','race','charClass','level'];
        var charAttrbs = this.input.val().split(',');
        var newCharacter = {};

        for (var i = 0; i < charAttrbs.length; i++) {
          newCharacter[attrList[i]] = charAttrbs[i];
        }

        console.log(newCharacter);

        this.model.add(newCharacter);
        this.input.val('');
      }
    });

    return {
      CharacterList: _CharListView
    };
  })();

  console.log(Model);
  console.log(View);

  return {
    App: new View.CharacterList({ model: Model.Party })
  };

})();

});
