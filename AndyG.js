//String.prototype.EscapeR = function () { return this.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); };
// Escapes characters for use with a regular expression (not used - a function EscapeReg is used instead)

//This prototype is provided by the Mozilla foundation and is distributed under the MIT license.
if (!Array.prototype.every) {			//http://www.ibiblio.org/pub/Linux/LICENSES/mit.license
	Array.prototype.every = function (fun /*, thisp*/ ) {
		var i, thisp, len = this.length;		// required if browser doesn't support 'every()' (IE)
		if (typeof fun !== "function")
			throw new TypeError();
		thisp = arguments[1];
		for (i = 0; i < len; i++) {
			if (i in this && !fun.call(thisp, this[i], i, this))
				return false;
		}
		return true;
	};
}
if (!Array.prototype.some) {	// required if browser doesn't support the 'some()' method							
	Array.prototype.some = function (fun /*, thisp */ ) {		// this code must remain 'as is'
		"use strict";
		var t = Object(this), len, thisp, i;
		if (this == null)
			throw new TypeError();
		len = t.length >>> 0;
		if (typeof fun !== "function")
			throw new TypeError();
		thisp = arguments[1];
		for (i = 0; i < len; i++) {
			if (i in t && fun.call(thisp, t[i], i, t))
			return true;
		}
		return false;
	};
}
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt /*, from*/) {
		var len = this.length;
		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0)
			from += len;
		for (; from < len; from++) {
			if (from in this && this[from] === elt)
				return from;
		}
		return -1;
	};
}
/* www.moocr.com
Array.prototype.qsort = function(low, high) {
    var i = low;
    var j = high;
    var a = this[i];
    if (low < high) {
        while (i < j) {
            while (i < j && this[j] > a) { j--; }
            if (i < j) {
                this[i] = this[j];
                i++;
            }
            while (i < j && this[i] < a) { i++; }
            if (i < j) {
                this[j] = this[i];
                j--;
            }
        }
        this[i] = a;
        this.qsort(low,i-1);
        this.qsort(i+1,high);
    }
    return this;
}
*/
// Create an empty namespace: version 1
// var AndyG_ns = AndyG_ns || {};
// AndyG_ns._construct = function () {
// }
// AndyG_ns._construct();

