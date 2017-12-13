//kommentar
/*längre kommentar*/


function showTab(link) {
    window.location.href = link;
}


/* function showTab2(evt, menuName) {
    var i, ContentInSelectedTab;
    ContentInSelectedTab = document.getElementsByClassName("menuContent");
    for (i = 0; i < ContentInSelectedTab.length; i++) {
        ContentInSelectedTab[i].style.display = "none";
    }
    document.getElementById(menuName).style.display = "block";
} */


// TESTFUNKTIONER

function functionTextTillDiv() {
    var variabelNamn = document.getElementById('testdiv');
    variabelNamn.innerHTML+="Text som ploppar upp för att jag tryck på knappen. ";
}

function functionTömDiv() {
    var variabelNamn = document.getElementById('testdiv');
    variabelNamn.innerHTML=" ";
}





