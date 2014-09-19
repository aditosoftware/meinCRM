import("lib_log");
import("lib_keyword");
import("lib_user");
import("lib_calendar");

/*
 * lädt die Baumkomponente für Themenbaum und Historie
 * 
 * @param {int} pThemenTyp req, wählt den KIND aus der THEME Tabelle aus 
 * @param {Boolean} pActive req , true falls inaktive erscheinen sollten * 
 * 
 * @return {[]}
 */
function loadTree( pThemenTyp, pActive )
{
    var nodeid = a.valueof("$local.nodeid");
    var iconskey = new Object();
    if ( a.hasvar("$image.ThemeIcons") )  iconskey = a.valueofObj("$image.ThemeIcons");
    else    if( !pActive )
    { 
        var icons = a.sql("select ID, DESCRIPTION from ASYS_ICONS where ICON_TYPE = 'Themenbaum'", a.SQL_COMPLETE);
        for ( var i = 0; i < icons.length; i++ )	iconskey[icons[i][1]] = icons[i][0];
        a.imagevar("$image.ThemeIcons", iconskey);
    }
    if ( !a.hasvar("$image.treeopen") ) a.imagevar("$image.treeopen", false)
    var result = [];
    var condition =  " KIND = " + pThemenTyp;
    if (nodeid == null) condition +=  " and THEME_ID is null"; else condition += " and THEME_ID = '" + nodeid + "'";
    if ( pActive ) condition += " and ISACTIVE = 'true'";
    if ( a.hasvar("$image.SearchThemeCondition") )  condition += a.valueof("$image.SearchThemeCondition");
    var theme = a.sql("select THEMEID, THEME, DESCRIPTION, ISACTIVE, REMINDER, "
        + " (select count(*) from THEME UT where UT.THEME_ID = THEME.THEMEID ) "
        + " from THEME where " + condition + " order by THEMESORT", a.SQL_COMPLETE);

    for (i = 0; i < theme.length; i++)
    {
        if ( theme[i][5] > 0 )
        {
            isleaf = false;
            icon = theme[i][3] == "true" ? "Knoten aktiv" : "Knoten inaktiv";
        }
        else
        {
            isleaf = nodeid == null ? false : true;
            icon = theme[i][3] == "true" ? "Element aktiv" : "Element inaktiv";
        } 
        var wv = theme[i][4] == "true" ? " (WV)" : "";    
        icon  = iconskey[icon] != undefined ? iconskey[icon] : null;
        //            nodeID 	   displayValue 		  tooltip	            icon  isLeaf  parentID autoOpen
        result.push([ theme[i][0],  (pActive ? a.translate(theme[i][1]) : theme[i][1]) + wv, 
            pActive ? a.translate(theme[i][2]) : theme[i][2], icon, isleaf, nodeid,  a.valueof("$image.treeopen") ]);
    }
    return result;
}

/*
 * liefert die Condition für Suchbegriff
 * 
 * @param {String} pKind  req. - Thema Id
 * @param {String} pSearch  req. - Thema Id
 * @param {Boolean} pActive opt. 
 * 
 * @return {String} condition
 */
function getSearchThemeCondition( pKind, pSearch, pActive )
{
    var condition = "";
    if( pSearch != undefined && pSearch != "" )
    {
        if ( pActive ) condition += " and ISACTIVE = 'true' ";

        var searchNodes = a.sql(["select THEMEID from THEME where UPPER(" + "THEME" + ") like UPPER(?)" 
            + " and KIND = " + pKind + condition, [["%" + pSearch + "%", SQLTYPES.VARCHAR]]], a.SQL_COLUMN);
   
        var NodesIDs = [];
        var childNodesIDs = [];
    
        //Ermitteln von Eltern- und Kundknoten
        for(var i = 0; i < searchNodes.length; i++)
        {
            NodesIDs = getAllParents(searchNodes[i], NodesIDs);
            childNodesIDs = getAllChilds(searchNodes[i], childNodesIDs);
        } 
    
        //Hinzufuegen der Knoten zu einem gemeinsamen Array
        NodesIDs = NodesIDs.concat(childNodesIDs); 
        if ( NodesIDs.length > 0 )  
        {
            condition = " and THEMEID in ('" + NodesIDs.join("', '") + "')";
            a.imagevar("$image.treeopen", true);
        }
            
        else 
        {
            condition = " and 1 = 2 "
            a.setFocus("$comp.edt_Suche");
        }
    }
    else    a.imagevar("$image.treeopen", false);
    return condition;
}

