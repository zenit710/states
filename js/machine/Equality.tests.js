function test() {
    test1();
    test2();
    test3();
}

function check(machine1, machine2, different) {
    different = !!different;

    if (machine1.equals(machine2) == different) {
        console.error('FAIL!');
    } else {
        console.warn('Passed!');
    }
}

function test1() {
    console.log('#1 - identical machines');

    var a = new State('a'),
    b = new State('b', true);

    a.addRoute('b', a);
    a.addRoute('a', b);
    b.addRoutes(['a','b'], b);

    machine = new Machine(a);
    machine.addState(b);

    machine2 = new Machine(a);
    machine2.addState(b);

    check(machine, machine2);
}

function test2() {
    console.log('#2 - machines doing the same');

    var _1 = new State('1'),
        _2 = new State('2'),
        _3 = new State('3', true),
        a = new State('A'),
        b = new State('B'),
        c = new State('C'),
        d = new State('D'),
        e = new State('E', true);

    _1.addRoute('b', _1);
    _1.addRoute('a', _2);
    _2.addRoute('b', _2);
    _2.addRoute('a', _3);
    _3.addRoutes(['a','b'], _3);

    a.addRoute('b', b);
    a.addRoute('a', c);
    b.addRoute('a', c);
    b.addRoute('b', b);
    c.addRoute('a', e);
    c.addRoute('b', d);
    d.addRoute('b', c);
    d.addRoute('a', e);
    e.addRoutes(['a','b'], e);

    var machine = new Machine(_1),
        machine2 = new Machine(a);

    machine.addState(_2);
    machine.addState(_3);

    machine2.addState(b);
    machine2.addState(c);
    machine2.addState(d);
    machine2.addState(e);

    check(machine, machine2);
}

function test3() {
    console.log('#3 - different machines');

    var _1 = new State('1'),
        _2 = new State('2'),
        _3 = new State('3', true),
        a = new State('A'),
        b = new State('B'),
        c = new State('C');

    _1.addRoute('b', _1);
    _1.addRoute('a', _2);
    _2.addRoute('b', _2);
    _2.addRoute('a', _3);
    _3.addRoutes(['a','b'], _3);

    a.addRoute('b', a);
    a.addRoute('a', b);
    b.addRoute('a', b);
    b.addRoute('b', c);
    c.addRoutes(['a','b'], c);

    var machine = new Machine(_1),
        machine2 = new Machine(a);

    machine.addState(_2);
    machine.addState(_3);

    machine2.addState(b);
    machine2.addState(c);

    check(machine, machine2, true);
}

// test();