console.log("i am store")

const state = {
  content: '',
  options: [],
  selectedIndex: -1,
  setting: {
    [MatcherName.case]: {on: false, disable: false},
    [MatcherName.word]: {on: false, disable: false},
    [MatcherName.regex]: {on: false, disable: false}
  }
}

state.setContent = function (content) {
  this.content = content || ""
}.bind(state)
state.setOptions = function (options) {
  this.options = options || []
}.bind(state)
state.setSelectedIndex = function (index) {
  this.selectedIndex = index || -1
}.bind(state)

state.setMatcher = function (name, on = false, disable = false) {
  const matcher = state.setting[name]
  if (matcher) {
    matcher.on = on
    matcher.disable = disable
  }
}.bind(state)

state.rest = function () {
  this.content = ''
  this.options = []
  this.selectedIndex = -1
}.bind(state)