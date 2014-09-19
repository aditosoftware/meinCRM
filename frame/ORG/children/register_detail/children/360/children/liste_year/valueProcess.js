var user = tools.getUser(a.valueof("$sys.user"))
var modul = user[tools.PARAMS]["modulORGYear"];
if ( modul == undefined )   modul = "";  
a.imagevar("$image.modulORGYear", modul);
a.rs( modul);