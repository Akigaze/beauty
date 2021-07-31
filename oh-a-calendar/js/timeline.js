class Timeline {
  /**
   *
   * @param {Object} [option] 配置参数
   * @param {String} [option.parent] 父节点的id
   */
  constructor(option) {
    this.elements = {
      parent: null,
      wrap: null,
      times: null,
      grid: null
    }

    this.attributes = {
      parent: ''
    }

    this.state = {
      range: [0, 23],
      gap: 1
    }
    this.initialize(option)
      .render()
  }

  initialize(options) {

    this.set(Timeline.defaules)
      .set(options)

    this._createElements()
    return this
  }

  render() {
    const elements = this.getElements()
    const $wrap = elements.wrap
    const $fragment = document.createDocumentFragment()


    this._renderTimes()
    $wrap.appendChild(elements.times)
    this._renderGrid()
    $wrap.appendChild(elements.grid)

    $fragment.appendChild($wrap)

    elements.parent.appendChild($fragment)
    return this
  }

  /**
   *
   * @param {String} name
   * @return {*}
   */
  get(name) {
    return this.attributes[name]
  }

  set(options) {
    options && Object.assign(this.attributes, options)
    return this
  }

  /**
   *
   * @return {Array<Number>}
   */
  getRange(){
    return this.state.range
  }

  /**
   *
   * @return {number}
   */
  getGap(){
    return this.state.gap
  }

  getElements() {
    return this.elements
  }

  _createElements() {
    const DOM = Utils.DOM
    const elements = this.getElements()
    const STYLE = this.get('STYLE')
    elements.parent = document.getElementById(this.get('parent'))
    elements.wrap = DOM.createElement('div', {className: STYLE.WRAP})
    elements.times = DOM.createElement('div', {className: STYLE.TIMES})
    elements.grid = DOM.createElement('div', {className: STYLE.GRID})
  }

  _renderTimes() {
    const DOM = Utils.DOM
    const STYLE = this.get('STYLE')
    const $times = this.getElements().times;
    let [start, end] = this.getRange()
    let gap = this.getGap()
    let $fragment = document.createDocumentFragment()
    for (let i = start; i <= end; i+=gap) {
      const timeNode = DOM.createElement('div', {className: STYLE.TIME_ENTRY},
        [DOM.createElement('code', {className: STYLE.TEXT}, [Utils.createTimeText(i)])])
      $fragment.appendChild(timeNode)
    }

    $times.appendChild($fragment)

    return this
  }

  _renderGrid() {
    const DOM = Utils.DOM
    const STYLE = this.get('STYLE')
    const $grid = this.getElements().grid;
    let [start, end] = this.getRange()
    let gap = this.getGap()
    let $fragment = document.createDocumentFragment()
    for (let i = start; i <= end; i+=gap) {
      const timeNode = DOM.createElement('div', {className: STYLE.GRID_LINE},
        [DOM.createElement('div', {className: STYLE.GRID_LINE_WRAP},
          [DOM.createElement('div', {className: STYLE.LINE}), DOM.createElement('span', {className: STYLE.TEXT, }, [i])])])
      $fragment.appendChild(timeNode)
    }

    $grid.appendChild($fragment)

    return this
  }
}

Timeline.defaules = {
  parent: 'timeline',
  STYLE: {
    WRAP: 'tl-wrap',
    TIMES: 'tl-times',
    TIME_ENTRY: 'tl-time-entry',
    GRID: 'tl-grid',
    GRID_LINE: 'tl-grid-line',
    GRID_LINE_WRAP: 'tl-grid-line-wrap',
    TEXT: 'tl-text',
    LINE: 'tl-line',
  }
}