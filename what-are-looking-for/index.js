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
  searchContent: '',
  matchedOptions: [],
  selectedOptionIndex: -1
}

const elementGetter = {
  input: () => document.querySelector("input"),
  searchIcon: () => document.querySelector(".search-icon"),
  optionList: () => document.querySelector(".option-list"),
  option: (index) => document.getElementById(`option-${index}`),
}

const optionEventHandler = function () {
  const optionClick = (index) => {
    if (state.selectedOptionIndex === index) {
      return
    }

    const preIndex = state.selectedOptionIndex
    const nextIndex = (state.selectedOptionIndex = index)
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
    const searchContent = state.searchContent.replace(" ", "&nbsp;")
    const filling = getRestLetter(value, state.searchContent).replace(" ", "&nbsp;")
    return `<div id="option-${index}" class="option ${selected ? 'selected' : ''}" onclick="optionEventHandler.click(${index})"><div class="option-id">${id}</div><div class="option-value"><span class="search-content">${searchContent}</span>${filling}</div></div>`
  }

  const clearOptionListIfSearchContentIsEmpty = () => {
    if (!state.searchContent) {
      state.matchedOptions = []
      elementGetter.optionList().innerHTML = ""
      return true
    }
  }

  const clearOptionListIfNoOptionMatch = () => {
    if (state.matchedOptions.length === 0) {
      state.matchedOptions = []
      elementGetter.optionList().innerHTML = ""
      return true
    }
  }

  const updateOptionList = () => {
    const optionDivs = state.matchedOptions.map((option, index) => createOption(option, index, false))
    const optionList = elementGetter.optionList()
    optionList.innerHTML = optionDivs.join("")
  }

  const KEY_CODE_MAP = {
    38: {name: 'UP', handle: () => updateSelectedOptionByDirection(Direction.up)},
    40: {name: 'DOWN', handle: () => updateSelectedOptionByDirection(Direction.down)}
  }

  const searchContentChange = (event) => {
    state.searchContent = event.target.value.trimStart();
    state.selectedOptionIndex = -1
    if (clearOptionListIfSearchContentIsEmpty()) {
      return
    }

    state.matchedOptions = options.filter(option => option.value.startsWith(state.searchContent))

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
    if (!state.searchContent) {
      elementGetter.searchIcon().setAttribute("class", "search-icon")
    }
  }

  return {
    contentChange: searchContentChange,
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
}

const Direction = {
  up: {value: -1, condition: (index, maxIndex, minIndex = 0) => index > minIndex},
  down: {value: 1, condition: (index, maxIndex, minIndex = 0) => index < maxIndex}
}

function updateSelectedOptionByDirection(direction) {
  if (!direction.condition(state.selectedOptionIndex, state.matchedOptions.length - 1, 0)) {
    return
  }
  const preIndex = state.selectedOptionIndex
  const nextIndex = state.selectedOptionIndex += direction.value
  updateSelectedOption(preIndex, nextIndex)
}

function updateSelectedOption(preIndex, nextIndex) {
  if (preIndex !== -1) {
    const preSelectedOption = elementGetter.option(preIndex)
    preSelectedOption.setAttribute('class', 'option')
  }
  const nextSelectedOption = elementGetter.option(nextIndex)
  nextSelectedOption.setAttribute('class', 'option selected')
}