import("lib_sql")

a.rs("select HISTORYID, " + concat(["SUBJECT", "'|'", getSQLFormatedDate("ENTRYDATE")]) + " as title, INFO from HISTORY order by ENTRYDATE desc")