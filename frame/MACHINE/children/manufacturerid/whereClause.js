import("lib_relation");

a.rs(getContactWhereString("RELATIONID in (select ROW_ID from ATTRLINK join ATTR on ATTRID = ATTRLINK.ATTR_ID "
	+ "where ATTRNAME = 'Zielgruppe' and OBJECT_ID = 1 and AOACTIVE = 1 and VALUE_ID = "
	+ "(select ATTRID from ATTR where ATTRNAME = 'Lieferant'))"));