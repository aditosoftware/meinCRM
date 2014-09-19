import("lib_lead");

var orgid =  a.sql("select org_id from relation where relationid = '" +  a.decodeFirst(a.valueof("$comp.tbl_orgdubletten")) + "'"); 
var persid = a.sql("select pers_id from relation where relationid = '" + a.decodeFirst(a.valueof("$comp.tbl_persdubletten")) + "'");

ImportDuplicate ( a.valueofObj("$image.DataFields"), a.valueofObj("$image.DataTypes"), a.valueofObj("$image.DataTables"), a.valueofObj("$image.FielDev"),
    a.valueof("$comp.LEADID"), orgid, false, persid, false, a.valueof("$comp.IMPORTDEV_ID") );

nextLead();