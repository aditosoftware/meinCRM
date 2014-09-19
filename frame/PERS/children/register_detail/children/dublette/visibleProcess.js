import("lib_duplicate");

if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT ||  a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW )
{
    var tabelle = hasPersDuplicates( a.valueof("$comp.relationid"), a.valueof("$comp.persid"), getPersFramePattern() );
    a.rs( tabelle.length > 0)
}