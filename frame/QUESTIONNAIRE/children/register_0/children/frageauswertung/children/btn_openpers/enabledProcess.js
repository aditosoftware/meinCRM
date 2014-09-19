var questionnaireid = a.valueof("$comp.QUESTIONNAIREID");
var questionid = a.valueof("$comp.cmb_question");
var answer = a.valueof("$comp.cmb_answer");

a.rs( questionnaireid != '' && questionid != '' && answer != '');