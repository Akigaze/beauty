console.log("i am ui")

const elementGetter = {
  input: () => document.querySelector("input"),
  searchIcon: () => document.querySelector(".search-icon"),
  optionList: () => document.querySelector(".option-list"),
  option: (index) => document.getElementById(`option-${index}`),
  clearButton: () => document.querySelector(".clear-content"),
  caseMatchButton: () => document.querySelector(".case-match"),
  wordMatchButton: () => document.querySelector(".word-match"),
  regexMatchButton: () => document.querySelector(".regex-match"),
}

const elementRenderer = {
  clearAll: () => {
    elementGetter.optionList().innerHTML = ""
    elementGetter.input().value = ""
    elementGetter.clearButton().setAttribute("class", "clear-content invisible")
  },
  clearOptionsList: () => elementGetter.optionList().innerHTML = "",
  fillOptionList: (html) => elementGetter.optionList().innerHTML = html,
  active: (element, activeClassName) => element.setAttribute("class", concatClass(element, activeClassName)),
  inactive: (element, activeClassName) => element.setAttribute("class", removeClass(element, activeClassName))
}

const elementCreator = {
  option: ({id, value}, index, selected) => {
    const {front, middle, end} = getOptionValue(value, state.content)
    const key = `option-${index}`
    const className = `option ${selected ? 'selected' : ''}`
    return `<div id="${key}" class="${className}" onclick="optionEventHandler.click(${index})"><div class="option-id">${id}</div><div class="option-value">${front}<span class="search-content">${middle}</span>${end}</div></div>`
  }
}

const getOptionValue = (value, pattern) => {
  const {matchValue, index} = MatchExecutor.find(pattern, value)
  const front = value.slice(0, index)
  const end = value.slice(index + matchValue.length)
  return {middle: replaceBlank(matchValue), front: replaceBlank(front), end: replaceBlank(end)}
}