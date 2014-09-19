import("lib_report");

rid = a.decodeFirst(a.valueof("$comp.tbl_Report"))
if ( rid != "" )
{
    var funcname = a.sql("select functionname from aosys_reportadministration"
        + " where aosys_reportadministrationid = '" + rid + "'");
    eval(funcname + "()");
}