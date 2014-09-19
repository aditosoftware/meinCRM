var entry = a.valueofObj("$image.entry");
var count = Number(entry[calendar.LINKS]);
var links = new Array();

for (var i = 1; i <= count; i++)
{
    var id = _encode(entry, String(i));
	
    var next = [id, entry["LINK_TITLE_" + String(i)] ];
    links.push(next);
}

a.ro(links);

/**
 * Codiert einen Eintrag, wie die ID der Tabelle
 *
 * Dublette zu Kontextmenü -> Löschen
 */
function _encode(pEntry, pLinkIndex)
{
    var alias = entry["LINK_ALIAS_" + pLinkIndex];
    var table = entry["LINK_TABLE_" + pLinkIndex];
    var idcolumns = entry["LINK_IDCOLUMN_" + pLinkIndex];
    var dbid = entry["LINK_DBID_" + pLinkIndex];
    var frame = entry["LINK_FRAME_" + pLinkIndex];
    var title =	entry["LINK_TITLE_" + pLinkIndex];
		
    return a.encodeMS([alias, table, idcolumns, dbid, frame, title, pLinkIndex]);
}