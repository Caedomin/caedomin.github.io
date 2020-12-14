var js = {
    prepare: function () {
        act.add([
            new act.Anim('ch4alert', 'Button', {
                '1': function () {
                    noclass();
                    hide();
                    execute('1');
                    schedNext('2');
                },
                '2': function () {
                    noclass();
                    execute('2');
                    schedNext('3');
                },
                '3': function () {
                    alert('Water is delicious!');
                    noclass();
                    execute('3');
                    schedNext('End');
                },
                'Button': function () {
                    act.clear(idents);
                    hide();
                    click('Button', 'Click');
                    schedNext('1');
                },
                'Click': null,
                'End': function () {
                    noclass();
                    reset();
                }
            }, {}),
            new act.Anim('ch4greet', 'Button', {
                '1': function () {
                    noclass();
                    hide();
                    execute('1');
                    schedNext('2');
                },
                '2': function () {
                    noclass();
                    execute('2');
                    schedNext('3');
                },
                '3': function () {
                    vars.name = prompt('Please enter your name');
                    noclass();
                    vars.greeting = 'Hello ' + vars.name + '.  I hope you are well today.';
                    execute('3');
                    schedNext('4');
                },
                '4': function () {
                    noclass();
                    execute('4');
                    schedNext('5');
                },
                '5': function () {
                    alert(vars.greeting);
                    noclass();
                    execute('5');
                    schedNext('End');
                },
                'Button': function () {
                    act.clear(idents);
                    hide();
                    click('Button', 'Click');
                    schedNext('1');
                },
                'Click': null,
                'End': function () {
                    noclass();
                    reset();
                }
            }, {
                name: '',
                greeting: ''
            }),
            new act.Anim('ch4verse', 'Input', {
                '1': function () {
                    noclass();
                    hide();
                    execute('1');
                    schedNext('2');
                },
                '2': function () {
                    noclass();
                    execute('2');
                    schedNext('3');
                },
                '3': function () {
                    noclass();
                    execute('3');
                    vars.verse = 'I, ' + vars.name + ', having been born of goodly parents&hellip;';
                    schedNext('4');
                },
                '4': function () {
                    noclass();
                    execute('4');
                    schedNext('Div');
                },
                '5': function () {
                    noclass();
                    hide();
                    execute('5');
                    schedNext('End');
                },
                'Input': function () {
                    act.clear(idents);
                    hide();
                    vars.name = 'Sergio';
                    enter('Input', 'Enter', vars.name);
                    schedNext('Button');
                },
                'Button': function () {
                    noclass();
                    hide();
                    click('Button', 'Click');
                    schedNext('1');
                },
                'Div': function () {
                    noclass();
                    display('Div', 'Display', vars.verse);
                    schedNext('5');
                },
                'Enter': null,
                'Click': null,
                'Display': null,
                'End': function () {
                    noclass();
                    reset();
                }
            }, {
                name: '',
                verse: ''
            })
        ]);
        act.prepare();
    }
};