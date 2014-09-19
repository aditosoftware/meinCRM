var ToDelete = a.valueof("$local.idvalue");

_delete(a.valueofObj("$image.entry"), a.decodeMS(ToDelete)[6]);


/**
 * Löscht den Eintrag mit dem Index aus dem Entry
 */
function _delete(pEntry, pLinkIndex)
{ 
    var currentCount = Number(pEntry[calendar.LINKS]);

    for (var i = Number(pLinkIndex); i < currentCount; i++)
    {
        var toDeleteIndex = String(i); 
        var toCopyIndex = String( i + 1 );
        pEntry["LINK_ALIAS_" + toDeleteIndex] = pEntry["LINK_ALIAS_" + toCopyIndex];
        pEntry["LINK_TABLE_" + toDeleteIndex] = pEntry["LINK_TABLE_" + toCopyIndex];
        pEntry["LINK_IDCOLUMN_" + toDeleteIndex] = pEntry["LINK_IDCOLUMN_" + toCopyIndex];
        pEntry["LINK_DBID_" + toDeleteIndex] = pEntry["LINK_DBID_" + toCopyIndex];
        pEntry["LINK_FRAME_" + toDeleteIndex] = pEntry["LINK_FRAME_" + toCopyIndex];
        pEntry["LINK_ALIAS_" + toDeleteIndex] = pEntry["LINK_ALIAS_" + toCopyIndex];
        pEntry["LINK_TITLE_" + toDeleteIndex] = pEntry["LINK_TITLE_" + toCopyIndex];   
    }

    var lastIndex = String(currentCount);
    pEntry["LINK_ALIAS_" + lastIndex] = null;
    pEntry["LINK_TABLE_" + lastIndex] = null;
    pEntry["LINK_IDCOLUMN_" + lastIndex] = null;
    pEntry["LINK_DBID_" + lastIndex] = null;
    pEntry["LINK_FRAME_" + lastIndex] = null;
    pEntry["LINK_ALIAS_" + lastIndex] = null;
    pEntry["LINK_TITLE_" + lastIndex] = null; 

    pEntry[calendar.LINKS] = String(currentCount - 1);
}