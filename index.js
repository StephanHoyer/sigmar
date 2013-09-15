_ = require('lodash');

module.exports = function() {
  return new Graph();
};

function Graph(node) {
  this.nodes = {};
  this.froms = {};
  this.ancestorsOfs = [];
  this.descendantsOfs = [];
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
    var from = this.node(name, thing, true);
    this.froms[name] = from;
    return this;
  },
  to: function(name, thing) {
    var to = this.node(name, thing, true);
    _.each(this.froms, function(from, fromName) {
      from.to[name] = to;
      to.from[fromName] = from;
    });
    return this;
  },
  ancestorsOf: function(name) {
    this.ancestorsOfs.push(name);
    return this;
  },
  descendantsOf: function(name) {
    this.descendantsOfs.push(name);
    return this;
  },
  selectParentsOf: function(name, collection, recursive) {
    var node = this.nodes[name];
    _.each(node.from || {}, function(from, fromName) {
      if (!_.has(collection, fromName)) {
        collection[fromName] = from;
        if (recursive) {
          this.selectParentsOf(fromName, collection, recursive);
        }
      }
    }, this);
  },
  selectChildrenOf: function(name, collection, recursive) {
    var node = this.nodes[name];
    _.each(node.to || {}, function(to, toName) {
      if (!_.has(collection, toName)) {
        collection[toName] = to;
        if (recursive) {
          this.selectChildrenOf(toName, collection, recursive);
        }
      }
    }, this);
  },
  getItems: function() {
    var subGraph = {};
    var items = {};
    if (this.descendantsOfs && this.descendantsOfs.length) {
      // TODO handle multiple descendantsOf (and, or)
      var descendantsOf = this.descendantsOfs[0];
      this.selectChildrenOf(descendantsOf, subGraph, true);
    }
    if (this.ancestorsOfs && this.ancestorsOfs.length) {
      // TODO handle multiple descendantsOf (and, or)
      var ancestorsOf = this.ancestorsOfs[0];
      this.selectParentsOf(ancestorsOf, subGraph, true);
    }
    if (!subGraph) {
      subGraph = _.clone(this);
    }
    _.each(subGraph, function(node, name) {
      items[name] = node.content;
    });
    return items;
  }
};

_.extend(Graph.prototype, graphFuncs);

Graph.prototype.__defineGetter__('items', function() {
  return this.getItems();
});
