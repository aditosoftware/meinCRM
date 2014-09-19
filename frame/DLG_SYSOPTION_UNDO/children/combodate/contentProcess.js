var list = a.sql("select distinct deldate, deldate from aosys_configuration where deldate is not null order by 1", a.SQL_COMPLETE);

for ( var i = 0; i < list.length; i++)  list[i][1] = date.longToDate(list[i][1], "dd.MM.yyyy");

a.ro(list);