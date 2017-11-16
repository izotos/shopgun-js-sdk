MicroEvent = require 'microevent'
Mustache = require 'mustache'
template = require './templates/hotspot-picker'
keyCodes = require '../../key-codes'

if window?.Element && !Element.prototype.matches
    Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector

class PagedPublicationHotspotPicker
    constructor: (@options = {}) ->
        @el = document.createElement 'div'
        @resizeListener = @resize.bind @

        return

    render: ->
        width = @options.width ? 100
        header = @options.header
        template = @options.template if @options.template?
        trigger = @trigger.bind @
        view =
            header: header
            hotspots: @options.hotspots
            top: @options.y
            left: @options.x

        @el.className = 'sgn-pp__hotspot-picker'
        @el.setAttribute 'tabindex', -1
        @el.innerHTML = Mustache.render template, view

        popoverEl = @el.querySelector '.sgn__popover'
        width = popoverEl.offsetWidth
        height = popoverEl.offsetHeight
        parentWidth = @el.parentNode.offsetWidth
        parentHeight = @el.parentNode.offsetHeight

        if view.top + height > parentHeight
            popoverEl.style.top = parentHeight - height + 'px'

        if view.left + width > parentWidth
            popoverEl.style.left = parentWidth - width + 'px'

        @el.addEventListener 'keyup', @keyUp.bind(@)

        @el.addEventListener "click", e ->
            if (e.target && e.target.matches("[data-id]"))
                trigger 'selected', id: e.target.getAttribute 'data-id'
            if (e.target && e.target.matches("[data-close]"))
                @destroy
        
        window.addEventListener 'resize', @resizeListener, false

        @

    destroy: ->
        @el.parentNode.removeChild @el

        @trigger 'destroyed'

        return

    keyUp: (e) ->
        @destroy() if e.keyCode is keyCodes.ESC
        
        return

    resize: ->
        window.removeEventListener 'resize', @resizeListener

        @destroy()

        return

MicroEvent.mixin PagedPublicationHotspotPicker

module.exports = PagedPublicationHotspotPicker
