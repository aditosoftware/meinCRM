if ( a.valueof("$image.isReadOnly") == "false") 
    a.rq("select addr from comm where medium_id = 3 and standard = 1 and relation_id = '$global.user_relationid'");