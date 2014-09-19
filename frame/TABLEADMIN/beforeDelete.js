var tableid = a.valueof("$comp.TABLEID")
a.sqlDelete("AOSYS_COLUMNREPOSITORY", "TABLE_ID = '" + tableid + "'");
a.sqlDelete("AOSYS_INDEXREPOSITORY", "TABLE_ID = '" + tableid + "'");