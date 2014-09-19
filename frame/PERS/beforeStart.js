import("lib_grant");

// Rights initialisieren
initFrame();

// Definieren, in welchen der Frame-Tabellen welche Frame-Aktionen stattfinden können
if ( a.valueof("$sys.superframe") == "PERS" )		a.setTablesCanBeCreated(new Array("RELATION"));
else a.setTablesCanBeCreated(new Array("PERS","RELATION"));
a.setTablesCanBeEdited(new Array("PERS","RELATION"));
a.setTablesCanBeDeleted(new Array("PERS","RELATION"));


// Image-Variable für Dublettencheck, enthält die IDs möglicher Dubletten oder ""
a.imagevar("$image.dupids", "");

// SocialMedia
a.imagevar("$image.socialinfo", "<none/>");
a.imagevar("$image.socialtabActive", "false");