import("lib_user");

if ( tools.hasRole(a.valueof("$sys.user"), "PROJECT_Fachadministrator") )
    a.rq(getPossibleUserSQL("LOGIN"));
else
    a.rq("select LOGIN from EMPLOYEE where login = '" + a.valueof("$sys.user") + "'");