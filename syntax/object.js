var members = [ "A", "B", "C" ];

var i = 0;
while (i < members.length) {
    console.log('array loop: ' + members[i]);
    i++;
}

var roles = {
    'programmer': 'A',
    'designer': 'B',
    'manager': 'C'
}

for (var name in roles) {
    console.log('object key loop: ' + name);
    console.log('object value loop: ' + roles[name]);
}
