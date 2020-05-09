console.log("I am util")

function concatClass(element, added) {
  const className = element.getAttribute("class");
  if (className) {
    const classes = className.split(" ")
    if (classes.length > 0) {
      return `${classes[0]} ${added}`
    }
  }
  return added
}

function removeClass(element, removed) {
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

