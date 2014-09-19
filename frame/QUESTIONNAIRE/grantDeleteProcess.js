var id = a.valueof("$comp.idcolumn")

if (id != '') a.rs(a.sql("select count(*) from QUESTIONNAIRELOG where QUESTIONNAIRE_ID = '" + id + "'") == 0);