//@idef0 TypescriptClass
class TypescriptClass {
  //@c1
  c1: String;
  //@c2
  c2: String;

  //@func f1 > c1
  f1(arg1: string, arg2: string) {
    console.log("f1");
    this.f2();
  }

  //@func f2 < c1 > c2
  f2() {
    console.log("f2");
  }

  //@view v1 < f1 f2
}
