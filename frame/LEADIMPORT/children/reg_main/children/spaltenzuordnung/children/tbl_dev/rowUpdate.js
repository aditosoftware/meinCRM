var rowdata = a.valueofObj("$local.rowdata");

var importid = a.valueof("$comp.IMPORTDEVID");

if ( rowdata[2] != null )
{
    if ( a.sql("select count(*) from IMPORTFIELDDEV where FIELDNUMBER = " + rowdata[0] + " and IMPORTDEV_ID = '" + importid + "'") > 0 )
    {
        columns = [ "FIELDNAME", "USER_EDIT", "DATE_EDIT" ];
        ctypes = a.getColumnTypes("IMPORTFIELDDEV", columns );
        cvalues = [ rowdata[2], a.valueof("$sys.user"), a.valueof("$sys.date") ];
        a.sqlUpdate("IMPORTFIELDDEV", columns, ctypes, cvalues, "FIELDNUMBER = " + rowdata[0] + " and IMPORTDEV_ID = '" + importid + "'");
    }
    else
    {
        columns = [ "IMPORTDEV_ID", "FIELDNUMBER", "FIELDNAME", "USER_NEW", "DATE_NEW" ];
        ctypes = a.getColumnTypes("IMPORTFIELDDEV", columns );
        cvalues = [ importid,  rowdata[0], rowdata[2], a.valueof("$sys.user"), a.valueof("$sys.date") ];
        a.sqlInsert("IMPORTFIELDDEV", columns, ctypes, cvalues);
    }
}