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

type="text/javascript" src="https://www.gstatic.com/charts/loader.js"
type="text/javascript"
      google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
        ]);

        var options = {
          title: 'My Daily Activities',
          is3D: true,
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
        chart.draw(data, options);
      }