import("lib_lead");

//  für die Übernahme initialisieren

var DataTables = new Array("ORG", "PERS", "RELATION", "ADDRESS", "LEAD", "COMM", "ATTRLINK");
var DataFields = GetDataFields( DataTables );
var DataTypes = GetDataTypes( DataFields, DataTables );

var LeadFields = a.getColumns(a.valueof("$sys.dbalias"), "LEAD");

var FieldDef = getImportFieldDef( a.valueof("$global.importdefid"));
for (var i = 0; i < LeadFields.length; i++)
    FieldDef.push ( new Array ( i , LeadFields[i] ) );
// Parameter für die Dublettenprüfung
var dparam = {
    Org:[], 
    Pers:[], 
    OrgComm:[], 
    PersComm:[]
};
var data = getKeyList( "DuplicateOrgPattern", ["KEYNAME1", "KEYNAME2", "KEYDETAIL", "KEYDESCRIPTION"], undefined, "AOACTIVE = 1" );
for ( i = 0; i < data.length; i++ ) dparam.Org[data[i][0]] = data[i];
data = getKeyList( "OrgMedium", ["KEYVALUE", "KEYNAME2"] );
for ( i = 0; i < data.length; i++ ) dparam.OrgComm[data[i][0]] = data[i][1];
data = getKeyList( "DuplicatePersPattern", ["KEYNAME1", "KEYNAME2", "KEYDETAIL", "KEYDESCRIPTION"], undefined, "AOACTIVE = 1" );
for ( i = 0; i < data.length; i++ ) dparam.Pers[data[i][0]] = data[i];
data = getKeyList( "PersMedium", ["KEYVALUE", "KEYNAME2"] );
for ( i = 0; i < data.length; i++ ) dparam.PersComm[data[i][0]] = data[i][1];

a.imagevar("$image.FielDev", FieldDef );
a.imagevar("$image.DataTables", DataTables );
a.imagevar("$image.DataFields", DataFields );
a.imagevar("$image.DataTypes", DataTypes );
a.imagevar("$image.LeadFields", LeadFields);
a.imagevar("$image.abbruchImport", "false");
a.imagevar("$image.impError", "false");
a.imagevar("$image.DubParam", dparam );

