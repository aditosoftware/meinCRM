import("lib_sql")

var id = a.valueof("$comp.idcolumn");
var machineid = a.valueof("$comp.MACHINE_ID");

if (id != '' && machineid != '')
{
    var garantiezeit = a.sql("select VALUE_INT from ATTRLINK join ATTR on (ATTR.ATTRID = ATTRLINK.ATTR_ID) "
        + " where ATTRNAME like 'Garantiezeit(Monate)' and ROW_ID = (select MACHINE_ID from COMPLAINT where COMPLAINTID = '" + id + "')");
    var garantiebeginn = a.sql("select VALUE_DATE from ATTRLINK join ATTR on (ATTR.ATTRID = ATTRLINK.ATTR_ID) "
        + " where ATTRNAME like 'Garantiebeginn' and ROW_ID = (select MACHINE_ID from COMPLAINT where COMPLAINTID = '" + id + "')");

    if (garantiezeit != '' && garantiebeginn != '')
    {
        var diff = eMath.subInt(eMath.addInt(garantiebeginn, garantiezeit * date.ONE_DAY * 30), a.valueof("$sys.date") )
        a.rs(diff / date.ONE_DAY)
    }
}
else a.rs("");