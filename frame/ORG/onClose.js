var modul = a.valueof("$comp.Liste_modul");
var user = tools.getUser(a.valueof("$sys.user"))
if ( a.hasvar("$image.modulORG") && modul != a.valueof("$image.modulORG") )
{
    user[tools.PARAMS]["modulORG"] = modul;
    tools.updateUser(user);
}

modul = a.valueof("$comp.Liste_year");
if ( a.hasvar("$image.modulORGYear") && modul != a.valueof("$image.modulORGYear") )
{
    user[tools.PARAMS]["modulORGYear"] = modul;
    tools.updateUser(user);
}