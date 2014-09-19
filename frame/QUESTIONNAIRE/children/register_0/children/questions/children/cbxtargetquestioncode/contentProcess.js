var qid  = a.decodeFirst(a.valueof("$comp.tblQuestion"));  // aktuelle frage
var qreid = a.valueof("$comp.QUESTIONNAIREID");

if (qid != '')  // wenn eine frage markiert wurde
{
    var sql = a.sql("select distinct QUESTIONID, QUESTIONCODE "
        + " from QUESTION "
        + " where QUESTIONID <> '" + qid 
        + "'   and QUESTIONNAIRE_ID = '" + qreid
        + "'   and QUESTIONCODE is not null "
        //          + "   and questioncode <> '' "
        + " order by QUESTIONCODE ", a.SQL_COMPLETE);

    //Array um Ende Kennzeichen erweitern 0 => Ende 
    var zusatz = new Array(new Array("0", "Ende"));
    //  var zusatz = new Array(new Array("0", a.translate("Ende")));
    var erg = sql.concat(zusatz);   
      
    a.returnobject(erg);
}
else
{
    a.rs(null);
}