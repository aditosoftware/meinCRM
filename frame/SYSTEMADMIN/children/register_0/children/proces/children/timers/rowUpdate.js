var row = a.valueofObj("$local.rowdata");
var cols = [];
var vals = [];

if ( row[1] != null )
{
    cols.push("PROCESSNAME");
    vals.push(row[1]);
}
if ( row[2] != null )
{
    cols.push("NEXTSTART");
    vals.push(row[2]);
}
if ( row[3] != null )
{
    cols.push("AO_INTERVAL");
    vals.push(row[3]);
}
a.sqlUpdate("AOSYS_TIMER", cols, a.getColumnTypes("AOSYS_TIMER", cols), vals, "TIMERID = '" + row[0] + "'");