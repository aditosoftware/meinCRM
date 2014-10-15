import("lib_duplicate");

var persduplicates = a.getTableData("$comp.tbl_dublettenPERS", a.ALL );
var orgduplicates = a.getTableData("$comp.tbl_dublettenORG", a.ALL );


var nodupOrg = [];
var nodupPers = [];

if (orgduplicates != undefined)
{    
    for ( i = 0; i < orgduplicates.length; i++ )
    {
        nodupOrg.push(orgduplicates[i][0]);
    }
    a.imagevar("$image.nodupOrg", nodupOrg);
}
if (persduplicates != undefined)
{    
    for ( i = 0; i < persduplicates.length; i++ )
    {
        persid = a.sql("select PERS_ID from RELATION where RELATIONID = '" + persduplicates[i][0] + "'");
        nodupPers.push(persid);
    }                
    a.imagevar("$image.nodupPers", nodupPers);
}
a.imagevar("$image.dupORGids", "");
a.imagevar("$image.dupPERSids", "");
a.setValue("$comp.DUP_CHECK", "1");

a.doAction(ACTION.FRAME_SAVE);

