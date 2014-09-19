import("lib_frame");
import("lib_grant");

/*

* gibt die Suchverknüpfung eine Selektion zurück
*
* @return {void}
*/
function getSelSearchLink()
{
    var selection = a.decodeFirst(a.valueof("$local.selection"));
    var condition;
    var selcond = a.sql("select AO_CONDITION, SEARCHFIELD from SELECTION where SELECTIONID = '" + selection + "'", a.SQL_ROW);
    // AdditionalCharSearch
    if ( (selcond[0]).search("{AdditionalCharCondition}") != -1 && a.getDatabaseType(a.valueof("$sys.dbalias")) == a.DBTYPE_SQLSERVER2000  )
    {
        var operator = ["","=","!=",">","<","<=",">=","like","not like","","","is not","is"];
        condition = selcond[1] + " " + operator[Number(a.valueof("$local.operator"))] + " ?";
        var value = a.valueof("$local.rawvalue");
        var addchar = getKeyList( "AdditionalCharSearch", ["KEYNAME1","KEYNAME2"]);
        for ( var i = 0; i < addchar.length; i++ )	value = value.replace( new RegExp(addchar[i][0], "g"), "[" + addchar[i][1] + "]" );
        condition = a.resolveVariables( selcond[0]).replace( "{AdditionalCharCondition}", condition );
        return [ condition,[[ value, SQLTYPES.VARCHAR]]];
    }
    else
    {
        selection = a.decodeFirst(a.valueof("$local.selection"));
        var localcondition = a.valueof("$local.condition").replace( new RegExp("{'table.column'}", "g"), selcond[1] );
        condition = a.resolveVariables(selcond[0]).replace( "{condition}", localcondition );
        return condition;
    }
}

/*
* gibt die Suchfelder eine Selektion zurück
*
* @param {integer} pComponent req  Componente
* 
* @return {String []}
*/
function getSelSearchFields( pComponent )
{
    var condition = getGrantCondition("SELECTION", " FRAMEID = " + a.valueof("$image.FrameID") + " and COMPONENT = " + pComponent);
    var selection = a.sql("select SELECTIONID, NAME from SELECTION where " + condition, a.SQL_COMPLETE);

    var searchfields = new Array();
    for (var i = 0; i < selection.length; i++)
    {
        searchfields.push( [ selection[i][0], a.translate(selection[i][1]) ] );
    }
    return searchfields;
}

/*
* Gibt die Auswahlliste für die Combobox zurück.
* 
*@return {String []}
*/
function getSelComboboxList()
{
    var result = new Array();
    if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_TABLE )
    {
        var selection = a.decodeFirst(a.valueof("$local.selection"));

        var erg = a.sql("select SELECTIONLIST from SELECTION where SELECTIONID = '" + selection + "'");

        list = trim(erg);
        if ( list.substring(0, 6).toLowerCase() == "select")
        {
            result = a.sql( list, a.SQL_COMPLETE );
        }
        else
        {
            list = list.split("\n")
            for ( var i = 0; i < list.length; i++ )
            {
                var row = new Array();
                var element = trim(list[i]).split(";");
                for ( var y = 0; y < element.length; y++ )
                {
                    row.push( trim(element[y]));
                }
                result.push(row);		
            } 
        }
    }
    return result;
	
    /*
	* Schneidet einen String zu.
	*
	* @param {String} txt req String der zugeschnitten werden soll
	*
	* @return {String} den zugeschnittenen String
	*/
    function trim(txt) 
    {
        return txt.replace(/(^\s+)|(\s+$)/g,"")
    }
}