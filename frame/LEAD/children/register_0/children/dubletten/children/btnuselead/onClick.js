import("lib_duplicate");
import("lib_lead");

var status = a.valueof("$comp.STATUS");
var org_new = false;
var pers_new = false;
var orgid = a.valueof("$comp.ORG_ID");
var persid = a.valueof("$comp.PERS_ID");

switch(status)
{
    //  Duplicat Pers und Org
    case "1":
        org_new = true;
        pers_new = true;
        break;
    //  Duplicat Pers 
    case "2":
    case "3":
        pers_new = true;
        break;
    //  Duplicat Org 
    case "4":
    case "5":
        org_new = true;
        break;
}
var id = ImportDuplicate ( a.valueofObj("$image.DataFields"), a.valueofObj("$image.DataTypes"), a.valueofObj("$image.DataTables"),
    a.valueofObj("$image.FielDev"), a.valueof("$comp.LEADID"), orgid, org_new, persid, pers_new, a.valueof("$comp.IMPORTDEV_ID") );
    
var persduplicates = a.getTableData("$comp.tbl_persdubletten", a.ALL );
var orgduplicates = a.getTableData("$comp.tbl_orgdubletten", a.ALL );

if ( org_new && orgduplicates != undefined )
{
    for ( i = 0; i < orgduplicates.length; i++ )
    {
        relid =  a.sql("select RELATIONID from RELATION where PERS_ID is null and ORG_ID = '" + id.Org + "'");
        noduplicate ( relid, orgduplicates[i][0] );
    }                                
}
if ( pers_new && persduplicates != undefined )
{
    for ( i = 0; i < persduplicates.length; i++ )
    {
        persid = a.sql("select PERS_ID from RELATION where RELATIONID = '" + persduplicates[i][0] + "'");
        noduplicate ( id.Pers, persid );
    }                
}
nextLead();