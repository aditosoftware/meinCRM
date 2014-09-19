var language = a.valueof("$comp.LANGUAGE")

if (language != '')
    a.translate(a.rq("select shorttext from textblock where aotype = 11 and lang = " 
        + language + " order by shorttext"));