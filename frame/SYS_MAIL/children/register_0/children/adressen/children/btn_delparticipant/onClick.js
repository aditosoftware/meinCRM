var addr = a.valueof("$comp.addrcopy").split(";");
var delindexes = a.decodeMS(a.valueof("$comp.tbl_addresses")).sort();

for ( var i = 0; i < delindexes.length; i++ )
{
    // Index muss sortiert sein dann kann nach jedem löschen der nächste zu löschende Index um i kleiner sein !
    addr.splice( Number(delindexes[i])-i, 1 );
}
a.imagevar("$image.addr", addr);