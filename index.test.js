expect = require('expect.js');

sigmar = require('./index');

var foo = {};
var foz = {};
var bar = {};
var baz = {};

it('should create a graph with two nodes and one edge', function() {
  var graph = sigmar();
  // foo -> bar
  graph
    .node('foo', foo)
    .node('bar', bar)
    .from('foo').to('bar');
  expect(graph.descendantsOf('foo').items.bar).to.be(bar);
});

it('should only return descendants nodes', function() {
  var graph = sigmar();
  // foo -> bar -> baz
  graph
    .node('foo', foo)
    .node('bar', bar)
    .node('baz', baz)
    .from('foo').to('bar')
    .from('bar').to('baz');
  var descendants = graph.descendantsOf('foo').items;
  expect(descendants)
    .to.have.key('bar')
    .and.to.have.key('baz')
    .and.not.to.have.key('foo');
});

it('should only return ancestors nodes', function() {
  var graph = sigmar();
  // foo -> bar -> baz
  graph
    .node('foo', foo)
    .node('bar', bar)
    .node('baz', baz)
    .from('foo').to('bar')
    .from('bar').to('baz');
  var ancestors = graph.ancestorsOf('bar').items;
  expect(ancestors)
    .to.not.have.key('bar')
    .and.not.to.have.key('baz')
    .and.to.have.key('foo');
});

    // multiple to's
    //.from('foo').to('bar').and('baz') 

    // multiple from's
    //.from('foo').and('bar').to('baz')

    // inline from and to definition
    //.from('foo', foo).to('baz', baz)

    // array from and to definition
    //.from(['foo', 'bar']).to(['baz', 'faz']) 
    
    // object from and to definition
    //.from({foo: foo, bar: bar}).to({baz: baz, faz: faz}) 
    
    // chaining to's
    //.from('foo').to('bar').to('baz')


    // SELECTORS
    // .ancestorsOf('foo').items
    // .descendantsOf('foo').items
    // .parentsOf().items
    // .childrenOf().items
    // .roots().items
    // .leafes().items
    // chaining.items
    // .ancestorsOf('foo').and.descendantsOf('bar').items
    // .ancestorsOf('foo').or.descendantsOf('bar').items
    
