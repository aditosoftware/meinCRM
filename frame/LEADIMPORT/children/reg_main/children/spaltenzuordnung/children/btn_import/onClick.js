import("lib_lead");

a.imagevar("$image.abbruchImport", "false");
a.imagevar("$image.impError", "false");

var noPersCheck = a.valueof("$comp.NOPERSCHECK");
var importdefid =  a.valueof("$comp.IMPORTDEVID");
var posanz;

// Parameter für die Dublettenprüfung
var dparam = {Org:[], Pers:[], OrgComm:[], PersComm:[]};
var data = getKeyList( "DuplicateOrgPattern", ["KEYNAME1", "KEYNAME2", "KEYDETAIL", "KEYDESCRIPTION"], undefined, "AOACTIVE = 1" );
for ( i = 0; i < data.length; i++ ) dparam.Org[data[i][0]] = data[i];
data = getKeyList( "OrgMedium", ["KEYVALUE", "KEYNAME2"] );
for ( i = 0; i < data.length; i++ ) dparam.OrgComm[data[i][0]] = data[i][1];
if ( noPersCheck == "0" )
{
    data = getKeyList( "DuplicatePersPattern", ["KEYNAME1", "KEYNAME2", "KEYDETAIL", "KEYDESCRIPTION"], undefined, "AOACTIVE = 1" );
    for ( i = 0; i < data.length; i++ ) dparam.Pers[data[i][0]] = data[i];
    data = getKeyList( "PersMedium", ["KEYVALUE", "KEYNAME2"] );
    for ( i = 0; i < data.length; i++ ) dparam.PersComm[data[i][0]] = data[i][1];
}
// geladene Importdaten;
var Daten = a.valueofObj("$image.ImportValues");
var ImportDate =  a.valueof("$sys.date");
var ImportFieldDef = getImportFieldDef(importdefid)

var DatenFieldCount = Daten[0].length;
//  Attribute die für Org, Pers und History angelegt werden sollen 
var AttrObject = getLeadAttr( importdefid );

// Vorbelegungen Source übergeben;
var FieldDef = AddArray( ImportFieldDef, new Array ( DatenFieldCount++, "SOURCE", "")  );
var source = a.valueof("$comp.NAME");
// Vorbelegungen DateNew übergeben
FieldDef.push( new Array ( DatenFieldCount++, "DATE_NEW", "") );

//  für Tabellen Felder und Typen ermitteln
var header = a.valueof("$comp.HEADLINE");
var DataTables = new Array("ORG", "PERS", "RELATION", "ADDRESS", "LEAD", "COMM", "ATTRLINK");
var DataFields = GetDataFields( DataTables );
var DataTypes = GetDataTypes( DataFields, DataTables );

// Prüfen ob BUILDINGNO angegeben
var addressPos = getFieldPos ( ImportFieldDef, "ADDRESS" );
var noBuildingNr = ( getFieldPos ( ImportFieldDef, "BUILDINGNO" ).length == 0 && addressPos.length > 0);
if ( noBuildingNr )
    FieldDef.push( new Array ( DatenFieldCount++, "BUILDINGNO", "") );

// Prüfen ob COUNTRY angegeben
var noCountry = ( getFieldPos ( ImportFieldDef, "COUNTRY" ).length ==  0 ); 
if ( noCountry )
    FieldDef.push( new Array ( DatenFieldCount++, "COUNTRY", "") );

// STATUS wird berücksichtigt 
FieldDef.push( new Array ( DatenFieldCount++, "STATUS", "") );

// Prüfen ob Orgname öffters angegeben
var posOrgName = getFieldPos ( ImportFieldDef, "ORGNAME" ); 

// Prüfen, ob ORGINFO öfter angegeben
var posOrginfo = getFieldPos ( ImportFieldDef, "ORGINFO" );

