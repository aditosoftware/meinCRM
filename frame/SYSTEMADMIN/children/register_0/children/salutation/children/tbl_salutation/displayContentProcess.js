import("lib_keyword")

var sqlstr = "select SALUTATIONID, " + getKeySQL( "SPRACHE", "LANGUAGE" ) + ", SALUTATION, TITLE, HEADLINE, LETTERSALUTATION, SEX from SALUTATION";

list = a.sql(sqlstr + " order by LANGUAGE, SORT", a.SQL_COMPLETE);
for (i=0; i<list.length; i++)		list[i][5] = a.translate(list[i][5])
if (list == '') list = a.createEmptyTable(5)
a.ro(list);