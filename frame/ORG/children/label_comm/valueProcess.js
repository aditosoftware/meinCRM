import("lib_sql");

if (a.valueof("$comp.Label_pers_dec") != "")
{
    a.rs(a.sql("select " + concat(new Array("firstname", "lastname")) 
            + " from PERS where PERSID = '" + a.valueof("$comp.Label_pers_dec") + "'"));
}
else
{
    a.rs("");
}