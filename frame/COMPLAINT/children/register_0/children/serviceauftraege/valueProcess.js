var dbid = a.valueof("$comp.MACHINE_ID");

var count = a.sql("select SERVICEORDERID from SERVICEORDER where MACHINE_ID = '" + dbid + "'", a.SQL_COLUMN).length;
	if (count == undefined ) count = 0;

a.rs(a.translate("Serviceaufträge (%0)", [count]));