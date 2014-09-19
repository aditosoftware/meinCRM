import("lib_dbschema")

var action = a.valueof("$comp.comboColAction");
var colname = a.valueof("$comp.comboColName");
var tables;
var dlg;

switch(action)
{
    case "add":
        // dialog anzeigen
        if(colname != "")
        {
            a.localvar("$local.COLUMNNAME", colname);
            dlg = a.askUserQuestion(a.translate("Bitte Spaltendaten definieren"), "DLG_REPO_ADDCOL");
            if(dlg != null) addColumn(dlg, a.decodeMS(a.valueof("$comp.tblTablelist")));
        }
        break;
			
    case "del":
        colname = a.valueof("$comp.comboColName");
        tables = a.decodeMS(a.valueof("$comp.tblTablelist"));

        if((tables != "") && (colname != "") && (a.askQuestion(a.translate("Sind Sie sicher?"), a.QUESTION_YESNO, "") == "true"))
        {
            // remove column
            var condition = "columnname = '" + colname + "' and " + 
            " table_id in ('" + tables.join("', '") + "')";
            a.sqlDelete("AOSYS_COLUMNREPOSITORY", condition);
            a.showMessage(a.translate("Spalten wurden entfernt."));
        }
        break;
			
    case "ren":
        colname = a.valueof("$comp.comboColName");
        tables = a.decodeMS(a.valueof("$comp.tblTablelist"));
        var newname;
        if((tables != "") && (colname != "") && (newname = a.askQuestion(a.translate("Neuer Spaltenname:"), a.QUESTION_EDIT, "") != ""))
        {
            renColumn(colname, newname, tables);
        }
        break;	
								
    case "mod":
        colname = a.valueof("$comp.comboColName");
        tables = a.decodeMS(a.valueof("$comp.tblTablelist"));
        if((tables != "") && (colname != ""))
        {
            var repo = new RepositoryObject();
            var tblobj = repo.tableFromRepositoryID( a.decodeFirst(a.valueof("$comp.tblTablelist")) );
            var colobj = tblobj.getColumnWithName(colname);
				
            if(colobj != null)
            {
                a.localvar("$local.COLUMNNAME", colname);
                a.localvar("$local.LONGNAME", colobj.longname);
                a.localvar("$local.COLUMNSIZE", colobj.size);
                a.localvar("$local.COLUMNREF", colobj.columnref);
                a.localvar("$local.CONSTRAINTTYPE", colobj.constraint);
                a.localvar("$local.DATATYPE", colobj.type);				
                a.localvar("$local.DESCRIPTION", colobj.description);
                a.localvar("$local.INTERNALUSE", colobj.internal);
                a.localvar("$local.TABLEREF", colobj.tableref);		
                a.localvar("$local.CUSTOMIZED", colobj.customized == "Y");
                a.localvar("$local.NULLABLE", colobj.nullability == "Y");
							
                dlg = a.askUserQuestion(a.translate("Bitte Spaltendaten definieren"), "DLG_REPO_ADDCOL");
                if(dlg != null)	setColumn(dlg, a.decodeMS(a.valueof("$comp.tblTablelist")));
            }	
        }
        break;			
}




// ende