import("lib_tablecomp");
import("lib_util");

/*
 * Gibt die Einträge für die Tabellenkomponente zurück
 *
 * @param {String} pRecordID req ID des Datensatzes, auf den Rechte vergeben wurden
 * @param {String} pFrameID req das Frame
 * @param {String} isIDProzess opt gibt an, ob es sich um einen ID-Prozess handelt
 *
 * @return {[]} Tabelleninhalt
 */
function getRightsEntry( pRecordID, pFrameID, isIDProzess )
{
    var list = "";

    if (pRecordID != "")
    {
        if ( isIDProzess )
        {
            list = a.sql("select TABLEACCESSID, ROLEID, PRIV_READ, PRIV_EDIT, PRIV_DELETE, PRIV_GRANT from TABLEACCESS "
                + " where TATYPE = 'R' and FRAME_ID = " + pFrameID + " and ROW_ID = '" + pRecordID	+ "'", a.SQL_COMPLETE);		
        }
        else
        {
            var users = tools.getStoredUsers();
            var userindex = [];
            for ( var i = 0; i < users.length; i++ )	userindex[users[i][0]] = users[i][1]; 	
            var roles = tools.getAllRoles([]);
            list = a.sql("select TABLEACCESSID, ROLEID, PRIV_READ, PRIV_EDIT, PRIV_DELETE, PRIV_GRANT from TABLEACCESS "
                + " where TATYPE = 'R' and FRAME_ID = " + pFrameID + " and ROW_ID = '" + pRecordID	+ "'", a.SQL_COMPLETE);
            for ( i = 0; i < list.length; i++ )		
            {   
                if ( list[i][1].substr( 0, 9) == "_____USER" )  list[i][1] = userindex[list[i][1]] + " / " + a.translate("User");                    
                else
                {
                    if( roles[list[i][1]] != undefined ) list[i][1] = roles[list[i][1]][0]; 
                    list[i][1] += " / " + a.translate("Rolle");
                }
            }
        }
    }
    if (list.length == 0) 	list = a.createEmptyTable(6);
    return list;
}

/*
 * Gibt die Rollen und Logins zurück.
 *
 * @return {[]} Liste aller möglichen Rollen
 */
function getRoles4TA()
{	
    var listroles = new Array();
    var listusers = new Array();
    var roles = tools.getAllRoles(["PROJECT"]);
    for ( var role in roles )
    {
        listroles.push([ role, roles[role][0] + " / " + a.translate("Rolle") ] );
    }
    var users = tools.getStoredUsers();
    for ( var i = 0; i < users.length; i++ )  
    {
        if ( !tools.hasRole(users[i][1], "PROJECT_Ressource")
            && tools.getUser(users[i][1])[tools.PARAMS][tools.IS_ENABLED] == "true")
            {
            listusers.push( [users[i][0], users[i][1] + " / " + a.translate("User") ] )
        }
    }
    array_mDimSort(listroles, 1, true)
    array_mDimSort(listusers, 1, true)
    return listroles.concat(listusers);
}

/*
* Legt einen Eintrag in Tableaccess vom Typ 'record'
*
* @return {void}
*/
function insertRight()
{
    var row = a.valueofObj("$local.rowdata");
    for ( var i = 2; i < 6; i++) if ( row[i] == "" ) row[i] = "0";
    var fields = [
    [1, "ROLEID", true],
    [2, "PRIV_READ"],
    [3, "PRIV_EDIT"],
    [4, "PRIV_DELETE"],
    [5, "PRIV_GRANT"]
    ];

    var vkfields = [[a.valueof("$comp.idcolumn"), "ROW_ID"],[a.valueofObj("$image.FrameID"), "FRAME_ID"],["R", "TATYPE"]];
    instable(fields, vkfields, row, "TABLEACCESS", "TABLEACCESSID");
}

/*
* Ändert einen Eintrag in Tableaccess vom Typ 'record'
*
* @return {void}
*/
function updateRight()
{
    var row = a.valueofObj("$local.rowdata");
    var fields = [
    [1, "ROLEID", true],
    [2, "PRIV_READ"],
    [3, "PRIV_EDIT"],
    [4, "PRIV_DELETE"],
    [5, "PRIV_GRANT"]
    ];

    updtable(fields, row, "TABLEACCESS", "TABLEACCESSID");
}

/*
* prüft ob Eintrag in einem Array vorhanden
*
* @param {[]} pArray req Array das nach dem Element durchsucht werden soll
* @param {String} pElement req das gesuchte Element
*
* @return {Boolean} true / false
*/
function hasElement(pArray, pElement)
{
    for (var i = 0; i < pArray.length; i++)
    {
        if ( pArray[i][1] == pElement )
            return true;
    }		
    return false;
}

/*
* Überprüft ob die Einträge in Tableaccess.
* 
* @return {void}
*/
function checkRights()
{
    var ok = false;
    var content = a.getTableData("$comp.tbl_rights", a.ALL );
    var myroles = tools.getRoles(a.valueof("$sys.user"));
    if ( contentall.length == 0 ) ok = true;
    for ( var i = 0; i < contentall.length; i++)
    {
        if ( hasElement(myroles, content[i][1]) )
        {
            ok = true;
            break;
        }
    }
    return ok;
}