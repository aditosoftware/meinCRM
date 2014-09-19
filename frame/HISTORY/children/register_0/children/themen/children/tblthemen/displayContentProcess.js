import("lib_themetree")

var histid = a.valueof("$comp.idcolumn");
if (histid != '')
{
    var result = getThemes(histid)
    a.ro(result);
}