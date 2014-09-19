import("lib_keyword");
import("lib_grant");
/*
Änderung SP 2008-06-12
Änderung PK 2011-01-31 // isactive eingeführt
Aufruf der Reports mit Herrn Boesl besprochen.

Zur Verwaltung der Reports im Frame MyAdito wird ein Verwaltungsframe gebaut. 
Alle Aufrufe der Reports stehen in einer Frunktion im Prozess lib_report
In einer Verwaltungstabelle wird lediglich der Funktionsname angegeben. Eventuelle TempTabellen/Parameter und Reportaufrufe stehen
in der Funktion.
*/
var where_bed = "";
where_bed = getGrantCondition("REPORT_ADMINISTRATION", "") ;// Leserechte holen
if (where_bed != "") where_bed = " and " + where_bed;

var sql = a.sql("select AOSYS_REPORTADMINISTRATIONID, REPORTNAME, DESCRIPTION, "
    + getKeySQL( "REPORTGROUP", "AOSYS_REPORTADMINISTRATION.RUBRIC" )
    + " from AOSYS_REPORTADMINISTRATION where ISACTIVE = 'Y' " + where_bed, a.SQL_COMPLETE );

for (i=0; i<sql.length; i++)
{
    sql[i][1] = a.translate(sql[i][1]);
    sql[i][2] = a.translate(sql[i][2]);
}

a.ro(sql);