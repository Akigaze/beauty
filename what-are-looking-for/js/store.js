console.log("i am store")

const state = {
  content: '',
  options: [],
  selectedIndex: -1,
  setting: {
    [MatchName.case]: false,
    [MatchName.word]: false,
    [MatchName.regex]: false
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

state[MatchName.case] = function(on=false){state.setting[MatchName.case] = on}.bind(state)
state[MatchName.word] = function(on=false){state.setting[MatchName.word] = on}.bind(state)
state[MatchName.regex] = function(on=false){state.setting[MatchName.regex] = on}.bind(state)

state.rest = function () {
  this.content = ''
  this.options = []
  this.selectedIndex = -1
}.bind(state)