var index = a.decodeMS(a.valueof("$comp.listColumn"));
var table = [];
for ( var i = 0; i < index.length; i++ ) table.push([index[i], index[i], String(i)]);
a.ro (table);