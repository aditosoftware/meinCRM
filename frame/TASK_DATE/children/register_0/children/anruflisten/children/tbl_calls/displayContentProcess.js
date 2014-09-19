var user = a.valueof("$comp.ADITOUSER");

var sql = " SELECT ctilog.CTILOGID, ctilog.ADDRESS, org.orgname, pers.firstname, pers.lastname, ctilog.DATE_NEW " +
" FROM CTILOG left join relation on (relation_id = relationid) " + 
" left join org on (orgid = org_id) left join pers on (pers_id = persid) " + 
" where ctilog.answermode = " + a.valueof('$comp.cmb_calltype') +  
" and CTILOG.USER_NEW = '" + user + "' order by ctilog.date_new desc ";

a.rq(sql);