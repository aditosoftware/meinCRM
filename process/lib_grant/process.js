import("lib_frame");
import("lib_keyword");

/*
* Initialisierung der Rechte.
*
* @return {void}
*/
function initFrame()
{
    var fd = new FrameData().getData("name", a.valueof("$sys.currentimagename"), ["id", "idcolumn", "table"]);
    frameinfo = new Object();
    frameinfo.Id = fd[0][0]; 
    frameinfo.IDColumn = fd[0][1];
    frameinfo.Table = fd[0][2];
    frameinfo.RowID = "";
    frameinfo.Grants = getGrants( frameinfo.Id, frameinfo.RowID );
    a.imagevar("$image.Frame", frameinfo);
    a.imagevar("$image.FrameID",fd[0][0]);
}

/*
* Überprüft, ob der angemeldete User ein Berechtigung auf ein Objekt besitzt.
* 
* @param {String} pMode req Recht, das überprüft werden soll (mögliche Werte: 'read', 'insert', 'edit', 'delete', 'grant')
* @param {String} pRowID opt ID des Objekts für das geprüft wird, ob Rechte vorhanden sind
*
* @return {boolean}  ( true, false )
*/

function isgranted( pMode, pRowID ) 
{
    if ( !a.hasvar("$global.useRights") || !a.valueofObj("$global.useRights") ) return true;
    var frame = a.valueofObj("$image.Frame");
    if ( frame.RowID != pRowID ) frame.Grants = getGrants( frame.Id, pRowID );
    switch(pMode)
    {
        case "read":
            return frame.Grants[0];		
            break;
        case "insert":
            return frame.Grants[1];		
            break;
        case "edit":
            return frame.Grants[2];		
            break;
        case "delete":
            return frame.Grants[3];		
            break;
        case "grant":
            return frame.Grants[4];		
            break;
        default:
            return false;		
            break;
    }
}

/*
* Überprüft, ob der angemeldete/übergebene User eine Berechtigung auf ein Objekt besitzt.
* 
* @param {String} pFrameName req Name des Frames
* @param {String} pCondition req Wherebedingung des Frame
* @param {String} pIDColumn opt Abweichende IDColumn
* @param {String} pMode opt Recht, das überprüft werden soll (mögliche Werte: 'read', 'insert', 'edit', 'delete')
* @param {String} pUser opt Anderer als der angemeldete User
* 
* @return {String} erweiterte Wherebedingung
*/

function getGrantCondition( pFrameName, pCondition, pIDColumn, pMode, pUser)
{
    var userroles = "";
    var salesarea = "";
    var useRights = true;
    var restrictive = false;
    if(pUser == undefined)
    {
        pUser = a.valueof("$sys.user");
        userroles = a.valueofObj("$global.userroles");
        if(a.hasvar("$global.user_salesarea")){
            salesarea = a.valueofObj("$global.user_salesarea");
        }
        useRights = a.valueof("$global.useRights");
        restrictive = a.valueofObj("$global.restrictive");
    }
    else
    {
        userroles = tools.getRoles(pUser);
        userroles = userroles.concat(a.sql("select Name from ASYS_USER where TITLE = '" + pUser + "'"));
        var relid = a.sql("select RELATION_ID from EMPLOYEE join RELATION on RELATION_ID = RELATIONID where LOGIN = '" + pUser + "'");
        salesarea = a.sql("select KEYVALUE from ATTR join ATTRLINK on ATTRID = ATTRLINK.ATTR_ID join KEYWORD on VALUE_ID = KEYWORDID "
            + "join EMPLOYEE on EMPLOYEEID = ROW_ID where ATTRNAME = 'Gebiet' and EMPLOYEE.RELATION_ID = '" + relid + "' order by KEYSORT", a.SQL_COLUMN);
    }
    if ( pMode == undefined ) pMode = "READ";
    if ( !useRights || tools.hasRole( pUser, "INTERNAL_DESIGNER" ) ) return pCondition;
    var fd = new FrameData().getData("name", pFrameName, ["id", "table", "idcolumn"]);

    if ( pIDColumn == "" || pIDColumn == undefined)  pIDColumn = fd[0][1] + "." + fd[0][2];

    var condition = "( exists (select ROW_ID from TABLEACCESS where " + pIDColumn + " = ROW_ID and TATYPE = 'R' and FRAME_ID = " + fd[0][0]
                  + " and  PRIV_" + pMode + " = '1' and ROLEID in ('" + userroles.join("','") + "'))";
    if ( !restrictive )	condition	+= " or " 
        + " not exists (select ROW_ID from TABLEACCESS where " + pIDColumn + " = ROW_ID and TATYPE = 'R' and FRAME_ID = " + fd[0][0] + ")";
    condition	+= " )";

    // wenn SalesArea eingetragen
    if (salesarea != "") 
    {
        if (salesarea.length > 0)
        {
            var orgcondition = " SALESAREA in (" + salesarea.join(", ") + ")";
            switch(pFrameName)
            {
                case 'ORG':
                    condition += " and " + orgcondition;
                    break;
                case 'PERS':
                    condition += " and RELATION.ORG_ID in (select ORGID from ORG where " + orgcondition + ")";
                    break;
                case 'HISTORY':
                    condition += " and HISTORYID in (select HISTORY_ID from HISTORYLINK join RELATION on OBJECT_ID = 1 and ROW_ID = RELATIONID join ORG on ORG_ID = ORGID and " + orgcondition + ")";
                    break;
                case 'OFFER':
                case 'SALESORDER':
                case 'SALESPROJECT':
                case 'CONTRACT':
                case 'MACHINE':
                case 'SERVICEORDER':
                case 'COMPLAINT':
                    condition += " and " + pFrameName + ".RELATION_ID in (select RELATIONID from RELATION join ORG on ORG_ID = ORGID and " + orgcondition + ")";
                    break;
            }
        }
    }
    if ( pCondition != "" ) condition = "(" + pCondition + ") and ( " + condition + ")";
    return condition;
}


