import("lib_util");

var res = a.sql("select ISO2, NAME_DE from COUNTRYINFO", a.SQL_COMPLETE);
for(var i = 0; i < res.length; i++)
{
    res[i][1] = a.translate(res[i][1]);
}

//Sortierung nach der Übersetzung
array_mDimSort(res, 1, true, false);
a.ro(res);