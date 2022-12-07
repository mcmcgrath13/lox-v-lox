export interface Program {
  name: string;
  program: string;
}

export const SAMPLE_PROGRAMS: Program[] = [
  {
    name: "Fibonacci (recursive)",
    program: `
fun fib(n) {
  if (n <= 1) return n;
  return fib(n - 2) + fib(n - 1);
}

var start = clock();
for (var i = 1; i <= 25; i = i + 1) {
  print fib(i);
}

print "time to execute (ms):";
print clock() - start;
`,
  },
  {
    name: "Fibonacci (iterative)",
    program: `
var a = 1;
var temp;

for (var b = 1; a < 10000; b = temp + b) {
  print a;
  temp = a;
  a = b;
}
  `,
  },
  {
    name: "Class inheritance",
    program: `
class Doughnut {
  cook() {
    print "Fry until golden brown.";
  }
}

class BostonCream < Doughnut {
  cook() {
    super.cook();
    print "Pipe full of custard and coat with chocolate.";
  }
}

BostonCream().cook();`,
  },
  {
    name: "Class mutability",
    program: `
class Cake {
  init(flavor) {
    this.flavor = flavor;
  }

  taste() {
    var adjective = "delicious";
    print "The " + this.flavor + " cake is " + adjective + "!";
  }
}

var cake = Cake("vanilla");
cake.taste();
cake.flavor = "German chocolate";
cake.taste();
cake.flavor = "funfetti";
cake.taste();
`,
  },
  {
    name: "Counter",
    program: `
fun makeCounter() {
  var i = 0;
  fun count() {
    i = i + 1;
    print i;
  }

  return count;
}

var counter = makeCounter();
counter();
counter();
    `,
  },
];
