const Utils = {
  /**
   * 判断给定值是否是一个html dom 元素
   * @param {*} obj
   * @return {Boolean}
   */
  isElement: (obj) => {
    return obj && obj.nodeName && obj.tagName && obj.nodeType === 1
  },
  /**
   * 判断给定值是否是一个字符串
   * @param {*} obj
   * @return {Boolean}
   */
  isString: (obj) => {
    return typeof obj === 'string'
  },
  /**
   * 判断给定值是否是一个数字
   * @param {*} obj
   * @return {Boolean}
   */
  isNumber: (obj) => {
    return typeof obj === 'number'
  },
  /**
   * 判断给定值是否是一个数组
   * @param {*} obj
   * @return {Boolean}
   */
  isArray: (obj) => {
    return Array.isArray(obj)
  },
  /**
   * 判断给定值是否是一个日期类型
   * @param {*} obj
   * @return {Boolean}
   */
  isDate: (obj) => {
    return obj && obj.constructor === Date
  },
  /**
   * 创建一个用于匹配样式表的正则表达式
   * @param {String} className 样式表名称
   * @return {RegExp} 正则表达式
   */
  createClassRegex: (className) => {
    return new RegExp('(\\s|^)' + className + '(\\s|$)')
  },
  /**
   * 数组按数量分组
   * @param {Array} array 待分组的数组
   * @param {Number} size 每组的元素个数
   * @return {Array} 分组好的数组
   */
  partition(array, size) {
    const result = []
    let cur
    for (let i in array) {
      if (i % size === 0) {
        cur = []
        result.push(cur)
      }
      cur.push(array[i])
    }
    return result
  },
  /**
   * 获取月份的常量对象
   * @param {Date} date 日期对象
   * @return {{order: Number, fullName: String, shortName: String}} 月份常量对象
   */
  getMonth(date) {
    let month = date.getMonth();
    return Utils.Constants.MONTH[month]
  },
  /**
   * 获取星期的常量对象
   * @param {Date} date 日期对象
   * @return {{number: Number, fullName: String, shortName: String}} 星期常量对象
   */
  getDay(date) {
    let day = date.getDay();
    return Utils.Constants.DAY[day]
  },
  /**
   * 获取所在月份第一天的星期
   * @param {Date} date 给定时间
   * @return {{fullName: String, shortName: String, order: Number}}
   */
  getDayOfFirstDateInMonth(date) {
    const day = date.getDay()
    const _date = date.getDate()
    let gap = (_date - 1) % 7
    let dayOfFirstDate = day - gap;
    if (dayOfFirstDate < 0) {
      dayOfFirstDate = 7 + dayOfFirstDate
    }
    return Utils.Constants.DAY.find(d => d.order === dayOfFirstDate)
  },
  /**
   * 获取指定日期在当月的星期
   * @param {Date} date 给定时间
   * @param {Number} th 第几天
   * @return {{fullName: String, shortName: String, order: Number}}
   */
  getDayOf(date, th) {
    const day = date.getDay()
    const _date = date.getDate()
    let dayOfTh = day
    if (th < _date) {
      let gap = (_date - th) % 7
      dayOfTh = day - gap;
      if (dayOfTh < 0) {
        dayOfTh = 7 + dayOfTh
      }
    } else if (th > _date) {
      let gap = (th - _date) % 7
      dayOfTh = day + gap;
      if (dayOfTh >= 7) {
        dayOfTh = dayOfTh - 7
      }
    }
    return Utils.Constants.DAY.find(d => d.order === dayOfTh)
  },
  /**
   * 拼凑时间
   * @param {Number} hour 小时数
   * @param {Number} minute 分钟数
   * @return {String} xx:xx
   */
  createTimeText: (hour = 0, minute = 0) => {
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 60) {
      const _hour = (hour < 10 ? '0' : '') + hour
      const _minute = (minute < 10 ? '0' : '') + minute
      return _hour + ':' + _minute
    }
    throw new Error(`非法时间：${hour} : ${minute}`)
  }
}

