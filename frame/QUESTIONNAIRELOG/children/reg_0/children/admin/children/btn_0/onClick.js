var tq = a.sql("select QUESTIONTEXT from QUESTION where QUESTIONID = '" + a.valueof("$image.currentTargetid") + "'");

a.showMessage("$image.currentQuestionid=" + a.valueof("$image.currentQuestionid")
    + "\n$image.currentCompType=" + a.valueof("$image.currentCompType")
    + "\n$image.currentQuestionlogid=" + a.valueof("$image.currentQuestionlogid")
    + "\n$image.currentTargetid=" + a.valueof("$image.currentTargetid")
    + "\ntq=" + tq
    + "\n$image.currentAnswer=" + a.valueof("$image.currentAnswer"))