var is_enabled = "true";
var login = a.valueof("$comp.login");

if ( (a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT || a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW) && login != "")
{
    try
    {
        var user = tools.getUser(login);
        is_enabled = user[tools.PARAMS][tools.IS_ENABLED];
    }
    catch(err){}
}
a.rs(is_enabled);