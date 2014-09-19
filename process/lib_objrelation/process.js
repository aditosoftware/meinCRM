import("lib_frame");
import("lib_addr");

/*
	bibliothek mit hilfsroutinen fuer die Verwaltung von Objektbeziehungen
 */

/*
 * display object relations in hierachical tree form
 *
 * @param {String} pObject req Object z.B.: org, pers, priv ( Eintrag in Keyword )
 * @param {integer} pFrameMode req Framemode
 * @param {integer} pObjectType req Relationstype
 * @param {String} pRelationID req Relationid
 *
 * @return {[]} TreeEntry        
 */
function fillObjectTree ( pObject, pFrameMode, pObjectType, pRelationID )
{
    if ( pRelationID != "" && (pFrameMode == a.FRAMEMODE_EDIT || pFrameMode == a.FRAMEMODE_SHOW))
    {
        // values are provided by the system for the fill process
        var nodeid = a.valueof("$local.nodeid");
        var nodelayer = a.valueof("$local.nodelayer");
        var object = a.decodeMS( pObjectType );

        // create result set array
        var tree = new Array();
        // if we fill the very first level of the tree (normally one root node)
        if (nodeid == null)
        {
            if ( pObjectType != "" )
            {
                // wenn Hierarchie dann oberstes Element ermitteln ansonsten aktuelle relationid  
                if ( object[2] == "true" ) pRelationID = getRootID ( pRelationID, object[0] );
                // Root-Element eintragen
                insertEntry( tree,[[ pRelationID,"","","","","" ]], nodeid );
            }
            else   // kein ObjectType ausgewählt
            {
                // Alle ObjectTypen holen
                var objtypes =  getEntry( pObject );
                for ( var i = 0; i < objtypes.length; i++ )
                {
                    object = a.decodeMS( objtypes[i][0] );
                    var data  = getData ( a.encodeMS( [ pRelationID, i, objtypes[i][0] ] ), object[1], object[0] );
                    // if KEYNAME1 = KEYNAME2 und noch keine Untereintrag
                    if ( data.length == 0 && object[1] == "g") 	data = getData ( a.encodeMS( [ pRelationID, i, objtypes[i][0] ] ), "n", object[0] );
                    if ( data.length > 0) // Nur wenn ein UnterEintrag vorhanden dann ObjectType anzeigen
                    {
                        var icon = a.sql( "select ID from ASYS_ICONS where ICON_TYPE = 'Beziehung' and DESCRIPTION = '" +  objtypes[i][1] + "'" );
                        tree.push( [ a.encodeMS( [ pRelationID, i, objtypes[i][0] ] ), objtypes[i][1], "", icon, "false", nodeid, true ] ); 
                    }
                }
            }
        } 
        else  // second and further levels of the tree
        {
            // wenn Hierarchie dann immer nur reverse Sicht anzeigen 
            if ( object[2] == "true" && pObjectType != "" ) 		insertEntry ( tree, getData ( nodeid, "r", object[0] ), nodeid, nodelayer );
            else
            {
                if ( pObjectType == "" )   // ObjectType aus nodeid ermitteln
                {		
                    object = a.decodeMS( nodeid );
                    for ( var nl = 0; nl < nodelayer; nl++ )		object = a.decodeMS( object[2] );
                }
                insertEntry ( tree, getData ( nodeid, object[1], object[0] ), nodeid, nodelayer );
                // if KEYNAME1 = KEYNAME2
                if ( object[1] == "g" )	insertEntry ( tree, getData ( nodeid, "n", object[0] ), nodeid, nodelayer );
            }
        }
        // return result set
        return tree;		
    }
    else // we don't have a selection of the frame mode does not fit, clear tree
    {
        return null;
    }

    // Daten lesen
    function getData ( pEntryID, pReverse, pObjectType )
    {	
        if ( pObjectType == undefined ) return "";
        if ( pReverse == "n" ) 
        {
            var reltitel = "KEYNAME1";
            var getfield = "DEST";
            var setfield = "SOURCE"; 
        }
        else
        {
            reltitel = "KEYNAME2";
            getfield = "SOURCE";
            setfield = "DEST"; 
        }
        // den Vorgänger-Knoten ausschliesen
        var condition = " and RELVALUE = " + pObjectType + " and " + getfield + "_ID";
        var id = a.decodeFirst(a.decodeMS(pEntryID)[2]);
        if (id != "")	condition += " <> '" + id + "' "; 
        else condition += " is not null "; 
        sql = "select " + getfield + "_ID, OBJECTRELATIONID, ASYS_ICONS.ID, RELDESC, " + reltitel
        + " from OBJECTRELATION left join ASYS_ICONS on DESCRIPTION = cast(" + getfield + "_OBJECT as char(1)) and ICON_TYPE = 'Beziehung'" 
        + " join KEYWORD on KEYVALUE = RELVALUE where " + getKeyTypeSQL("objrel")
        + " and " + setfield + "_ID = '" + a.decodeFirst(pEntryID) + "'" + condition;
        return a.sql( sql, a.SQL_COMPLETE );
    }

    // Konten eintragen
    function insertEntry ( pTree, pEntryData, pNodeID, pNodeLayer )
    {
        var open = true;
        if ( pNodeLayer > 10 ) open = false;
        for(var i=0; i < pEntryData.length; i++)
        {
            var addrobj = new AddrObject( pEntryData[i][0] );
            var display =  addrobj.formatAddress("{sa} {ti} {fn} {ln} {on}");
            var tooltip = addrobj.getFormattedAddress()
            if ( pEntryData[i][3] != "" )tooltip += "\n\n" +  pEntryData[i][3];
            var icon =  pEntryData[i][2];
            pTree.push( [ a.encodeMS( [ pEntryData[i][0], pEntryData[i][1], pNodeID ] ) , display, tooltip, icon,  "false", pNodeID, open ] );
        }
    }
}

