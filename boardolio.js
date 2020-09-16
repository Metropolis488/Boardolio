var uSix = "https://www.quandl.com/api/v3/datasets/FRED/CIVPART.json?api_key=Jcyk-GUH8y6JQHsTjovt";
var test = "amzn";
var testTwo = "https://api.tiingo.com/tiingo/daily/" + test + "/prices?format=json&token=5172699a46c83fd85068e9464c21ab8bff140042"
var stocks = "https://api.tiingo.com/tiingo/daily/" 
// var stocksTwo = "/prices?format=json&token=5172699a46c83fd85068e9464c21ab8bff140042"
var submit = $("#submit")



function searchStock () {
    var input = $("#input").val()
    var searchURL = "https://api.tiingo.com/tiingo/utilities/search?query=" + input + "&format=json&token=5172699a46c83fd85068e9464c21ab8bff140042"
    
    $.ajax({
        url: searchURL,
        method: "GET"
    }).then(function(response) {
        response.forEach((element, i) => {
            var btn = $(`<button>`)
            $(btn).append(response[i].name)
            $(btn).attr("data-name", response[i].ticker)
            $("#search-results").append(btn)
            console.log(response)
            
        });
    });



}

var ctx = $("#myChart");

let chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            data: [80, 20, 30, 40, 50, 60]
        }],
        labels: ['January', 'February', 'March', 'April', 'May', 'June']
    },
    // options: {
    //     scales: {
    //         xAxes: [{
    //             ticks: {
    //                 min: 'March'
    //             }
    //         }]
    //     }
    // }
});

console.log(test);

$.ajax({
    url: uSix,
    method: "GET"
}).then(function(response) {
    console.log(response);
});

$.ajax({
    url: testTwo,
    method: "GET"
}).then(function(response) {
    console.log(response);
});


$("#submit").on("click", searchStock)