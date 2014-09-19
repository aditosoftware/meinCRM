var sqlstr = "select TITLE from SALUTATION where TITLE is not null";
if ( a.valueof("$sys.workingmode") != a.FRAMEMODE_TABLE )
{
    var lang = a.valueof("$comp.LANG");
    if (lang != '') sqlstr += " and LANGUAGE = " + lang;
}
a.rq(sqlstr + " order by SORT");