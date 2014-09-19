import("lib_sql")

var id = a.valueof("$comp.idcolumn");
var machineid = a.valueof("$comp.MACHINE_ID")

if (id != '' && machineid != '')
{
    a.rq("select VALUE_INT from ATTRLINK join ATTR on (ATTR.ATTRID = ATTRLINK.ATTR_ID) "
        + " where ATTRNAME like 'Garantiezeit(Monate)' and ROW_ID = (select MACHINE_ID from COMPLAINT where COMPLAINTID = '" + id + "')");
}
else a.rs("");