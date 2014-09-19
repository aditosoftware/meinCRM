var oid = a.valueof("$comp.OFFER_ID");

if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW && oid != "" )
{
    var sort = a.sql("select max(ITEMSORT) + 1 from OFFERITEM where OFFER_ID = '" + oid + "'");
    if ( sort == "" ) sort = 1;
    a.rs( sort );
}