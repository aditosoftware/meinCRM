var row = a.valueofObj("$local.rowdata");

if ( row[5] != null && row[5] != "")
{

    var attribute = "";
    if ( row[4] != null && row[4] != "") 
    {		
        attribute = row[4];
    }
    else 
    {	 
        attribute = row[3];
    }
    var field = new Array("VALUE_ID","VALUE_CHAR","VALUE_CHAR","VALUE_DATE","VALUE_INT","VALUE_DOUBLE","VALUE_ID");
    var component = a.sql("select ATTRCOMPONENT from ATTR where ATTRID = '" + attribute + "'");
    var cols = new Array("ATTRLINKID", "ATTR_ID", "ROW_ID", "OBJECT_ID", "DATE_NEW", "USER_NEW", field[component - 1]);
    var vals = new Array(a.getNewUUID(), attribute, a.valueof("$comp.idcolumn"), a.valueof("$image.FrameID"), a.valueof("$sys.date"), a.valueof("$sys.user"), row[5]);
    var colTypes = a.getColumnTypes("ATTRLINK", cols);
	
    a.sqlInsert("ATTRLINK", cols, colTypes, vals);
}