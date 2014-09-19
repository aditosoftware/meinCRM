import("lib_attr");

var RelID = a.valueof("$comp.RELATION_ID");
if ( RelID != "" && a.valueof("$comp.DELIVERYTERMS") == ""  )
{
    var orgrelid = a.sql("select RELATIONID from RELATION where PERS_ID is null and ORG_ID = (select ORG_ID from RELATION where RELATIONID = '" + RelID + "')");
    deliveryterm = GetAttributeKey( "Lieferkondition", 1, orgrelid )[0];
    if ( deliveryterm != "" ) a.rs( parseInt(deliveryterm) );
    else a.rs(1);
}