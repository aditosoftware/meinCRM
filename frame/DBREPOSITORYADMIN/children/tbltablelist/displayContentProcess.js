var filter = a.valueof("$comp.cmbModuleFilter");
var typ = a.valueof("$comp.cmbTypeFilter");
var longname = a.valueof("$comp.edtLongnameFilter");
var tablename = a.valueof("$comp.edtDbNameFilter");
var logging = a.valueof("$comp.chk_logging");
var edit = "false";
if (a.hasvar("$image.edit")) edit = a.valueof("$image.edit");
var sql = " select TABLEID, '" + edit + "', -1, TABLETYPE, AOMODULE, LONGNAME, TABLENAME, DESCRIPTION " + 
"	from AOSYS_TABLEREPOSITORY ";
          
var whereclause = []
if(filter != "") whereclause.push(" aomodule = '" + filter +  "' ");
if(typ != "") whereclause.push(" tabletype = '" + typ + "' ");
if(longname != "") whereclause.push(" upper(longname) like upper('%" + longname + "%') ");
if(tablename != "") whereclause.push(" upper(tablename) like upper('%" + tablename + "%') ");
if(logging == "Y") whereclause.push("  TABLEID in (select TABLE_ID from AOSYS_COLUMNREPOSITORY where LOGGING  = '" + logging + "')");

if(whereclause.length > 0) sql += " where "  + whereclause.join(" AND ");
          
sql += " order by TABLENAME, LONGNAME ";
          
var daten = a.sql(sql, a.SQL_COMPLETE);

for(var i=0; i < daten.length; i++)
{
    switch(daten[i][3])
    {
        case "U":
            daten[i][3] = a.translate("Benutzer");
            break;
        case "S":
            daten[i][3] = a.translate("System");
            break;
        case "I":
            daten[i][3] = a.translate("Include");
            break;
    }
}          
	
a.ro(daten);