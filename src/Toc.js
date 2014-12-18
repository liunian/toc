/**
 * Created by bd on 12/13/14.
 */

if (typeof exports === 'object') {
  var Chapter = require('./Chapter')
}

/**
 *
 * @param container {Object}
 * @constructor
 */
function Toc(container) {
  this.selector = 'h1, h2, h3, h4, h5, h6'
  this.container = container
  this.chapters = []
  this.parseChapters()
}

Toc.prototype.parseChapters = function() {
  // hack
  // test code use jquery to parse, while use querySelector in browser
  var titles = typeof document !== 'undefined' ? this.container.querySelectorAll(this.selector) :
               this.container.find(this.selector)
  if (!titles.length) return

  var lastLevel = 1,
    curLevel,
    text,
    curChapter,
    lastChapter,
    rootChapter;

  for (var i = 0, l = titles.length; i < l; i++) {
    var ele = titles[i]

    curLevel = parseInt(ele.tagName.slice(1), 10)
    // remove tail ¶, this is added by gitlab
    text = ele.textContent.trim().replace(/¶$/, '')

    curChapter = new Chapter(curLevel, text)
    ele.id = curChapter.id

    // if h1, just add
    if (curLevel == 1) {
      lastLevel = curLevel
      this.chapters.push(curChapter)
      rootChapter = curChapter
      lastChapter = curChapter
      continue
    }

    if (!rootChapter) {
      rootChapter = new Chapter(1)
      this.chapters.push(rootChapter)
      lastChapter = rootChapter
    }


    if (curLevel < lastLevel) {
      var tem1 = curLevel
      // h4 - h2, h4 -> h3 -> h2 -> h1, h1.add
      while(tem1++ <= lastLevel) {
        lastChapter = lastChapter.parent
      }
      lastChapter.addSubChapter(curChapter)
    } else if (curLevel > lastLevel) {
      var tem = curLevel
      // add the skip, h2 - h4, h2 -> h3, h3.add
      while(tem - 1 > lastLevel) {
        var chapter = new Chapter(tem)
        lastChapter.addSubChapter(chapter)
        lastChapter = chapter
        tem--
      }
      lastChapter.addSubChapter(curChapter)
    } else {
      // h3 - h3
      lastChapter.parent.addSubChapter(curChapter)
    }

    lastChapter = curChapter

    lastLevel = curLevel
  }

}

Toc.prototype.toHTML = function() {
  var ret = '<ul>'

  this.chapters.forEach(function(chapter) {
    ret += chapter.toHTML()
  })

  ret += '</ul>'
  return ret
}

Toc.prototype.valueOf = function() {
  var ret = []

  this.chapters.forEach(function(chapter) {
    ret.push(chapter.valueOf())
  })

  return ret.join('||')
}

if (typeof exports === 'object') {
  module.exports = Toc
}
