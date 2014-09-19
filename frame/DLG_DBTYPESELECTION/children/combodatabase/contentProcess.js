var res = new Array();

res.push( new Array( a.DBTYPE_DERBY10.toString(), "Apache Derby") );
//res.push( new Array( a.DBTYPE_FIREBIRD250.toString(), "Firebird") );
res.push( new Array( a.DBTYPE_SQLSERVER2000.toString(), "Microsoft SQL Server") );
res.push( new Array( a.DBTYPE_ORACLE10_THIN.toString(), "Oracle 9/10") );
res.push( new Array( a.DBTYPE_POSTGRESQL8.toString(), "PostgreSQL 8.x") );
//res.push( new Array( a.DBTYPE_MYSQL4.toString(), "MySQL 5.x") );

a.ro(res);