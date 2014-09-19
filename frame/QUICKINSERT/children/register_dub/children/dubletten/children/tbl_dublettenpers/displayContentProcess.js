import("lib_duplicate");

var dupids = a.valueofObj("$image.dupPERSids");

if (dupids.length > 0)
{
    var tabelle = getDuplicates("PERS", dupids);
    a.ro(tabelle);
}
else
{
    a.createEmptyTable(7);
}