// Konten eintragen
function insertEntry ( pTree, pEntryData, pNodeID, pNodeLayer )
{
    var open = true;
    if ( pNodeLayer > 10 ) open = false;
    for(var i=0; i < pEntryData.length; i++)
    {
        var addrobj = new AddrObject( pEntryData[i][0] );
        var display =  addrobj.formatAddress("{sa} {ti} {fn} {ln} {on}");
        var tooltip = addrobj.getFormattedAddress()
        if ( pEntryData[i][3] != "" )tooltip += "\n\n" +  pEntryData[i][3];
        var icon =  pEntryData[i][2];
        pTree.push( [ a.encodeMS( [ pEntryData[i][0], pEntryData[i][1], pNodeID ] ) , display, tooltip, icon,  "false", pNodeID, open ] );
    }
}

/*
* RootId ermitteln
*
* @param {String} pRelationid req Relationid
* @param {String} pType req Type der Beziehung
*
* @return {String} RootID        
*/
// RootId berechnen
function getRootID ( pRelationID, pType )
{
    var sourceid = pRelationID;
    var max = 100;
    do
    {
        var rootid = sourceid;
        max--;
        sourceid = a.sql("select DEST_ID from OBJECTRELATION where SOURCE_ID = '" + sourceid + "' and RELVALUE = " + pType);
    }
    while( sourceid != "" && max > 0 );
    return rootid; 
}

/*
* liefert die Liste der möglichen Objectrelationen
*
* @param {integer} pReltype req ( org, rel o. priv )
*
* @return {[]} objectrelation        
*/
function getEntry( pReltype )
{
    var sqlstr = ", KEYDETAIL, KEYSORT from keyword where " + getKeyTypeSQL("objrel") +	" and keydetail like '";
	
    var sql = "select keyvalue, keyname1, 'n'" + sqlstr +	pReltype + "-%' and keyname1 <> keyname2 union "
    + "select keyvalue, keyname2, 'r'" + sqlstr +	"%-" + pReltype + "%' and keyname1 <> keyname2 union "						
    + "select keyvalue, keyname1, 'g'" + sqlstr +	pReltype + "-%' and keyname1 = keyname2 ";
    if ( pReltype	== "priv"	|| pReltype	== "rel" )
    {	
        sql += "union select keyvalue, keyname1, 'n'" + sqlstr + "pers-%' and keyname1 <> keyname2 union "
        + "select keyvalue, keyname2, 'r'" + sqlstr +	"%-pers%' and keyname1 <> keyname2 union "						
        + "select keyvalue, keyname1, 'g'" + sqlstr + "pers-%' and keyname1 = keyname2 ";
    }
    sql += " order by 5, 2 ";
    var res = a.sql( sql, a.SQL_COMPLETE);	
    var list = [];
    for(var i =0; i < res.length; i++)
    {
        var usage = res[i][3].split(" ");
        usage = usage[0].split("-");
        if ( res[i][2] == "r")	usage.reverse();
        var hierarchie = "false";
        if ( res[i][3].search( new RegExp( "hier", "i") ) != -1 )  hierarchie = "true";
        var id = a.encodeMS( [ res[i][0], res[i][2], hierarchie, usage[1], usage[0] ] );
        list.push([ id, a.translate(res[i][1]) ]);
    }
    return list
}