Utils.Constants = {
  /**
   * 月份常量，包括简写(shortName)和全称(fullName)
   */
  MONTH: [
    {order: 0, shortName: 'Jan', fullName: 'January'},
    {order: 1, shortName: 'Feb', fullName: 'February'},
    {order: 2, shortName: 'Mar', fullName: 'March'},
    {order: 3, shortName: 'Apr', fullName: 'April'},
    {order: 4, shortName: 'May', fullName: 'May'},
    {order: 5, shortName: 'Jun', fullName: 'June'},
    {order: 6, shortName: 'Jul', fullName: 'July'},
    {order: 7, shortName: 'Aug', fullName: 'August'},
    {order: 8, shortName: 'Sep', fullName: 'September'},
    {order: 9, shortName: 'Oct', fullName: 'October'},
    {order: 10, shortName: 'Nov', fullName: 'November'},
    {order: 11, shortName: 'Dec', fullName: 'December'}
  ],
  /**
   * 星期常量，包括简写(shortName)和全称(fullName)
   */
  DAY: [
    {order: 0, shortName: 'Sun', fullName: 'Sunday'},
    {order: 1, shortName: 'Mon', fullName: 'Monday'},
    {order: 2, shortName: 'Tue', fullName: 'Tuesday'},
    {order: 3, shortName: 'Wed', fullName: 'Wednesday'},
    {order: 4, shortName: 'Thu', fullName: 'Thursday'},
    {order: 5, shortName: 'Fri', fullName: 'Friday'},
    {order: 6, shortName: 'Sat', fullName: 'Saturday'},
  ]
}

Utils.DOM = {
  /**
   * 创建DOM元素，添加属性和子节点
   * @param {String} tagName 标签名
   * @param {Object} [attributes] 标签属性
   * @param {Array<HTMLElement|String|Number>} [children] 子节点
   * @return {HTMLElement}
   */
  createElement: (tagName, attributes, children) => {
    const element = document.createElement(tagName)
    for (let name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        Utils.DOM.setAttribute(element, name, attributes[name])
      }
    }
    if (Utils.isArray(children)) {
      for (let child of children) {
        let childNode
        if (Utils.isElement(child)) {
          childNode = child
        } else if (Utils.isString(child) || Utils.isNumber(child)) {
          childNode = document.createTextNode(child.toString())
        }
        childNode && element.appendChild(childNode)
      }
    }
    return element
  },
  /**
   * DOM 元素设置属性值
   * @param {HTMLElement} element DOM元素
   * @param {String} name 属性名
   * @param {String|Number|Boolean} value 属性值
   */
  setAttribute: (element, name, value) => {
    let tagName = element.tagName.toLowerCase()
    switch (name) {
      case 'style':
        element.style.cssText = value
        break
      case 'value':
        (tagName === 'input' || tagName === 'textarea') ? element.value = value : element.setAttribute(name, value)
        break
      case 'className':
        element.className = value
        break
      default:
        element.setAttribute(name, value)
    }
  },
  /**
   * 为DOM 元素的style属性设置子属性
   * @param {HTMLElement} element DOM 元素
   * @param {String} name style 属性的子属性名
   * @param {String} value 属性值
   */
  setStyle: (element, name, value) => {
    element.style[name] = value
  },
  /**
   * 判断元素是否有指定的class样式
   * @param {HTMLElement} element DOM 元素
   * @param {String} className class样式表名称
   * @return {*}
   */
  hasClass: (element, className) => {
    let allClasses = element.className
    if (!allClasses) {
      return false
    }
    return className.match(Calendar.Utils.createClassRegex(className))
  },
  /**
   * 为DOM元素添加指定样式表
   * @param {HTMLElement} element DOM 元素
   * @param {String} className 样式表名称
   * @return {Boolean} 是否添加成功
   */
  addClass: (element, className) => {
    let allClasses = element.className
    if (allClasses) {
      if (Calendar.DOM.hasClass(element, className)) {
        return false
      }
      allClasses += ' ' + className
    } else {
      allClasses = className
    }
    return Boolean(element.className = allClasses)
  },
  /**
   * 删除DOM元素的指定样式表
   * @param {HTMLElement} element DOM 元素
   * @param {String} className 样式表名称
   * @return {Boolean} 是否删除成功
   */
  removeClass: (element, className) => {
    let allClasses = element.className;
    if (allClasses && Utils.DOM.hasClass(element, className)) {
      allClasses = allClasses.replace(Utils.createClassRegex(className), '')
      element.className = allClasses
      return true
    }
    return false
  },

}

Utils.Delegate = {
  /**
   * DOM 元素添加事件
   * @param {HTMLElement} element DOM 元素
   * @param {String} type 事件类型
   * @param {Function} fn 事件处理函数
   * @param {Object} context 事件处理上下文，默认是 element
   * @param {Boolean} capture 是否采用事件捕获
   * @return {*}
   */
  on: (element, type, fn, context, capture = false) => {
    const wrapper = function (event) {
      fn.call(context || element, event)
    }
    element.addEventListener(type, wrapper, capture)
    return fn
  }
}