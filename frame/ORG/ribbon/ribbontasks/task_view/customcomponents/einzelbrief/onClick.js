import("lib_wordbrf");

var language = a.valueof("$comp.LANG");

var theRel = a.valueof("$comp.Label_relpers_dec");
if ( theRel == "" ) theRel = a.valueof("$comp.relationid");
if (a.sql("select STATUS from RELATION where RELATIONID = '" + theRel + "'") != "1" )
    a.showMessage(a.translate("Diese Relation ist nicht aktiv!"));
else
    writeLetter( theRel, a.decodeFirst(a.valueof("$comp.tbl_ADDRESS")), language );