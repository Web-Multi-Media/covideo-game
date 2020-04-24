var Typo = require("typo-js");
var similarity = require("similarity");

function Dictionary(locale){
  if (!locale){
    locale = "fr_FR"
  }
  this.dictionary = Typo(locale, false, false, { dictionaryPath: "typo/dictionaries" });
}

Dictionary.prototype = {
  calculateSimilarity: function(word, otherWord){
    return similarity(word, otherWord);
  },
  checkSpelling: function(word){
    var correctSpelling = dictionary.check(word);
    if (!correctSpelling){
      return dictionary.suggest(word);
    }
    return []
  }
};

module.exports.Dictionary = Dictionary;
