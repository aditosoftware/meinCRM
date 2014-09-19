import("lib_sql");
import("lib_util");

/*
* Klasse zum Arbeiten mit Voreinstellungen 
* 
* @return {object} Konfigurationsobjekt
*/
function Configuration()
{
    // read an option, default to logged in user or "server" for server processes
    this.getOption = function(pName, pUser)
    {		
        var retvalue = "";
        if( a.hasvar("$sys.user") && pUser == undefined )	pUser = a.valueof("$sys.user");
        // sieht nach ob Hauptrolle aus Frame EMPLOYEE im Usermodell vorhanden ist ansonsten erste Rolle von allen
        var userroles = tools.getUser(pUser);
        var mainrole = userroles[tools.PARAMS]["mainrole"];
        if ( mainrole == undefined || mainrole == "") var roles = tools.getRoles( pUser );
        else roles = [mainrole];

        var sql = "select OPTIONVALUE, ROLEID from AOSYS_CONFIGURATION where OPTIONNAME = '" + pName 
        + "' and (ROLEID in ('" + roles.join("','") + "') or ROLEID is null) order by ROLEID";
        var data = a.sql(sql, a.SQL_COMPLETE);			
        if ( data.length > 0 )	retvalue = data[0][0];

        return retvalue;
    }
}

/*
* Liefert die Benutzer für Termin / Aufgaben
*
* @param {[]} pUsersName req Namen der CalenderUser
* @param {[]} pUserTitle req Titel der CalenderUser
* @param {Object} pEntry req Termin / Aufgabe
* @param {Integer} pDepartment opt Keyword
*
* @return {[]} von Benutzern
*/
function getCalendarUser( pUsersName, pUserTitle, pEntry, pDepartment )
{
    var nouser = notIn(a.decodeMS(pEntry[calendar.AFFECTEDUSERS]), pUsersName)
    var result = [];
    var i;
    var userp;

    // Userliste auf die der Angemeldete User lesen /schreiben darf
    if( pDepartment != undefined && pDepartment != "" )
    {
        result = getUsersByDepartment( pDepartment );
    }
    else 
    {
        for (i = 0; i <  pUsersName.length; i++)
        {
            if (a.hasvar("$global.firstLastName") && a.valueofObj("$global.firstLastName"))
            {
                userp = tools.getUser(a.decodeMS(pUsersName[i])[1].split(":")[1])[tools.PARAMS];
                result.push(new Array(pUsersName[i], userp[tools.LASTNAME] + " " + userp[tools.FIRSTNAME]));
            }

            else	result.push(new Array(pUsersName[i], pUserTitle[i]));
        }
    }

    // Alle User die in der Aufgabe / Termin eingetragen sind aber nicht in der Userliste
    for (i = 0; i < nouser.length; i++)
    {
        try
        {
            userp = tools.getUser(a.decodeMS(nouser[i])[1].split(":")[1])[tools.PARAMS];
            if (a.hasvar("$global.firstLastName") && a.valueofObj("$global.firstLastName"))
                result.push(new Array(nouser[i], userp[tools.LASTNAME] + " " + userp[tools.FIRSTNAME]));
            else	result.push(new Array(nouser[i], userp[tools.FIRSTNAME] + " " + userp[tools.LASTNAME]));
        }
        catch(ex)
        {
            userp = a.decodeMS(nouser[i])[1].split(":")[1];
            result.push(new Array(nouser[i], userp));
            log.log(ex);
        }
    }
    return result;
}

/*
* Liefert die Benutzer der angegebenen Rollen des Systems.
*
* @param {String} pKeyfield req das Datenbankfeld das als Key verwendet werden soll
* @param {String} pRole opt die Rolle, für die die Vorauswahl zusammengestellt werden soll
*
* @return {String} der SQL, der die Benutzer liefert
*/
function getPossibleUserSQL(pKeyfield, pRole)
{
    var cond = "";
    var display = ["lastname", "firstname"];
    if (a.hasvar("$global.firstLastName") && a.valueofObj("$global.firstLastName"))	display = ["firstname", "lastname"];
    if ( pRole != undefined ) 
    {
        var users = tools.getUsersWithAnyRole(pRole);
        cond = " and employee.login in ('" + users.join("', '") + "')";
    }
    return ("select " + pKeyfield + ", " + concat( display )
        + " from employee join relation on (employee.relation_id = relation.relationid)"
        + " join pers on (relation.pers_id = pers.persid) "
        + " where relation.status = 1 " + cond
        + " order by lastname, firstname");
}

/*
* Liefert die Logins aller einem bestimmten Department zugehörigen User
*
* @param {String} pDepartment req Das Department, nach dem gesucht werden soll;
* @param {String} pSearch opt suchstring in LASTNAME, FIRSTNAME und Login
* 
* @return {[[]]} [Zweidimensionales Array, das die CalendarID und den Usertitle enthält]
*/
function getUsersByDepartment( pDepartment, pSearch )
{
    var res = [];    
    var sql = "select LOGIN from EMPLOYEE join RELATION on RELATION_ID = RELATIONID join PERS on PERSID = PERS_ID where STATUS = 1 and THEME_ID = '" + pDepartment + "'";
    if ( pSearch != undefined && pSearch != "" )
    {
        sql += " and (UPPER(LASTNAME) like UPPER(?) or UPPER(FIRSTNAME) like UPPER(?) or UPPER(LOGIN) like UPPER(?))";
        sql = [sql, [["%" + pSearch + "%", SQLTYPES.VARCHAR], ["%" + pSearch + "%", SQLTYPES.VARCHAR], ["%" + pSearch + "%", SQLTYPES.VARCHAR]]];       
    }
    var login = a.sql( sql, a.SQL_COLUMN );
    
    var writable = calendar.getFullCalendarUsers(calendar.RIGHT_WRITE);
	
    for( var i = 0; i < writable.length; i++ )
    {
        for( var j = 0; j < login.length; j++ )
        {
            if( a.decodeMS( writable[i][0] )[1].split(":")[1] == login[j] )
            {
                var userp = tools.getUser( writable[i][1] )[tools.PARAMS];
                if ( a.hasvar("$global.firstLastName") && a.valueofObj("$global.firstLastName") )
                    res.push( [ writable[i][0], userp[tools.LASTNAME] + " " + userp[tools.FIRSTNAME] ] );
                else
                    res.push( [ writable[i][0], userp[tools.FIRSTNAME] + " " + userp[tools.LASTNAME] ] );
            }
        }
    }
    return res;
}

/*
* Liefert die Logins der übergeben Rollen
*
* @param {String} pRoles req encoded Rollen;
* 
* @return {Array}  Logins
*/
function getUsersByRoles( pRoles )
{    
    var rolesids = a.decodeMS( pRoles );
    var users = [].concat(tools.getUsersWithAnyRole( rolesids ));
    
    for ( var ui = 0; ui < rolesids.length; ui++ )
    {
        if( rolesids[ui].substr(0, 8) != "PROJECT_" )
        {
            if ( ! hasElement( users, rolesids[ui] ) ) //keine doppelte Anzeige von Usern
            {
                users.push( rolesids[ui] )
            }
        }
    }
    return users;
}
