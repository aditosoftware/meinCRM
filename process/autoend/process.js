// LastLogout schreiben
a.sqlUpdate("EMPLOYEE", ["LASTLOGOUT"], [SQLTYPES.TIMESTAMP], [a.valueof("$sys.date")], "LOGIN = '" + a.valueof("$sys.user") + "'");