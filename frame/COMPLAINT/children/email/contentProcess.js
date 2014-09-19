var relation_id =  a.valueof("$comp.RELATION_ID");
if (relation_id != "")
{
    var persid = a.sql("select pers_id from relation where relationid = '" + relation_id + "'");
    a.rq("select ADDR from COMM where MEDIUM_ID in (3,13) and RELATION_ID in (select relationid from relation where pers_id = '"
        + persid + "')");
}