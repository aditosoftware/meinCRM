import("lib_sql");
import("lib_keyword");

a.rs("MACHINEID, " + concat([ cast("PRODUCTNAME", "varchar", 10), "':'", cast("SERIALNUMBER", "varchar", 50) ]) 
    + " as anzeige, PRODUCTNAME, SERIALNUMBER, (select ORGNAME from ORG join RELATION on ORGID = ORG_ID where RELATIONID = MACHINE.RELATION_ID)" );