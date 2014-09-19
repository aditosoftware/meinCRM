import("lib_duplicate");

var duplicates = a.getTableData("$comp.tbl_dubletten", a.ALL );
if (duplicates.length > 0 )
{
    var persid = a.valueof("$comp.persid");
    for ( var i = 0; i < duplicates.length; i++ )
    {
        duppersid = a.sql("select PERS_ID from RELATION where RELATIONID = '" + duplicates[i][0] + "'")
        noduplicate (persid, duppersid);
    }
}
a.imagevar("$image.dupids", "");
a.setValue("$comp.DUP_CHECK", "1");
a.doAction(ACTION.FRAME_SAVE);