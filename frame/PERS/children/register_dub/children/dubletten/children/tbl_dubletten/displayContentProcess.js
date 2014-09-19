import("lib_duplicate");

var dupids = a.valueofObj("$image.dupids");

if (dupids.length > 0)
{
    var tabelle = getDuplicates(a.valueof("$sys.currentimagename"), dupids);
    a.ro(tabelle);
}
else
{
    a.createEmptyTable(4);
}