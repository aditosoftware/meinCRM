var id =  a.decodeFirst(a.valueof("$comp.tbl_Ressource"))
var Entry = calendar.getEntry(id)[0];
var user = 	a.decodeMS(Entry[calendar.USER]);
user = user[1].substr(3,user[1].length-3)

if ( user != a.valueof("$sys.user") && Entry[calendar.CLASSIFICATION] == "PRIVATE") {} else calendar.openEntry(id , false)