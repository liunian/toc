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
          instance.tocBtn.off('click')
          instance.tocBtn = null
          instance.tocBox.remove()
          instance.tocBox = null
        }
        var $ele = $('#' + tocId)
        if ($ele) {
          $ele.remove()
          $ele = null
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
      '#tree-content-holder > .file-holder > .file-content.wiki', // gitlab markdown file viewer
      '.wiki-holder > .wiki'       // gitlab wiki page
    ]

    // directory readme
    var container = null

    for (var i = 0, l = containerSelector.length; i < l; i++) {
      container = $(containerSelector[i])
      if (!container.length) {
        container = null
      } else {
        break
      }
    }

    if (!container) {
      return null
    }

    var toc = new Toc(container)

    var tocBox = $('<div/>'),
      tocBd = $('<div/>'),
      tocBtn = $('<button>TOC</button>');

    tocBd.html(toc.toHTML()).addClass('tocBd')
    tocBox.addClass('tocBox').append(tocBd).prependTo(container)
      .append(tocBtn).attr('id', boxId)

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
    tocBtn.on('click', function() {
      tocBd.fadeToggle()
    })

    $(document).on('click', function(e) {
      var t = e.target,
        c = tocBox.get(0)

      if (!(t === c || $.contains(c, t))) {
        tocBd.fadeOut()
      }
    })

    return {
      toc   : toc,
      tocBox: tocBox,
      tocBd : tocBd,
      tocBtn: tocBtn
    }
  }

})()
