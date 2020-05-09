console.log("i am core");


const MatchName = {
  simple: 'simpleMatch',
  case: 'caseMatch',
  word: 'wordMatch',
  regex: 'regexMatch',
}

const simpleMatcher = {
  match: (pattern, target) => {
    return String.prototype.startsWith.call(target, pattern)
  },
  find: (pattern, target) => {
    const matchValue = [...target].filter((c, i) => pattern[i] === c).join("");
    return {matchValue, index: 0}
  }
}

const caseMatcher = {
  match: (pattern, target) => {
    const caseConvert = String.prototype.toLowerCase
    return String.prototype.startsWith.call(caseConvert.apply(target), caseConvert.apply(pattern))
  },
  find: (pattern, target) => {
    const caseConvert = String.prototype.toLowerCase
    const matchValue = [...target].filter((c, i) => pattern[i] && caseConvert.apply(pattern[i]) === caseConvert.apply(c)).join("");
    return {matchValue, index: 0}
  }
}

const wordMatcher = {
  flags: [],
  regex: null,
  getWordRegex: function (pattern) {
    let regexPattern = `\\b${pattern}\\b`;
    if (!this.regex || this.regex.source !== regexPattern) {
      console.log("new Regex: ", pattern)
      this.regex = new RegExp(regexPattern, this.flags.join(""))
    }
    return this.regex
  },
  match: function (pattern, target) {
    const regex = this.getWordRegex(pattern)
    return RegExp.prototype.test.call(regex, target)
  },
  find: function (pattern, target) {
    const regex = this.getWordRegex(pattern)
    let matchResult = String.prototype.match.call(target, regex);
    return {matchValue: matchResult[0], index: matchResult.index}
  }
}

const regexMatcher = {
  flags: [],
  regex: null,
  getRegex: function (pattern) {
    if (!this.regex || this.regex.source !== pattern) {
      console.log("new Regex: ", pattern)
      this.regex = new RegExp(pattern, this.flags.join(""))
    }
    return this.regex
  },
  match: function (pattern, target) {
    const regex = this.getRegex(pattern)
    return RegExp.prototype.test.call(regex, target)
  },
  find: function (pattern, target) {
    const regex = this.getRegex(pattern)
    let matchResult = String.prototype.match.call(target, regex);
    return {matchValue: matchResult[0], index: matchResult.index}
  }
}

const MatchExecutor = {
  matcher: simpleMatcher,
  match: function (pattern, target) {
    return this.matcher.match(pattern, target)
  },
  find: function (pattern, target) {
    return this.matcher.find(pattern, target)
  }
}


const MatchFactory = function () {
  const matchers = {
    [MatchName.simple]: simpleMatcher,
    [MatchName.case]: caseMatcher,
    [MatchName.word]: wordMatcher,
    [MatchName.regex]: regexMatcher
  }

  return {
    get(name) {
      return matchers[name] || matchers[MatchName.simple]
    }
  }
}()