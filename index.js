var _ = require('lodash');

module.exports = function() {
  return new Graph();
};

function Graph(node) {
  this.nodes = {};
  this.froms = {};
  this.tos = {};
  this.ancestorsOfs = {};
  this.descendantsOfs = {};
}

var graphFuncs = {

  node: function(name, thing, returnNode) {
    var node = this.nodes[name] || {
      content: null,
      from: {},
      to: {},
    };
    if (thing) {
      node.content = thing;
    }
    this.nodes[name] = node;
    return returnNode ? node : this;
  },

  from: function(name, thing) {
    this.and = this.from;
    var names = _.isString(name) ? [name] : name;
    _.each(names, function(name, nameOfObject) {
      if (_.isPlainObject(names)) {
        thing = name;
        name = nameOfObject;
      }
      var from = this.node(name, thing, true);
      this.froms[name] = from;
    }, this);
    this.tos = {};
    return this;
  },

  to: function(name, thing) {
    this.and = this.to;
    var newTos = {};
    var names = _.isString(name) ? [name] : name;
    _.each(names, function(name, nameOfObject) {
      if (_.isPlainObject(names)) {
        thing = name;
        name = nameOfObject;
      }
      var to = this.node(name, thing, true);
      this.froms = _.isEmpty(this.tos) ? this.froms : this.tos;
      _.each(this.froms, function(from, fromName) {
        from.to[name] = to;
        to.from[fromName] = from;
      });
      newTos[name] = to;
    }, this);
    this.tos = newTos;
    return this;
  },

  ancestorsOf: function(name, depth) {
    this.ancestorsOfs[name] = depth;
    return this;
  },

  parentsOf: function(name) {
    this.ancestorsOf(name, 1);
    return this;
  },

  childrenOf: function(name) {
    this.descendantsOf(name, 1);
    return this;
  },

  descendantsOf: function(name, depth) {
    this.descendantsOfs[name] = depth;
    return this;
  },

  selectParentsOf: function(name, collection, depth) {
    var node = this.nodes[name];
    _.each(node.from || {}, function(from, fromName) {
      if (!_.has(collection, fromName)) {
        collection[fromName] = from;
        if (depth > 1 || _.isUndefined(depth) || _.isNull(depth)) {
          this.selectParentsOf(fromName, collection, depth-1);
        }
      }
    }, this);
  },

  selectChildrenOf: function(name, collection, depth) {
    var node = this.nodes[name];
    _.each(node.to || {}, function(to, toName) {
      if (!_.has(collection, toName)) {
        collection[toName] = to;
        depth = _.isNumber(depth) ? depth-1 : null;
        if (depth !== 0) {
          this.selectChildrenOf(toName, collection, depth-1);
        }
      }
    }, this);
  },

  getItems: function() {
    var subGraph = {};
    var items = {};
    _.each(this.descendantsOfs, function(depth, name) {
      this.selectChildrenOf(name, subGraph, depth);
    }, this);
    _.each(this.ancestorsOfs, function(depth, name) {
      this.selectParentsOf(name, subGraph, depth);
    }, this);
    if (!subGraph) {
      subGraph = _.clone(this);
    }
    _.each(subGraph, function(node, name) {
      items[name] = node.content;
    });
    //reset selectors
    this.descendantsOfs = {};
    this.ancestorsOfs = {};
    return items;
  }

};

_.extend(Graph.prototype, graphFuncs);

Graph.prototype.__defineGetter__('items', function() {
  return this.getItems();
});
