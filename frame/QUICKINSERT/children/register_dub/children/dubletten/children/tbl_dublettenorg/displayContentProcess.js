import("lib_duplicate");

var dupids = a.valueofObj("$image.dupORGids");

if (dupids.length > 0)
{
    var tabelle = getDuplicates("ORG", dupids);
    a.ro(tabelle);
}
else
{
    a.createEmptyTable(6);
}