var row = a.valueofObj("$local.rowdata");

if ( row[1] != "" )
{
    var link = a.decodeMS( row[1] );
    var entry = a.valueofObj("$image.entry");
    var LinkCount =  entry[calendar.LINKS];
    if ( LinkCount == undefined ) LinkCount = 1;
    else LinkCount = Number( LinkCount ) + 1;

    entry[calendar.LINKS] = String(LinkCount);
    entry["LINK_ALIAS_" + LinkCount] = link[0];
    entry["LINK_TABLE_" + LinkCount] = link[1];
    entry["LINK_IDCOLUMN_" + LinkCount] = link[2];
    entry["LINK_DBID_" + LinkCount] = link[3];
    entry["LINK_FRAME_" + LinkCount] = link[4];
    entry["LINK_TITLE_" + LinkCount] = link[5];
}