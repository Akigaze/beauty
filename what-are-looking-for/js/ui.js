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
    const {matchValue, filling} = getOptionValue(value, state.content)
    return `<div id="option-${index}" class="option ${selected ? 'selected' : ''}" onclick="optionEventHandler.click(${index})"><div class="option-id">${id}</div><div class="option-value"><span class="search-content">${matchValue}</span>${filling}</div></div>`
  }
}

const getOptionValue = (value, prefix) => {
  const matchValue = MatchExecutor.find(prefix, value)
  const filling = [...value].filter((c, i) => matchValue[i] !== c).join("")
  return {matchValue: matchValue.replace(" ", "&nbsp;"), filling: filling.replace(" ", "&nbsp;")}
}