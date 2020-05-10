console.log("i am core");

const MatcherName = {
  simple: 'simpleMatch',
  case: 'caseMatch',
  word: 'wordMatch',
  regex: 'regexMatch',
}

class Matcher {
  constructor() {
    this._superMatchers = []
    this._overrideMatchers = []
    this._flags = new Set()
    this.active = false;
  }

  setActive(active = true) {
    this.active = true
  }

  getFlags() {
    return [...this._flags].join("")
  }

  addSuperMatchers(...matchers) {
    this._superMatchers.push(...matchers)
  }

  addOverrideMatchers(...matchers) {
    this._overrideMatchers.push(...matchers)
  }

  ignoreCase(flag = true) {
    flag ? this._flags.add("i") : this._flags.delete("i")
  }

  getName() {
  }

  enable() {
    this.setActive(true)
  }

  disable() {
    this.setActive(false)
  }

  match(pattern, target) {
  }

}

class SimpleMatcher extends Matcher {

  getName() {
    return MatcherName.simple;
  }

  enable() {
    MatchExecutor.matcher = MatchFactory.get(this.getName())
    super.enable()
  }

  disable() {
    this.setActive(false)
  }

  match(pattern, target) {
    const index = target.indexOf(pattern)
    if (index > -1) {
      return [target.slice(0, index), target.slice(index, index + pattern.length), target.slice(index + pattern.length)]
    }
    return null
  }
}

class CaseMatcher extends Matcher {

  getName() {
    return MatcherName.case
  }

  enable() {
    this._superMatchers.forEach(matcher => matcher.ignoreCase())
    if (MatchExecutor.matcher.getName() === MatcherName.simple) {
      MatchExecutor.matcher = MatchFactory.get(this.getName())
    }
    super.enable()
  }

  disable() {
    this._superMatchers.forEach(matcher => matcher.ignoreCase(false))
    if (MatchExecutor.matcher.getName() === this.getName()) {
      MatchExecutor.matcher = MatchFactory.get()
    }
    super.disable()
  }

  match(pattern, target) {
    const index = target.toLowerCase().indexOf(pattern.toLowerCase())
    if (index > -1) {
      return [target.slice(0, index), target.slice(index, index + pattern.length), target.slice(index + pattern.length)]
    }
    return null
  }

}

class WordMatcher extends Matcher {
  constructor() {
    super()
    this.regex = null
  }

  getName() {
    return MatcherName.word;
  }

  enable() {
    if (MatchExecutor.matcher.getName() === MatcherName.regex) {
      throw new Error("word matcher should not work with regex matcher")
    }
    MatchExecutor.matcher = MatchFactory.get(this.getName())
    super.enable()
  }

  disable() {
    if (MatchExecutor.matcher.getName() === MatcherName.regex) {
      throw new Error("word matcher should not work with regex matcher")
    }
    const nextMatcher = this._overrideMatchers.find(matcher => matcher.active)
    MatchExecutor.matcher = MatchFactory.get(nextMatcher && nextMatcher.getName())
    super.disable()
  }

  getWordRegex(pattern) {
    const flags = this.getFlags();
    const regexPattern = `\\b${pattern}\\b`;
    if (!this.regex || this.regex.source !== regexPattern || this.regex.flags !== flags) {
      console.log("new Regex: ", pattern)
      this.regex = new RegExp(regexPattern, flags)
    }
    return this.regex
  }

  match(pattern, target) {
    const regex = this.getWordRegex(pattern)
    const result = target.match(regex)
    if (result) {
      return [target.slice(0, result.index), result[0], target.slice(result.index + result[0].length)]
    }
    return null
  }
}

class RegexMatcher extends Matcher {
  constructor() {
    super()
    this.regex = null
  }

  getName() {
    return MatcherName.regex;
  }

  enable() {
    MatchFactory.get(MatcherName.word).disable()
    MatchExecutor.matcher = MatchFactory.get(this.getName())
    super.enable()
  }

  disable() {
    const nextMatcher = this._overrideMatchers.find(matcher => matcher.active)
    MatchExecutor.matcher = MatchFactory.get(nextMatcher && nextMatcher.getName())
    super.disable()
  }

  getRegex(pattern) {
    const flags = this.getFlags();
    if (!this.regex || this.regex.source !== pattern || this.regex.flags !== flags) {
      console.log("new Regex: ", pattern)
      this.regex = new RegExp(pattern, flags)
    }
    return this.regex
  }

  match(pattern, target) {
    const regex = this.getRegex(pattern)
    const result = target.match(regex)
    if (result) {
      return [target.slice(0, result.index), result[0], target.slice(result.index + result[0].length)]
    }
    return null
  }
}

const MatchFactory = function () {
  let simpleMatcher = new SimpleMatcher();
  let caseMatcher = new CaseMatcher();
  let wordMatcher = new WordMatcher();
  let regexMatcher = new RegexMatcher();

  caseMatcher.addSuperMatchers(wordMatcher, regexMatcher)
  wordMatcher.addOverrideMatchers(caseMatcher)
  regexMatcher.addOverrideMatchers(caseMatcher)

  const matchers = {
    [MatcherName.simple]: simpleMatcher,
    [MatcherName.case]: caseMatcher,
    [MatcherName.word]: wordMatcher,
    [MatcherName.regex]: regexMatcher
  }

  return {
    get(name) {
      return matchers[name] || matchers[MatcherName.simple]
    }
  }
}()

const MatchExecutor = {
  matcher: MatchFactory.get(MatcherName.simple),
  match: function (pattern, target) {
    return this.matcher.match(pattern, target)
  }
}
