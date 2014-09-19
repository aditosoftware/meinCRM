var user = tools.getUser(a.valueof("$sys.user"))
var modul = user[tools.PARAMS]["modulPERS"];
if ( modul == undefined )   modul = "";  
a.imagevar("$image.modulPERS", modul);
a.rs( modul);