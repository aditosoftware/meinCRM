a.rq("select ATTRID from attr a where ATTRNAME = 'Interessent' and ATTR_ID = (select ATTRID from ATTR where ATTRNAME = 'Zielgruppe')");