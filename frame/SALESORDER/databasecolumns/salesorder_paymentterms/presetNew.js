import("lib_attr");

if ( a.hasvar("$image.ID") )
{
    var RelID = a.valueof("$image.ID");
    var orgrelid = a.sql("select RELATIONID from RELATION where PERS_ID is null and ORG_ID = (select ORG_ID from RELATION where RELATIONID = '" + RelID + "')");
    paymentterm = GetAttributeKey( "Zahlungskondition", 1, orgrelid )[0];
    if ( paymentterm != "" ) a.rs( parseInt(paymentterm) );
    else a.rs(1);
}