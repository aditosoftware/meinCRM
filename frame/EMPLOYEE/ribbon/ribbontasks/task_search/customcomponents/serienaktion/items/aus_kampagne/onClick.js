import("lib_campaign");

condition = "RELATIONID in (select RELATION_ID from EMPLOYEE where " +  a.valueof("$sys.selection") + ")";
deleteParticipantsWithCondition( "PERS", condition);