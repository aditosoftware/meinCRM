import("lib_campaign");
import("lib_addrexp");

var relids = getRelationIDs();

if ( relids.length > 0 )
{
    openExport( "RELATION.RELATIONID in ('" + relids.join("','") + "')" );
}