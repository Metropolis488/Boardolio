var stockPortfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
var stocks = "https://api.tiingo.com/tiingo/daily/";
var portfolioSection = $("#portfolio");
var submit = $("#submit");
var resultsArea = $("#search-results");
var todayDate = moment().format("YYYY/MM/DD");
var beginDate = moment().subtract(10, "years").format("YYYY/MM/DD");
var uSix = "https://www.quandl.com/api/v3/datasets/FRED/CIVPART.json?api_key=Jcyk-GUH8y6JQHsTjovt&start_date=" + beginDate + "&end_date=" + todayDate;
var chartLabels = [];
var chartData = [];
var ctx = $("#myChart");

function searchStock (event) {
    event.preventDefault()
    var input = $("#input").val()
    var searchURL = "https://api.tiingo.com/tiingo/utilities/search?query=" + input + "&format=json&token=5172699a46c83fd85068e9464c21ab8bff140042"
    
    $.ajax({
        url: searchURL,
        method: "GET"
    }).then(function(response) {
        resultsArea.empty();
        response.forEach((element, i) => {
            var btn = $(`<button>`)
            $(btn).append(response[i].name)
            $(btn).attr("data-name", response[i].ticker)
            $(btn).addClass("result")
            $(resultsArea).append(btn)
        });
    });   
}

function addStock () {
    var clickedStock = $(this).attr("data-name");
    var stockName = $(this).text();
    var getStockPrice = "https://api.tiingo.com/tiingo/daily/" + clickedStock + "/prices?format=json&token=5172699a46c83fd85068e9464c21ab8bff140042"
    
    $.ajax({
        url: getStockPrice,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        var rawPrice = parseFloat(response[0].adjClose).toFixed(2);
        var stockCard = $("<div>");
        stockCard.append(`<p>${moment(response.date).subtract(1, "day").format('M/D/YYYY')}</p>`);
        stockCard.append(`<p>${stockName}</p>`);
        stockCard.append(`<p>Closing Price: $${rawPrice}</p>`);
        portfolioSection.append(stockCard);
    });
    stockPortfolio.unshift({
        ticker: clickedStock,
        companyName: stockName
    });
    localStorage.setItem("portfolio", JSON.stringify(stockPortfolio));
    
};


function buildChart () {
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                data: chartData
            }],
            labels: chartLabels
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
}

$.ajax({
    url: uSix,
    method: "GET"
}).then(function(response) {
    for (var i = 0; i < response.dataset.data.length; i++) {
        chartLabels.unshift(response.dataset.data[i][0]);
        chartData.unshift(response.dataset.data[i][1])
    }
    buildChart();
});
            
function getStoredStocks() {
    console.log(stockPortfolio);
    for (var i = 0; i < stockPortfolio.length; i++) {
        var stock = stockPortfolio[i].ticker
        var companyName = stockPortfolio[i].companyName
        stockHistory(stock, companyName);
    }
}

function createCard(companyName, closePrice, closeDate) {
    var stockCard = $("<div>");
    stockCard.append(`<p>${closeDate}</p>`);
    stockCard.append(`<p>${companyName}</p>`);
    stockCard.append(`<p>Closing Price: $${closePrice}</p>`);
    portfolioSection.append(stockCard);
}

function stockHistory(stock, companyName) {
        var getStockPrice = "https://api.tiingo.com/tiingo/daily/" + stock + "/prices?format=json&token=5172699a46c83fd85068e9464c21ab8bff140042";
        
        $.ajax({
            url: getStockPrice,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var closePrice = parseFloat(response[0].adjClose).toFixed(2);
            var closeDate = moment(response[0].date).add(1, "day").format('M/D/YYYY')
            createCard(companyName, closePrice, closeDate);
        });

    };
    
    getStoredStocks()
    $("#submit").on("submit", searchStock);
    $(document).on("click", ".result", addStock);