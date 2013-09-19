expect = require('expect.js');

sigmar = require('./index');

var foo = {};
var foz = {};
var bar = {};
var baz = {};

it('should create a graph with two nodes and one edge', function() {
  var graph = sigmar();
  expect(graph.from('foo').to('bar').childrenOf('foo').items).to.have.key('bar');
});

it('should create a graph with two nodes and one edge', function() {
  var graph = sigmar();
  // foo -> bar
  graph
    .node('foo', foo)
    .node('bar', bar)
    .from('foo').to('bar');
  expect(graph.descendantsOf('foo').items.bar).to.be(bar);
});

it('should be able to create two nodes with a from-to', function() {
  var graph = sigmar();
  // foo -> bar
  graph
    .from('foo', foo).to('bar', bar);
  expect(graph.descendantsOf('foo').items.bar).to.be(bar);
  expect(graph.ancestorsOf('bar').items.foo).to.be(foo);
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
    .to.only.have.keys('bar', 'baz');
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
  expect(ancestors).to.only.have.key('foo');
});

it('should be possible to declare multiple tos', function() {
  var graph = sigmar();
  // foo -> bar
  //    `-> baz
  graph.from('foo', foo).to('bar', bar).and('baz', baz);
  expect(graph.ancestorsOf('bar').items).to.only.have.key('foo');
  expect(graph.descendantsOf('foo').items).to.only.have.keys('bar', 'baz');
});

it('should be possible to declare multiple froms', function() {
  var graph = sigmar();
  // foo -> baz
  // bar ---^
  graph.from('foo', foo).and('bar', bar).to('baz', baz);
  expect(graph.ancestorsOf('baz').items).to.only.have.keys('foo', 'bar');
  expect(graph.descendantsOf('foo').items).to.only.have.key('baz');
});

it('should be possible to declare multiple froms with array', function() {
  var graph = sigmar();
  // foo -> baz
  // bar ---^
  graph.from(['foo', 'bar']).to('baz');
  expect(graph.ancestorsOf('baz').items).to.only.have.keys('foo', 'bar');
  expect(graph.descendantsOf('foo').items).to.only.have.key('baz');
});

it('should be possible to declare multiple tos with array', function() {
  var graph = sigmar();
  // foo -> bar
  //    `-> baz
  graph.from('foo').to(['bar','baz']);
  expect(graph.ancestorsOf('bar').items).to.only.have.key('foo');
  expect(graph.descendantsOf('foo').items).to.only.have.keys('bar', 'baz');
});

it('should be possible to declare multiple froms with object', function() {
  var graph = sigmar();
  // foo -> baz
  // bar ---^
  graph.from({'foo': foo, 'bar': bar}).to('baz', baz);
  expect(graph.ancestorsOf('baz').items).to.only.have.key('foo', 'bar');
  expect(graph.descendantsOf('foo').items).to.only.have.key('baz');
});

it('should be possible to declare multiple tos with array', function() {
  var graph = sigmar();
  // foo -> bar
  //    `-> baz
  graph.from('foo', foo).to({'bar': bar,'baz': baz});
  expect(graph.ancestorsOf('bar').items).to.only.have.key('foo');
  expect(graph.descendantsOf('foo').items).to.only.have.keys('bar', 'baz');
});

it('should be possible to chain tos', function() {
  var graph = sigmar();
  // foo -> bar -> baz -> foz
  graph.from('foo').to('bar').to('baz').to('foz');
  expect(graph.descendantsOf('foo').items).to.only.have.keys('bar', 'baz', 'foz');
  expect(graph.descendantsOf('bar').items).to.only.have.keys('baz', 'foz');
  expect(graph.childrenOf('bar').items).to.only.have.key('baz');
});

it('should able to select parents', function() {
  var graph = sigmar();
  // foo -> bar -> baz
  graph.from('foo', foo).to('bar', bar).to('baz', baz);
  expect(graph.parentsOf('baz').items).to.only.have.key('bar');
});

it('should able to select children', function() {
  var graph = sigmar();
  // foo -> bar -> baz
  graph.from('foo', foo).to('bar', bar).to('baz', baz);
  expect(graph.childrenOf('foo').items).to.only.have.key('bar');
});

it('should be possible to chain from/to-blocks with and', function() {
  var graph = sigmar();
  // baz -> foo -> bar
  graph.from('foo').to('bar').and.from('baz').to('foo');
  expect(graph.childrenOf('baz').items).to.only.have.key('foo');
  expect(graph.childrenOf('foo').items).to.only.have.keys('bar');
});

it('should be possible to deselect nodes', function() {
  var graph = sigmar();
  // foo -> bar -> baz
  graph.from('foo').to('bar').to('baz');
  expect(graph.not.parentsOf('bar').items).to.only.have.keys('bar', 'baz');
});

//TODO

// SELECTORS
// .roots().items
// .leafes().items
// .not.parentsOf('foo').items

// chaining
// .ancestorsOf('foo').and.descendantsOf('bar').items
// .ancestorsOf('foo').or.descendantsOf('bar').items
