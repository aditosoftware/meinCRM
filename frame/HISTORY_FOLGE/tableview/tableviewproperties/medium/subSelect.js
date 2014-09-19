import("lib_sql");
import("lib_keyword");

a.rs( concat([ getKeySQL( "HistoryMedium", "MEDIUM" ), "case when DIRECTION = 'o' then '>' else '<' end"]) );