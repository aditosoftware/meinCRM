var roles = tools.getAllRoles([]);
var list = new Array();
var login = a.valueof("$comp.login");
if (login != '')
{
    var userroles = tools.getRoles(login);

    for ( var i = 0; i < userroles.length; i++ )
    {
        if ( roles[userroles[i]][1] == "PROJECT")	list.push( userroles[i] );
    }
    a.returnstatic( a.encodeMS(list) );
}