!function ($) {
	var b = 0;
	var _data = {};
	var mapper = {
		defaults : {
			src : "",
			file : "",
			style : {
				fill : "#666",
				stroke : "#333",
				strokeWidth : "1",
				opacity : "0.6",
				cursor : "pointer"
			},
			pointStyle : {
				fill : "#fff",
				stroke : "#333",
				strokeWidth : "1",
				opacity : "0.6",
				cursor : "pointer"
			},
			event : {
				init : function () {},
				update : function () {},
				addArea : function () {},
				removeArea : function () {}
			},
		},
		init : function (e, f) {
			var g = this,
			h = $(this),
			f = f || {};
			if (!e) {
				f = $.extend(!0, mapper.defaults, f),
				_data[b] = {
					state : {
						isLoaded : !1,
						areaIndex : 0,
						areaLength : 0
					},
					area : [],
					options : f
				},
				current = b,
				h.data("imageMapper", b++),
				h.addClass("image-mapper"),
				h.html('<img class="image-mapper-img" /><svg class="image-mapper-svg" />');
				var i = $(".image-mapper-img", h);
				i[0].onload = function () {
					_data[current].state.isLoaded = !0
				},
				_data[current].options.src.length > 0 && i.attr("src", _data[current].options.src),
				mapper.bindEvents.apply(this, [current]),
				
				mapper.addArea(current, "rect");
				if("function" == typeof _data[current].options.event.init )
					_data[current].options.event.init.apply(g);
				 
			}
		},
		update : function (current, e) {
			var f = this,
			g = $(this),
			e = e || {};
			if (current >= 0) {
				e = $.extend(!0, _data[current].options, e),
				_data[current] = {
					state : {
						isLoaded : !1,
						areaIndex : 0,
						areaLength : 0
					},
					area : [],
					options : e
				};
				var h = $(".image-mapper-img", g);
				"src" in e && h.attr("src", _data[current].options.src),
				mapper.addArea(current, "rect"),
				mapper.refresh.apply(this, [current]);
				if("function" == typeof _data[current].options.event.update ) 
					_data[current].options.event.update.apply(f);
			}
		},
		bindEvents : function (current) {
			var e = this;
			var $ele = $(this);
			$(window).on("resize", function () {
				mapper.refresh.apply(e, [current])
			}),
			$ele.on("click", function ($) {
				var pos = mapper.getPosition.apply(e, [current, $]);
				mapper.addPoint.apply(e, [current, pos]),
				"function" == typeof _data[current].options.event.update && _data[current].options.event.update.apply(e)
			});
			var g,
			h;
			$ele.on("mousemove touchmove", function (evt) {
				if (!g)
					return !0;
				var i = "undefined" != typeof evt.originalEvent.touches || !1,
				j = mapper.getPosition.apply(e, [current, evt, i]),
				k = mapper.getClientPosition.apply(e, [current, j]),
				l = mapper.getRatio.apply(e),
				m = g.data("areaIndex"),
				n = $(".image-mapper-img", e),
				o = [],
				p = !1;
				$.each(_data[current].area[m].coords, function (i, point) {
					var cc = {
						naturalX : point.naturalX + Math.round((k.clientX - h.clientX) * l.ratioX),
						naturalY : point.naturalY + Math.round((k.clientY - h.clientY) * l.ratioY)
					};
					cc.naturalX < 0 || cc.naturalX >= n[0].naturalWidth ? p = !0 : (cc.naturalY < 0 || cc.naturalY >= n[0].naturalHeight) && (p = !0),
					o[i] = cc
				}),
				p || (_data[current].area[m].coords = o, mapper.refresh.apply(e, [current])),
				h = k,
				evt.preventDefault(),
				evt.stopImmediatePropagation()
			}),
			$ele.on("mouseup touchend mouseleave touchleave", function (evt) {
				var touches = "undefined" != typeof evt.originalEvent.touches || !1;
				g && (0 === evt.button || touches) && (g = !1)
			}),
			$ele.on("mousedown touchstart", ".image-mapper-shape", function (evt) {
				var touches = "undefined" != typeof evt.originalEvent.touches || !1;
				if (0 === evt.button || touches) {
					var i = mapper.getPosition.apply(e, [current, evt, touches]),
					j = mapper.getClientPosition.apply(e, [current, i]);
					g = $(this),
					h = j
				}
			});
			var i;
			$ele.on("mousemove touchmove", function (evt) {
				if (!i)
					return !0;
				var touches = "undefined" != typeof evt.originalEvent.touches || !1,
				g = mapper.getPosition.apply(e, [current, evt, touches]),
				h = mapper.getClientPosition.apply(e, [current, g]);
				_data[current].area[i.data("areaIndex")].coords[i.data("coordIndex")] = g,
				i.attr("cx", h.clientX).attr("cy", h.clientY),
				mapper.renderSVG.apply(e, [current]),
				evt.preventDefault(),
				evt.stopImmediatePropagation()
			}),
			$ele.on("mouseup touchend mouseleave touchleave", function (evt) {
				var touches = "undefined" != typeof evt.originalEvent.touches || !1;
				i && (0 === evt.button || touches) && (i = !1)
			}),
			$ele.on("mousedown touchstart", ".image-mapper-point", function (evt) {
				var touches = "undefined" != typeof evt.originalEvent.touches || !1;
				(0 === evt.button || touches) && (i = $(this))
			}),
			$ele.on("click", ".image-mapper-point", function (evt) {
				evt.preventDefault(),
				evt.stopImmediatePropagation()
			}),
			$ele.on("mouseup touchend", ".image-mapper-point", function (evt) {
				2 == evt.button && (_data[current].area[$(this).data("areaIndex")].coords.splice($(this).data("coordIndex"), 1), mapper.refresh.apply(e, [current]))
			}),
			$ele.on("contextmenu", function (evt) {
				evt.preventDefault()
			})
		},
		getData : function (current) {
			return _data[current]
		},
		getRatio : function () {
			var img = $(".image-mapper-img", this);
			return {
				ratioX : img[0].naturalWidth / img[0].clientWidth,
				ratioY : img[0].naturalHeight / img[0].clientHeight
			}
		},
		getPosition : function (b, evt, e) {
			var f = $(".image-mapper-img", this),
			g = f.offset(),
			h = mapper.getRatio.apply(this, [b]),
			i = {
				naturalX : 0,
				naturalY : 0
			};
			return e ? (i.naturalX = Math.round((evt.originalEvent.targetTouches[0].pageX - g.left) * h.ratioX), i.naturalY = Math.round((evt.originalEvent.targetTouches[0].pageY - g.top) * h.ratioY)) : (i.naturalX = Math.round((evt.clientX + (window.scrollX || window.pageXOffset) - g.left) * h.ratioX), i.naturalY = Math.round((evt.clientY + (window.scrollY || window.pageYOffset) - g.top) * h.ratioY)),
			i
		},
		getClientPosition : function (b, ele) {
			var e = $(".image-mapper-img", this),
			f = (e.offset(), mapper.getRatio.apply(this, [b])),
			g = {
				clientX : 0,
				clientY : 0
			};
			return g.clientX = Math.round(ele.naturalX / f.ratioX),
			g.clientY = Math.round(ele.naturalY / f.ratioY),
			g
		},
		refresh : function ($e) {
			mapper.renderSVG.apply(this, [$e]),
			mapper.renderPoints.apply(this, [$e])
		},
		addPoint : function ($e, point) {
			mapper.addCoord($e, point),
			mapper.refresh.apply(this, [$e])
		},
		addArea : function (current, shape) {
			if( shape==undefined)shape = "rect";
			if(current==undefined)
				current = $(this).data("imageMapper");
			 
			
			_data[current].area[_data[current].state.areaLength] = {
				el : !1,
				shape : shape,
				href : "",
				title : "",
				target : "",
				coords : []
			};
			_data[current].state.areaLength++;
			if("function" == typeof _data[current].options.event.addArea )
				_data[current].options.event.addArea.apply(this);
			mapper.setActive.apply(this, [current,_data[current].state.areaLength-1]);
		},
		setActive : function (current, index) {
			_data[current].state.areaIndex = index;
			mapper.refresh.apply(this, [current]);
		},
		setProperty : function (current, index,name,val) {
			_data[current].area[index][name]=val;
		},
		removeArea : function (current, index) {
			_data[current].area.splice(index, 1),
			_data[current].state.areaLength--,
			_data[current].state.areaIndex >= _data[current].state.areaLength ? _data[current].state.areaIndex = 0 : _data[current].state.areaIndex == index && 0 !== index && _data[current].state.areaIndex--,
			0 === _data[current].state.areaLength && mapper.addArea(current, "rect"),
			"function" == typeof _data[current].options.event.removeArea && _data[current].options.event.removeArea.apply(this);
			mapper.refresh.apply(this, [current]);
		},
		addCoord : function (current, point) {
			var index = _data[current].state.areaIndex,
			e = _data[current].area[index].shape;
			(-1 == ["circle", "rect"].indexOf(e) || 2 != _data[current].area[index].coords.length) && _data[current].area[index].coords.push(point)
		},
		renderSVG : function (current) {
			var e = this,
			f = $(".image-mapper-svg", this);
			f.css("width", "100%"),
			$(".image-mapper-shape", f).remove(),
			$.each(_data[current].area, function (g, h) {
				var i,
				j = [];
				$.each(h.coords, function (i, point) {
					var f = mapper.getClientPosition.apply(e, [current, point]);
					j.push(f.clientX, f.clientY)
				}),
				h.el && (i = h.el),
				"poly" == h.shape ? (i || (i = $(document.createElementNS("http://www.w3.org/2000/svg", "polygon"))), i.attr("points", j.join(","))) : "circle" == h.shape ? j.length >= 4 && (i || (i = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"))), i.attr("cx", j[0]).attr("cy", j[1]), i.attr("r", Math.sqrt(Math.pow(j[2] - j[0], 2) + Math.pow(j[3] - j[1], 2)))) : j.length >= 4 && (i || (i = $(document.createElementNS("http://www.w3.org/2000/svg", "rect"))), i.attr("x", Math.min(j[0], j[2])).attr("y", Math.min(j[1], j[3])), i.attr("width", Math.abs(j[2] - j[0])).attr("height", Math.abs(j[3] - j[1]))),
				i && (i.attr("class", "image-mapper-shape"), i.attr("data-area-index", g), i.css(_data[current].options.style), f.prepend(i), _data[current].area[g].el = i)
			})
		},
		renderPoints : function (current) {
			var e = this,
			f = $(".image-mapper-svg", this);
			$(".image-mapper-point", f).remove();
			var g = _data[current].state.areaIndex,
			h = _data[current].area[g];
			$.each(h.coords, function (h, i) {
				var j = $(document.createElementNS("http://www.w3.org/2000/svg", "circle")),
				k = mapper.getClientPosition.apply(e, [current, i]);
				j.attr("cx", k.clientX).attr("cy", k.clientY),
				j.attr("r", 5),
				j.attr("class", "image-mapper-point"),
				j.attr("data-area-index", g),
				j.attr("data-coord-index", h),
				j.css(_data[current].options.pointStyle),
				f.append(j)
			})
		},
		asHTML : function (current) {
			var img = $("<img />"),
			e = _data[current].options.src;
			_data[current].options.file.length > 0 && (e = _data[current].options.file),
			img.attr("src", e),
			img.attr("usemap", "#image-map");
			var f = $("<map />");
			f.attr("name", "image-map");
			var g = [];
			$.each(_data[current].area, function (index, area) {
				var f = [];
				if ($.each(area.coords, function (i, point) {
						f.push(point.naturalX, point.naturalY)
					}), "circle" == area.shape) {
					var h = Math.round(Math.sqrt(Math.pow(f[2] - f[0], 2) + Math.pow(f[3] - f[1], 2)));
					f = f.slice(0, 2),
					f.push(h)
				}
				var i = $("<area />");
				i.attr("target", _data[current].area[index].target),
				i.attr("alt", _data[current].area[index].title),
				i.attr("title", _data[current].area[index].title),
				i.attr("href", _data[current].area[index].href),
				i.attr("coords", f.join(",")),
				i.attr("shape", _data[current].area[index].shape),
				g.push(i[0].outerHTML)
			}),
			f.append("\n    " + g.join("\n    ") + "\n");
			var h = "<!-- Image Map Generated -->";
			return h + "\n" + img[0].outerHTML + "\n\n" + f[0].outerHTML
		}
	};
	$.fn.imageMapper = function () {
		var func = "string" == typeof arguments[0] ? arguments[0] : "init",
		obj = ("object" == typeof arguments[0] ? 0 : 1) || {},
		e = Array.prototype.slice.call(arguments, obj),
		f = $(this).data("imageMapper");
		return "setData" == func ? mapper.setData(f,arguments[1]) :"getData" == func ? mapper.getData(f) : "asHTML" == func ? mapper.asHTML(f) : (e.unshift(f), this.each(function () {
				"function" == typeof mapper[func] && mapper[func].apply(this, e)
			}))
	}
}
(jQuery)