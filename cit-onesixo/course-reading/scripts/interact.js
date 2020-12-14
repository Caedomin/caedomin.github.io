var act = {
    check: function (inputId, iconId, pat) {
        var response = this.getById(inputId).value;
        var icon = this.getById(iconId);
        var title = pat.test(response) ? 'correct' : 'incorrect';
        icon.src = 'images/' + title + '.png';
        icon.alt = title;
        icon.title = title;
    },

    toggleVisibility: function (id) {
        for (var a = 0; a < arguments.length; ++a) {
            var arg = arguments[a];
            var style = this.getById(arg).style;
            var vis = style.visibility;
            style.visibility = (vis == 'hidden' ? 'visible' : 'hidden');
        }
    },

    toggleHighlight: function (id) {
        var elems = this.getByClass('highlight');
        var toggle = elems[0].classList.contains('on') ?
            function (elem, clss) {
                elem.classList.remove(clss);
            } :
            function (elem, clss) {
                elem.classList.add(clss);
            };
        for (var i = 0; i < elems.length; ++i) {
            toggle(elems[i], 'on');
        }
    },

    /** Launches a complete code example in a new browser tab. */
    launch: function (id) {
        var html = '';
        var sep = '';
        for (var i = 0; i < arguments.length; ++i) {
            var id = arguments[i];

            // Get the code for the example.
            var part = this.getById(id).innerHTML;

            // Remove all the tags for syntax highlighting and animations.
            part = part.replace(/<[^>]+>/g, '');

            // Convert entities like &lt; to characters.
            part = this.charFromEntity(part);

            html += sep + part;
            sep = '\n\n';
        }

        // Give the script a name so that when a student opens the
        // debugger in the launched tab, the script will be included in
        // the list of files that can be debugged.
        var patScript = /.*<\/script>/;
        html = html.replace(patScript, '//# sourceURL=example.js\n$&');

        // Open a new tab (or window) and write the example code into it.
        var win = window.open();
        var doc = win.document;
        doc.open('text/html', true);
        doc.write(html);
        doc.close();

        //		var area = doc.createElement('textarea');
        //		doc.body.appendChild(area);
        //		area.value = html;
        //		area.select();
        //		doc.execCommand('copy');
    },


    handleMouseEnter: function (event) {
        var name = event.target.getAttribute('data-name');
        var list = act.getBySelector('[data-name="' + name + '"]');
        for (var i = 0; i < list.length; ++i) {
            var elem = list[i];
            var highlight = elem.classList.contains('decl') ? 'ora' : 'yel';
            elem.classList.add(highlight);
        }
    },

    handleMouseLeave: function (event) {
        var name = event.target.getAttribute('data-name');
        var list = act.getBySelector('[data-name="' + name + '"]');
        for (var i = list.length - 1; i >= 0; --i) {
            var elem = list[i];
            elem.classList.remove('ora');
            elem.classList.remove('yel');
        }
    },


    millis: 2000,
    classes: ['enter', 'click', 'execute', 'assign',
        'display', 'draw', 'write', 'examine'
    ],
    states: {
        paused: 1,
        running: 2,
        pausing: 3,
        step: 4
    },
    animations: {},

    add: function (anims) {
        for (var i = 0; i < anims.length; ++i) {
            var anim = anims[i];
            this.animations[anim.name] = anim;
        }
    },

    prepare: function () {
        var titles = [{
                'class': 'head',
                title: 'function header'
            },
            {
                'class': 'call',
                title: 'function call'
            },
            {
                'class': 'glob',
                title: 'global variable'
            },
            {
                'class': 'loc',
                title: 'local variable'
            },
            {
                'class': 'param',
                title: 'parameter (local variable)'
            },
            {
                'class': 'arg',
                title: 'argument'
            },
            {
                'class': 'id',
                title: 'id'
            }
        ];
        titles.forEach(function (obj) {
            var list = act.getByClass(obj['class']);
            for (var i = 0; i < list.length; ++i) {
                var elem = list[i];
                elem.title = obj.title;
                elem.addEventListener('mouseenter', act.handleMouseEnter);
                elem.addEventListener('mouseleave', act.handleMouseLeave);
            }
        });

        for (var a in this.animations) {
            var anim = this.animations[a];
            anim.prepare();
            anim.reset();
        }
    },


    runClick: function (animId) {
        var anim = this.animations[animId];
        var runBtn = act.getById(anim.name + 'Run');
        var stepBtn = act.getById(anim.name + 'Step');
        var state = runBtn['data-state'];
        if (state == 'paused') {
            stepBtn.disabled = true;
            runBtn.innerHTML = '<b>||</b>';
            runBtn.title = 'Pause';
            runBtn['data-state'] = 'running';
            // Start the animation by executing the next step immediately.
            runBtn['data-cmd'].call(anim, anim.vars);
        } else if (state == 'running') {
            runBtn.disabled = true;
            runBtn.innerHTML = '&#x25ba;';
            runBtn.title = 'Run';
            // Pause when the next step tries to execute.
            runBtn['data-state'] = 'pausing';
        } else if (state == 'pausing') {
            // Should never happen.
            alert('Aaaaahhh 1');
        } else if (state == 'step') {
            // Should never happen.
            alert('Aaaaahhh 2');
        }
    },

    stepClick: function (animId) {
        var anim = this.animations[animId];
        var runBtn = act.getById(anim.name + 'Run');
        var stepBtn = act.getById(anim.name + 'Step');
        var state = runBtn['data-state'];
        if (state == 'paused') {
            stepBtn.disabled = true;
            runBtn['data-state'] = 'step';
            // Execute next step immediately.
            runBtn['data-cmd'].call(anim, anim.vars);
        } else if (state == 'running') {
            // Should never happen.
            alert('Aaaaahhh 3');
        } else if (state == 'pausing') {
            // Should never happen.
            alert('Aaaaahhh 4');
        } else if (state == 'step') {
            // Should never happen.
            alert('Aaaaahhh 5');
        }
    },

    schedNext: function (anim, stepId) {
        var runBtn = act.getById(anim.name + 'Run');
        var stepBtn = act.getById(anim.name + 'Step');

        stepId = anim.name + stepId;
        var state = runBtn['data-state'];
        if (state == 'paused') {
            // Should never happen.
            alert('Aaaaahhh 6');
        } else if (state == 'running') {
            window.setTimeout(function () {
                    var elem = act.getById(stepId);
                    elem['data-cmd'].call(anim, anim.vars);
                },
                this.millis);
        } else if (state == 'pausing') {
            runBtn['data-cmd'] = act.getById(stepId)['data-cmd'];
            runBtn['data-state'] = 'paused';
            runBtn.innerHTML = '&#x25ba;';
            runBtn.title = 'Run';
            runBtn.disabled = false;
            stepBtn.disabled = false;
        } else if (state == 'step') {
            runBtn['data-cmd'] = act.getById(stepId)['data-cmd'];
            runBtn['data-state'] = 'paused';
            stepBtn.disabled = false;
        }
    },

    slowerClick: function () {
        if (this.millis < 7000) {
            this.millis += 500;
        }
    },

    fasterClick: function () {
        if (this.millis > 500) {
            this.millis -= 500;
        }
    },


    clear: function () {
        this.noclass.apply(this, arguments);
        for (var a = 0; a < arguments.length; ++a) {
            var arg = arguments[a];
            if (Array.isArray(arg)) {
                for (var i = 0; i < arg.length; ++i) {
                    var elem = this.getById(arg[i]);
                    if (elem.nodeName.toLowerCase() == 'th') {
                        elem.innerHTML = '&nbsp;';
                    }
                    var imgs = elem.getElementsByTagName('img');
                    if (imgs.length > 0) {
                        elem.removeChild(imgs[0]);
                    }
                }
            } else {
                var elem = this.getById(arg);
                if (elem.nodeName.toLowerCase() == 'th') {
                    elem.innerHTML = '&nbsp;';
                }
                var imgs = elem.getElementsByTagName('img');
                if (imgs.length > 0) {
                    elem.removeChild(imgs[0]);
                }
            }
        }
    },

    hide: function () {
        //		this.noclass.apply(this, arguments);
        for (var a = 0; a < arguments.length; ++a) {
            var arg = arguments[a];
            if (Array.isArray(arg)) {
                for (var i = 0; i < arg.length; ++i) {
                    var elem = this.getById(arg[i]);
                    elem.style.visibility = 'hidden';
                    elem.innerHTML = '';
                }
            } else {
                var elem = this.getById(arg);
                elem.style.visibility = 'hidden';
                elem.innerHTML = '';
            }
        }
    },

    noclass: function () {
        var n = this.classes.length;
        for (var a = 0; a < arguments.length; ++a) {
            var arg = arguments[a];
            if (Array.isArray(arg)) {
                for (var i = 0; i < arg.length; ++i) {
                    var elem = this.getById(arg[i]);
                    for (var c = 0; c < n; ++c) {
                        elem.classList.remove(this.classes[c]);
                    }
                }
            } else {
                var elem = this.getById(arg);
                for (var c = 0; c < n; ++c) {
                    elem.classList.remove(this.classes[c]);
                }
            }
        }
    },

    enter: function (id, explainId, text) {
        this.getById(id).classList.add('enter');
        var elem = this.getById(explainId);
        elem.innerHTML = 'User enters: "' + text + '"';
        elem.classList.add('enter');
        elem.style.visibility = 'visible';
    },

    click: function (id, explainId) {
        this.getById(id).classList.add('click');
        var elem = this.getById(explainId);
        elem.innerHTML = 'User clicks button';
        elem.classList.add('click');
        elem.style.visibility = 'visible';
    },

    execute: function (id) {
        var elem = this.getById(id);
        elem.classList.add('execute');
    },

    assign: function (id, value, oldId) {
        var elem = this.getById(id);
        elem.classList.add('assign');
        if (typeof (value) == 'string') {
            value = '"' + value + '"';
        }
        elem.innerHTML = value;

        if (oldId) {
            var elem = this.getById(oldId);
            var img = document.createElement('img');
            img.src = 'images/x.gif';
            elem.appendChild(img);
        }
    },

    display: function (id, explainId, text) {
        this.getById(id).classList.add('display');
        var elem = this.getById(explainId);
        elem.innerHTML = 'Program displays: "' + text + '"';
        elem.classList.add('display');
        elem.style.visibility = 'visible';
    },

    explain: function (id, text) {
        var elem = this.getById(id);
        elem.innerHTML = text;
        elem.style.visibility = 'visible';
    },

    draw: function (id, explainId, message) {
        this.getById(id).classList.add('draw');
    },

    write: function (id, text) {
        var elem = this.getById(id);
        elem.classList.add('write');
        elem.innerHTML = text;
    },

    examine: function (id) {
        this.getById(id).classList.add('examine');
    },


    getById: function (id) {
        var elem = document.getElementById(id);
        if (!elem) {
            console.log('ID not found: ' + id);
        }
        return elem;
    },

    getByTag: function (name) {
        return document.getElementsByTagName(name);
    },

    getByClass: function (name) {
        return document.getElementsByClassName(name);
    },

    getBySelector: function (selector) {
        return document.querySelectorAll(selector);
    },



    eFromC: {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;',
        '#': '&#35;',
        '\r': '&#13;',
        '\n': '&#10;'
    },

    /** Within a string converts the characters <, &, >, ', ", #, \r, and \n
     * to their corresponding HTML escape sequences. */
    entityFromChar: function (str) {
        var self = this;
        return str.replace(/[<&>'"#\r\n]/g,
            function (s) {
                return self.eFromC[s];
            });
    },

    cFromE: {
        'lt': '<',
        'gt': '>',
        'amp': '&',
        'quot': '"',
        '#39': "'",
        '#35': '#',
        '#13': '\r',
        '#10': '\n',
        '#039': "'",
        '#035': '#',
        '#013': '\r',
        '#010': '\n'
    },

    /** Within a string converts the HTML entity escape sequences for
     * the characters <, &, >, ', ", #, \r, and \n to the characters. */
    charFromEntity: function (str) {
        var self = this;
        return str.replace(/&([^&;]+);/g,
            function (s, p) {
                var c = self.cFromE[p];
                return c == null ? s : c;
            });
    },


    choose: function (list) {
        return list[this.randInt(0, list.length)];
    },

    /** Returns a pseudo random real number in the range [min, max) */
    randReal: function (min, max, digits) {
        var mplier = Math.pow(10, digits);
        var real = this.randInt(min * mplier, max * mplier) / mplier;
        return parseFloat(real.toFixed(digits));
    },

    /** Returns a pseudo random integer in the range [low, high) */
    randInt: function (low, high) {
        return low + Math.floor(Math.random() * (high - low));
    },

    randBool: function () {
        return Math.random() < 0.5;
    }
};


act.Anim = function Anim(name, startId, steps, vars) {
    this.name = name;
    this.steps = steps;
    this.startId = startId;
    this.vars = vars;
    this.idents = [];
    this.explains = [];
};

act.Anim.prototype.prepare = function () {
    var steps = this.steps;
    var idents = this.idents;
    var explains = this.explains;
    var members = /\b(reset|noclass|execute|assign|hide|enter|click|display|explain|draw|write|examine|not|and|or|xor|bool|str|schedNext|idents|vars)\b/g;

    for (var id in steps) {
        var stepId = this.name + id;
        idents.push(stepId);
        var elem = act.getById(stepId);
        if (elem.classList.contains('explain')) {
            explains.push(stepId);
        }

        // Rewrite each step function so that it includes "this."
        // wherever it is needed. Doing this allows the steps of each
        // animation to be much shorter.
        var step = steps[id];
        if (step) {
            var code = step.toString();
            var body = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
            body = body.replace(members, 'this.$1');
            step = new Function(body);
        }

        elem['data-cmd'] = step;
    }
};

act.Anim.prototype.reset = function () {
    var name = this.name;
    var runBtn = act.getById(name + 'Run');
    var stepBtn = act.getById(name + 'Step');
    runBtn.innerHTML = '&#x25ba;';
    runBtn.title = 'Run';
    runBtn['data-cmd'] = act.getById(name + this.startId)['data-cmd'];
    runBtn['data-state'] = 'paused';
    runBtn.disabled = false;
    stepBtn.disabled = false;
};

act.Anim.prototype.noclass = function () {
    act.noclass(this.idents);
};
act.Anim.prototype.execute = function (stepId) {
    act.execute(this.name + stepId);
};
act.Anim.prototype.assign = function (cellId, val, oldId) {
    if (oldId) {
        oldId = this.name + oldId;
    }
    act.assign(this.name + cellId, val, oldId);
};
act.Anim.prototype.hide = function () {
    act.hide(this.explains);
};
act.Anim.prototype.enter = function (id, explainId, text) {
    act.enter(this.name + id, this.name + explainId, text);
};
act.Anim.prototype.click = function (id, explainId) {
    act.click(this.name + id, this.name + explainId);
};
act.Anim.prototype.display = function (id, explainId, text) {
    act.display(this.name + id, this.name + explainId, text);
};
act.Anim.prototype.explain = function (id, text) {
    act.explain(this.name + id, text);
};
act.Anim.prototype.draw = function (id, explainId, text) {
    act.draw(this.name + id, this.name + explainId, text);
};
act.Anim.prototype.write = function (id, text) {
    act.write(this.name + id, text);
};
act.Anim.prototype.examine = function (id) {
    for (var a = 0; a < arguments.length; ++a) {
        act.examine(this.name + arguments[a]);
    }
};

act.Anim.prototype.not = function (id) {
    return this.str(!this.bool(id));
};
act.Anim.prototype.and = function (id1, id2) {
    return this.str(this.bool(id1) && this.bool(id2));
};
act.Anim.prototype.or = function (id1, id2) {
    return this.str(this.bool(id1) || this.bool(id2));
};
act.Anim.prototype.xor = function (id1, id2) {
    return this.str(this.bool(id1) != this.bool(id2));
};
act.Anim.prototype.bool = function (id) {
    var text = act.getById(this.name + id).innerHTML;
    return text.toUpperCase().indexOf('T') != -1;
};
act.Anim.prototype.str = function (b) {
    return b ? 'True' : 'False';
};
act.Anim.prototype.schedNext = function (stepId) {
    act.schedNext(this, stepId);
};