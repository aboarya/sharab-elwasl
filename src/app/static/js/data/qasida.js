
function Verse (index, lang) {
  
  this.lang_first  = lang+'_first';
  this.lang_first  = lang+'_second';
  this.count       = count;

};

function Qasida (lang, verses) {

  this._verses     = [];
  this.lang        = lang;
  this.lang_title  = lang+'_title';
  this.lang_first  = lang+'_first';
  this.lang_first  = lang+'_second';
  this.ar_title    = verses[0]['na_title'];
  this.title       = verses[0][this.lang_title];
  
  this.verses = function() {
    return this._verses;
  }
};

var _range = function (start, end) {
  var ret = [];
  if (!end) {
    end = start;
    start = 0;
  }
  for (var i = start; i < end; i++) {
    ret.push(i);
  }
  return ret;
};

var _prev = function (index) {
  if (index > 0) {
    index--;
  };
};

var _next = function (index, count) {
  if (index < count) {
    index++;
  };

};

var _set = function () {
  return this._list[this.n];
};

Qasida.prototype.init = function(verses) {
  for (var i =0; i < verses.length; i++) {
    this._verses.push(new Verse(i, this.lang));
  };
};

Qasida.prototype.prev = _prev
Qasida.prototype.next = _next;

Verse.prototype.prev = _prev
Verse.prototype.next = _next;

Qasida.prototype.set = _set;
Verse.prototype.set = _set;

Qasida.prototype.range = _range;
Verse.prototype.range = _range;
