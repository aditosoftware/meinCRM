var orgid = a.valueof("$comp.lup_orgid");

if ( orgid.replace(/\s/g,"") != "0" ) a.rs("3");
else 	a.rs("2");