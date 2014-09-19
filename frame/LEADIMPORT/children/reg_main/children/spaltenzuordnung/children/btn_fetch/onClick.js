import("lib_lead");

var rowanz = LoadImportFile(a.valueof("$comp.IMPORTFILE"));

// alle Splaten die nicht belegt sind ausblenden Anzahl 50
//for ( var i = 0; i < 50; i++ )	a.setTableColumnVisibility("$comp.tbl_import", i, true);
//for ( var i = rowanz; i < 50; i++ )	a.setTableColumnVisibility("$comp.tbl_import", i, false);