import("lib_tableaccess");

/*
* löscht gesamtes System für Übergabe an Interessenten
*	
* @return {void}
*/
emptyTables();

function emptyTables()
{
    if ( a.askQuestion(a.translate("Wollen Sie das gesamte System leeren?"), a.QUESTION_YESNO, "") == "true" )
    {
        var tab = a.getTables(a.valueof("$sys.dbalias"));
  
        var tabexclude = ["AOSYS_COLUMNREPOSITORY", "AOSYS_CONFIGURATION", "AOSYS_INDEXREPOSITORY", "AOSYS_LOCATION", 
        "AOSYS_REPORTADMINISTRATION", "AOSYS_SQLREPOSITORY", "AOSYS_TABLEREPOSITORY", "ASYS_ICONS", "ASYS_SYSTEM",
        "ASYS_ALIASCONFIG", "ASYS_USER", "ASYS_BINARIES", "DOCUMENT", "SALUTATION", "THEME",
        "ATTR", "ATTROBJECT", "COUNTRYINFO", "EMPLOYEE", "KEYWORD", "ORG","PERS","RELATION", "ADDRESS", "COMM"]
        for (i=0; i<tab.length; i++)
        {
            if ( ! hasElement(tabexclude, tab[i] ) )
            {
                try
                {
                    a.sql("delete from " + tab[i] );
                }
                catch(err){log.log(err);}
            }
        }
        a.sql("delete from RELATION where RELATIONID not in (select RELATION_ID from EMPLOYEE) and ORG_ID not in ('O1')");
        a.sql("delete from ORG where ORGID not in ('0','O1')");
        a.sql("delete from PERS where PERSID not in (select PERS_ID from RELATION where PERS_ID is not null)");  
        a.sql("delete from ADDRESS where RELATION_ID not in (select RELATIONID from RELATION)");  
        a.sql("delete from COMM where RELATION_ID not in (select RELATIONID from RELATION)"); 
    }
    a.showMessage(a.translate("Prozess abgeschlossen."));
}