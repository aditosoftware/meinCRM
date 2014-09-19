// Löschen des vorbelegten Users und setzen des markierten Users als Verantwortlichen
a.imagevar("$image.affectedusers", []);
var user = a.decodeMS(a.valueof("$comp.treeThemen"));
var adduser = [];
adduser.push([user[1], "-3407821" ,user[2]]);
a.imagevar("$image.affectedusers", adduser);
a.refresh("$comp.tblUsers");