(function () {
    var adg = this.Utils || new Utils;      // to enable sub-classes to use the utility methods
	function Utils() {					// my Class
		var MonthNames = ["January","February","March","April","May","June","July",
			"August","September","October","November","December"];
		var DayNames = [ "Sunday","Monday","Tueday","Wednesday","Thursday","Friday","Saturday" ];
		var ShortMths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var ShortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		
		var Left = function (str, n) {		// returns characters from the left of a string
			if ( n <= 0 ) return "";
			return ( (n > String(str).length) ? str : String(str).substring(0,n) );
		};
		var Right = function (str, n) {		// returns characters from the right of a string
			if (n <= 0) return "";
			else if (n > String(str).length) 
				return str;
			else 
			   return String(str).substring(String(str).length-n, n);
		};
		var TrimLR = function (text) {			// would trim leading and trailiing spaces v.fast (Steven Levithan)
			text = text.replace(/^\s+/, "");
			for (var i = text.length - 1; i >= 0; i--) {
				if (/\S/.test(text.charAt(i))) {
					text = text.substring(0, i + 1);
					break;
				}
			}
			return text;
		};
		var $ = function () {							// Example: var els = $('obj1name',obj2,'obj2name');			
			var elements = {}, doc, argLen, i, element;	// Saves having to write 'document.getElementById' repeatedly,
			doc = document;								// but could also be useful for grouping elements.
			for (i = 0, argLen = arguments.length; i < argLen; i++) {
				element = arguments[i];
				if (typeof element === 'string')
					element = doc.getElementById(element);
				if (argLen === 1)
					return element;
				elements.push(element);
			}
			return elements;
		};
		var DeleteEl = function (el) {
			var elem = $(el);
			elem.parentNode.removeChild(elem);
		};
		var DisplayMsg = function (oMsg,sMsg,colour) {		// uses a hidden span to display any message (for 2 secs)
			var msgObj = $(oMsg);						// clicking a message will cancel future messages
			if ( (msgObj.firstChild.nodeValue !== 'messages cancelled') && sMsg ) {
				msgObj.style.color = colour || 'green';		// the default text colour is green
				msgObj.firstChild.nodeValue = sMsg;
				msgObj.style.display = 'inline';
				window.setTimeout(function () { msgObj.style.display = 'none'; } ,2000);
			}
		};
		var MoveElDown = function (container,elem) {
			// Moves elem to the bottom of the container. For example, moves a paragraph to the end of
			// it's containing DIV. If the element is already the last one, moves it to the top.
			var firstElem;
			if (elem.nextSibling)				// move element to end of container
				container.appendChild(elem);
			else {																// element is already the last one..
				firstElem = container.getElementsByTagName(elem.nodeName)[0];	// get the 1st element in the container
				container.insertBefore(elem,firstElem);						// insert the current paragraph before it
			}
		};
		var MoveElDownwards = function (container,elem) {
			// Moves an element one place further down within it's container.
			// If the element is already at the bottom, moves it to the top.
			var nextElem, firstElem;
			if (elem.nextSibling) {
				nextElem = elem.nextSibling;
				if (nextElem.nextSibling)
					container.insertBefore(elem,nextElem.nextSibling);
				else
					container.appendChild(elem);
			} else {
				firstElem = container.getElementsByTagName(elem.nodeName)[0];
				container.insertBefore(elem,firstElem);
			}
		};
		var MoveElUp = function (container,elem) {
			var firstElem;
			if (elem.previousSibling) {
				firstElem = container.getElementsByTagName(elem.nodeName)[0];
				container.insertBefore(elem,firstElem);
			} else {
				container.appendChild(elem);
			}
		};
		var MoveElUpwards = function (container, elem) {
			if (elem.previousSibling)
				container.insertBefore(elem,elem.previousSibling);
			else
				container.appendChild(elem);	// must be at the top
		};
		var RemoveToolTips = function (mins) {
			if ( document.getElementsByTagName('button') ) {				// if there are any buttons
				window.setTimeout(function () { 							// hide tooltips after 5 mins, by removing the
					var btns = document.getElementsByTagName('button');		// 'title' attribute from all buttons				
					var i = btns.length;
					while ( i-- ) btns[i].removeAttribute('title');
				}, mins * 60 * 1000);
			}
		};
		/*
			Developed by Robert Nyman, http://www.robertnyman.com
			Code/licensing: http://code.google.com/p/getelementsbyclassname/
		*/
		var GetElementsByClassName = function (className, tag, elm) {
			if (document.getElementsByClassName) {		// use built-in method
				GetElementsByClassName = function (className, tag, elm) {
					elm = elm || document;
					var elements = elm.getElementsByClassName(className),
						nodeName = (tag) ? new RegExp("\\b" + tag + "\\b", "i") : null,
						returnElements = [], current;
					for(var i=0, il=elements.length; i < il; i++){
						current = elements[i];
						if(!nodeName || nodeName.test(current.nodeName)) {
							returnElements.push(current);
						}
					}
					return returnElements;
				};
			} else if (document.evaluate) {			// using XPath
				GetElementsByClassName = function (className, tag, elm) {
					tag = tag || "*";
					elm = elm || document;
					var classes = className.split(" "), classesToCheck = "",
						xhtmlNamespace = "http://www.w3.org/1999/xhtml",
						namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
						returnElements = [], elements, node;
					for(var j=0, jl=classes.length; j < jl; j++) {
						classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
					}
					try	{
						elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
					}
					catch (e) {
						elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
					}
					while ((node = elements.iterateNext())) {
						returnElements.push(node);
					}
					return returnElements;
				};
			} else {
				GetElementsByClassName = function (className, tag, elm) {
					tag = tag || "*";
					elm = elm || document;
					var classes = className.split(" "), classesToCheck = [],
						elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
						current, returnElements = [], match;
					for(var k=0, kl=classes.length; k < kl; k++) {
						classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
					}
					for(var l=0, ll=elements.length; l < ll; l++) {
						current = elements[l];
						match = false;
						for(var m=0, ml=classesToCheck.length; m < ml; m++) {
							match = classesToCheck[m].test(current.className);
							if (!match) {
								break;
							}
						}
						if (match) {
							returnElements.push(current);
						}
					}
					return returnElements;
				};
			}
			return GetElementsByClassName(className, tag, elm);
		};
		var GetStyle = function (elem, strRule) {		// e.g. "font-size"
			elem = $(elem);				        // robertnyman.com
			if (document.defaultView && document.defaultView.getComputedStyle ) {
				return document.defaultView.getComputedStyle(elem, '').getPropertyValue(strRule);
			} else if ( elem.currentStyle ) {
				strRule = strRule.replace(/\-(\w)/g, function (strMatch, p1) {
					return p1.toUpperCase();
				});
				return elem.currentStyle[strRule];
			} else {
				return '';
			}
		};		// Note: IE is 'elem.styleFloat' FF is 'elem.cssFloat'
				// Also FF returns pixels for font-size in em, IE returns the 'em' value. 
		var ResetAll = function (aFrm) {		// clears all text and checkboxes within a form
			var frm = $(aFrm), allInputs= frm.getElementsByTagName('input'), i = allInputs.length, inp;
			if ( !confirm('Clear text-boxes and untick check-boxes?') ) return false;
			while ( i-- ) {
				inp = allInputs[i];
				if ( inp.type === 'text' ) inp.value = '';
				else if ( inp.type === 'checkbox' ) inp.checked = false;
			}
			return true;
		};
		
		var SetCookie = function ( name, value, expires, path, domain, secure ) {
				// the caller should Trim the name/value pair
				// sets the name/value pair (encoded) - 'expires' is the number of days
			var expires_date;
			if (expires) {
				expires_date = new Date();
				expires_date.setDate(expires_date.getDate() + expires);
			}
			document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +
				( ( expires ) ? ";expires=" + expires_date.toUTCString() : "" ) +
				( ( path ) ? ";path=" + path : "" ) +
				( ( domain ) ? ";domain=" + domain : "" ) +
				( ( secure ) ? ";secure" : "" );
		};
		var DeleteCookie = function ( name, path, domain ) {			// the caller should Trim the name/value pair
			document.cookie = encodeURIComponent(name) + "=" +			// encodes the name before deleting
				( ( path ) ? ";path=" + path : "") + ( ( domain ) ? ";domain=" + domain : "" ) +
					";expires=Fri, 01-Jan-2010 00:00:01 UTC";
		};
		var DelAllCookies = function () {
			var currDate = new Date(), i, theCookie = document.cookie.split(";");
			currDate = currDate.toUTCString();
			i = theCookie.length;
			while ( i-- ) {
				document.cookie = theCookie[i] + "; expires =" + currDate;
			}
		};
		
		var EscapeReg = function (str) { return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); };
		// Escapes characters for use with a regular expression
		
		// The following four functions do not Trim the name or value before use - the calling fns should do this.
		var CName_Exists = function ( cookie_name ) {					// case-insensitive
			var testName, myReg;
			if (document.cookie.length == 0) return false;
			testName = EscapeReg(cookie_name);
			myReg = new RegExp('(^|;) ?' + testName + '=([^;]*)(;|$)','i');
			return myReg.test(decodeURIComponent(document.cookie));
		};
		var CValue_Exists = function ( cookie_value )	{				// case insensitive
			var testName, myReg;
			if (document.cookie.length == 0) return false; 
			testName = EscapeReg(cookie_value);
			myReg = new RegExp('(=)' + testName + '(;|$)','i');
			return myReg.test(decodeURIComponent(document.cookie));
		};
		var CGet_Name = function ( cookie_value ) { 			// (case-insensitive)
			var testName, myReg, results;
			if (document.cookie.length == 0) return '';
			testName = EscapeReg(cookie_value);
			myReg = new RegExp('(^|;) ?([^=]*)=' + testName + '(;|$)','i');
			results = decodeURIComponent(document.cookie).match(myReg);
			return ( results ) ? results[2] : '';
		};
		var CGet_Value = function ( cookie_name ) {			// (case-insensitive)
			var testName, myReg, results;
			if (document.cookie.length == 0) return '';
			testName = EscapeReg(cookie_name);
			myReg = new RegExp('(^|;) ?' + testName + '=([^;]*)(;|$)','i');
			results = decodeURIComponent(document.cookie).match(myReg);
			return ( results ) ? results[2] : '';
		};
		var GetCookieStr = function () {	// returns a string which could be placed in a textarea (for example)
			return decodeURIComponent(document.cookie).replace(/([^=;]+)=([^;]*)[;\s]*/g,'$1 ($2)\n') || '';
		};
		var Asc = function (a, b) {		// used by sort() method (case insensitive)
			var x = a.toLowerCase(), y = b.toLowerCase();
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		};
		var Desc = function (a, b) {		// used by sort() method (case insensitive)
			var x = a.toLowerCase(), y = b.toLowerCase();
			return ((x > y) ? -1 : ((x < y) ? 1 : 0));
		};
		var AscN = function (a, b) {		// used by sort() method (case insensitive)
			var x = a.toLowerCase(), y = b.toLowerCase();
			var xNum = parseFloat(x), yNum = parseFloat(y); // check if each begin with a number
			if ( !isNaN(xNum) && !isNaN(yNum) && (xNum - yNum) )
				return xNum - yNum;
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		};
		var DescN = function (a, b) {		// used by sort() method (case insensitive)
			var x = a.toLowerCase(), y = b.toLowerCase(),
                xNum = parseFloat(x), yNum = parseFloat(y);	// check if each begin with a number
			if ( !isNaN(xNum) && !isNaN(yNum) && (yNum - xNum) )
				return yNum - xNum;
			return ((x > y) ? -1 : ((x < y) ? 1 : 0));
		};
		var SortNumA = function (a, b) {	// ascending
			return a - b;
		};
		var SortNumD = function (a, b) {	// descending
			return b - a;
		};
		var IsAscending = function (element, index, array) {		// used by every() method
			return ( index == 0 || element.toLowerCase() >= array[index-1].toLowerCase() );
		};
		var IsDescending = function (element, index, array) {		// used by every() method
			return ( index == 0 || element.toLowerCase() <= array[index-1].toLowerCase() );
		};
		var SortTable = function (tbl,col) {	// could be called directly
			SortElements(tbl,'tr','td',col);
		};
		var SortElements = function (parentEl, childTag, colTag, colIndex) {// example use: SortElements('table1','tr','td',2)
			var i, j, cTags = {}, startAt = 0,										// or SortElements('list1','li')
                parent = $(parentEl), childLen, aChild, elem, sortBy,				// or SortElements('divName','p','span',3)
                content, elems = [], sortedLen, frag, hdrsLen, hdr;
			
			var AscText = function (a, b) {		// sort() by .data as text
				var x = a.data, y = b.data,
                    xNum = parseFloat(x), yNum = parseFloat(y);	// check if each begin with a number
				if ( !isNaN(xNum) && !isNaN(yNum) && (xNum - yNum) )
					return xNum - yNum;
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			};
			var DescText = function (a, b) {		// sort() by .data
				var x = a.data, y = b.data,
                    xNum = parseFloat(x), yNum = parseFloat(y);	// check if each begin with a number
				if ( !isNaN(xNum) && !isNaN(yNum) && (yNum - xNum) )
					return yNum - xNum;
				return ((x > y) ? -1 : ((x < y) ? 1 : 0));
			};
			var AscNum = function (a, b) {	// used with dates as well
				return a.data - b.data;
			};
			var DescNum = function (a, b) {
				return b.data - a.data;
			};
			if ( parent.nodeName.toLowerCase() == 'table' ) {
				if ( childTag == 'tr' ) {
					sortBy = parent.rows[0].cells[colIndex].sortBy || 'text';
				}
				parent = parent.tBodies[0] || parent;
				if ( parent.rows[0].cells[0].nodeName.toLowerCase() == 'th' ) {
					startAt = 1;
				}
			}
			cTags = parent.getElementsByTagName(childTag);
			if ( typeof colIndex == 'undefined' ) {
				sortBy = 'text';	// sort simple lists or paragraphs as text
			}
			for ( i = startAt, childLen = cTags.length; i < childLen; i++ )	{		// go forward examining each child
				aChild = cTags[i];
				elem = (colTag) ? aChild.getElementsByTagName(colTag)[colIndex] : aChild;
				if (elem) {
					if ( !sortBy ) {		// sorting non-table columns..
						sortBy = (typeof elem.numberValue != 'undefined') ? 'number' : 
							((typeof elem.dateValue != 'undefined') ? 'date' : 'text');
					}
					switch (sortBy) {		// you can supply 'sort' attributes to enable sorting of numbers,etc.;
                        case 'text':		// for example, <td sort='2011/02/12'> for a date.
                            content = (elem.getAttribute('sort') || elem.firstChild.nodeValue).toLowerCase();
                            break;
                        case 'number':
                            content = elem.numberValue;
                            break;
                        case 'date':
                            content = elem.dateValue;
                            break;
                        default:
                            content = (elem.getAttribute('sort') || elem.firstChild.nodeValue).toLowerCase();
                            break;
					}
					j = elems.length;
					if ( !aChild.id ) 
						aChild.id = 'tempSortID' + j;
					elems[j] = { data: content, tempID: aChild.id };
				}
			}
			// The following will determine if the table/etc has already been sorted by the same column or tag.
			// If so, it will sort in ascending or descending order.
			// It creates custom element properties to the parent element to remember the previous sort details.
			if ( typeof colIndex == 'undefined' ) colIndex = 0;
			if ( parent.prevTag && parent.prevTag == ((typeof colTag == 'undefined') ? childTag : colTag) ) {
				if (parent.prevCol == colIndex) {			// sorting by the same column as previously
					parent.prevSort = (parent.prevSort == 'asc') ? 'desc' : 'asc';
				} else {							// sorting by any other column
					parent.prevCol = colIndex;
					parent.prevSort = 'asc';
				}
			} else {			// sorting for the 1st time or by a different tag
				parent.prevTag = ((typeof colTag == 'undefined') ? childTag : colTag);
				parent.prevCol = colIndex;
				parent.prevSort = 'asc';
			}
			if ( parent.prevSort === 'desc' ) {			// 'desc' WILL BE the previous sort order..
				switch (sortBy) {
					case 'text': elems.sort(DescText); break;
					case 'number': elems.sort(DescNum); break;
					case 'date': elems.sort(DescNum); break;
					default: elems.sort(DescText); break;
				}
			} else {
                switch (sortBy) {
                    case 'text': elems.sort(AscText); break;
                    case 'number': elems.sort(AscNum); break;
                    case 'date': elems.sort(AscNum); break;
                    default: elems.sort(AscText); break;
                }
			}
			frag = document.createDocumentFragment();
			for (i = 0, sortedLen = elems.length; i < sortedLen; i++) {
				elem = $(elems[i].tempID);
				frag.appendChild(elem);
				if ( (elem.id).substr(0,10) == 'tempSortID' )
					elem.removeAttribute('id');
			}
			parent.appendChild(frag);
			elems = null;		// probably not necessary as the array goes out of scope
			return parent.prevSort;		// not currently used
		};
		var ApplyFilter = function (txt,tbl,col) {		// filters a table by a specified column index
			var theTable = $(tbl), i, theRow, cellText;
			theTable = theTable.tBodies[0] || theTable;
			txt = txt.toLowerCase();
			i = theTable.rows.length-1;
			while ( i + 1 ) {
				theRow = theTable.rows[i--];
				if ( theRow.cells[0].nodeName.toLowerCase() == 'td' ) {		// ignore 'th' within 'tbody'
					cellText = theRow.cells[col].firstChild.nodeValue.toLowerCase();
					theRow.style.display = ( cellText.indexOf(txt)+1 ) ? '' : 'none';
				}
			}
		};
		var AlignTables = function (tbl, cols, direction) {	// cols is a number or array identifying which
			var i, rLen;					// column(s) to align. Use this to amend an existing table.
			if ( ['left','center','right'].indexOf(direction) < 0 ) {
				return false;		// direction should be left, center or right
			}
			while ( cols.length ) AlignTables(tbl,cols.pop(),direction);
			if ((cols instanceof Array) || isNaN(cols)) return false;
			tbl = $(tbl);
			tbl = tbl.tBodies[0] || tbl;
			for ( i = 0, rLen =  tbl.rows.length; i < rLen; i++) {
				if ( tbl.rows[i].cells[0].nodeName.toLowerCase() == 'td' ) {
					tbl.rows[i].cells[cols].style.textAlign = direction;
				}
			}
			return true;
		};
		var AddSortToTables = function () {					// if table attribute 'sortIt="yes"'
			var tables = document.getElementsByTagName('table'), i, j, tblLen, tbl, hdrs, hdrsLen;
			function PreserveSortScope(a,b,c,d) {	// used when table attribute sortIt = "yes"
				return function() {				// assigns the SortElements fn. to a table header
					SortElements(a,b,c,d);
				}
			}
			// add sorting to table headers,
			for ( i = 0, tblLen = tables.length; i < tblLen; i++ ) {	// if they have attribute sortIt="yes"
				tbl = tables[i];
				if ( tbl.getAttribute('sortIt') && tbl.getAttribute('sortIt') == 'yes' ) {
					hdrs = tbl.getElementsByTagName('th');
					if ( hdrs ) {
						for ( j = 0, hdrsLen = hdrs.length; j < hdrsLen; j++ ) {
							AddEvent(hdrs[j],'click',PreserveSortScope(tbl,'tr','td',j));
							if ( !hdrs[j].title ) hdrs[j].setAttribute('title','Click to sort');
						}
					}
				}
			}
		};
		var AddSortByDate = function (tbl, col, dateMask) {
			// Input: the table name (or object), a column index (or array) and a date mask ('dd-mmm-yy')
			// Adds a sortBy = 'date' property to the first row
			// will ignore the first row, assuming it is a header row
			var i, rLen, cell;
			while ( col.length ) AddSortByDate(tbl,col.pop(),dateMask);
			if ((col instanceof Array) || isNaN(col)) return;
			tbl = $(tbl);
			tbl.rows[0].cells[col].sortBy = 'date';
			AddSortByDate2(tbl,'tr','td',col,dateMask);
		};
		var AddSortByDate2 = function (parentEl, childTag, colTag, colIndex, dateMask) {
			var parent = $(parentEl), kids, startAt = 0, i, rLen, cell;
			if ( parent.nodeName.toLowerCase() == 'table' ) {
				parent = parent.tBodies[0] || parent;
				startAt = ( parent.rows[0].cells[0].nodeName.toLowerCase() == 'th' ) * 1;
			}
			kids = parent.getElementsByTagName(childTag);
			for ( i = startAt, rLen =  kids.length; i < rLen; i++) {
				cell = kids[i].getElementsByTagName(colTag)[colIndex];
				if (cell) {
					if ( typeof cell.numberValue != 'undefined' ) delete cell.numberValue;
					// the above enables switching from a number to a date sort (although v. unlikely)
					cell.dateValue = new Date(StringToDate(cell.firstChild.nodeValue, dateMask));
					if (cell.dateValue.toString() == "NaN" || cell.dateValue.toString() == "Invalid Date") 
						cell.dateValue = 0;
				}
			}
		};
		var AddSortByNumber = function (tbl, col) {	// col is a column index or array of indices
			//  will ignore the first row, assuming it is a header row
			var i, rLen, cell, tempNum;
			while ( col.length ) AddSortByNumber(tbl,col.pop());
			if ((col instanceof Array) || isNaN(col)) return;
			tbl = $(tbl);
			tbl.rows[0].cells[col].sortBy = 'number';
			AddSortByNumber2(tbl,'tr','td',col);
		};
		var AddSortByNumber2 = function (parentEl, childTag, colTag, colIndex) {
			var parent = $(parentEl), kids, startAt = 0, i, rLen, cell, tempNum;
			if ( parent.nodeName.toLowerCase() == 'table' ) {
				parent = parent.tBodies[0] || parent;
				startAt = ( parent.rows[0].cells[0].nodeName.toLowerCase() == 'th' ) * 1;
			}
			kids = parent.getElementsByTagName(childTag);
			for (i = startAt, rLen = kids.length; i < rLen; i++) {
				cell = kids[i].getElementsByTagName(colTag)[colIndex];
				if (cell) {
					if ( typeof cell.dateValue != 'undefined' ) delete cell.dateValue;
					// the above enables switching from a date to a number sort (although v. unlikely)
					tempNum = cell.firstChild.nodeValue;
					tempNum = tempNum.replace(/[^0-9.-]/g, '');
					cell.numberValue = parseFloat(tempNum);
					if (isNaN(cell.numberValue)) 
						cell.numberValue = 0.0;
				}
			}
		};		
		var HighlightRows = function (tbl,colour,withIndex) {
			// Supply the table name (or object) and the colour you want for the highlight
			// E.g. HighlightRows('table1','yellow')
			// Any row background colour will be re-instated on mouseout; if a cell already
			// has a background colour this will remain.
			// If withIndex (optional) is true, pointing at a row will show a tooltip e.g. 'Row 24'.		
			tbl = $(tbl);
			AddEvent(tbl,'mouseover',function (e) {
				var evt = e || window.event;
				var elem = evt.target || evt.srcElement;
				if ( elem.nodeName.toLowerCase() == 'td' ) {
					elem.prevColour = elem.parentNode.style.backgroundColor;
					elem.parentNode.style.backgroundColor = colour;
					if (typeof withIndex != 'undefined' && withIndex == true) 
						elem.setAttribute('title','Row ' + elem.parentNode.rowIndex);
				}
			});
			AddEvent(tbl,'mouseout',function (e) {
				var evt = e || window.event;
				var elem = evt.target || evt.srcElement;
				if ( elem.nodeName.toLowerCase() == 'td' ) {
					elem.parentNode.style.backgroundColor = elem.prevColour;
				}
			});
		};
		var MoveRow = function (tbl,i,j) {		// can use -1 for the last row
			var lastRow;
			tbl = $(tbl);
			if ( tbl.nodeName.toLowerCase() != 'table' ) return false;
			tbl = tbl.tBodies[0] || tbl;
			i = parseInt(i,10);
			j = parseInt(j,10);
			if ( isNaN(i) || isNaN(j) ) return false;
			lastRow = tbl.rows.length-1;
			if ( i == -1 ) i = lastRow;
			if ( j == -1 ) j = lastRow;
			if ( i < 0 || j < 0 || i == j ) {
				return false;
			}
			if ( (i == 0 || j == 0) && tbl.rows[0].cells[0].nodeName.toLowerCase() == 'th' ) {
				return false;		// don't move a header row!
			}
			if ( j == lastRow )
				return tbl.appendChild(tbl.rows[i]);
			else
				return tbl.rows[j + (i < j)].parentNode.insertBefore(tbl.rows[i],tbl.rows[j + (i < j)]);
		};
		var GetToday = function (sFormat)	{		// returns a string with today's date
			var currDT = new Date(),
                D = currDT.getDate(), DDDD = DayNames[currDT.getDay()], DDD = DDDD.substr(0,3),
                M = currDT.getMonth()+1, MMMM = MonthNames[currDT.getMonth()], MMM = MMMM.substr(0,3),
                YYYY = currDT.getFullYear(), YY = ('' + YYYY).substr(2,2),
                H = currDT.getHours(), N = currDT.getMinutes(), S = currDT.getSeconds(),
                DD = ( D < 10 ? "0" : "" ) + D,			// Pad with leading zeros, if required
                MM = ( M < 10 ? "0" : "" ) + M, HH = ( H < 10 ? "0" : "" ) + H,
                NN = ( N < 10 ? "0" : "" ) + N, SS = ( S < 10 ? "0" : "" ) + S;
            
            sFormat = ( sFormat ) ? sFormat.toUpperCase() : 'DD/MM/YYYY';
            var sParsed = sFormat.replace(/D{1,4}|M{1,4}|Y{2,4}|H{1,2}|N{1,2}|S{1,2}/g,function (m) {
                    try {
                        return eval(m);
                    } catch (e) {
                        return '';
                    }
                });
			return sParsed;
		};
		var FormatDate = function (sFormat, aDate)	{
			// Example use: FormatDate('ddd, dd mmm YYYY hh:nn'); - use 'nn' for mins
			// If aDate is not supplied the current date is assumed.
            var currDT = aDate || new Date();
			
 			sFormat = sFormat.toUpperCase();
            function ReplaceDTChars(match) {
				switch (match) {
                	case 'D': return currDT.getDate();
                	case 'DD': 
						var currDate = currDT.getDate();
	                    return ( currDate < 10 ? "0" : "" ) + currDate;
					case 'DDD': return DayNames[currDT.getDay()].substring(0,3);
                	case 'DDDD': return DayNames[currDT.getDay()];
                	case 'M': return currDT.getMonth()+1;
                	case 'MM':
						var currMonth = currDT.getMonth()+1;
	                    return ( currMonth < 10 ? "0" : "" ) + currMonth;
	                case 'MMM': return MonthNames[currDT.getMonth()].substring(0,3);
					case 'MMMM': return MonthNames[currDT.getMonth()];
					case 'Y': 
					case 'YY': return ('' + currDT.getFullYear()).substring(2);
                	case 'YYY': 
					case 'YYYY': return '' + currDT.getFullYear();
                	case 'H': return currDT.getHours();
                	case 'HH': 
						var currHr = currDT.getHours();
	                    return ( currHr < 10 ? "0" : "" ) + currHr;
                	case 'N': return currDT.getMinutes();
                	case 'NN': 
						var currMin = currDT.getMinutes();
	                    return ( currMin < 10 ? "0" : "" ) + currMin;
	                case 'S': return currDT.getSeconds();
                	case 'SS': 
						var currSecs = currDT.getSeconds();
	                    return ( currSecs < 10 ? "0" : "" ) + currSecs;
					default: return match;
                }
            }
            return sFormat.replace(/D{1,4}|M{1,4}|Y{1,4}|H{1,2}|N{1,2}|S{1,2}/g,function(m){return ReplaceDTChars(m)});
		};
        var StringToDate = function (sDate, sFormat, cutOff) {
			// Input: a date value as a string, it's format as a string e.g. 'dd-mmm-yy'
			// Optional: a cutoff (integer) for 2 digit years.
			// If no 'd' appears in the format string then the 1st of the month is assumed.
			// If the year is 20 and the cut-off is 30 then the value will be converted to 2020;
			// if the year is 40 then this will be converted to 1940.
			// If no cut-off is supplied then '20' will be pre-pended to the year (YY).
			// Output: a string in the format 'YYYY/MM/DD' or ''
			// Will not attempt to convert certain combinations e.g. DMM, MDD, DDM, YYYYD
			var sParsed, fndSingle; 			// sParsed will be constructed in the format 'YYYY/MM/DD'
			sDate = sDate.toString().toUpperCase();
			sFormat = sFormat.toUpperCase();
			
			if (sFormat.search(/MMMM|MMM/) + 1) {		// replace Mar/March with 03, etc.
				sDate = sDate.replace(new RegExp('(' + ShortMths.join('|') + ')[A-Z]*', 'gi'), function(m){
					var i = ShortMths.indexOf(m.charAt(0).toUpperCase() + m.substr(1, 2).toLowerCase()) + 1;
					return ((i < 10) ? "0" + i : "" + i).toString();
				});
				sFormat = sFormat.replace(/MMMM|MMM/g, 'MM');
			}
			if (sFormat.search(/DDDD|DDD/) + 1) {		// replace Tue/Tuesday, etc. with ''
				sDate = sDate.replace(new RegExp('(' + ShortDays.join('|') + ')[A-Z]*', 'gi'), '');
				sFormat = sFormat.replace(/DDDD|DDD/g, '');
			}
			sDate = sDate.replace(/(^|\D)(\d)(?=\D|$)/g, function($0, $1, $2){	// single digits 2 with 02
				return $1 + '0' + $2;
			});
			sFormat = sFormat.replace(/(^|[^DMY])(D|M)(?=[^DMY]|$)/g, function($0, $1, $2){
				return $1 + $2 + $2;		// replace D or M with DD and MM
			});
			fndSingle = sFormat.search(/(^|[^D])D([^D]|$)|(^|[^M])M([^M]|$)/)+1;	// are there still single Ds or Ms?
			if ( fndSingle ) return '';		// do not attempt to parse, for example, 'DMM'
			sFormat = sFormat.replace(/(^|[^Y])(YY)(?=[^Y]|$)/g, function($0, $1, $2, index){
				var tempDate = sDate.substr(0, index + 1);
				tempDate += (cutOff) ? ((parseInt(sDate.substr(index + 1, 2),10) > cutOff) ? '19' : '20') : '20';
				tempDate += sDate.substr(index + 1);
				sDate = tempDate;
				return $1 + $2 + $2;
			});
			sParsed = ('YYYY/MM/DD').replace(/YYYY|MM|DD/g, function(m){
				return (sFormat.indexOf(m) + 1) ? sDate.substr(sFormat.indexOf(m), m.length) : '';
			});
			if (sParsed.charAt(0) == '/') { 	// if no year specified, assume the current year
				sParsed = (new Date().getFullYear()) + sParsed;
			}
			if (sParsed.charAt(sParsed.length - 1) == '/') { // if no date, assume the 1st of the month
				sParsed += '01';
			}
			return ( sParsed.length == 10 ) ? sParsed : '';	// should end up with 10 characters..
		};
		var StartClock = function (clockID, sFormat) {		// supply the id of the clock or an object
			var theClock = $(clockID);
            if ( theClock ) {						// if there is a clock?
                var clock = theClock.firstChild;
                sFormat = sFormat || 'hh:nn';
				clock.nodeValue = GetToday(sFormat);		// start the clock
				( function () { setInterval( function () {      // a closure
					clock.nodeValue = GetToday(sFormat); },3000); }
				) ();			// updates the clock every three seconds
			}
		};
		var GetParam = function (name) {  						// get named parameter from url
		  var regexS = "[\\?&]"+name+"=([^&#]*)";
		  var regex = new RegExp( regexS,'i' );			// case insensitive
		  var results = regex.exec( window.location.href );
		  return (results == null) ? "" : decodeURIComponent(results[1]);
		};
		var Delay = function (mills) {		// cause an 'artificial' delay of mills (milliseconds)
			var date = new Date();
			var curDate = null;
			do { curDate = new Date(); }
			while (curDate - date < mills);
		};
		var AddEvent = function (elem, eventType, func) {	// polymorphic function
			if ( elem.addEventListener )
				AddEvent = function (elem, eventType, func) {
					elem.addEventListener(eventType, func, false);
				};
			else if ( elem.attachEvent )
				AddEvent = function (elem, eventType, func) {
					elem.attachEvent('on' + eventType, func);
				};
			else
				AddEvent = function (elem, eventType, func) {
					elem['on' + eventType] = func;
				};
			AddEvent(elem, eventType, func);
		};
		var RemoveEvent = function (elem, eventType, func) {	// polymorphic function
			if ( elem.removeEventListener )
				RemoveEvent = function (elem, eventType, func) {
					elem.removeEventListener(eventType, func, false);
				};
			else if ( elem.detachEvent )
				RemoveEvent = function (elem, eventType, func) {
					elem.detachEvent('on' + eventType, func);
				};
			else
				RemoveEvent = function (elem, eventType, func) {
					elem['on' + eventType] = null;
				};
			RemoveEvent(elem, eventType, func);
		};
        var FireEvent = function (elem,event) {
            if (document.createEventObject) {       // trigger for IE
                var evt = document.createEventObject();
                return elem.fireEvent('on'+event,evt);
            }
            else {          // trigger for firefox + others
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(event, true, true);  // event type, bubbling, cancelable
                return !elem.dispatchEvent(evt);
            }
        };
		var LoadXMLDoc = function (url, cfunc) {	// requires a callback function to handle the responseXML
			var xmlhttp;
			if (window.XMLHttpRequest) {		// code for IE7+, Firefox, Chrome, Opera, Safari
			  xmlhttp=new XMLHttpRequest();
			} else {								// code for IE5/6
			  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange = function() {
				if ( xmlhttp.readyState == 4 ) {
                    var stat = xmlhttp.status;
                    if ( (stat == 0 && location.href.indexOf('http') == -1) || stat == 200 || stat == 304 ) {
                        cfunc(xmlhttp.responseXML);		// status==304 'not modified' (for cached document)
                    }								    // status == 0 for local file
                }
            };
			xmlhttp.open("GET",url,true);
			xmlhttp.send();
		};
        var LoadJSON = function (url, cfunc) {	// requires a callback function to handle the response data
            var xmlhttp;
            if (window.XMLHttpRequest) {		// code for IE7+, Firefox, Chrome, Opera, Safari
              xmlhttp=new XMLHttpRequest();
            } else {								// code for IE5/6
              xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function() {
                var jsonData, stat;
                if ( xmlhttp.readyState == 4 ) {
                    stat = xmlhttp.status;
                    if ( (stat == 0 && location.href.indexOf('http') == -1) || stat == 200 || stat == 304 ) {
                        jsonData = eval("(" + xmlhttp.responseText + ")");
                        cfunc(jsonData);		// status==304 'not modified' (for cached document)
                    }                           // status == 0 for local file
                }
            };
            xmlhttp.open("GET",url,true);
            xmlhttp.send();
		};
		// Expose class methods:
		// String functions/ methods ***********************************************
		this.Left = Left;
		this.Right = Right;
		this.TrimLR = TrimLR;
		// DOM functions ***********************************************************
		this.$ = $;
		this.DeleteEl = DeleteEl;
		this.DisplayMsg = DisplayMsg;
		this.MoveElDown = MoveElDown;
		this.MoveElDownwards = MoveElDownwards;
		this.MoveElUp = MoveElUp;
		this.MoveElUpwards = MoveElUpwards;
		this.RemoveToolTips = RemoveToolTips;
		this.GetElementsByClassName = GetElementsByClassName;
		this.GetStyle = GetStyle;
		// Form functions **********************************************************
		this.ResetAll = ResetAll;
		// Cookie functions ********************************************************
		this.SetCookie = SetCookie;
		this.DeleteCookie = DeleteCookie;
		this.DelAllCookies = DelAllCookies;
		this.CName_Exists = CName_Exists;
		this.CValue_Exists = CValue_Exists;
		this.CGet_Name = CGet_Name;
		this.CGet_Value = CGet_Value;
		this.GetCookieStr = GetCookieStr;
		// Sort functions **********************************************************
		this.Asc = Asc;
		this.Desc = Desc;
		this.AscN = AscN;		// sort, possibly beginning with a number
		this.DescN = DescN;
		this.SortNumA = SortNumA;
		this.SortNumD = SortNumD;
		this.IsAscending = IsAscending;
		this.IsDescending = IsDescending;
		this.SortElements = SortElements;
		this.AddSortByNumber2 = AddSortByNumber2;	// for non-table elements
		this.AddSortByDate2 = AddSortByDate2;
		// Table functions *********************************************************
		this.SortTable = SortTable;					// calls SortElements
		this.ApplyFilter = ApplyFilter;
		this.AlignTables = AlignTables;
		this.AddSortToTables = AddSortToTables;
		this.AddSortByDate = AddSortByDate;			// uses AddSortByDate2
		this.AddSortByNumber = AddSortByNumber;		// uses AddSortByNumber2
		this.HighlightRows = HighlightRows;
		this.MoveRow = MoveRow;
		// Date/Time functions *****************************************************
		this.MonthNames = MonthNames;
		this.DayNames = DayNames;
		this.ShortMths = ShortMths;
		this.ShortDays = ShortDays;
		this.GetToday = GetToday;
		this.FormatDate = FormatDate;
		this.StringToDate = StringToDate;
		this.StartClock = StartClock;
		// Miscellaneous ***********************************************************
		this.GetParam = GetParam;
		this.Delay = Delay;
		this.AddEvent = AddEvent;
		this.RemoveEvent = RemoveEvent;
        this.FireEvent = FireEvent;
		this.LoadXMLDoc = LoadXMLDoc;
        this.LoadJSON = LoadJSON;
	}
    this.Utils = adg;		        // expose the instance of Utils
}).call(window.AndyG_ns || (AndyG_ns = {}));
