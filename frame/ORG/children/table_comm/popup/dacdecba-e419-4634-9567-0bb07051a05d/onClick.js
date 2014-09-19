var id = a.decodeFirst(a.valueof("$comp.Table_comm"))
var val = a.getTableData("Table_comm", id)[3]
a.doClientCommand(a.CLIENTCMD_TOCLIPBOARD, [val])