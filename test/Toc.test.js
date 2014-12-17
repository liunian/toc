/**
 * Created by bd on 12/13/14.
 */

var assert = require('assert')
var $ = require('jQuery')

var Chapter = require('../src/Chapter')
var Toc = require('../src/Toc')


describe('Toc', function() {
  describe('normal path', function() {
    it('parse chapter from html', function() {
      var html = '<div>' +
        '<h1>chapter 1</h1>' +
        '<p>paragraph</p>' +
          '<h2>chapter 1.1</h2>' +
          '<p>paragraph</p>' +
            '<h3>chapter 1.1.1</h3>' +
          '<h2>chapter 1.2</h2>' +
            '<h3>chapter 1.2.1</h3>' +
        '<h1>chapter 2</h1>' +
          '<h2>chapter 2.1</h2>' +
            '<h3>chapter 2.1.1</h3>' +
          '<h2>chapter 2.2</h2>' +
          '<h2>chapter 2.3</h2>' +
        '<h1>chapter 3</h1>' +
        '<h1>chapter 4</h1>' +
        '</div>'

      var container = $(html)

      var toc = new Toc(container)
      assert.equal(toc.chapters.length, 4)
      assert.equal(toc.chapters[0].children.length, 2)
      assert.equal(toc.chapters[0].children[0].children.length, 1)
    })

    it('textContent rather than innerHTML', function() {
      var html = '<div>' +
        '<h1><a href="#">chapter 1</a><a href="#"></a></h1>' +
        '</div>'

      var container = $(html)

      var toc = new Toc(container)
      assert.equal(toc.chapters[0].title, 'chapter 1')
    })

    it('replace tail ¶', function() {
      var html = '<div>' +
        '<h1>chapter 1<a href="#">¶</a></h1>' +
        '<h1>¶chapter 1<a href="#">¶</a></h1>' +
      '</div>'

      var container = $(html)

      var toc = new Toc(container)
      assert.equal(toc.chapters[0].title, 'chapter 1')
      assert.equal(toc.chapters[1].title, '¶chapter 1')
    })
  })

  describe('has skip', function() {
    it('the first is not h1', function() {
      var html = '<div><h2>chapter 1.2</h2></div>'

      var container = $(html)
      var toc = new Toc(container)

      assert.equal(toc.chapters[0].children.length, 1)
    })

    it('there are skips from parent to sub', function() {
      var html = '<div>' +
        '<h1>chapter 1</h1>' +
        '<p>paragraph</p>' +
            '<h4>chapter 1.1.1</h4>' +
        '</div>'

      var container = $(html)
      var toc = new Toc(container)

      assert.equal(toc.chapters.length, 1)
      var h3 = toc.chapters[0].children[0].children[0]
      assert.equal(h3.children.length, 1)
    })

    it('skip h1 & h2', function() {
      var html = '<div><h3>chapter 1.2</h3></div>'

      var container = $(html)
      var toc = new Toc(container)

      assert.equal(toc.chapters[0].children[0].children.length, 1)
    })

    it('skip from h4 to h1', function() {
      var html = '<div>' +
        '<h1>chapter 1</h1>' +
          '<p>paragraph</p>' +
          '<h2>chapter 1.1</h2>' +
          '<p>paragraph</p>' +
            '<h3>chapter 1.1.1</h3>' +
              '<h4>chapter 2.3</h4>' +
        '<h1>chapter 4</h1>' +
        '</div>'

      var container = $(html)

      var toc = new Toc(container)
      assert.equal(toc.chapters.length, 2)
      assert.equal(toc.chapters[0].children[0].children[0].children.length, 1)
    })
  })

  describe('toHTML', function() {

  })

  describe('valueOf', function() {
    var html = '<div>' +
      '<h1>chapter 1</h1>' +
      '<p>paragraph</p>' +
      '<h2>chapter 1.1</h2>' +
      '<p>paragraph</p>' +
      '<h3>chapter 1.1.1</h3>' +
      '<h2>chapter 1.2</h2>' +
      '<h3>chapter 1.2.1</h3>' +
      '<h1>chapter 2</h1>' +
      '</div>'

    var res = 'chapter 1/1/chapter-1*chapter 1.1/2/chapter-1.1*chapter 1.1.1/3/chapter-1.1.1||chapter 1.2/2/chapter-1.2*chapter 1.2.1/3/chapter-1.2.1||chapter 2/1/chapter-2'

    var container = $(html)

    var toc = new Toc(container)
    assert.equal(toc.valueOf(), res)
  })
})
