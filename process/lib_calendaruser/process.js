import("lib_util");
import("lib_sql");
import("lib_user");
 
/*
* Aktualisiert Kalenderuser bzgl. eines einzelnen Users.
*
* @param {String} pUser req der bei den anderen Usern aktualisiert werden soll
* @param {String} pColumn req die betroffene Spalte in Employee
* @param {[]} pCurrentUsers req die User, in denen sich der Benutzer jetzt befindet
*
* @return {void}
*/
function updateCalendarUser(pUser, pColumn, pCurrentUsers)
{
    // Bestehende Eintragungen des Users
    var query = ("select login from employee where " + pColumn + " like '%" + pUser + "%'");
    var existing = a.sql(query, a.SQL_COLUMN);
	
    // Alle neu hinzugefügten: Alle aus newUsers, die nicht in existing sind
    var added = notIn(pCurrentUsers, existing)	
    for (i = 0; i < added.length; i++)
    {								
        _addCalendarUser(added[i], pColumn, pUser);
    }
	
    // Alle entfernten: Alle aus existing, die nicht mehr in newUsers sind
    var removed = notIn(existing, pCurrentUsers)
    for (i = 0; i < removed.length; i++)
    {
        _removeCalendarUser(removed[i], pColumn, pUser);
    }
	
}

/*
* Zu Benutzern hinzufügen.
*
* @param {String} pUser req der Benutzer bei dem hinzugefügt werden soll
* @param {String} pColumn req die betroffene Spalten
* @param {String} pUserToAdd req der hinzuzufügende Benutzer
*
* @return {void}
*/
function _addCalendarUser(pUser, pColumn, pUserToAdd)
{	
    var currentStr = a.sql("select "+ pColumn + " from employee where login = '" + pUser + "'");
	
    var current = currentStr == null || currentStr.length == 0 ? new Array : a.decodeMS(currentStr);	 
    current = current.concat(pUserToAdd);	
    var newoneStr = a.encodeMS(current);

    var columns = [pColumn];
    var types = a.getColumnTypes("employee", columns)
    a.sqlUpdate("employee", columns, types, [newoneStr], "login = '" + pUser + "'");
}

/*
* Aus Benutzern entfernen.
*
* @param {String} pUser req der Benutzer bei dem entfernt werden soll
* @param {String} pColumn req die betroffene Spalten
* @param {String} pUserToRemove req der zu entfernende Benutzer
*
* @return {void}
*/
function _removeCalendarUser(pUser, pColumn, pUserToRemove)
{	
    var currentStr = a.sql("select "+ pColumn + " from employee where login = '" + pUser + "'");
	
    var current = currentStr == null || currentStr.length == 0 ? new Array : a.decodeMS(currentStr);
    current = removeElement(current, pUserToRemove);		
    var newoneStr = a.encodeMS(current);

    var columns = [pColumn];
    var types = a.getColumnTypes("employee", columns)
    a.sqlUpdate("employee", columns, types, [newoneStr], "login = '" + pUser + "'");
}


/*
* Liefert die Benutzer des Systems. Kann verwendet werden, um eine Vorauswahl für die	
* Kalenderbenutzer zu erstellen.
*
* @param {String} pUser req der User, für den die Vorauswahl zusammengestellt werden soll
* @param {String} pDepartment opt Filer Department (= Abteilung aus Themenbaum)
*
* @return {String} der SQL, der die Benutzer liefert
*/
function getPossibleCalendarUserSQL( pUser, pDepartment )
{
    var condition = "where STATUS = 1 and LOGIN != '" + pUser + "'";
    if ( pDepartment != undefined && pDepartment != "" )
    {
        condition += " and ( EMPLOYEE.THEME_ID = '" + pDepartment + "')";
    }
    return ("select LOGIN, " + concat( ["LASTNAME", "FIRSTNAME"] )
        + " from EMPLOYEE join relation on EMPLOYEE.RELATION_ID = RELATION.RELATIONID"
        + " join PERS on RELATION.PERS_ID = PERS.PERSID " + condition + " order by LASTNAME, FIRSTNAME");
}




/*
* gibt ein Liste der möglichen CalenderUser (user,LastnameFirstname)
*
* @param {String} pUser req der Usern für den die Liste 
* @param {String} pModus opt Modus ( read oder write ) 
*
* @return {[]} ( Array ( user, username ) )
*/
function getUserNameList( pUser, pModus )
{
    if ( pModus == undefined )  pModus = "read";	
    var calendar_user = a.sql("select calendar_" + pModus + " from employee e, relation r where e.relation_id = r.relationid and r.status <> 0 and  e.login = '" + pUser + "'");
    var m = new Array( new Array(pUser, getUserName( pUser) ));

    if (calendar_user != "")
    {
        var user = a.decodeMS(calendar_user);
        for (i=0; i < user.length; i++ )
        {
            var username = "";
            if ( user[i] != "" ) username = getUserName(user[i]);
            if ( username != "" ) m.push( new Array(user[i], username ));
  
        }
    }
    //Sortierung nach Vorname
    array_mDimSort(m, 1, true, false);
    return m;
}

/*

* gibt ein Liste der möglichen CalenderUser
* es wird Vorname Nachname angezeigt, genauso wie im Kalender, 
* da im Kalender derzeit nicht auf Nachname Vorname umgestellt werden kann
*
* @param {String} pUser req der Usern für den die Liste 
*
* @return {String} Firstname + Lastname
*/

function getUserName(pUser)
{
    if ( tools.existUsers(pUser))
    {
        var userobj = tools.getUser(pUser);
        return userobj[tools.PARAMS][tools.FIRSTNAME] + " " + userobj[tools.PARAMS][tools.LASTNAME];
    }
    else    return "";
}
