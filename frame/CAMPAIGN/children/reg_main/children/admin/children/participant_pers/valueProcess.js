var p_r = a.valueof("$comp.participant_relation");
if (p_r != "")
{
    a.rq("select pers_id from relation where relationid = '" + p_r + "'");
}