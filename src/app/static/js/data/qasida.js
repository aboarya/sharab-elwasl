
function Verse (lang, verse) {

  var v = this;

  this.init = function(lang, verse) {
    for (var prop in verse) {
      v[prop] = verse[prop];
    }
    var f = lang+'_first'; var s = lang+'_second';
    v["first"] = verse[f];
    v["second"] = verse[s];
  };

  this.init(lang, verse);
};

function Qasida (lang, number, verses) {

  this._verses     = [];
  this.number      = number;
  
  this.verses = function() {
    return this._verses;
  }

  this.init = function(lang, verses) {

    for (var i =0; i < verses.length; i++) {
      this._verses.push(new Verse(lang, verses[i]));
    };

    // this.lang_title  = verses[0][lang+'_title'];
    // this.lang_first  = verses[0][lang+'_first'];
    // this.lang_first  = verses[0][lang+'_second'];
    this.ar_title    = verses[0]['na_title'].replace(')', '').replace('(', '');
    this.title       = verses[0]['ar_title'];
    this.lang        = lang;
  };

  this.init(lang, verses);
};

var _range = function (count) {
  return new Array(count);
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

Qasida.prototype.prev = _prev
Qasida.prototype.next = _next;

Verse.prototype.prev = _prev
Verse.prototype.next = _next;

Qasida.prototype.set = _set;
Verse.prototype.set = _set;

Qasida.prototype.range = _range;
