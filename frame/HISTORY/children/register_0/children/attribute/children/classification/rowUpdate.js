var row = a.valueofObj("$local.rowdata");
if ( row[5] != null && row[5] != "")
{	
    var id = row[0];
    var content = a.getTableData("comp.classification", [id])[0];	
    var attribute = "";
    if (content[4] != null && content[4] != "") 
    {  	
        attribute = content[4];
    }
    else 
    {
        attribute = content[3];
    }

    var field = new Array("VALUE_ID","VALUE_CHAR","VALUE_CHAR","VALUE_DATE","VALUE_INT","VALUE_DOUBLE","VALUE_ID");
    var component = a.sql("select ATTRCOMPONENT from ATTR where ATTRID = '" + attribute + "'");
    var cols = new Array( "ATTR_ID", "DATE_EDIT", "USER_EDIT", field[component - 1]);
    var vals = new Array( attribute, a.valueof("$sys.date"), a.valueof("$sys.user"), row[5]);
    var colTypes = a.getColumnTypes("ATTRLINK", cols);

    a.sqlUpdate("ATTRLINK", cols, colTypes, vals, "ATTRLINKID = '" + row[0] + "'");
}