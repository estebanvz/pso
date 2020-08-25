function costFunc1(X) {
  let total = 0;
  for (let i = 0; i < X.length; i++) {
    // if(X[i]<=150){
    //   total+=0
    // }else{
    total += (X[i] - 100) ** 2;
    // }
  }
  return total;
}
function costFunc2(X) {
  let total = 0;
  let x = X[0];
  let y = X[1];
  total=0.26*((x-10)**2+(y+3)**2)-0.48*x*(y+2);
  return total;
}
function costFunc3(X) {
  let total = 0;
  let x = X[0];
  let y = X[1];
//   total=(y+47)*Math.sin(Math.abs(x/2+y+47)**0.5)*x*Math.sin(Math.abs(x-y+47)**0.5)
  total=-(y+47)*Math.sin(Math.abs(x/2+y+47)**0.5)-x*Math.sin(Math.abs(x-y-47)**0.5)
  return total;
}

export class TestFunctions {
  solutions = [];
  solution=10;
  costFunc = costFunc1;
  getFunction1() {
    this.solutions = [];
    this.solutions.push([100, 100]);
    this.costFunc = costFunc1;
    this.solution = costFunc1([100,100])
  }
  getFunction2() {
    this.solutions = [];
    this.solutions.push([1534/25, 1341/25]);
    this.costFunc = costFunc2;
    this.solution = costFunc2([1534/25, 1341/25])
  }
  getFunction3() {
    this.solutions = [];
    this.solutions.push([512,404.2319]);
    this.solutions.push([615,367]);
    this.costFunc = costFunc3;
    this.solution = costFunc3([512,404.2319])
  }
}


