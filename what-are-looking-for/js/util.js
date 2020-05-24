console.log("I am util")

const utils = function () {

  const concatClass = (element, added) => {
    const className = element.getAttribute("class");
    if (className) {
      const classes = className.split(" ")
      if (classes.length > 0) {
        return `${classes[0]} ${added}`
      }
    }
    return added
  }

  const removeClass = (element, removed) => {
    const className = element.getAttribute("class");
    if (className) {
      const classes = className.split(" ")
      const remained = classes.filter(c => c !== removed)
      if (remained.length > 0) {
        return remained.join(" ")
      }
    }
    return className
  }

  const replaceClass = (element, added, removeds) => {
    const className = element.getAttribute("class");
    if (className) {
      const classes = className.split(" ")
      const remained = classes.filter(c => !removeds.includes(c))
      return [...remained, added].join(" ")
    }
    return className
  }

  const replaceBlank = (() => {
    const BLANK_REGEX = new RegExp(/ /, 'g')
    return (value) => value.replace(BLANK_REGEX, "&nbsp;")
  })()

  const trimIfExist = (str, char) => {
    return str
  }

  const appendParams = (url, param={}) => {
    const _param = Object.entries(param).map(([k, v]) => `${k}=${v}`).join("&")
    if (!_param) {
      return url
    }
    return `${url}?${_param}`
  }

  const makeURL = (host, baseURL, ...paths) => {
    host = trimIfExist(host, "/")
    baseURL = trimIfExist(baseURL, "/")
    return `${host}/${baseURL}/${paths.map(path => trimIfExist(path, "/")).join("/")}`
  }

  return {
    concatClass,
    removeClass,
    replaceClass,
    replaceBlank,
    trimIfExist,
    appendParams,
    makeURL,
  }
}()
