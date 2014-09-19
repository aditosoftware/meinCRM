a.rq("select relationid, orgname as anzeige from relation join org "
    + " on (org.orgid = relation.org_id) where pers_id is null order by orgname asc");