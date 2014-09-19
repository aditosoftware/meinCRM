var mode = a.valueof("$sys.workingmode");

if ( mode == a.FRAMEMODE_EDIT || mode == a.FRAMEMODE_NEW )
{ 
    var id = a.decodeFirst(a.valueof("$comp.tbl_ADDRESS") );
    if (id != '' && id.substr( 0, 4) != "ZZZ#" )
    {
        var data = a.getTableData("$comp.tbl_ADDRESS", [id]);
        if (data[0][12] == null)
        {
            var country = a.sql("select COUNTRY, NAME_DE from ADDRESS join RELATION on ADDRESS_ID = ADDRESSID and RELATIONID = '" 
                + a.valueof("$global.user_relationid") + "' join COUNTRYINFO on COUNTRY = ISO2", a.SQL_ROW); 
            a.updateTableCell("$comp.tbl_ADDRESS", id, 14, country[0], a.translate(country[1]));
        }
        if (data[0][3] == null)
        {
            a.updateTableCell("$comp.tbl_ADDRESS", id, 3, a.valueof("$comp.relationid"), a.sql("select ORGNAME from ORG where ORGID = '" + a.valueof("$comp.lup_orgid") + "'"));
        }
    }
}