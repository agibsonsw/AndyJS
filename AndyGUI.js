(function () {
    var adg = this.Utils;   // reference the utilities from the namespace
	// The following function requires acknowledgement (if I can determine the source..)
	function Draggable() { 				// Class : allow draggable elements
        if (!(this instanceof Draggable)) return new Draggable();  // did they use "new"?
        var _startX, _startY, _offsetX, _offsetY,
            _dragElement,		// needs to be passed from OnMouseDown to OnMouseMove 
            _oldZIndex;		// we temporarily increase the z-index during drag 
        
        var InitDragDrop = function () {
            _startX = _startY = _offsetX = _offsetY = 0;
			document.onmousedown = OnMouseDown; 
			document.onmouseup = OnMouseUp; 
		};
        var OnMouseDown = function (e) { 
            if (e == null) e = window.event;    // IE is retarded and doesn't pass the event object 
            var target = e.target != null ? e.target : e.srcElement;    // IE uses srcElement, others use target
            // for IE, left click == 1; for Firefox, left click == 0 
            if ((e.button == 1 && window.event != null || e.button == 0) && target.className == 'dragIt') {   // grab the mouse position 
                _startX = e.clientX; _startY = e.clientY;       // grab the clicked element's position 
                _offsetX = ExtractNumber(target.style.left); 
                _offsetY = ExtractNumber(target.style.top); // bring the clicked element to the front while it is being dragged 
                _oldZIndex = target.style.zIndex;
                target.style.zIndex = 100; // we need to access the element in OnMouseMove 
                _dragElement = target; // tell our code to start moving the element with the mouse 
                document.onmousemove = OnMouseMove; // cancel out any text selections 
                document.body.focus(); // prevent text selection in IE 
                document.onselectstart = function () { return false; }; // prevent IE from trying to drag an image 
                target.ondragstart = function() { return false; }; // prevent text selection (except IE) 
                return false; 
            }
            return true;    // not used
        };
        var OnMouseMove = function (e) { 
            if (e == null) e = window.event; // this is the actual "drag code" 
            _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px'; 
            _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px'; 
        };
        var OnMouseUp = function (e) {	    // When the mouse is released, we remove the event handlers and reset dragElement:
            if (_dragElement != null) { 
                _dragElement.style.zIndex = _oldZIndex; // we're done with these events until the next OnMouseDown 
                document.onmousemove = null; 
                document.onselectstart = null; 
                _dragElement.ondragstart = null; // this is how we know we're not dragging 
                _dragElement = null; 
            } 
        };
        var ExtractNumber = function (value) { 
            var n = parseInt(value,10); 
            return n == null || isNaN(n) ? 0 : n; 
        };
		this.InitDragDrop = InitDragDrop;	// only need to expose this method
        return this;
	}
	function Carousel(obj) {
        if (!(this instanceof Carousel)) return new Carousel(obj);  // did they use "new"?
        if ( !obj.objID ) throw new Error("Element id is required.");
        this.theObj = adg.$(obj.objID);
        if ( !this.theObj ) throw new Error("The element doesn\'t exist.");
        if ( adg.GetStyle(this.theObj,'position').toLowerCase() == 'static' )
            throw new Error("Must be a positioned element.");
        this.objWidth = parseInt(adg.GetStyle(this.theObj,'width'),10);
        this.conWidth = parseInt(adg.GetStyle(this.theObj.parentNode,'width'),10);
        if ( this.objWidth <= this.conWidth ) throw new Error("Element must be wider than it\'s container.");
        this.lft = parseInt(adg.GetStyle(this.theObj,'left'),10);
        this.lft = isNaN(this.lft) ? 0 : this.lft;   // IE/Chrome return 'auto'
        this.inc = ( obj.inc ) ? obj.inc : 1;       // number of pixels to move per interval
        this.gap = ( obj.duration ) ? (obj.duration / (this.objWidth - this.conWidth)) : 30; // defaults to 30ms intervals

        var that = this;    // preserve scope
        if ( obj.bLeft ) adg.AddEvent(adg.$(obj.bLeft),'click',function(e) {
            return that.MoveIt(true);   // true = move to left
        });
        if ( obj.bRight ) adg.AddEvent(adg.$(obj.bRight),'click',function(e) {
            return that.MoveIt(false);  // false = move to right
        });
        if ( obj.bToggle ) adg.AddEvent(adg.$(obj.bToggle),'click',function(e) {
            return that.ToggleMove();
        });
        return this;
    }
    Carousel.prototype = {
        constructor : Carousel,     // otherwise it inherits Object.prototype
        CancelMove : function () {
            clearTimeout(this.theTimer);
            this.Moving = false;     // -inc = left, +inc = right
        },
        MoveIt : function (blnLeft) {  // blnLeft : true = left, false = right
            var MoveToLeft = function (blnLeft) {          // called by MoveIt()
                if ( blnLeft && (this.lft + this.objWidth >= this.conWidth + this.inc) ) {
                    this.lft -= this.inc;
                }
                else if ( !blnLeft && (this.lft <= -this.inc) ) {
                    this.lft += this.inc;
                }
                else {
                    this.Moving = false;
                    return false;
                }
                this.theObj.style.left = this.lft + 'px';
                var that = this;    // preserve scope
                this.theTimer = setTimeout(function() { MoveToLeft.call(that,blnLeft); },that.gap);
                return true;
            };
            if ( this.Moving ) {
                this.CancelMove();
            } else {
                this.Moving = ( blnLeft ) ? -this.inc : this.inc;
                MoveToLeft.call(this,blnLeft);
            }
        },
        ToggleMove : function () {
            var ml = this.Moving;       // was it moving already?
            this.CancelMove();
            if ( this.lft ) {
                ( ml > 0 ) ? this.MoveIt(true) : this.MoveIt(false);
            } else {        // it's already furthest right..
                this.MoveIt(true);      // so move it left
            }
        }
    };
    /* SlidePanel parameters:
      conID : the id for the container element that is to be moved (must be a positioned element)
      clickID: the id for the clickable element that causes the move
      distance : the distance to be moved or, if omitted, the width of the element
      duration : an (optional) duration in milliseconds. 1000 would mean the whole process would
            take 1 second to complete. If omitted, defaults to 30ms intervals (of 2 pixel movements).
    */
    function SlidePanel(conID, clickID, distance, duration) {
        if (!(this instanceof SlidePanel)) return new SlidePanel(conID, clickID, distance, duration);  // did they use "new"?
        this.theContainer = adg.$(conID);
        this.rgt = parseInt(adg.GetStyle(this.theContainer,"right"),10);
        this.distance = distance || parseInt(adg.GetStyle(this.theContainer,"width"),10);
        this.gap = ( duration ) ? ( duration / this.distance ) : 30; // defaults to 30ms intervals
        var that = this;    // preserve scope
        adg.AddEvent(adg.$(clickID),'click',function(e) {
            return that.ToggleMove();
        });
        return this;
    }
    SlidePanel.prototype = {
        constructor : SlidePanel,
        ToggleMove : function () {
            var MoveIt = function(toLeft) {
                if ( toLeft && this.rgt <= -2 ) {
                    this.rgt += 2;
                } else if ( !toLeft && this.rgt >= -this.distance + 2 ) {
                    this.rgt -= 2;
                } else {
                    return false;
                }
                this.theContainer.style.right = this.rgt + 'px';
                var that = this;
                this.theTimer = setTimeout(function() { MoveIt.call(that,toLeft); },that.gap);
                return true;
            };
            clearTimeout(this.theTimer);
            this.out = !this.out;
            MoveIt.call(this,this.out);
        }
    };
    function Animated(obj, gap, interval, out) {
        this.theObj = adg.$(obj);
        this.gap = gap || 2;                // defaults to 2px (0.02 opacity) "gaps"
        this.interval = interval || 30;     // defaults to 30ms intervals
        
        this.theObj.style.left = this.theObj.offsetLeft + 'px';     // equalize position
        this.theObj.style.marginLeft = 0;
        this.objW = this.theObj.offsetWidth;
        this.parentW = this.theObj.offsetParent.clientWidth;    // width incl. padding
        
        this.theObj.style.top = this.theObj.offsetTop + 'px';
        this.theObj.style.marginTop = 0;
        this.objH = this.theObj.offsetHeight;
        this.parentH = this.theObj.offsetParent.clientHeight;   // height incl. padding
        this.getMetrics();  // store current left, top and opacity
        this.adjW = this.adjH = 0;
        if ( typeof out != 'undefined' && out == true ) {
            this.adjW = this.objW;
            this.adjH = this.objH;
        }
    }
    Animated.prototype = {
        constructor : Animated,
        getMetrics : function () {
            this.left = parseInt(adg.GetStyle(this.theObj,'left'),10);
            this.top = parseInt(adg.GetStyle(this.theObj,'top'),10);
            var opacIE = parseFloat( (/opacity=*([\d.]+)/i.exec(adg.GetStyle(this.theObj,'filter')) || [0,-1])[1]);
            this.opacity = parseFloat(adg.GetStyle(this.theObj,'opacity'));
            this.opacity = ( isNaN(this.opacity) ) ? ((opacIE == -1) ? 1 : opacIE/100) : this.opacity;
        },
        animate : function (type, increase) {
            var from, to, x, o, that, opac = 1;
            function animateIt(o) {
                if ( o.from < o.to ) {
                    o.x = (o.increase) ? o.x + this.gap/o.opac : o.x - this.gap/o.opac;
                    (o.increase) ? o.from = o.x : o.to = o.x;
                    if ( o.type == 'opacity' ) {
                        this.theObj.style.filter = "alpha(opacity=" + (o.x * 100) + ")";
                        this.theObj.style.opacity = o.x;
                    } else {
                        this.theObj.style[o.type] = o.x + 'px';
                    }
                } else {
                    this.stopIt();
                }   
            }
            this.stopIt();      // stop current animation
            this.getMetrics();  // read left, top and opacity
            switch (type) {
                case 'left':
                    from = (increase) ? this.left : 0 - this.adjW;
                    to = (increase) ? this.parentW - this.objW + this.adjW : this.left;
                    break;
                case 'top':
                    from = (increase) ? this.top : 0 - this.adjH;
                    to = (increase) ? this.parentH - this.objH + this.adjH: this.top;
                    break;
                case 'opacity':
                    from = (increase) ? this.opacity : 0;
                    to = (increase) ? 1 : this.opacity;
                    opac = 100;
                    break;
                default :
                    return false;
                    break;
            }
            that = this;
            o = [{ type : type, from : from, to : to , increase : increase , x : that[type], opac : opac }];
            this.theTimer = setInterval(function () {
                animateIt.apply(that,o);
            },this.interval);
            return true;
        },
        addTrigger : function (obj, event, type, increase) {
            var that = this;
            obj = adg.$(obj);
            if ( type == 'stop' ) {
                adg.AddEvent(obj,event,function () { that.stopIt(); });
            } else if ( type == 'gap' ) {   // using a text input to change the gap
                adg.AddEvent(obj,event,function () { that.setGap(this.value); });
            } else if ( type == 'interval' ) {  // using a text input
                adg.AddEvent(obj,event,function () { that.setAnimInterval(this.value); });
            } else if ( event == 'toggle' ) {
                adg.AddEvent(obj,'click',function () { 
                    this.inc = (typeof this.inc == 'undefined') ? increase : !this.inc;
                    that.animate(type,this.inc);
                });
            } else {
                adg.AddEvent(obj,event,function () { that.animate(type,increase); });
            };
        },
        setGap : function (val) {
            val = parseInt(val,10);
            this.gap = ( isNaN(val) || val < 0 ) ? 2 : val;
        },
        setAnimInterval : function (val) {
            val = parseInt(val,10);
            this.interval = ( isNaN(val) || val < 0 ) ? 30 : val;
        },
        stopIt : function () {
            clearInterval(this.theTimer);
        }
    };
	this.Draggable = Draggable;     // expose the constructors
    this.Carousel = Carousel;
    this.SlidePanel = SlidePanel;
    this.Animated = Animated;
}).call(AndyG_ns);      // the namespace must exist!