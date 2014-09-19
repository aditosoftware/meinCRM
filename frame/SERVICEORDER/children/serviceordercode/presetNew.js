var maxcode = a.sql("select max(SERVICEORDERCODE) + 1 from SERVICEORDER");
if (maxcode == '') a.rs('1001');
else a.rs(maxcode);