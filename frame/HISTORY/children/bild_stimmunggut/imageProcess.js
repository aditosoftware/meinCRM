var bild = a.sql("select BINDATA from ASYS_ICONS where DESCRIPTION = 'gut' and ICON_TYPE = 'Stimmung'");
a.rs(bild);