/*
* Holt die Rechte für Neuanlage, Ändern, Löschen und Rechtsetzen
* 
* @param {String} pFrame req der FrameID 
* @param {String} pRowID req der ID des Records 
* 
* @return {[]} die Framerechte Neuanlage, Ändern, Löschen und Rechtsetzen als Array
*/
function getGrants( pFrame, pRowID )
{
    var sqlstr = " select priv_read, priv_insert, priv_edit, priv_delete, priv_grant from tableaccess "
    + " where frame_id = " + pFrame + " and ( TATYPE = 'F' or row_id = '" + pRowID + "')";
			
    // Wenn keine Aussage über den Frame gefunden wurde, darf jeder alles
    if ( a.sql(sqlstr, a.SQL_COMPLETE).length > 0 )
    {
        // Rechte holen für das angegebene Objekt
        var user_grants = a.sql( sqlstr + " and ROLEID in ('" + a.valueofObj("$global.userroles").join("','") + "')", a.SQL_COMPLETE );
        // gesamtrechte über alle rollen hinweg ermitteln
        var grants = new Array(false, false, false, false, false );
        for (var i=0; i < user_grants.length; i++)
            for (var y=0; y < grants.length; y++)
                grants[y] = grants[y] || ( user_grants[i][y] == "1" ? true : false );
        return grants;
    }
    else return new Array(true, true, true, true, true);
}

/*
* setzt die Rechte für Neuanlage, Ändern, Löschen und Rechtsetzen
*
* @param {String} pRowID req der ID des Records 
* @param {String} pFrameID req der FrameID 
* 
* @return {void}
*/
function setGrants( pRowID, pFrameID  )
{
    if ( a.hasvar("$global.restrictive") && a.valueofObj("$global.restrictive") )
    {
        var user = a.valueof("$sys.user");
        var actdate = a.valueof("$sys.date");
        if ( pRowID == undefined )  pRowID = a.valueof("$comp.idcolumn");
        if ( pFrameID == undefined )  pFrameID = a.valueof("$image.FrameID");
		
        var tafields = ["TABLEACCESSID","TATYPE","ROLEID","FRAME_ID","ROW_ID","PRIV_INSERT","PRIV_READ","PRIV_EDIT","PRIV_DELETE","PRIV_GRANT","DATE_NEW","USER_NEW"];
        var tatypes = a.getColumnTypes("TABLEACCESS", tafields);
        var insobj = [];
        roleid = a.valueof("$global.userrole");
        insobj.push(["TABLEACCESS", tafields, tatypes, [a.getNewUUID(), "R", roleid, pFrameID, pRowID, "1", "1", "1", "1", "1", actdate, user]]);
        roleid = a.valueof("$global.mandatorrole");
        if ( roleid != "" )
            insobj.push(["TABLEACCESS", tafields, tatypes, [a.getNewUUID(), "R", roleid, pFrameID, pRowID, "1", "1", "1", "1", "1", actdate, user]]);
        a.sqlInsert(insobj);
    }
}

/*
* setzt die Rechte für Neuanlage, Ändern, Löschen und Rechtsetzen
* 
* @return {void}
*/
function setTblRights()
{
    if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW && a.valueofObj("$global.restrictive") ) 
    {
        var type = new Object();
        type["USER"] = a.translate("User");
        type["PROJECT"] = a.translate("Rolle");
        var rights = [[a.valueof("$global.userrole"), 1, 1, 1, 1]];
        var roleid = a.valueof("$global.mandatorrole");
        if ( roleid != "" ) rights.push([roleid, 1, 1, 1, 1]);	
        var rviewvalue = [a.translate("Nein"), a.translate("Ja")];
        var roles = tools.getAllRoles([]);
        for ( var i = 0; i < rights.length; i++)
        {
            if ( rights[i][0] != "" )
            {
                var uid = a.addTableRow("$comp.tbl_rights");
                a.updateTableCell("$comp.tbl_rights", uid, 1, rights[i][0], roles[rights[i][0]][0] + " / " + type[roles[rights[i][0]][1]]);
                for ( z = 1; z < 5; z++ )	a.updateTableCell("$comp.tbl_rights", uid, z+1, rights[i][z], rviewvalue[rights[i][z]]);
            }
        }
    }
}