var sqlstr = "select distinct SALUTATION from SALUTATION where SALUTATION is not NULL";
if ( a.valueof("$sys.workingmode") != a.FRAMEMODE_TABLE )
{
    var lang = a.valueof("$comp.LANG");
    if (lang != '') sqlstr += " and LANGUAGE = " + lang;
}
a.rq(sqlstr);