/*
 * liefert die Condition für Suchbegriff
 * 
 * @param {String} pSearch  req. - Thema Id
 * 
 * @return {String} condition
 */
function getSearchDepartmentCondition( pSearch )
{
    var condition = "";
    if( pSearch != undefined && pSearch != "" )
    {
        var NodesIDs = [];
        var childNodesIDs = [];       
        var sqlstr = "select THEME_ID from EMPLOYEE join RELATION on RELATION_ID = RELATIONID join PERS on PERSID = PERS_ID "
        + "where UPPER(LASTNAME) like UPPER(?) or UPPER(FIRSTNAME) like UPPER(?) or UPPER(LOGIN) like UPPER(?)"   ;
        var searchNodes = a.sql([sqlstr, [["%" + pSearch + "%", SQLTYPES.VARCHAR], ["%" + pSearch + "%", SQLTYPES.VARCHAR], 
            ["%" + pSearch + "%", SQLTYPES.VARCHAR]]], a.SQL_COLUMN);  
    
        //Ermitteln von Eltern- und Kundknoten
        for(var i = 0; i < searchNodes.length; i++)   NodesIDs = getAllParents(searchNodes[i], NodesIDs);
    
        //Hinzufuegen der Knoten zu einem gemeinsamen Array
        NodesIDs = NodesIDs.concat(childNodesIDs); 
        if ( NodesIDs.length > 0 ) 
        {
            condition = " and THEMEID in ('" + NodesIDs.join("', '") + "')";
            a.imagevar("$image.treeopen", true);
        }
        else 
        {
            condition = " and 1 = 2 ";
            a.setFocus("$comp.edt_Suche");
        }
    }
    else    a.imagevar("$image.treeopen", false);
    return condition;
}

/*
 * lädt die Baumkomponente für Aufgaben
 * 
 * @param {Boolean} pActive req , true falls inaktive erscheinen sollten
 * @param {String} pSearch opt , Suchstring
 * @param {Boolean} pWithResource opt 
 * 
 * @return {[]}
 */
function loadDepartment(pActive, pSearch, pWithResource)
{
    var result = [];
    var iconskey = [];
    var icons = a.sql("select ID, DESCRIPTION from ASYS_ICONS where ICON_TYPE = 'Themenbaum'", a.SQL_COMPLETE);
    for ( var i = 0; i < icons.length; i++ )	iconskey[icons[i][1]] = icons[i][0];
    var nodeid  = a.valueof("$local.nodeid");
    var condition = ( pWithResource != undefined && pWithResource ) ? " KIND in (2, 4) " : " KIND = 2 ";
    if (nodeid == null) condition += " and THEME_ID is null"; else condition += " and THEME_ID = '" + a.decodeMS(nodeid)[1] + "'";
    if ( pActive ) condition += " and ISACTIVE = 'true'";
    if ( a.hasvar("$image.SearchThemeCondition") )  condition += a.valueof("$image.SearchThemeCondition");
    if ( !a.hasvar("$image.treeopen") )        a.imagevar("$image.treeopen", true);
    
    var theme = a.sql("select THEMEID, THEME, KIND, (select count(*) from THEME UT where UT.THEME_ID = THEME.THEMEID) from THEME where " + condition + " order by THEMESORT", a.SQL_COMPLETE);
    if ( a.decodeMS(nodeid)[0] == "R" )     bild = a.sql("select THEME from THEME where THEMEID = '" + a.decodeMS(nodeid)[1] + "'"); 

    //  Abteilungen / Recource 
    for (i = 0; i < theme.length; i++)
    {
        var isleaf = false;
        if ( theme[i][2] == "2" ) // Abteilung
        {
            type = "O";
            bild = "Abteilungen";
        }
        else    // Ressource
        {
            type = "R";
            if ( theme[i][3] > 0 )      bild = theme[i][1];                 
            else    // Ressource-Usermodell
            {
                if ( tools.existUsers( theme[i][1] ) )      isleaf = true;
                else type = "";  // Wenn kein User dann kein Eintrag
            }
        }
        if ( type != "")  // Kein Eintrag da kein UserModell
        {
            result.push([ a.encodeMS([type , theme[i][0]]), a.translate(theme[i][1]) , a.translate(theme[i][0]), 
                iconskey[bild] != undefined ? iconskey[bild] : null, isleaf, nodeid, a.valueof("$image.treeopen") ]);   
        }
    }
    //  Mitarbeiter / Employee
    if (nodeid != null && a.decodeMS(nodeid)[0] == "O")
    {   
        bild = iconskey["Employee"] != undefined ? iconskey["Employee"] : null;        
        employees = getUsersByDepartment( a.decodeMS(nodeid)[1], pSearch );
        for( j = 0; j < employees.length; j++)
        {
            result.push([ a.encodeMS(["U" ,employees[j][0], employees[j][1]]), employees[j][1], "", bild, true, nodeid ]) 
        }
    }
    return result;
}

