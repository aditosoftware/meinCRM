var id = a.decodeMS( a.decodeFirst(a.valueof("$comp.tbl_ujumsatz")) );
var groups = a.decodeMS(a.valueof("$comp.UJGruppe"));
for( var i = 0; i < groups.length; i++ )
{
    if (groups[i] == "ORGNAME")
    {
        if( id.length == i+1)   a.openLinkedFrame("ORG", "ORGNAME = '" + id[i] + "'", false, a.FRAMEMODE_SHOW, "");    
        break;
    }
}
