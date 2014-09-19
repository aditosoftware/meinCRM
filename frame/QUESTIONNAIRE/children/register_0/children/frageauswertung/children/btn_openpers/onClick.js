ids = a.decodeMS(a.valueof("$comp.tbl_pers"));
if (ids.length > 0)
{
    var ids = a.sql("select RELATION_ID from QUESTIONLOG join QUESTIONNAIRELOG on QUESTIONNAIRELOGID = QUESTIONNAIRELOG_ID "
        + " where QUESTIONLOGID in ('" + a.decodeMS(a.valueof("$comp.tbl_pers")).join("','") + "')", a.SQL_COLUMN)
}
else
{
    ids = a.sql("select RELATION_ID from QUESTIONLOG join QUESTIONNAIRELOG on QUESTIONNAIRELOGID = QUESTIONNAIRELOG_ID "
        + " where QUESTIONLOG.QUESTION_ID = '" + a.valueof("$comp.cmb_question") + "' and QUESTIONLOG.ANSWERTEXT like '%" + a.valueof("$comp.cmb_answer") + "%'", a.SQL_COLUMN)
}
a.openFrame("PERS", "RELATION.PERS_ID in (select PERS_ID from RELATION where RELATIONID in ('" + ids.join("','") + "'))", false, a.FRAMEMODE_TABLE_SELECTION, null, false);