import("lib_keyword");
import("lib_sql");

/*
* Gibt die Addresse zurück
*
* @param {String} pRelation req
* @param {String} pOrgID req
* 
* @return {String [[]]}
*/

function getAddresses(pRelation, pOrgID)
{
    var data = a.createEmptyTable(12);
    var persid = a.valueof("$comp.persid");
    if ( persid != "") 
    {
        var colourh = "-16777216";
        var colourn = "-4144960";
        var sqlorder = " order by 2, 3, 5"
        var	fields = [ "case when ADDRESSID = (select ADDRESS_ID from RELATION where RELATIONID = '" + pRelation + "') then -51 else -1 end", "ORGNAME", getKeySQL( "AdressTyp", "ADDR_TYPE" ), 
        "ADDRIDENTIFIER", "ADDRESS", "BUILDINGNO", "ADDRESSADDITION", "ZIP", "CITY", "DISTRICT", "REGION", "STATE", "NAME_DE"];
        var fromstr =  " from ADDRESS left join COUNTRYINFO on ISO2 = COUNTRY ";
        var joinstr1 = " join RELATION on RELATIONID = RELATION_ID join ORG on ORGID = ORG_ID ";
        var joinstr2 = " join RELATION on ADDRESSID = ADDRESS_ID join ORG on ORGID = ORG_ID "; // Standard Address

        if ( a.valueof("$comp.AOTYPE") == "3" )
        {
            var sqlstr = "select " + concat(["'ZZZ'", "RELATIONID"],"#") + ", " + colourn + ", " + fields.join(", ") + fromstr + joinstr2 + " where PERS_ID = '" + persid 
            + "' and RELATIONID != '" + pRelation + "' union "	
            + "select ADDRESSID, " + colourh + ", " + fields.join(", ") + fromstr + joinstr1 + " where RELATIONID = '" + pRelation + "'";
			
            sqlstr += " or ( PERS_ID is null and ORG_ID = '" + pOrgID + "')";
            sqlstr += " union select ADDRESSID, " + colourh + ", " + fields.join(", ") + fromstr + joinstr2 + " where RELATIONID = '" + pRelation + "'" + sqlorder;
        }
        else
        {
            sqlstr = " select ADDRESSID, " + colourh + ", " + fields.join(", ") + fromstr + joinstr1 + " where ORG_ID = '0' and PERS_ID = '" + persid + "'"
            + " union select " + concat(["'ZZZ'", "RELATIONID"],"#") + ", " + colourn + ", " + fields.join(", ") + fromstr + joinstr2 + " where ORG_ID != '0' and PERS_ID = '" + persid + "'" + sqlorder;
        }
        data = a.sql( sqlstr, a.SQL_COMPLETE );
        for ( var i = 0; i < data.length; i++ )
        {
            if ( data[i][0].substr(0, 4) != "ZZZ#") data[i][0] = data[i][0].substr(0, 36);
            data[i][12] = a.translate(data[i][12]); //Übersetzung des Landes
        }
    }
    return data;
}