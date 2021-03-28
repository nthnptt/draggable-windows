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
                    background-color: white;
                    border: solid 1px black;
                    padding: 30px 60px;
                    position: absolute;
                    z-index: 3
                }
                .window-sidebar {
                    height: 20px;
                    background-color: red;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000
                }
            </style>
            <div class="window-root">
                <div class="window-sidebar">

                </div>
                <slot></slot>
            </div>
        `

        this.$root = this.shadow.querySelector('.window-root') 
        this.$sidebar = this.shadow.querySelector('.window-sidebar')
        this.$sidebar.addEventListener('click', ()=>{console.log('test')})

        this.attachDragEventOn(this.$sidebar)


    }

    /**
     * 
     * @param {HTMLElement} $element 
     */
    attachDragEventOn($element = null) {
        $element = $element ?? this.$root
        this.renderMove()
        

        $element.addEventListener('mouseup', (event)=>{
            this.cursorPoint = null
            document.removeEventListener('mousemove', this.onDragCallback)
        })

        $element.addEventListener('mousedown', (event)=>{
            this.cursorPoint = new AppPoint(event.clientX, event.clientY)
            this.cursorPoint = this.cursorPoint.minus(this.pos)
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

    /**
     * init attributes
     */
    initAttributes() {
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
}