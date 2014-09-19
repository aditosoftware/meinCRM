import("lib_user");

var list = []; //[["all", "alle Servicemitarbeiter"]]
var data = a.sql(getPossibleUserSQL("LOGIN", ["PROJECT_Service"]), a.SQL_COMPLETE);
for (i=0; i<data.length; i++)
{
    list.push(data[i])
}
a.ro(list)