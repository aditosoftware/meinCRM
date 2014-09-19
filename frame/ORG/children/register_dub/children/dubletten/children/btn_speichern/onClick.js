import("lib_duplicate");

var duplicates = a.getTableData("$comp.tbl_dubletten", a.ALL );
if (duplicates.length > 0 )
{
    var relid = a.valueof("$comp.relationid");
    for ( var i = 0; i < duplicates.length; i++ )
    {
        noduplicate (relid, duplicates[i][0]);
    }
}
a.imagevar("$image.dupids", "");
a.setValue("$comp.DUP_CHECK", "1");
a.doAction(ACTION.FRAME_SAVE);