// function a() {
//     console.log('A');
// }


var a = function() {
    console.log('AA');
}


function slowFunc(callback) {
    console.log('slowFunc!');

    callback();

}


slowFunc(a);