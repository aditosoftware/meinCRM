var modul = a.valueof("$comp.Liste_modul");
var user = tools.getUser(a.valueof("$sys.user"))
if ( a.hasvar("$image.modulPERS") && modul != a.valueof("$image.modulPERS") )
{
    user[tools.PARAMS]["modulPERS"] = modul;
    tools.updateUser(user);
}

modul = a.valueof("$comp.Liste_year");
if ( a.hasvar("$image.modulPERSYear") && modul != a.valueof("$image.modulPERSYear") )
{
    user[tools.PARAMS]["modulPERSYear"] = modul;
    tools.updateUser(user);
}