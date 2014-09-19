import("lib_campaign");

var res = a.sql("select QUESTIONNAIREID, TITLE from QUESTIONNAIRE order by TITLE", a.SQL_COMPLETE);
var list = [];
for (i=0; i<res.length; i++)
    if(testQuestionnaire(res[i][0]) == "") list.push(res[i]);
a.ro(list)