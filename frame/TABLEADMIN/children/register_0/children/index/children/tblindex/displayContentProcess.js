var sql = " select AOSYS_INDEXREPOSITORYID, INDEXNAME, ISUNIQUE "
+ " from AOSYS_INDEXREPOSITORY "
+ " where TABLE_ID = '$comp.TABLEID'";
        
a.rq(sql);