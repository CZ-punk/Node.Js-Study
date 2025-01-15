var f = function() {
    console.log(1+1);
    console.log(1+2);
}

var a = [f]

console.log(a[0]);  // 변수 f
a[0]();             // 함수 f 


var o = {
    func:f
}

console.log(o.func);    // 변수 f
o.func();               // 함수 f