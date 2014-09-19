import("lib_lead");

var orgnew = false;
var persid = a.sql("select pers_id from relation where relationid = '" + a.decodeFirst(a.valueof("$comp.tbl_persdubletten")) + "'");
var orgid = a.valueof("$comp.ORG_ID");

if ( a.valueof("$comp.STATUS") == 1 )
{
    orgnew = true;
    orgid = "";
}

ImportDuplicate ( a.valueofObj("$image.DataFields"), a.valueofObj("$image.DataTypes"), a.valueofObj("$image.DataTables"), a.valueofObj("$image.FielDev"),
    a.valueof("$comp.LEADID"), orgid,	orgnew, persid, false, a.valueof("$comp.IMPORTDEV_ID") );
nextLead();