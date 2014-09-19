import("lib_sql");

var retstr = "";
if (a.valueof("$comp.Label_pers_dec") != '')
{
    retstr = a.sql("select " + concat(new Array("lastname", "firstname")) 
        + " from PERS where PERSID = '" + a.valueof("$comp.Label_pers_dec") + "'");
}
a.rs( retstr );