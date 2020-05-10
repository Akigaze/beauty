console.log("what are you looking for?")

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

    filterOptions()

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

const searchSettingEventHandler = function () {

  const setMatcher = (name, on) => {
    if (name === MatcherName.regex) {
      state.setMatcher(MatcherName.word, false, on)
    }
    state.setMatcher(name, on)
    if (on) {
      MatchFactory.get(name).enable()
    }else {
      MatchFactory.get(name).disable()
    }
  }

  const reFilterOptions = () => {
    filterOptions()
    if (clearOptionListIfNoOptionMatch()) {
      return;
    }
    updateOptionList()
  }

  const clickAroundAop = (name, fn) => (event) => {
    const setting = state.setting[name];
    if (setting.disable){
      return
    }
    const nextOn = !setting.on;
    setMatcher(name, nextOn)
    fn(nextOn)
    reFilterOptions()
    elementGetter.input().focus()
  }

  const caseMatchClick = clickAroundAop(MatcherName.case, (nextOn) => {
    if (nextOn) {
      elementRenderer.replace(elementGetter.caseMatchButton(), 'active', 'normal')
    }else {
      elementRenderer.replace(elementGetter.caseMatchButton(), 'normal', 'active')
    }
  })

  const wordMatchClick = clickAroundAop(MatcherName.word, (nextOn) => {
    if (nextOn) {
      elementRenderer.replace(elementGetter.wordMatchButton(), 'active', 'normal')
    }else {
      elementRenderer.replace(elementGetter.wordMatchButton(), 'normal', 'active')
    }
  })

  const regexMatchClick = clickAroundAop(MatcherName.regex, (nextOn) => {
    const operation = nextOn ? elementRenderer.active : elementRenderer.inactive
    operation(elementGetter.regexMatchButton(), 'active')
    if (nextOn) {
      elementRenderer.replace(elementGetter.regexMatchButton(), 'active', 'normal')
      elementRenderer.replace(elementGetter.wordMatchButton(), 'disable', 'normal', 'active')
    } else {
      elementRenderer.replace(elementGetter.regexMatchButton(), 'normal', 'active')
      elementRenderer.replace(elementGetter.wordMatchButton(), 'normal', 'disable')
    }
  })

  return {
    caseMatchClick,
    wordMatchClick,
    regexMatchClick,
  }
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

  const caseMatchButton = elementGetter.caseMatchButton()
  action.call(caseMatchButton, 'click', searchSettingEventHandler.caseMatchClick)
  const wordMatchButton = elementGetter.wordMatchButton()
  action.call(wordMatchButton, 'click', searchSettingEventHandler.wordMatchClick)
  const regexMatchButton = elementGetter.regexMatchButton()
  action.call(regexMatchButton, 'click', searchSettingEventHandler.regexMatchClick)
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

function filterOptions() {
  if (state.content) {
    try {
      const matchedOptions = []
      for (let option of options) {
        const result = MatchExecutor.match(state.content, option.value)
        if (result) {
          matchedOptions.push({...option, parts: result})
        }
      }
      state.setOptions(matchedOptions)
    } catch (e) {
      console.error(state.content, e)
    }
  }
}

function clearOptionListIfSearchContentIsEmpty() {
  if (!state.content) {
    state.setOptions()
    elementRenderer.clearOptionsList()
    return true
  }
}

function clearOptionListIfNoOptionMatch() {
  if (state.options.length === 0) {
    state.setOptions()
    elementRenderer.clearOptionsList()
    return true
  }
}

function updateOptionList() {
  try {
    const optionDivs = state.options.map((option, index) => elementCreator.option(option, index, false))
    elementRenderer.fillOptionList(optionDivs.join(""))
  } catch (e) {
    console.error(state.content, e)
  }

}