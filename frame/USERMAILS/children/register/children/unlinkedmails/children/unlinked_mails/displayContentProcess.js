import("lib_keyword");

var user = a.valueof("$comp.user");
var relid = a.sql("select RELATION_ID from EMPLOYEE where LOGIN = '" + user + "'");
var table = a.createEmptyTable(5);

if (relid != "")
{
    // Mailadressen des Users
    var emailadr = a.sql("select ADDR from COMM join keyword on (keyword.keyvalue = comm.medium_id) where " 
        + getKeyTypeSQL(["PersMedium", "OrgMedium"])	+ " and keyname2 = 'mail' and comm.relation_id = '" + relid + "'", a.SQL_COLUMN);
			 
    // unlinked Mails	 
    var mails = a.sql("SELECT ID, SENDER, RECIPIENT, SUBJECT, SENTDATE, RECEIVEDATE FROM ASYS_MAILREPOSIT where ID IN "
        + " (select MAILID from UNLINKEDMAIL) ORDER BY RECEIVEDATE DESC" , a.SQL_COMPLETE);
    table = new Array();
    for (var i = 0; i < mails.length; i++)
    {
        var isowner = false;
        if ( contains( emailadr, emails.extractAddress(mails[i][1])) ) 
        {
            isowner = true;
        }
        else
        {
            var rec = mails[i][2].split(";");
            for (var z = 0; z < rec.length; z++)
            {
                if ( contains( emailadr, emails.extractAddress(rec[z])) ) 
                {
                    isowner = true;
                    break;
                }
            }
        }
        // nur Mails die eine Addresse des Users in Sender oder Recipients beinhalten ! 	
        if ( isowner) table.push( mails[i] );
    }
}
a.returnobject( table );

/*
* contains
* prüft ob ein Element in einem Array vorhanden ist
*
* @author HB
* @version 1.0
*
* @param {[]} pArray req
* @param {String} pElement req
*
* @return {boolean}
*/
function contains(pArray, pElement)
{
    for (j = 0; j < pArray.length; j++)
    {
        if (pArray[j].toUpperCase() == pElement.toUpperCase())
            return true;	
    }

    return false;
}