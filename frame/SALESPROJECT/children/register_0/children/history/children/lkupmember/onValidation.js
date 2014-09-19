var id = a.decodeFirst(a.valueof("$comp.tblTeam"));

if ( id != "" )
{
    var data = a.getTableData("$comp.tblTeam", [id]);
    var sql = a.sql("select DEPARTMENT, RELTITLE, RELPOSITION, ORGNAME from RELATION join ORG on ORGID = ORG_ID "
        + " where RELATIONID = '" + data[0][1] + "'", a.SQL_ROW);
    if (data[0][2] == '')	a.updateTableCell("$comp.tblTeam", id, 3 , sql[0], sql[0]);
    if (data[0][3] == '')	a.updateTableCell("$comp.tblTeam", id, 4 , sql[1], sql[1]);
    if (data[0][4] == '')	a.updateTableCell("$comp.tblTeam", id, 5 , sql[2], sql[2]);
    if (data[0][5] == '')	a.updateTableCell("$comp.tblTeam", id, 6 , sql[3], sql[3]);
}