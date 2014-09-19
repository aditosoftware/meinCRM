if (a.valueof("$comp.login") != "")
{
    var query = ("select login from employee where employee.calendar_read like '%; " + a.valueof("$comp.login") + "; %'");
    var result = a.sql(query, a.SQL_COLUMN);
    a.rs(a.encodeMS(result));
}