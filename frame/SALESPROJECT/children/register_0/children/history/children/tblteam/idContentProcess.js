var pid = a.valueof("$comp.SALESPROJECTID");

if(pid != "")
{
	var sql = "select SPMEMBERID, RELATION_ID, SALESPROJECTROLE, '', '', '', '' "
	        + " from SPMEMBER ";
	var list = a.sql(sql, a.SQL_COMPLETE);
		
	a.ro(list);
}