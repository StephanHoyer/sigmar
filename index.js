_ = require('lodash');

module.exports = function() {
  return new Graph();
};

function Graph(node) {
  this.nodes = {};
  this.ancestorsOfs = [];
  this.descendantsOfs = [];
}

var graphFuncs = {
  node: function(name, thing) {
    if (this.nodes[name]) {
      throw new Error('Node with name \'' + name + '\' already exists');
    }
    this.nodes[name] = this.nodes[name] || {}
    this.nodes[name].content = thing;
    return this;
  },
  from: function(name, thing) {
    if (thing) {
      this.node(name, thing);
    }
    this.fromName = name;
    return this;
  },
  to: function(name, thing) {
    if (thing) {
      this.node(name, thing);
    }
    var from = this.fromName;
    this.nodes[from] = this.nodes[from] || {};
    this.nodes[from].to = this.nodes[from].to || [];
    this.nodes[from].to.push(name);
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
  selectChildrenOf: function(name, collection, recursive) {
    _.each(this.nodes[name].to, function(toName) {
      if (!_.contains(collection, toName)) {
        collection.push(toName);
        if (recursive) {
          this.selectChildrenOf(toName, collection, recursive);
        }
      }
    }, this);
  },
  getItems: function() {
    var selected = [];
    if (this.descendantsOfs) {
      // TODO handle multiple descendantsOf (and, or)
      var descendantsOf = this.descendantsOfs[0];
      this.selectChildrenOf(descendantsOf, selected, true);
    }
    var nodes = {};
    _.each(selected, function(key) {
      nodes[key] = this.nodes[key].content;
    }, this);
    return nodes;
  }
};

_.extend(Graph.prototype, graphFuncs);

Graph.prototype.__defineGetter__('items', function() {
  return this.getItems();
});