/*
 * prüft ein Knoten mit gleichen Namen unter den Ziel Knoten bereits existiert.
 * 
 * @param {String} pParentId req. - ID des Ziel Knotens
 * @param {String} pBezeichnung req. - Die Bezeichnung des einzufügenden Knotens.
 * @param {String} pThemeID opt. - ID des Thema. 
 * @param {String} pKind opt. - Art des Themenbaums.
 * 
 * @return {Boolean} true falls bereits existiert sonst false.
 */
function isExists(pParentId, pBezeichnung, pThemeID, pKind )
{
    var sqlStatment = "select count(*) from THEME where THEME = '" + pBezeichnung + "' and THEME_ID";
    if(pParentId == "" )    sqlStatment += " is null ";
    else    sqlStatment += " = '" +  pParentId + "'";
    if (pKind != undefined )  sqlStatment += " and KIND = " + pKind;
    if ( pThemeID != undefined ) sqlStatment += " and THEMEID != '" +  pThemeID + "'";
    return ( a.sql(sqlStatment) > 0 ); 
}

/*
 * liefert alle untergeordnete Themen IDs des als parameter übergenenes Thema, inkl. die übergebenes Thema. 
 * 
 * @param {String} pNodeId  req. - Thema Id
 * @param {String[]} pChildSNodeId req. - untergeordnete Themen IDs
 * 
 * @return {void}
 */
function getAllChilds(pNodeId, pChildSNodeId)
{
    if ( pNodeId != "")
    {
        pChildSNodeId.push(pNodeId);
        var childNodes = a.sql("select THEMEID from THEME where THEME_ID = '" + pNodeId + "'", a.SQL_COLUMN);
        if(childNodes.length > 0)
        {
            for(var i=0; i<childNodes.length; i++)
                getAllChilds(childNodes[i], pChildSNodeId);
        }
    }
    return pChildSNodeId; 
}

/*
 * liefert alle übergeordnete Themen IDs des als parameter übergenenes Thema, inkl. die übergebenes Thema. 
 * 
 * @param {String} pNodeId  req. - Thema Id
 * @param {String[]} pParentsNodeId req. - übergeordnete Themen IDs
 * 
 * @return {void}
 */
function getAllParents(pNodeId, pParentsNodeId)
{
    if ( pNodeId != "")
    {
        pParentsNodeId.push(pNodeId);
        var parentsNodes = a.sql("select THEME_ID from THEME where THEMEID = '" + pNodeId + "'", a.SQL_COLUMN);
        if(parentsNodes.length > 0)
        {
            for(var i=0; i<parentsNodes.length; i++)
                getAllParents(parentsNodes[i], pParentsNodeId);
        }
    }
    return 	pParentsNodeId; 
}

/*
 * prüft ob eines von übergebene Themen in einem Kontakt(Historie) verwendet wird.
 * 
 * @param {String[]} pChildIDs req. - Themen IDs
 * 
 * @return {Boolean} true falls ein oder mehrere Themen in Verwendung, anderfalls false
 */
function isInUsage(pChildIDs)
{
    var exists = a.sql("select count(*) from HISTORY_THEME where THEME_ID in ('" + pChildIDs.join("','") + "')");
    return parseInt(exists)>0;
}

function deleteChilds(pChildIDs)
{
    a.sqlDelete("THEME", "THEME.THEMEID in('" + pChildIDs.join("','") + "')");
}

