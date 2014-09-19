import("lib_sql");
import("lib_keyword");

a.rs("select RELATIONID, " + concat(["SALUTATION", "TITLE", "FIRSTNAME", "LASTNAME", "' | '", "ORGNAME"]) + " as title, "
     + concat(["ADDRESS","BUILDINGNO","'-'", "COUNTRY", "ZIP", "CITY", "' | Telefon:'", 
       getCommStandardAddrSQL("Pers", "fon", "RELATIONID"), "' E-Mail:'", getCommStandardAddrSQL("Pers", "mail", "RELATIONID")])
    + " as description, SALUTATION, FIRSTNAME, LASTNAME, COMM.ADDR, COMM.SEARCHADDR \n\
        from PERS join RELATION on PERSID = PERS_ID join ORG on ORG_ID = ORGID \n\
        join ADDRESS on ADDRESSID = ADDRESS_ID left join COMM on COMM.RELATION_ID = RELATIONID order by RELATIONID");