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
      '.file-holder > .file-content.wiki', // gitlab markdown file viewer
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
    var cssTexts = '@css@'

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