/*
 * Trägt neues Thema ein
 * 
 * @return {void}
 */
function insertNode()
{
    // Nichts ausgeschnitten
    if (!a.hasvar("$image.tmpTreeNodeID") && a.valueof("$image.tmpTreeNodeID") == "" )	return;	
    var destinationNodeId = a.valueof("$comp.treeThemen.context");
    //ist ein zweig zum Einfügen markiert?
    if (destinationNodeId == undefined || destinationNodeId == "")
        return;
				
    var childNodeId = a.valueof("$image.tmpTreeNodeID");
    var childTheme = a.sql("select THEME from THEME where THEMEID = '" + childNodeId + "'");
    //prüfe , ob ein Thema mit gleichen Namen existiert bereits!	
    if(isExists(destinationNodeId, childTheme))
    {
        a.showMessage(a.translate("Ein Thema mit gleichen Namen existiert bereits."));
        return;
    }
    var spalten = ["THEME_ID", "USER_EDIT", "DATE_EDIT"];
    var typen = a.getColumnTypes("AO_DATEN", "THEME", spalten);
    var werte = [destinationNodeId, a.valueof("$sys.user"), date.date()];
    a.sqlUpdate("THEME", spalten, typen, werte, " THEME.THEMEID = '" + childNodeId + "'");
    a.imagevar("$image.tmpTreeNodeID", "");  //Wieder auf leer setzen
    a.refresh("$comp.treeThemen")
}

/*
 * Update der Image-Variablen
 * 
 * @param {String} pNodeId req ID des Knotens
 * 
 * @return {void}
 */
function updateTreeView(pNodeId)
{
    a.imagevar("$image.refreshNodeid" , pNodeId);
}

/*
 * holt Themen.
 * 
 * @param {String} pHistID req
 * 
 * @return {void}
 */
function getThemes( pHistID )
{
    if (pHistID != "")
    {
        //Nun können die Themen der Historie geladen werden
        var historyThemen = a.sql("select HISTORY_THEMEID, THEME_ID, THEME from HISTORY_THEME where HISTORY_ID = '" + pHistID + "'", a.SQL_COMPLETE);
		
        for (var i = 0; i < historyThemen.length; i++)
        {
            historyThemen[i][1] = getThema( historyThemen[i][1]);
        }	
    }
    return historyThemen;
}

/*
 * holt Themen
 * 
 * @param {String} pID req
 * 
 * @return {void}
 */
function getThema( pID )
{
    thema = initThemenObject();
    var bez = [];
    var id = pID; 
    do
    {
        if  ( thema[id] != undefined && id != thema[id].parent )
        {
            bez.push( a.translate(thema[id].bezeichnung) );
            id = thema[id].parent;
        }
        else id = "";
    } while( id != "" );
    bez.reverse();	
    return bez.join(" > ");
}

/*
 * initialisiert die globale Variable global.objThemen. Diese enthält alle Themendatensätze als asoziative Arrays,
 * wo die key is die Themen ID und Value ist der Datensatz.
 * * 
 * @return {void}
 */
function initThemenObject()
{
    var objThemen = new Object(); 

    if ( a.hasvar( "$global.Themen" ) &&  a.valueofObj("$global.Themen") != "" ) 	objThemen = a.valueofObj("$global.Themen");
    else
    {
        //in globales Objekt auslagern!!!!!!!!!!!!!!!!!!!!!
        var themenData = a.sql("select THEMEID, THEME_ID, THEME, ISACTIVE from THEME", a.SQL_COMPLETE);
			
        //Themen durchgehen und ein Objekt aufbauen mit Index der THEMENID und der Bezeichnung
        for (var i = 0; i < themenData.length; i++)
        {
            //wenn noch nicht vorhanden!?
            if (objThemen[themenData[i][0]] == undefined)
                objThemen[themenData[i][0]] = {
                    "id":themenData[i][0], 
                    "parent":themenData[i][1], 
                    "bezeichnung":themenData[i][2], 
                    "activ":themenData[i][3]
                };
        }
        a.globalvar("$global.Themen", objThemen);
    }
    return objThemen;
}

