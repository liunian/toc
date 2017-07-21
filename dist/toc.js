/**
 * Created by bd on 12/13/14.
 */

/**
 *
 * @param level {Number}
 * @param title {String=}
 * @constructor
 */
function Chapter(level, title) {
  this.parent = null
  this.level = level
  this.title = title || ''
  this.id = this.setIDByTitle()
  this.children = []
}
Chapter.getIDFromStr = function(str) {
  // space to -
  // multiple - to one -
  // remove head -
  // remove tail -
  // remove / \ # & ? ,
  return str.toLowerCase().replace(/\s/g, '-').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '').replace(/[\/\\#&,\?]/g, '')
}

Chapter.prototype.setIDByTitle = function() {
  if (this.title) {
    return Chapter.getIDFromStr(this.title)
  } else {
    return '';
  }
}

Chapter.prototype.addSubChapter = function(chapter) {
  chapter.parent = this
  this.children.push(chapter)
}
Chapter.prototype.toHTML = function() {
  if (!this.title && !this.children.length) {
    return ''
  }

  var ret = '<li>'

  if (this.title) {
    ret += '<a href="#' + this.id + '">' + this.title + '</a>'
  }

  if (this.children.length) {
    ret += '<ul>'

    this.children.forEach(function(chapter) {
      ret += chapter.toHTML()
    })

    ret += '</ul>'
  }

  ret += '</li>'
  return ret;
}
Chapter.prototype.valueOf = function() {
  var ret = this.title + '/' + this.level + '/' + this.id

  if (this.children.length) {
    ret += '*'
    var c = []
    this.children.forEach(function(chapter) {
      c.push(chapter.valueOf())
    })
    ret += c.join('||')
  }

  return ret
}

if (typeof exports === 'object') {
  module.exports = Chapter
}

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

/**
 * Created by bd on 12/15/14.
 */

(function() {
  var tocId = 'JMdToc'
  var instance = createToc(tocId)

  // observe, so then change with ajax or pjax, try to update it
  var isGithub = location.hostname === 'github.com'
  var observeElement =  isGithub ? document.getElementById('js-repo-pjax-container') :
                       document.documentElement

  var observeList = {
    childList: true,
    subtree  : true
  }
  var observer = new MutationObserver(function(records) {
    records.forEach(function(record) {
      if (record.target === observeElement) {
        if (instance) {
          instance.tocBd = null
          instance.tocBtn = null
          instance.tocBox.parentNode.removeChild(instance.tocBox)
          instance.tocBox = null
        }
        var ele = document.getElementById(tocId)
        if (ele) {
          ele.parentNode.removeChild(ele)
          ele = null
        }
        instance = createToc(tocId)
      }
    })
  })
  if (observeElement) {
    observer.observe(observeElement, observeList)
  }


  /**
   *
   * @returns {*}
   * @param boxId {String}
   */
  function createToc(boxId) {
    var containerSelector = [
      '#readme > .markdown-body',   // github
      '#README > .wiki',           // gitlab directory
      '.file-content.wiki', // gitlab markdown file viewer
      '.wiki-holder > .wiki'       // gitlab wiki page
    ]

    // directory readme
    var container = null

    for (var i = 0, l = containerSelector.length; i < l; i++) {
      container = document.querySelector(containerSelector[i])
      if (container) break
    }

    if (!container) {
      return null
    }

    var toc = new Toc(container)

    var tocBox = document.createElement('div'),
      tocBd = document.createElement('div'),
      tocBtn = document.createElement('button')

    tocBtn.innerHTML = 'TOC'
    tocBd.classList.add('tocBd')
    tocBd.innerHTML = toc.toHTML()

    tocBox.id = boxId
    tocBox.classList.add('tocBox')
    tocBox.appendChild(tocBd)
    tocBox.appendChild(tocBtn)
    container.appendChild(tocBox)

    // create styles
    // use link element before build (for test)
    // inline css after build
    var cssTexts = '.tocBox{position:fixed;top:200px;right:10px;margin-top:30px !important;}.tocBox .toc-show{opacity:1 !important;}.tocBox .tocBd{opacity:0;padding:5px 10px;min-width:200px;max-height:500px;border:1px solid rgba(0, 0, 0, .2);border-radius:2px;background:#fff;overflow:auto;transition:opacity .3s ease-out;}.tocBox a{text-decoration:none;}.tocBox ul{margin:0 !important;padding:0 !important;list-style:none;}.tocBox li ul{margin-left:20px !important;}.tocBox button{position:absolute;top:-20px;right:0;font-size:12px;line-height:1.2}'

    if (cssTexts === '@' + 'css@') {
      var linkEle = document.createElement('link')
      linkEle.setAttribute('rel', 'stylesheet')
      linkEle.href = 'toc.css'
      document.body.appendChild(linkEle)
    } else {
      var style = document.createElement('style')
      style.appendChild(document.createTextNode(cssTexts))
      document.body.appendChild(style)
    }

    // events
    tocBtn.addEventListener('click', toggleToc, false)

    document.addEventListener('click', function(e) {
      var t = e.target

      if (!(t === tocBox || tocBox.contains(t))) {
        hideToc()
      }
    }, false)

    var showCls = 'toc-show'
    function hideToc() {
      tocBd.classList.remove(showCls)
    }

    function showToc() {
      tocBd.classList.add(showCls)
    }

    function toggleToc() {
      if (tocBd.classList.contains(showCls)) {
        hideToc()
      } else {
        showToc()
      }
    }

    return {
      toc   : toc,
      tocBox: tocBox,
      tocBd : tocBd,
      tocBtn: tocBtn
    }
  }

})()
