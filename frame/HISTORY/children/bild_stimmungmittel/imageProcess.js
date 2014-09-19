var bild = a.sql("select BINDATA from ASYS_ICONS where DESCRIPTION = 'mittel' and ICON_TYPE = 'Stimmung'");
a.rs(bild);