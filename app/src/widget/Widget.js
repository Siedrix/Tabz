Class('Widget').includes(CustomEventSupport, NodeSupport)({
    ELEMENT : '<div></div>',
    CLASS_NAME : '-widget',
    prototype : {
        init : function (config) {
            var property;

            for (property in config) {
                if (config.hasOwnProperty(property)) {
                    this[property] = config[property];
                }
            }

            if (!this.element) {
                this.element = $(this.constructor.ELEMENT);
                this.element.addClass(this.constructor.CLASS_NAME);
                this.element.addClass(this.className);
            }
        },
    
        setContent : function (content) {
            this.element.html(content);
            return this;
        },
    
        render : function (targetElement) {
            targetElement.append(this.element);
            return this;
        },

        destroy : function () {
            if (this.element) {
                this.element.remove();
            }

            if (this.parent) {
                this.parent.removeChild(this);
            }

            if(this.children){
                for(var i = 0; i < this.children.length; i++){
                    this.children[i].destroy();
                }
            }

            this.eventListeners = null;
            this.children       = null;
            this.element        = null;

            return null;
        },
    }
});