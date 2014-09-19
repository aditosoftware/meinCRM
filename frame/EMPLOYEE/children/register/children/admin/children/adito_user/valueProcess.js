var title = "";
var login = a.valueof("$comp.login");

if ( (a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT || a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW) && login != "")
{
    var user = tools.getUser(login);
    title = user[tools.TITLE];
}
a.rs(title);