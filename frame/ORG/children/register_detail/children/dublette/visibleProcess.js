import("lib_duplicate");

if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT ||  a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW )
{
    var tabelle = hasOrgDuplicates( a.valueof("$comp.relationid"), getOrgFramePattern() );
    a.rs( tabelle.length > 0)
}