/*
 * Verschiebt Baum-Elemente
 *
 * @param {String }pTable req Table
 * @param {String} pCountField req Feldname z.B. 'SORT'
 * @param {String} pDirection req 'up' oder 'down'
 * @param {String} pNodeID req
 * @param {String} pNode_ID req 
 * @param {Integer} pKind req 
 *
 * @return {void}
 */
function moveRowTree(pTable, pCountField, pDirection, pNodeID, pNode_ID, pKind)
{
    var condition = " and KIND = " + pKind;
    if ( pNode_ID == null || pNode_ID == "") condition = " and " + pTable + "_ID is null";
    else condition = " and " + pTable + "_ID = '" + pNode_ID + "'";
    sortRowTree(pTable, pCountField, pNode_ID, pKind);
    var col = [pCountField];
    var nextval;
    var typ = a.getColumnTypes( pTable, col);
    var oldval = a.sql("select " + pCountField + " from " + pTable + " where " + pTable + "ID = '" + pNodeID + "'");
	
    if (pDirection == "up")
    {
        nextval = a.sql("select max(" + pCountField + ") from " + pTable 
            + " where " + pCountField + " < " + oldval + condition);
    }
    else
    {
        nextval = a.sql("select min(" + pCountField + ") from " + pTable 
            + " where " + pCountField + " > " + oldval + condition);
    }
    if ( nextval == "" )  nextval = 0;
    var nextID = a.sql("select " + pTable + "ID from " + pTable + " where " + pCountField + " = " + nextval + condition); 
    a.sqlUpdate(pTable, col, typ, [oldval], pTable + "ID = '" + nextID + "'")
    a.sqlUpdate(pTable, col, typ, [nextval], pTable + "ID = '" + pNodeID + "'")
}

/*
 * Sortiert Baum neu
 *
 * @param {String} pTable req Table
 * @param {String} pCountField req Feldname z.B. 'SORT'
 * @param {String} pNode_ID req
 * @param {Integer} pKind req 
 *
 * @return {void}
 */
function sortRowTree(pTable, pCountField, pNode_ID, pKind)
{
    if ( pKind == "")  return;
    var condsort = " where KIND = " + pKind;
    if ( pNode_ID == null || pNode_ID == "")  condsort += " and " + pTable + "_ID is null";
    else condsort += " and " + pTable + "_ID = '" + pNode_ID + "'";

    if ( a.sql("select count(*) from " + pTable + condsort + " group by " + pCountField + " having count(*) > 1 ") > 0 )
    {
        var col = [pCountField];
        var typ = a.getColumnTypes( pTable, col);
        var ids = a.sql("select " + pTable + "ID from " + pTable + condsort + " order by " + pCountField, a.SQL_COLUMN);
        for ( var i = 0; i < ids.length; i++ )	a.sqlUpdate(pTable, col, typ, [i+1], pTable + "ID = '" + ids[i] + "'")
    }
}

/*
 * aktiviert up/Down-Buttons
 *
 * @param {String} pTable req Table
 * @param {String} pTreeComp req Name der BaumComponente
 * @param {String} pSortfield req Feldname z.B. 'SORT'
 * @param {String} pDirection req 'up' oder 'down'
 * @param {String} pNode_ID req
 * @param {Integer} pKind req 
 *
 * @return {Boolean} true wenn aktiv
 */
function moveActiveTree(pTable, pTreeComp, pSortfield, pDirection, pNode_ID, pKind)
{
    if ( pKind == "")  return false;
    var oldval = "min";
    var	minmax = "min";
    var id = a.valueof(pTreeComp);
    var condmove = " where KIND = " + pKind;
	
    if ( pNode_ID == "" || pNode_ID == null ) condmove += " and " + pTable + "_ID is null";
    else condmove += " and " + pTable + "_ID = '" + pNode_ID + "'";

    oldval = a.sql("select " + pSortfield + " from " + pTable + " where " + pTable + "ID = '" + id + "'"); 
    if (pDirection == "down")	minmax = "max";
    minmax = a.sql("select " + minmax + "(" + pSortfield + ") from " + pTable + condmove);
    return(oldval != minmax || oldval == "" || minmax == "" )
}

/*
 * ThemenStruktur holen
 *
 * @param {String} pKind req Type des Themenbaums 
 *
 * @return {StringArray} ThemenStruktur
 */
