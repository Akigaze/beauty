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
  inactive: (element, activeClassName) => element.setAttribute("class", removeClass(element, activeClassName)),
  replace: (element, nextClass, ...preClasses) => element.setAttribute("class", replaceClass(element, nextClass, preClasses)),
  scrollOptionList: (direction, index) => {
    const optionList = elementGetter.optionList()
    const option = elementGetter.option(index)
    const middleOffset = optionList.scrollTop + (optionList.offsetHeight >> 1)
    const offsetTopOfSelectedOption = option.scrollHeight * (index + 1) - (option.scrollHeight >> 1);
    const offset = Math.abs((offsetTopOfSelectedOption + direction.value * (option.scrollHeight >> 1)) - middleOffset) - (optionList.offsetHeight >> 1)
    if (offset > 0) {
      optionList.scrollTop += direction.value * offset
    }
  }
}

const elementCreator = {
  option: ({id, value, parts}, index, selected) => {
    const [front, middle, end] = parts.map(part => part && replaceBlank(part))
    const key = `option-${index}`
    const className = `option ${selected ? 'selected' : ''}`
    return `<div id="${key}" class="${className}" onclick="optionEventHandler.click(${index})"><div class="option-id">${id}</div><div class="option-value">${front}<span class="search-content">${middle}</span>${end}</div></div>`
  }
}