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

    const Delegate = Utils.Delegate;
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
    this.state.year = Utils.isNumber(time) ? time : (Utils.isDate(time) ? time.getFullYear() : new Date().getFullYear())
    return this
  }

  /**
   *
   * @param {Number|Date}time
   * @return {Calendar}
   */
  setMonth(time) {
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
    const DOM = Utils.DOM
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
    const elements = this.getElements()
    const STYLE = this.get('STYLE')
    const year = this.getYear();
    const month = this.getMonth();
    const date = this.getDate();
    const $title = elements.title
    const $date = elements.date

    const $day = elements.day
    const time = new Date(year, month, date.date)

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
    const DOM = Utils.DOM
    const $days = this.getElements().days
    const STYLE = this.get('STYLE')
    const DAYS = this.get('DAYS')

    for (let order of DAYS) {
      let _day = Utils.Constants.DAY.find(day => day.order === order)
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
    let DOM = Utils.DOM;
    let $dates = this.getElements().dates;
    const DAYS = this.get('DAYS')
    const STYLE = this.get('STYLE')
    const month = this.getMonth()
    const year = this.getYear()
    const date = this.getDate()
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
      lastMonth = 12 + lastMonth
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
    if (nextMonth >= 12) {
      nextMonth = nextMonth - 12
      yearOfNextMonth = yearOfNextMonth + 1
    }
    for (let i = 0; i < datesAfterMonth; i++) {
      const entry = {year: yearOfNextMonth, month: nextMonth, day: DAYS[_i++ % 7], date: i + 1}
      dateEntries.push(entry)
    }

    let dateByWeek = Utils.partition(dateEntries, 7)
    for (let dates of dateByWeek) {
      const dateNodes = dates.map(e => {
        let CLZ_NAME = STYLE.DATE_ENTRY
        if (e.date === date.date && e.month === month) {
          CLZ_NAME = CLZ_NAME + ' ' + STYLE.CURRENT
        } else if (e.month !== month) {
          CLZ_NAME = CLZ_NAME + ' ' + STYLE.FADE
        }
        return DOM.createElement('div', {className: STYLE.DATE_ENTRY_WRAP},
          [DOM.createElement('div', {className: CLZ_NAME, 'data-year': e.year, 'data-month': e.month, 'data-day': e.day, 'data-date': e.date},
            [DOM.createElement('span', {className: STYLE.TEXT}, [e.date])])])
      })
      const weekNode = DOM.createElement('div', {className: STYLE.DATES_OF_WEEK}, dateNodes)
      $dates.appendChild(weekNode)
    }

    for (let i = 0; i < 6 - dateByWeek.length; i++) {
      const emptyWeekNode = DOM.createElement('div', {className: STYLE.DATES_OF_WEEK + ' ' + STYLE.EMPTY})
      $dates.appendChild(emptyWeekNode)
    }

    return this
  }

  _repaintTitle() {
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
    DATE_ENTRY_WRAP: 'cal-date-entry-wrap',
    DATE_ENTRY: 'cal-date-entry',
    TEXT: 'cal-text',
    ICON_PREV: 'icon-arrow-left',
    ICON_NEXT: 'icon-arrow-right',
    CURRENT: 'cal-current-date',
    FADE: 'fade',
    EMPTY: 'empty',
  }
}
