var relids = a.sql("select RELATION_ID from CAMPAIGNPARTICIPANT where CAMPAIGNPARTICIPANTID in ('" 
    + a.decodeMS(a.valueof("$comp.tbl_participants")).join("','") + "')", a.SQL_COLUMN);

a.rs(a.sql("select count(*) from QUESTIONNAIRELOG where RELATION_ID in ('" + relids.join("','") + "')") > 0)