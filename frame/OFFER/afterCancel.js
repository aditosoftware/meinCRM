import("lib_linkedFrame");

if ( a.hasvar("$image.offervers") && a.valueof("$image.offervers") == "true")
{
    if ( a.askQuestion("Soll Angebot gelöscht werden ?", a.QUESTION_YESNO, "") == "true" )
    {
        var id = a.valueof("$comp.idcolumn");

        var toDel = new Array();
        // Rechte
        toDel.push(new Array("tableaccess", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
        // Attribute
        toDel.push( new Array("attrlink", "OBJECT_ID = 14 and row_id = '" + id + "'"));
        // Posten
        toDel.push( new Array("OFFERITEM", "OFFER_ID = '" + id + "'"));
        // Posten
        toDel.push( new Array("OFFER", "OFFERID = '" + id + "'"));

        a.sqlDelete(toDel);
        a.closeCurrentTopImage();
    }
    else	a.doAction(ACTION.FRAME_EDIT);
}

swreturn();