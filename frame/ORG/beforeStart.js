import("lib_grant");

// Rights initialisieren
initFrame();

// Definieren, in welchen der Frame-Tabellen welche Frame-Aktionen stattfinden können
a.setTablesCanBeCreated(new Array("ORG","RELATION"));
a.setTablesCanBeEdited(new Array("ORG","RELATION"));
a.setTablesCanBeDeleted(new Array("ORG","RELATION"));

// Image-Variable für Dublettencheck, enthält die IDs möglicher Dubletten oder false
a.imagevar("$image.dupids", "");