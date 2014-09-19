import("lib_sql")

a.rs("select " + concat(["firstname", "lastname"]) + " from pers join relation on (persid = pers_id) where relationid = COMPLAINT.RESPONSIBLE_ID")