import("lib_distlist");

condition = "RELATIONID in (select RELATION_ID from EMPLOYEE where " +  a.valueof("$sys.selection") + ")";
deleteMembersWithCondition( "PERS", condition);