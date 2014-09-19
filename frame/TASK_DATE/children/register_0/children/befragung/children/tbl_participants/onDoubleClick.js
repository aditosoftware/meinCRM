var persid = a.sql("select pers_id from campaignparticipant join relation on (campaignparticipant.relation_id = relation.relationid)"
    + " where campaignparticipantid = '" + a.decodeFirst(a.valueof("$comp.tbl_participants")) + "'");
a.setValue("$comp.lbl_interview", persid);
a.openLinkedFrame("PERS", null, false, a.FRAMEMODE_SHOW, "$comp.lbl_interview|PERS.PERSID")