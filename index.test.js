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
    .to.have.keys('bar', 'baz')
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
    .to.not.have.keys('bar', 'baz')
    .and.to.have.key('foo');
});

it('should be possible to declare multiple tos', function() {
  var graph = sigmar();
  // foo -> bar
  //    `-> baz
  graph.from('foo', foo).to('bar', bar).and('baz', baz);
  expect(graph.ancestorsOf('bar').items)
    .to.have.key('foo')
    .and.to.not.have.keys('bar', 'baz');
  expect(graph.descendantsOf('foo').items)
    .to.have.keys('bar', 'baz')
    .and.to.not.have.key('foo');
});

it('should be possible to declare multiple froms', function() {
  var graph = sigmar();
  // foo -> baz
  // bar ---^
  graph.from('foo', foo).and('bar', bar).to('baz', baz);
  expect(graph.ancestorsOf('baz').items)
    .to.have.keys('foo', 'bar')
    .and.to.not.have.key('baz');
  expect(graph.descendantsOf('foo').items)
    .to.have.key('baz')
    .and.to.not.have.keys('foo', 'bar');
});

it('should be possible to declare multiple froms with array', function() {
  var graph = sigmar();
  // foo -> baz
  // bar ---^
  graph.from(['foo', 'bar']).to('baz');
  expect(graph.ancestorsOf('baz').items)
    .to.have.keys('foo', 'bar')
    .and.to.not.have.key('baz');
  expect(graph.descendantsOf('foo').items)
    .to.have.key('baz')
    .and.to.not.have.keys('foo', 'bar');
})

it('should be possible to declare multiple tos with array', function() {
  var graph = sigmar();
  // foo -> bar
  //    `-> baz
  graph.from('foo').to(['bar','baz']);
  expect(graph.ancestorsOf('bar').items)
    .to.have.key('foo')
    .and.to.not.have.keys('bar', 'baz');
  expect(graph.descendantsOf('foo').items)
    .to.have.keys('bar', 'baz')
    .and.to.not.have.key('foo');
});
it('should be possible to declare multiple froms with object', function() {
  var graph = sigmar();
  // foo -> baz
  // bar ---^
  graph.from({'foo': foo, 'bar': bar}).to('baz', baz);
  expect(graph.ancestorsOf('baz').items)
    .to.have.key('foo', 'bar')
    .and.to.not.have.keys('baz');
  expect(graph.descendantsOf('foo').items)
    .to.have.key('baz')
    .and.to.not.have.keys('foo', 'bar');
})

it('should be possible to declare multiple tos with array', function() {
  var graph = sigmar();
  // foo -> bar
  //    `-> baz
  graph.from('foo', foo).to({'bar': bar,'baz': baz});
  expect(graph.ancestorsOf('bar').items)
    .to.have.key('foo')
    .and.to.not.have.keys('bar', 'baz');
  expect(graph.descendantsOf('foo').items)
    .to.have.keys('bar', 'baz')
    .and.to.not.have.key('foo');
});

it('should be possible to chain tos', function() {
  var graph = sigmar();
  // foo -> bar -> baz
  graph.from('foo').to('bar').to('baz');
  expect(graph.descendantsOf('foo').items)
    .to.have.keys('bar', 'baz')
    .and.not.to.have.key('foo');
  expect(graph.descendantsOf('bar').items)
    .to.have.keys('baz')
    .and.not.to.have.keys('foo', 'bar');
});

//TODO
// chaining to's
//.from('foo').to('bar').to('baz')


// SELECTORS
// .parentsOf().items
// .childrenOf().items
// .roots().items
// .leafes().items

// chaining
// .ancestorsOf('foo').and.descendantsOf('bar').items
// .ancestorsOf('foo').or.descendantsOf('bar').items
    