function getThemeStruktur( pKind )
{
    var result = [];

    __getThemeEintrag ( pKind, "", result, 0 );
    return result;
    
    function    __getThemeEintrag( pKind, pThemeID, pResult, pLevel )
    {
        var condition = " THEME_ID = '" + pThemeID + "'"
        if ( pThemeID == "") condition = " THEME_ID is null"

        // Nur Themen vom Typ Abteilung (= 2)
        var theme = a.sql("select THEMEID, THEME from THEME where ISACTIVE = 'true' and " + condition 
            + " and KIND = " + pKind  + " order by THEMESORT", a.SQL_COMPLETE);
        for ( var i = 0; i < theme.length; i++)
        {
            var distance = "";
            for ( var z = 0; z < pLevel; z++ ) distance += " - "
            pResult.push( [ theme[i][0], distance +  theme[i][1] ] );
            __getThemeEintrag( pKind, theme[i][0], pResult, pLevel + 1 );
        }
    }
}

/*
 * Füllt die Editfelder des Themas.
 *
 * @param {String} pThemeID req ID des Themas
 *
 * @return void
 */
function setThemeFields(pThemeID)
{
    if( !a.hasvar("$image.ThemeID") || a.valueof("$image.ThemeID") != pThemeID  )
    {
        if( a.hasvar("$image.isChanged") && a.valueofObj("$image.isChanged") == 1)
        {
            if(a.askQuestion(a.translate("Änderungen speichern?"), a.QUESTION_YESNO, "") == "true")
                saveTheme(a.valueof("image.ThemeID"));
        }
        var fields = ["THEME", "DESCRIPTION", "ISACTIVE", "REMINDER", "REMINDER_GROUP", "REMINDER_SILENT", "REMINDER_SUBJECT", "REMINDER_ROLES", "THEME_ID"];
        var values = ["", "", "", "", "", "", "", "" ];
        if (pThemeID != "")   values = a.sql("select " + fields.join(", ") + " from THEME where THEMEID = '" + pThemeID + "'", a.SQL_ROW);
        a.imagevar("$image.ThemeID",  pThemeID);
        a.imagevar("$image.isChanged", -1);
        for ( var i = 0; i < fields.length-1; i++ )     a.setValue("$comp." + fields[i], values[i]);
        a.imagevar("$image.Theme_ID",  fields[8]);
        a.imagevar("$image.isChanged", 0);
    }
}

/*
 * Speichert das Thema.
 *
 * @param {String} pThemeID req ID des Themas
 *
 * @return void
 */
function saveTheme(pThemeID)
{
    if ( pThemeID != "")
    {
        var values = [];
        var kind = a.valueof("$comp.cmb_ThemenTyp"); 
        var fields = ["THEME", "DESCRIPTION", "ISACTIVE"]
        // Nur bei Type HISTORY Reminder verwenden.
        if ( kind == "1" )    fields = fields.concat( "REMINDER", "REMINDER_GROUP", "REMINDER_SILENT", "REMINDER_SUBJECT", "REMINDER_ROLES" );

	
        for ( var i = 0; i < fields.length; i++ )    values.push( a.valueof("$comp." + fields[i]) );
    
        //Prüfe ob ein Thema mit gleichen Namen bereits existiert!
        if ( values[0] == "" )  a.showMessage("kein Name");
        else if( isExists(a.valueof("$image.Theme_ID"), values[0], pThemeID))
        {
            a.showMessage(a.translate("Ein Thema mit gleichen Namen existiert bereits!"));
        }	
        else
        {
            fields = fields.concat( "USER_NEW", "DATE_NEW" );            
            values = values.concat(a.valueof("$sys.user"), a.valueof("$sys.date"));
            var types = a.getColumnTypes("THEME", fields);
            a.sqlUpdate("THEME", fields, types, values, " THEME.THEMEID = '" + pThemeID + "'");  
            a.globalvar("$global.Themen", "");
            initThemenObject();
            a.imagevar("$image.isChanged", -1);
            a.refresh("$comp.treeThemen");
            a.imagevar("$image.isChanged", 0);
        }
    }
}

/*
 * Legt Aufgaben abhängig vom Thema an.
 *
 * @param {[String]} pHistoryThemeIDs req Array von HISTORY_THEMEID
 *
 * @return void
 */
