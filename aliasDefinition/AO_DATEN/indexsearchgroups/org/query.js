import("lib_sql");
import("lib_keyword");

a.rs("select RELATIONID, " + concat(["ORGNAME", "' | '", "COUNTRY", "'-'","ZIP", "CITY"]) + " as title, " 
    + concat(["ADDRESS", "BUILDINGNO", "', '", "COUNTRY", "'-'", "ZIP", "CITY", "'  | Telefon:'", 
    getCommStandardAddrSQL("Org", "fon", "RELATIONID"), "' E-Mail:'", getCommStandardAddrSQL("Org", "mail", "RELATIONID")])
    + " as description, ORGNAME, COMM.ADDR, COMM.SEARCHADDR \n\
        from ORG join RELATION on ORG_ID = ORGID and PERS_ID is null \n\
        join ADDRESS on ADDRESSID = ADDRESS_ID left join COMM on COMM.RELATION_ID = RELATIONID order by RELATIONID");