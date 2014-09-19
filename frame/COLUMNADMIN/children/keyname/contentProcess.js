var sql = " select keyname2 from keyword " +
" where keytype = 0 and keyname2 is not null"  + 
" order by keyname2 ";
a.rq(sql);