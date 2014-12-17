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
