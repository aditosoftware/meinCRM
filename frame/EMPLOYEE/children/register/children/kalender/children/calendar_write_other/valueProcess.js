if (a.valueof("$comp.login") != "")
{
    var query = ("select login"
        + " from employee join relation on (employee.relation_id = relation.relationid)"
        + " join pers on (relation.pers_id = pers.persid) where employee.calendar_write like '%; " + a.valueof("$comp.login") + "; %'");

    var result = a.sql(query, a.SQL_COLUMN);
    a.rs(a.encodeMS(result));
}