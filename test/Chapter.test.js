/**
 * Created by bd on 12/13/14.
 */

var assert = require('assert')

var Chapter = require('../src/Chapter')

function assertWithSourceAndResult(sources, res) {
  sources.forEach(function(s, i) {
    assert.equal(Chapter.getIDFromStr(s), res[i])
  })
}

describe('Chapter', function() {
  describe('getIDFromStr', function() {
    it('normal unchanged', function() {
      var sources = ['foo', '中文'],
        res = ['foo', '中文'];

      assertWithSourceAndResult(sources, res)
    })

    it('space => -', function() {
      var sources = ['a b c'],
        res = ['a-b-c']

      assertWithSourceAndResult(sources, res)
    })

    it('multiple - => one -', function() {
      var sources = ['a  b- c---d'],
        res = ['a-b-c-d']

      assertWithSourceAndResult(sources, res)
    })

    it('remove head -', function() {
      var sources = ['-abc', ' abc'],
        res = ['abc', 'abc']

      assertWithSourceAndResult(sources, res)
    })

    it('remove tail -', function() {
      var sources = ['abc-', 'abc '],
        res = ['abc', 'abc']

      assertWithSourceAndResult(sources, res)
    })

    it('remove special character', function() {
      var sources = ['abc/', 'abc\\', 'ab#c', 'ab?c?', 'ab,c,'],
        res = ['abc', 'abc', 'abc', 'abc', 'abc']

      assertWithSourceAndResult(sources, res)
    })
  })

  describe('single level', function() {
    it('single level', function() {
      var chapter = new Chapter(1, 'dev env')
      assert.equal(chapter.id, 'dev-env')
      assert.equal(chapter.toHTML(), '<li><a href="#dev-env">dev env</a></li>')
    })

    it('not all ascii', function() {
      var chapter = new Chapter(1, 'compass 配置')
      assert.equal(chapter.id, 'compass-配置')
      assert.equal(chapter.toHTML(), '<li><a href="#compass-配置">compass 配置</a></li>')
    })
  })

  describe('multiple levels', function() {
    it('chapter with sub-chapter', function() {
      var chapter = new Chapter(1, 'chapter 1')
      chapter.addSubChapter(new Chapter(2, 'chapter 1.1'))
      chapter.addSubChapter(new Chapter(2, 'chapter 1.2'))

      var res = '<li><a href="#chapter-1">chapter 1</a>' +
        '<ul>' +
        '<li><a href="#chapter-1.1">chapter 1.1</a></li>' +
        '<li><a href="#chapter-1.2">chapter 1.2</a></li>' +
        '</ul></li>'

      assert.equal(chapter.toHTML(), res)
    })

    it('multiple sub-chapter', function() {
      var chapter = new Chapter(1, 'a')
      var subA = new Chapter(2, 'aa')
      var subB = new Chapter(2, 'ab')
      subA.addSubChapter(new Chapter(3, 'aaa'))
      subB.addSubChapter(new Chapter(3, 'aba'))
      chapter.addSubChapter(subA)
      chapter.addSubChapter(subB)

      var res = '<li><a href="#a">a</a>' +
        '<ul>' +
        '<li><a href="#aa">aa</a>' +
        '<ul>' +
        '<li><a href="#aaa">aaa</a></li>' +
        '</ul></li>' +
        '<li><a href="#ab">ab</a>' +
        '<ul>' +
        '<li><a href="#aba">aba</a></li>' +
        '</ul></li>' +
        '</ul></li>'

      assert.equal(chapter.toHTML(), res)
    })
  })

  describe('empty title', function() {
    it('just empty', function() {
      var chapter = new Chapter(1)
      assert.equal(chapter.toHTML(), '')
    })

    it('empty with children', function() {
      var res = '<li><ul><li><a href="#a">a</a></li></ul></li>'

      var chapter = new Chapter(1)
      chapter.addSubChapter(new Chapter(2, 'a'))
      assert.equal(chapter.toHTML(), res)
    })
  })

  describe('valueOf', function() {

    var chapter = new Chapter(1, 'chapter 1')
    chapter.addSubChapter(new Chapter(2, 'chapter 1.1'))
    chapter.addSubChapter(new Chapter(2, 'chapter 1.2'))

    var res = 'chapter 1/1/chapter-1*chapter 1.1/2/chapter-1.1||chapter 1.2/2/chapter-1.2'

    assert.equal(chapter.valueOf(), res)
  })
})
