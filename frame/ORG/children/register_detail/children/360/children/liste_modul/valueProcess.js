var user = tools.getUser(a.valueof("$sys.user"))
var modul = user[tools.PARAMS]["modulORG"];
if ( modul == undefined )   modul = "";  
a.imagevar("$image.modulORG", modul);
a.rs( modul);