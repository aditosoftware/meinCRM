import("lib_attr");

// min und max Attribute überprüfen
var checked = checkAttrCount();

if ( checked )
{
    // der entsprechende User in der System-Datenbank angelegt / ändern
    var login = a.valueof("$comp.login");
    var name = a.sql("select firstname, lastname from pers where persid = '" + a.valueof("$comp.persid") + "'", a.SQL_ROW);
    var email = a.valueof("$comp.calendar_email");
    var aktiv = a.valueof("$comp.active");
    var password = a.valueof("$comp.password");
    var roles = [];

    if ( !tools.existUsers(login) )	//Existiert der User noch nicht in der System-DB wird ein neues User-Objekt erzeugt....
    {
        user = new Array();
        user[tools.TITLE] = login;
        user[tools.PARAMS] = new Array();
        user[tools.PASSWORD] = password;			
        user[tools.ROLES] = a.decodeMS(a.valueof("$comp.list_roles"));
        // Alten User auf inaktiv setzen
        if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT )
        {
            var olduser = a.sql("select LOGIN from EMPLOYEE where EMPLOYEEID = '" + a.valueof("$comp.EMPLOYEEID") + "'");
            if ( tools.existUsers(olduser) )
            {
                olduser = tools.getUser(olduser);
                olduser[tools.PARAMS][tools.IS_ENABLED] = "false";
                tools.updateUser(olduser);
            }             
        }
    }
    else	//... andernfalls wird das User-Objekt aus der System-DB geholt
    {
        user = tools.getUser(login);
        // Interne Rollen 
        var allroles = tools.getAllRoles([]);
        var userroles = tools.getRoles( login );
        for ( var i = 0; i < userroles.length; i++ )	if ( allroles[userroles[i]][1] != "PROJECT")	roles.push( userroles[i] );
    }
    user[tools.ROLES] = roles.concat(a.decodeMS(a.valueof("$comp.list_roles"))); 
    user[tools.PARAMS][tools.FIRSTNAME] = name[0]; 
    user[tools.PARAMS][tools.LASTNAME] = name[1];
    user[tools.PARAMS][tools.EMAIL] = email;
    user[tools.PARAMS][tools.IS_ENABLED] = aktiv;
    user[tools.PARAMS]["mainrole"] = a.valueof("$comp.cmb_mainrole");
    if ( !tools.existUsers(login) )	tools.insertUser(user);  // SystemUser anlegen
    else    tools.updateUser(user); // SystemUser ändern    
}
a.rs(checked)