// Prüfen, ob PERSONINFO öfter angegeben
var posPersinfo = getFieldPos ( ImportFieldDef, "PERSINFO" );
// Daten mit  Überschrift 
var dsanz = 0;
if ( header == 1) dsanz = 1;

// Daten einzeln verarbeiten
try
{
    for (; dsanz < Daten.length; dsanz++)
    {
        a.imagevar("$image.impError", "false");
        // felddefinition durchsteppen und werte zuordnen
        var impvalues = AddArray( Daten[dsanz], source);		
        impvalues.push( ImportDate );

        //  wenn keine Hausnummer dann aus Strasse ermitteln
        if ( noBuildingNr )
        {
            var pos =  addressPos[0];
            var BuildingNr = "";
            var address = impvalues[pos];
            if ( address != "" )
            {
                //   Strasse  und Hausnummer trennen
                var arr = address.match( /^[^0-9]+|[0-9]+.*$/g);
                // MU: 2013-07-12: Regexp kann fehlschlagen - dann ist das arr leer.
                if (arr && arr[0])
                {
                    impvalues[pos] = arr[0].replace(/(^\s+)|(\s+$)/g,"");
                    if ( arr[1] ) BuildingNr = arr[1];
                }
            }
            impvalues.push( BuildingNr );
        }
        // Wenn kein Land angegeben dann DE setzen
        if ( noCountry ) impvalues.push( "DE" );
		
        // Setzt STATUS auf 1
        impvalues.push( "1" );
									
        // Wenn Orgname öffters angegeben
        if ( posOrgName.length > 1 )
        {					
            for ( posanz = 1; posanz < posOrgName.length; posanz++ )
            {
                if ( impvalues[ posOrgName[ posanz ] ] != "" )
                    impvalues[ posOrgName[0] ] += "\n" +  impvalues[ posOrgName[ posanz ] ]; 
            }
        }
		
        // Wenn ORGINFO öfter angegeben
        if ( posOrginfo.length > 1 )
        {
            for ( posanz = 1; posanz < posOrginfo.length; posanz++ )
            {
                if ( impvalues[ posOrginfo[ posanz ] ] != "" )
                    impvalues[ posOrginfo[0] ] += "\n" +  impvalues[ posOrginfo[ posanz ] ]; 
            }
        }
        // Wenn PERSONINFO öfter angegeben
        if ( posPersinfo.length > 1 )
        {
            for ( posanz = 1; posanz < posPersinfo.length; posanz++ )
            {
                if ( impvalues[ posPersinfo[ posanz ] ] != "" )
                    impvalues[ posPersinfo[0] ] += "\n" +  impvalues[ posPersinfo[ posanz ] ]; 
            }
        }
        //  Datensatz verarbeiten
        ImportData( DataFields, DataTypes, DataTables, FieldDef, impvalues, importdefid, AttrObject, dparam );
		
        if (a.valueof("$image.abbruchImport") == "true")
            break;
    }
}
catch(err)
{
    log.show(err)
}

var fields = new Array("IMPORTDATE", "DATE_EDIT", "USER_EDIT");
a.sqlUpdate( "IMPORTDEV", fields, a.getColumnTypes("IMPORTDEV", fields), 
    new Array( ImportDate, a.valueof("$sys.date"), "IMP-" + a.valueof("$sys.user") ), "IMPORTDEVID = '" +  importdefid + "'");
a.showMessage( dsanz - ( ( header == 1) ? 1 : 0) + " " + a.translate("Zeilen verarbeitet") );
a.refresh();

// Gibt die Posiionen des Feldnamens zurück 
function getFieldPos ( pFieldDef, pFieldName)
{
    var multi = false;
    var pos = new Array();
    for (i = 0; i < pFieldDef.length; i++)
    {
        if ( pFieldDef[i][1] == pFieldName )
        {
            pos.push( pFieldDef[i][0] );
            if ( multi ) pFieldDef[i][1] = "NULL";
            multi = true;
        }
    }
    return pos;
}