var id = a.valueof("$comp.SALESORDER_ID");
//bei stornierter Rechnung FLAG CANCELLED wieder zurücksetzten auf 'N'
a.sqlUpdate("SALESORDER", ["CANCELLED"], [SQLTYPES.CHAR], ["N"], " SALESORDERID = '" + id + "'");
//a.closeCurrentTopImage();