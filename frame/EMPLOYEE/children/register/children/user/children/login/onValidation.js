if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW ||  a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT )
{
    var login_new = a.valueof("$comp.login");
    var login = a.sql("select login from employee where login = '" + login_new + "'");

    if(login_new.toUpperCase() == login.toUpperCase())
    {
        a.rs(a.translate("Der login ist bereits vergeben! Bitte verwenden sie einen anderen."));
    }
}