function setreminder(pHistoryThemeIDs)
{
    var singlusers = [];
    var description = [];
    var summary = [];
    var data = a.sql("select  HISTORYID, MEDIUM, ENTRYDATE, SUBJECT, THEME.THEME, REMINDER_SILENT, REMINDER_GROUP, REMINDER_ROLES, REMINDER_SUBJECT"
        + " from HISTORY_THEME join THEME on THEMEID = HISTORY_THEME.THEME_ID and REMINDER = 'true' "
        + " join HISTORY on HISTORY_THEME.HISTORY_ID = HISTORYID where HISTORY_THEMEID in ('" + pHistoryThemeIDs.join("', '") + "')", a.SQL_COMPLETE);

    var users = [a.valueof("$sys.user")];    
    for ( i = 0; i < data.length; i++ )
    {
        if(data[i][7] != "")    users = getUsersByRoles( data[i][7] );        
        if ( data[i][6] == "true" )  __newtodo( data[i][5], data[i][8], data[i][4], data[i], users[0], users, undefined, undefined, calendar.GROUP_MULTI )
        else   
        {   
            description.push( data[i][4] );
            summary.push( data[i][8] );
            singlusers = singlusers.concat( users );     
        }
    }
    if ( description.length > 1 )    for ( i = 0; i < description.length; i++ )  description[i] = summary[i] + ": " + description[i];

    for ( i = 0; i < singlusers.length; i++ )
        __newtodo(data[0][5], summary[0], description.join("\n"), data[0], singlusers[i], [ singlusers[i] ], undefined, undefined, calendar.GROUP_SINGLE );

    function __newtodo( pSilent, pSummary, pDescription, pData, pUser, pAffectedUsers, pStart, pDuration, pGroupType)
    {
        if ( pSilent == "true")  newSilentTodo( pSummary, pDescription,  __getLink( pData ), pUser, pAffectedUsers, pStart, pDuration, pGroupType );
        else  newTodo( pSummary, pDescription, __getLink( pData ), pUser, pAffectedUsers, pStart, pDuration );                              
    }
    function __getLink( pData )
    {
        var medium = pData[1];
        var string = a.translate("Datum") + ": " + a.longToDate(pData[2], "dd.MM.yyyy") + " \n"
        if (medium != "")
        {
            string += a.translate("Medium") + ": " + a.translate(a.sql("select keyname1 from keyword where" 
                + getKeyTypeSQL("HistoryMedium") + " and keyvalue = " + medium))
        }
        string += " \n" + a.translate("Betreff") + ": " + pData[3];
        return [["HISTORY", pData[0],  string]];        
    }
}

/*
 * füllt die Zwischentabelle THEMEADD über einen Serverprozess sp_themeadd
 * Es werden die in den Historien eingetragenen Themen für die Qlikview-Auswertung zusammengestellt
 *
 * @return void
 */
function themeadd()
{
    var col = ["HISTORY_THEMEID", "HISTORY_ID", "THEME", "THEME_ID1", "THEME_ID2", "THEME_ID3", "THEME1", "THEME2", "THEME3"];
    var typ = a.getColumnTypes("THEMEADD", col);
    var themeid = "";
    var theme = "";
    var access = [];
    var tid = a.sql("select THEMEID, THEME_ID, THEME from THEME", a.SQL_COMPLETE);
    for ( var i = 0; i < tid.length; i++ )    access[tid[i][0]] = {
        id:tid[i][1], 
        name:tid[i][2]
    };
	
    var themeids = a.sql("select HISTORY_THEMEID, HISTORY_ID, THEME, HISTORY_THEME.THEME_ID, '', '', "
        + " (select THEME from THEME where THEME.THEMEID = HISTORY_THEME.THEME_ID), '', '' from HISTORY_THEME ", a.SQL_COMPLETE);
    for (i=0; i<themeids.length; i++) 
    {
        themeid = access[themeids[i][3]].id;
        theme = access[themeid].name;
        themeids[i][4] = themeid;
        themeids[i][7] = theme; 

        themeid = access[themeid].id; 
        if (themeid != '')
        {
            themeids[i][5] = themeid;
            theme = access[themeid].name; 
            themeids[i][8] = theme;
        }

        a.sqlInsert("THEMEADD", col, typ, themeids[i]);
    }
    return;
}