import("lib_lead");

var persnew = false;
var orgid =  a.sql("select org_id from relation where relationid = '" +  a.decodeFirst(a.valueof("$comp.tbl_orgdubletten")) + "'"); 
var persid = a.valueof("$comp.PERS_ID");
if ( a.valueof("$comp.STATUS") == 1 )
{
    persnew = true;
    persid = "";
}

ImportDuplicate ( a.valueofObj("$image.DataFields"), a.valueofObj("$image.DataTypes"), a.valueofObj("$image.DataTables"), a.valueofObj("$image.FielDev"),
    a.valueof("$comp.LEADID"), orgid,	false, persid, persnew, a.valueof("$comp.IMPORTDEV_ID") );
			 
nextLead();