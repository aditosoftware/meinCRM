var id = a.decodeFirst(a.valueof("$comp.tbl_ADDRESS") );

if (id != '')
{
    var data = a.getTableData("$comp.tbl_ADDRESS", [id]);
    if (data[0][12] == null)
    {
        var country = a.sql("select COUNTRY, NAME_DE from ADDRESS join RELATION on ADDRESS_ID = ADDRESSID and RELATIONID = '" 
            + a.valueof("$global.user_relationid") + "' join COUNTRYINFO on COUNTRY = ISO2", a.SQL_ROW); 
        a.updateTableCell("$comp.tbl_ADDRESS", id, 12, country[0], a.translate(country[1]));
    }
}