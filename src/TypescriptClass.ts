//%model TypescriptClass
//%view v1 < constructor f1 f2 f3
class TypescriptClass {
  //%c1
  c1: number;
  //%c2
  c2: number;
  //%c3
  c3: number;

  //%func constructor < arg0 -> f1
  //%arg0
  constructor(arg0: number) {
    this.f1(arg0, arg0);
  }

  //%func f1 < arg1 arg2 > c1 ->f2
  //%arg1
  //%arg2
  f1(arg1: number, arg2: number) {
    this.c1 = arg1 + arg2;
    this.f2(10);
  }

  //%func f2 < arg3 c2 > c2 -> f3
  //%arg3
  f2(arg3: number) {
    this.c2 = this.c2 * arg3;
    this.f3();
  }

  //%func f3 < c1 c2 > c3
  f3() {
    this.c3 = this.c1 + this.c2;
  }
}
