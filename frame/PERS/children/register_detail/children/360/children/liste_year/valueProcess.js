var user = tools.getUser(a.valueof("$sys.user"))
var modul = user[tools.PARAMS]["modulPERSYear"];
if ( modul == undefined )   modul = "";  
a.imagevar("$image.modulPERSYear", modul);
a.rs( modul);