[![Build Status](https://travis-ci.org/StephanHoyer/sigmar.png?branch=master)](https://travis-ci.org/StephanHoyer/sigmar)

#sigmar

Digraph library for node.js.

**Note:** This is work in progress. API can change.

##Installation

    npm install sigmar

##Example Usage

    var sigmar = require('sigmar');
    var graph = sigmar();
    graph
      .from('foo')
      .to('bar')
      .childrenOf('foo').items
    // { bar: null }

## API


### Create node
    
Adds a node to the graph with given content. Name must be a string.

    graph.node(name, content);
    
### Create an edge

Creates an edge from given node to given node. Node is created if
it does not exist. If content is given, it will be attached to node.
If node exists and content is given, the conten will be overwritten.

    graph.from(name, content).to(name, content);

It's also possible to create multiple nodes at once:

    graph.from([name, ...], content).to([name, ...], content);

If content is given, all nodes get the same content. Notice that all
from nodes are now connected to all to nodes.

Objects are possible too:

    graph.from({name: content, ...}).to({name: content, ...})

### Chaining

All operations can be chained:

    graph.from(name).and(name).to(name).and(name);
    graph.from(name).to(name).and.from(name).to(name);
    
Chained to's are also possible:

    graph.from('foo').to('bar').to('baz')
    // foo -> bar -> baz

Look at the tests for more ways to define your graph.

### Selectors

    graph.ancestorsOf(name, depth)
    // selects all ancestors of given node respecting the depth
    
    graph.parentsOf(name)
    // selects all parents of given node.

    graph.descendantsOf(name, depth)
    // selects all descendants of given node respecting the depth
    
    graph.childrenOf(name)
    // selects all children of given node.
