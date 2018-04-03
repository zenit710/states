var a = new State('A'),
    b = new State('B'),
    c = new State('C'),
    d = new State('D'),
    e = new State('E', true);

a.addRoutes(['a','b'], a);
a.addRoute('a', b);
b.addRoutes(['a','b'], a);
b.addRoute('b', c);
c.addRoutes(['a','b'], a);
c.addRoute('b', d);
d.addRoutes(['a','b'], a);
d.addRoute('a', e);
e.addRoutes(['a','b'], e);

var machine = new Machine(a);

machine.addState(b);
machine.addState(c);
machine.addState(d);
machine.addState(e);

console.log(machine.toString());
machine2 = machine.toDeterministic();

console.log(machine2.toString());