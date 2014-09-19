import("lib_bulkmail");

condition = "RELATIONID in (select RELATION_ID from EMPLOYEE where " +  a.valueof("$sys.selection") + ")";
deleteRecipientsWithCondition( "PERS", condition );