var Typo = require("typo-js");
const stringSimilarity = require('string-similarity');
const similarity = require('similarity');

function Dictionary(locale){
  if (!locale){
    locale = "fr_FR";
  }
  // this.dictionary = Typo(locale, false, false, { dictionaryPath: "typo/dictionaries" });
}

Dictionary.prototype = {
  calculateSimilarity: function(word, otherWord){
    const sim1 = similarity(word, otherWord);
    const sim2 = stringSimilarity.compareTwoStrings(word, otherWord);
    console.log(`Sim 1 (${word}, ${otherWord}): ${sim1}`);
    console.log(`Sim 2 (${word}, ${otherWord}): ${sim2}`);
    return Math.max(sim1, sim2);
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
