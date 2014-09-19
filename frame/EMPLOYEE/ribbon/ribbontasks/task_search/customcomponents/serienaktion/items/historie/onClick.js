import("lib_history");

relids = a.sql("select RELATION_ID from EMPLOYEE where " +  a.valueof("$sys.selection"), a.SQL_COLUMN );
if ( relids.length > 0 )	InsertHistory( relids );