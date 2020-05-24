class Calendar {

  /**
   * 创建Calendar对象
   * @param {Object} [options] 创建对象配置参数
   * @param {String} [options.parent] 父节点的元素id，决定日历要显示的位置，默认'calendar'
   * @param {Date} [options.time] 初始化的时间，默认当前时间
   */
  constructor(options) {
    /**
     * 日历对象的配置属性
     */
    this.attributes = {
      parent: '',
      time: '',
      STYLE: {}
    }
    /**
     * 日历对象的DOM节点属性
     */
    this.elements = {
      parent: null,
      wrap: null,
      header: null,
      title: null,
      date: null, // 日期
      day: null, // 星期
      switcher: null,
      prev: null,
      next: null,
      body: null,
      days: null,
      dates: null,
      footer: null
    }

    /**
     * 记录当前展示的日期信息和选择的日期
     */
    this.state = {
      year: 0,
      month: 0,
      date: {
        year: 0,
        month: 0,
        date: 0,
        day: 0
      }
    }

    this.initialize(options)
      .render()
      .addEventListeners()
  }

  /**
   * 根据给定的配置参数初始化属性和DOM元素
   * @return {Calendar} 当前日历对象
   */
  initialize(options) {
    this.setAttributes(Calendar.defaults)
      .setAttributes(options)

    const time = this.get('time')

    this.setYear(time)
      .setMonth(time)
      .setDate(time)

    this._createElements()

    return this
  }

  /**
   * 渲染日历控件
   * @return {Calendar} 当前日历对象
   */
  render() {
    const element = this.getElements()
    const $wrap = element.wrap
    const $header = element.header
    const $body = element.body
    const $fragment = document.createDocumentFragment()

    this._renderTitle()
    $header.appendChild(element.title)

    this._renderSwitcher()
    $header.appendChild(element.switcher)

    this._renderDays()
    $body.appendChild(element.days)

    this._renderDates()
    $body.appendChild(element.dates)

    $wrap.appendChild($header)
    $wrap.appendChild($body)

    $fragment.appendChild($wrap)
    element.parent.appendChild($fragment)
    return this
  }

  /**
   * 给DOM元素添加事件监听
   * @return {Calendar}
   */
  addEventListeners() {

    const Delegate = Calendar.Delegate;
    const elements = this.getElements()
    const CLICK = 'click'
    Delegate.on(elements.prev, CLICK, this._prevClick, this)
    Delegate.on(elements.next, CLICK, this._nextClick, this)

    return this
  }

  /**
   *
   * @param {Number|Date}time
   * @return {Calendar}
   */
  setYear(time) {
    let Utils = Calendar.Utils;
    this.state.year = Utils.isNumber(time) ? time : (Utils.isDate(time) ? time.getFullYear() : new Date().getFullYear())
    return this
  }

  /**
   *
   * @param {Number|Date}time
   * @return {Calendar}
   */
  setMonth(time) {
    let Utils = Calendar.Utils;
    if (Utils.isNumber(time)) {
      this.state.month = time < 0 ? Math.abs((12 + time) % 12) : (time >= 12 ? (time - 12) % 12 : time)
    } else if (Utils.isDate(time)) {
      this.state.month = time.getMonth()
    } else {
      this.state.month = new Date().getMonth()
    }
    return this
  }

  /**
   *
   * @param {Date} time
   * @return {Calendar}
   */
  setDate(time) {
    const date = this.state.date
    date.year = time.getFullYear()
    date.month = time.getMonth()
    date.day = time.getDay()
    date.date = time.getDate()
    return this
  }

  /**
   *
   * @return {Number}
   */
  getYear() {
    return this.state.year
  }

  /**
   *
   * @return {Number}
   */
  getMonth() {
    return this.state.month
  }

  /**
   *
   * @return {{date: Number, month: Number, year: Number, day: Number}}
   */
  getDate() {
    return this.state.date
  }

  /**
   * 获取日历对象的elements属性
   * @see Calendar.elements
   * @return {Object}
   */
  getElements() {
    return this.elements;
  }

  /**
   * 设置配置信息
   * @see Calendar.defaults
   * @param {Object} options
   * @return {Calendar} 当前 Calendar 对象
   */
  setAttributes(options = {}) {
    Object.assign(this.attributes, options)
    return this
  }

  /**
   * 获取指定名称的配置属性的值
   * @param {String} name 属性名
   * @return {*} 属性值
   */
  get(name) {
    return this.attributes[name]
  }

  /**
   * 返回月份的总天数
   * @param {Number} year 给定年份
   * @param {Number} month 给定月份
   * @return {Number} 天数
   */
  getDatesOfMonth(year, month) {
    let datesOfMonth = this.get('DATES')[month]
    if (Calendar.isLeapYear(year) && month === 1) {
      datesOfMonth += 1
    }
    return datesOfMonth
  }

  update() {
    this._repaintTitle()
    this._repaintDates()
  }

  prev() {
    let month = this.getMonth() - 1
    let year = this.getYear()

    if (month < 0) {
      year -= 1
    }
    this.setYear(year)
      .setMonth(month)
    this.update()
  }

  next() {
    let month = this.getMonth() + 1;
    let year = this.getYear()
    if (month >= 12) {
      year += 1
    }
    this.setYear(year).setMonth(month)
    this.update()
  }

  /**
   * 上一个月处理函数
   * @param {Event} event
   * @private
   */
  _prevClick(event) {
    this.prev()
  }

  /**
   * 上一个月处理函数
   * @param {Event} event
   * @private
   */
  _nextClick(event) {
    this.next()
  }

  /**
   * 初始化DOM元素
   * @private
   * @return {Calendar} 当前日历对象
   */
  _createElements() {
    const DOM = Calendar.DOM
    const STYLE = this.get('STYLE')
    const element = this.getElements()
    element.parent = document.getElementById(this.get('parent'))
    element.wrap = DOM.createElement('div', {className: STYLE.WRAP})

    element.header = DOM.createElement('div', {className: STYLE.HEADER})
    element.title = DOM.createElement('div', {className: STYLE.TITLE})
    element.date = DOM.createElement('div', {className: STYLE.DATE},
      [DOM.createElement('span', {className: STYLE.TEXT})])
    element.day = DOM.createElement('div', {className: STYLE.DAY},
      [DOM.createElement('span', {className: STYLE.TEXT})])
    element.switcher = DOM.createElement('div', {className: STYLE.SWITCHER})
    element.prev = DOM.createElement('div', {className: STYLE.PREV},
      [DOM.createElement('span', {className: STYLE.TEXT},
        [DOM.createElement('i', {className: STYLE.ICON_PREV})])])
    element.next = DOM.createElement('div', {className: STYLE.NEXT},
      [DOM.createElement('span', {className: STYLE.TEXT},
        [DOM.createElement('i', {className: STYLE.ICON_NEXT})])])

    element.body = DOM.createElement('div', {className: STYLE.BODY})
    element.days = DOM.createElement('div', {className: STYLE.DAYS},)
    element.dates = DOM.createElement('div', {className: STYLE.DATES},)

    return this
  }

  /**
   * 渲染日历标题部分，包括日期和星期
   * @return {Calendar}
   * @private
   */
  _renderTitle() {
    const Utils = Calendar.Utils
    const elements = this.getElements()
    const STYLE = this.get('STYLE')
    const year = this.getYear();
    const $title = elements.title
    const $date = elements.date
    const $day = elements.day

    const time = new Date(year, this.getMonth(), 1)

    const dateText = $date.querySelector('.' + STYLE.TEXT)
    const dayText = $day.querySelector('.' + STYLE.TEXT)

    dateText.innerHTML = Utils.getMonth(time).shortName + ' ' + time.getDate() + ', ' + year
    dayText.innerHTML = Utils.getDay(time).fullName

    $title.appendChild($date)
    $title.appendChild($day)

    return this
  }

  /**
   * 渲染日历切换月份的按钮，包括上个月和下个月
   * @return {Calendar}
   * @private
   */
  _renderSwitcher() {
    const elements = this.getElements()
    const $switcher = elements.switcher
    const $prev = elements.prev
    const $next = elements.next

    $switcher.appendChild($prev)
    $switcher.appendChild($next)
    return this
  }

  /**
   * 渲染日历星期栏
   * @return {Calendar}
   * @private
   */
  _renderDays() {
    const Utils = Calendar.Utils
    const DOM = Calendar.DOM
    const $days = this.getElements().days
    const STYLE = this.get('STYLE')
    const DAYS = this.get('DAYS')

    for (let order of DAYS) {
      let _day = Utils.DAY.find(day => day.order === order)
      if (!_day) {
        throw new Error("invalid day: " + order)
      }
      let entry = DOM.createElement('div', {className: STYLE.DAY_ENTRY},
        [DOM.createElement('span', {className: STYLE.TEXT}, [_day.shortName])])
      $days.appendChild(entry)
    }

    return this
  }

  /**
   * 渲染日历日期网格
   * @return {Calendar}
   * @private
   */
  _renderDates() {
    let Utils = Calendar.Utils;
    let DOM = Calendar.DOM;
    let $dates = this.getElements().dates;
    const DAYS = this.get('DAYS')
    const STYLE = this.get('STYLE')
    const month = this.getMonth()
    const year = this.getYear()
    const timeOfFirstDate = new Date(year, month, 1)

    const datesOfMonth = this.getDatesOfMonth(year, month)
    let dayOfFirstDate = Utils.getDay(timeOfFirstDate)
    let dayOfLastDate = Utils.getDayOf(timeOfFirstDate, datesOfMonth)
    const datesBeforeMonth = DAYS.indexOf(dayOfFirstDate.order)
    const datesAfterMonth = 7 - 1 - DAYS.indexOf(dayOfLastDate.order)

    let dateEntries = []
    let yearOfLastMonth = year
    let lastMonth = month - 1
    if (lastMonth < 0) {
      lastMonth = 12 - lastMonth
      yearOfLastMonth = yearOfLastMonth - 1
    }
    const datesOfLastMonth = this.getDatesOfMonth(yearOfLastMonth, lastMonth)
    let _i = 0
    for (let i = 0; i < datesBeforeMonth; i++) {
      const entry = {
        year: yearOfLastMonth,
        month: lastMonth,
        day: DAYS[_i++ % 7],
        date: datesOfLastMonth - datesBeforeMonth + i
      }
      dateEntries.push(entry)
    }

    for (let i = 0; i < datesOfMonth; i++) {
      const entry = {year: year, month: month, day: DAYS[_i++ % 7], date: i + 1}
      dateEntries.push(entry)
    }

    let yearOfNextMonth = year
    let nextMonth = month + 1
    if (lastMonth <= 12) {
      nextMonth = nextMonth - 12
      yearOfNextMonth = yearOfNextMonth + 1
    }
    for (let i = 0; i < datesAfterMonth; i++) {
      const entry = {year: yearOfNextMonth, month: nextMonth, day: DAYS[_i++ % 7], date: i + 1}
      dateEntries.push(entry)
    }

    let dateByWeek = Utils.partition(dateEntries, 7)

    for (let dates of dateByWeek) {
      const dateNodes = dates.map(e => DOM.createElement('div',
        {
          className: STYLE.DATE_ENTRY,
          'data-year': e.year,
          'data-month': e.month,
          'data-day': e.day,
          'data-date': e.date
        },
        [DOM.createElement('span', {className: STYLE.TEXT}, [e.month === month ? e.date : null])]))
      const weekNode = DOM.createElement('div', {className: STYLE.DATES_OF_WEEK}, dateNodes)
      $dates.appendChild(weekNode)
    }

    return this
  }

  _repaintTitle(){
    const elements = this.getElements()
    let $title = elements.title;
    $title.innerHTML = ''
    this._renderTitle()
  }

  _repaintDates() {
    const elements = this.getElements()
    let $dates = elements.dates;
    $dates.innerHTML = ''
    this._renderDates()
  }

  /**
   * 计算给定年份是否是闰年：
   * ====================================================
   * 关于公历闰年是这样规定的：地球绕太阳公转一周叫做一回归年，一回归年长365日5时48分46秒。
   * 因此，公历规定有平年和闰年，平年一年有365日，比回归年短0.242199日，一般用四位小数计算，即0.2422，
   * 四年共短0.9688日，故每四年增加一日，并且把这多出了的一天放到二月份，所以闰年的二月份有29天，这一天也叫闰日，这一年共有366日，就是闰年。
   * 但四年增加一日比四个回归年又多0.0312日，400年后将多3.12日，故在400年中少设3个闰年，也就是在400年中只设97个闰年，这样公历年的平均长度与回归年就相近似了。
   * 由此规定：年份是整百数的必须是400的倍数才是闰年
   * @param {Number} year 给定年份
   * @return {Boolean}
   */
  static isLeapYear(year) {
    return (year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0))
  }

}

