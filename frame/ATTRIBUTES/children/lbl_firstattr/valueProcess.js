var attr_id = a.valueof("$comp.attr_id");
var attribute = "";
if (attr_id != "")
{
    attribute = a.sql("select ATTRNAME from ATTR where ATTRID = '" + attr_id + "'");
    a.rs(a.translate(attribute));
}
else a.rs(attribute);