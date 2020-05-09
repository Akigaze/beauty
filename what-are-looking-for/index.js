console.log("what are you looking for?")

const options = [
  {id: 2, value: 'America'},
  {id: 4, value: 'Japan'},
  {id: 9, value: 'Break dance'},
  {id: 10, value: 'China'},
  {id: 12, value: 'Korea'},
  {id: 17, value: 'Breezeblocks'},
  {id: 23, value: 'Breach'},
  {id: 27, value: 'Breakfast'},
  {id: 54, value: 'England'},
]

const state = {
  content: '',
  options: [],
  selectedIndex: -1
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

state.rest = function () {
  this.content = ''
  this.options = []
  this.selectedIndex = -1
}.bind(state)

const elementGetter = {
  input: () => document.querySelector("input"),
  searchIcon: () => document.querySelector(".search-icon"),
  optionList: () => document.querySelector(".option-list"),
  option: (index) => document.getElementById(`option-${index}`),
  clearButton: () => document.querySelector(".clear-content"),
}

const elementRenderer = {
  clearAll: () => {
    elementGetter.optionList().innerHTML = ""
    elementGetter.input().value = ""
    elementGetter.clearButton().setAttribute("class", "clear-content invisible")
  },
  clearOptionsList: () => elementGetter.optionList().innerHTML = "",
  fillOptionList: (html) => elementGetter.optionList().innerHTML = html
}

const optionEventHandler = function () {
  const optionClick = (index) => {
    if (state.selectedIndex === index) {
      return
    }

    const preIndex = state.selectedIndex
    const nextIndex = (state.selectedIndex = index)
    updateSelectedOption(preIndex, nextIndex)

    elementGetter.input().focus()
  }

  return {click: optionClick}
}()

const inputEventHandler = function () {
  const getRestLetter = (value, prefix) => {
    const rest = [...value].filter((c, i) => prefix[i] !== c)
    return rest.length > 0 ? rest.join("") : ""
  }

  const createOption = ({id, value}, index, selected) => {
    const content = state.content.replace(" ", "&nbsp;")
    const filling = getRestLetter(value, state.content).replace(" ", "&nbsp;")
    return `<div id="option-${index}" class="option ${selected ? 'selected' : ''}" onclick="optionEventHandler.click(${index})"><div class="option-id">${id}</div><div class="option-value"><span class="search-content">${content}</span>${filling}</div></div>`
  }

  const clearOptionListIfSearchContentIsEmpty = () => {
    if (!state.content) {
      state.setOptions()
      elementRenderer.clearOptionsList()
      return true
    }
  }

  const clearOptionListIfNoOptionMatch = () => {
    if (state.options.length === 0) {
      state.setOptions()
      elementRenderer.clearOptionsList()
      return true
    }
  }

  const updateOptionList = () => {
    const optionDivs = state.options.map((option, index) => createOption(option, index, false))
    elementRenderer.fillOptionList(optionDivs.join(""))
  }

  const handleClearButton = () => {
    elementGetter.clearButton().setAttribute("class", `clear-content ${state.content ? "" : "invisible"}`)
  }

  const KEY_CODE_MAP = {
    38: {name: 'Up', handle: () => updateSelectedOptionByDirection(Direction.up)},
    40: {name: 'Down', handle: () => updateSelectedOptionByDirection(Direction.down)},
    27: {name: 'Escape', handle: () => cancelSelectedOption()}
  }

  const contentChange = (event) => {
    state.setContent(event.target.value.trimStart());
    state.setSelectedIndex()

    handleClearButton()

    if (clearOptionListIfSearchContentIsEmpty()) {
      return
    }

    state.options = options.filter(option => option.value.startsWith(state.content))

    if (clearOptionListIfNoOptionMatch()) {
      return;
    }

    updateOptionList()
  }

  const inputKeydown = (event) => {
    const handler = KEY_CODE_MAP[event.keyCode]
    if (!handler) {
      return
    }
    handler.handle()
    event.preventDefault()
  }

  const inputFocus = (event) => {
    elementGetter.searchIcon().setAttribute("class", "search-icon active")
  }

  const inputBlur = (event) => {
    if (!state.content) {
      elementGetter.searchIcon().setAttribute("class", "search-icon")
    }
  }

  return {
    contentChange: contentChange,
    keydown: inputKeydown,
    focus: inputFocus,
    blur: inputBlur
  }
}()

const searchIconEventHandler = function () {
  const searchIconClick = (event) => {
    elementGetter.input().focus()
  }

  return {click: searchIconClick}
}()

const clearButtonEventHandler = function () {
  const clearContent = (event) => {
    state.rest()
    elementRenderer.clearAll()
    elementGetter.input().focus()
  }

  return {click: clearContent}
}()

window.onload = () => {
  eventManage(Element.prototype.addEventListener)
}

window.onclose = () => {
  eventManage(Element.prototype.removeEventListener)
}

function eventManage(action) {
  const input = elementGetter.input()
  action.call(input, 'input', inputEventHandler.contentChange)
  action.call(input, 'keydown', inputEventHandler.keydown)
  action.call(input, 'focus', inputEventHandler.focus)
  action.call(input, 'blur', inputEventHandler.blur)
  const searchIcon = elementGetter.searchIcon()
  action.call(searchIcon, 'click', searchIconEventHandler.click)
  const clearButton = elementGetter.clearButton()
  action.call(clearButton, 'click', clearButtonEventHandler.click)
}

const Direction = {
  up: {value: -1, condition: (index, max, min = 0) => index > min},
  down: {value: 1, condition: (index, max, min = 0) => index < max}
}

function updateSelectedOptionByDirection(direction) {
  if (!direction.condition(state.selectedIndex, state.options.length - 1, 0)) {
    return
  }
  const preIndex = state.selectedIndex
  const nextIndex = state.selectedIndex += direction.value
  updateSelectedOption(preIndex, nextIndex)
}

function cancelSelectedOption() {
  if (state.selectedIndex === -1) {
    return
  }
  const preSelectedOption = elementGetter.option(state.selectedIndex)
  preSelectedOption.setAttribute('class', 'option')
  state.setSelectedIndex()
}

function updateSelectedOption(preIndex, nextIndex) {
  if (preIndex !== -1) {
    const preSelectedOption = elementGetter.option(preIndex)
    preSelectedOption.setAttribute('class', 'option')
  }
  const nextSelectedOption = elementGetter.option(nextIndex)
  nextSelectedOption.setAttribute('class', 'option selected')
}