Calendar.DOM = {
  /**
   * 创建DOM元素，添加属性和子节点
   * @param {String} tagName 标签名
   * @param {Object} [attributes] 标签属性
   * @param {Array<HTMLElement|String|Number>} [children] 子节点
   * @return {HTMLElement}
   */
  createElement: (tagName, attributes, children) => {
    let Utils = Calendar.Utils;
    const element = document.createElement(tagName)
    for (let name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        Calendar.DOM.setAttribute(element, name, attributes[name])
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
    if (allClasses && Calendar.DOM.hasClass(element, className)) {
      allClasses = allClasses.replace(Calendar.Utils.createClassRegex(className), '')
      element.className = allClasses
      return true
    }
    return false
  }
}

Calendar.Utils = {
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
    return Calendar.Utils.MONTH[month]
  },
  /**
   * 获取星期的常量对象
   * @param {Date} date 日期对象
   * @return {{number: Number, fullName: String, shortName: String}} 星期常量对象
   */
  getDay(date) {
    let day = date.getDay();
    return Calendar.Utils.DAY[day]
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
    return Calendar.Utils.DAY.find(d => d.order === dayOfFirstDate)
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
    return Calendar.Utils.DAY.find(d => d.order === dayOfTh)
  },
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

Calendar.Delegate = {
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

Calendar.defaults = {
  parent: 'calendar',
  time: new Date(),
  // 星期的顺序, 0-6
  DATES: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  DAYS: [1, 2, 3, 4, 5, 6, 0],
  STYLE: {
    WRAP: 'cal-wrap',
    HEADER: 'cal-header',
    TITLE: 'cal-title',
    DATE: 'cal-date',
    DAY: 'cal-day',
    SWITCHER: 'cal-switcher',
    PREV: 'cal-prev',
    NEXT: 'cal-next',
    BODY: 'cal-body',
    DAYS: 'cal-days',
    DAY_ENTRY: 'cal-day-entry',
    DATES: 'cal-dates',
    DATES_OF_WEEK: 'cal-date-week',
    DATE_ENTRY: 'cal-date-entry',
    TEXT: 'cal-text',
    ICON_PREV: 'icon-arrow-left',
    ICON_NEXT: 'icon-arrow-right',
  }
}
