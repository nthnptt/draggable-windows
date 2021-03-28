class AppPoint {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    /**
     * 
     * @param {AppPoint} point 
     * @returns 
     */
    static fromPoint(point) {
        return new AppPoint(point.x, point.y)
    }

    /**
     * 
     * @param {AppPoint} other 
     * @returns {AppPoint}
     */
    minus(other) {
        return new AppPoint(this.x - other.x, this.y - other.y)     
    }
}

/**
 * CustomElement create window moveable in page
 */
export default class Windowed extends HTMLElement{
    /**
     * constructor
     */
    constructor() {
        super()
        this.onDragCallback = this.drag.bind(this)
        this.initAttributes()
        this.shadow = this.attachShadow({mode: 'open'})
        this.shadow.innerHTML = `
            <style>
                .window-root {
                    --window-primary-color: #d0d0d0;

                    background-color: white;
                    border: solid 1px var(--window-primary-color);
                    min-width: 100px;
                    max-width: 50%  ;
                    position: absolute;
                    z-index: 3

                }
                .window-sidebar {
                    display: flex;
                    justify-content: space-between;
                    padding: 0 5px;
                    background-color: var(--window-primary-color);
     
                    z-index: 1000;
                    font-size: 25px;
                    user-select: none;
                }
                .window-body {
                    padding: 3px 5px;
                }
                .window-tools>span:hover {
                    cursor: pointer;
                }
            </style>
            <div class="window-root">
                <div class="window-sidebar">
                    <div class="window-title">title</div>
                    <div class="window-tools"><span class="window-hide">_</span></div>
                </div>
                <slot class="window-body"></slot>
            </div>
        `

        this.$root = this.shadow.querySelector('.window-root') 
        this.$sidebar = this.shadow.querySelector('.window-sidebar')
        this.$hideButton = this.shadow.querySelector('.window-hide')
        this.$sidebar.addEventListener('click', ()=>{console.log('test')})
        this.$body = this.shadow.querySelector('.window-body')

        this.attachDragEventOn(this.$sidebar)
        this.attachHidenEvent()
    }

    attachHidenEvent() {
        this.$hideButton.addEventListener('click', this.hide.bind(this))
        this.renderHide()
    }

    /**
     * 
     * @param {HTMLElement} $element 
     */
    attachDragEventOn($element = null) {
        $element = $element ?? this.$root
        this.renderMove()

        $element.addEventListener('mousedown', (event)=>{
            this.cursorPoint = new AppPoint(event.clientX, event.clientY)
            this.cursorPoint = this.cursorPoint.minus(this.pos)

            document.addEventListener('mouseup', (event)=>{
                this.cursorPoint = null
                document.removeEventListener('mousemove', this.onDragCallback)
            })
            document.addEventListener('mousemove', this.onDragCallback)
        })
    }

    /**
     * Rendering position of window
     */
    renderMove() {
            this.$root.style.top = this.pos.y + 'px'
            this.$root.style.left = this.pos.x + 'px'
    }

    renderHide() {
        let actualWidht = this.$root.offsetWidth
        this.$hideButton.textContent = this.hiden ? '▭' : '-'
        this.$root.style.width = this.hiden ? actualWidht+'px' : 'inherit'
        this.$body.style.display = this.hiden ? 'none' : 'inherit'
    }

    /**
     * init attributes
     */
    initAttributes() {
        this.hiden = false
        this.pos = new AppPoint(this.getAttribute('left') ?? 0, this.getAttribute('top') ?? 0)
    }

    /**
     * function called during drag
     * @param {Event} event 
     */
    drag(event) {
        this.pos = (new AppPoint(event.clientX, event.clientY)).minus(this.cursorPoint)
        this.renderMove()
        event.stopImmediatePropagation()
    }

    /**
     * 
     * @param {Event} event 
     */
    hide(event) {
        this.hiden = !this.hiden
        this.renderHide()
    }
}