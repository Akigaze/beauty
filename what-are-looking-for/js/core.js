console.log("i am core");


const MatchName = {
  simple: 'simpleMatch',
  case: 'caseMatch',
  word: 'wordMatch',
  regex: 'regexMatch',
}

const simpleMatcher = {
  match: (condition, target) => {
    return String.prototype.startsWith.call(target, condition)
  },
  find: (condition, target) => {
    return [...target].filter((c, i) => condition[i] === c).join("")
  }
}

const caseMatcher = {
  match: (condition, target) => {
    const caseConvert = String.prototype.toLowerCase
    return String.prototype.startsWith.call(caseConvert.apply(target), caseConvert.apply(condition))
  },
  find: (condition, target) => {
    const caseConvert = String.prototype.toLowerCase
    return [...target].filter((c, i) => condition[i] && caseConvert.apply(condition[i]) === caseConvert.apply(c)).join("")
  }
}

const wordMatcher = {
  match: (condition, target) => {

  }
}

const regexMatcher = {
  _flags: [],
  flags: {
    get() {
      return this._flags.join("")
    },
    set(flag) {
      this._flags.push(flag)
    }
  },
  match: (condition, target) => {
    const regex = new RegExp(condition, this.flags)
    return String.prototype.test.call(target, regex)
  }
}

const MatchExecutor = {
  matcher: simpleMatcher,
  match: function (condition, target) {
    let matched = this.matcher.match(condition, target);
    console.log(`${condition} -> ${target} : ${matched}`)
    return matched
  },
  find: function (condition, target) {
    return this.matcher.find(condition, target)
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