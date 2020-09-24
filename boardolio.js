var stockPortfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
var stockNotes = JSON.parse(localStorage.getItem("notes")) || [];
var stocks = "https://api.tiingo.com/tiingo/daily/";
var portfolioSection = $("#portfolio");
var submit = $("#submit");
var resultsArea = $("#search-results");
var todayDate = moment().format("YYYY/MM/DD");
var beginDate = moment().subtract(10, "years").format("YYYY/MM/DD");
var uSix = "https://api.codetabs.com/v1/proxy/?quest=https://www.quandl.com/api/v3/datasets/FRED/CIVPART.json?api_key=Jcyk-GUH8y6JQHsTjovt&start_date=" + beginDate + "&end_date=" + todayDate;
var chartLabels = [];
var chartData = [];
var ctx = $("#myChart");

function searchStock (event) {
    event.preventDefault()
    var input = $("#input").val()
    var searchURL = "https://api.codetabs.com/v1/proxy/?quest=https://api.tiingo.com/tiingo/utilities/search?query=" + input + "&format=json&token=5172699a46c83fd85068e9464c21ab8bff140042"
    
    $.ajax({
        url: searchURL,
        method: "GET",
        // dataType: "jsonp"
    }).then(function(response) {
        resultsArea.empty();
        $(resultsArea).append(`<h5>Search Results for ${input}:</h5>`)
        response.forEach((element, i) => {
            var btn = $(`<button>`)
            $(btn).append(response[i].name)
            $(btn).attr("data-name", response[i].ticker)
            $(btn).addClass("result w3-button w3-padding w3-theme-l3 w3-round w3-large w3-border-white")        
            $(btn).css("margin", "10px")
            $(resultsArea).append(btn)
        });
        $("#input").val("");
    });   
}

function addStock () {
    var clickedStock = $(this).attr("data-name");
    var stockName = $(this).text();
    var getStockPrice = "https://api.codetabs.com/v1/proxy/?quest=https://api.tiingo.com/tiingo/daily/" + clickedStock + "/prices?format=json&token=5172699a46c83fd85068e9464c21ab8bff140042"
    
    $.ajax({
        url: getStockPrice,
        method: "GET",
        // dataType: "jsonp"
    }).then(function(response) {
        console.log(response)
        var rawPrice = parseFloat(response[0].adjClose).toFixed(2);
        var subCard = $(`<div style="margin: 10px">`)
        subCard.addClass("w3-card-4 w3-quarter w3-center w3-light-gray")
        subCard.append(`<section class="w3-gray cardtitle">${stockName}</section>`);
        subCard.append(`<p class="w3-light-gray">Closing Price: $${rawPrice}</p>`);
        subCard.append(`<div class="w3-container w3-border-top"><i class="fa fa-trash w3-button"></i></div>`);
        portfolioSection.append(subCard);
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
                fill: false,
                label: "Jobs Participation Rate",
                lineTension: 0.1,
                borderColor: "rgba(98,118,141,1)",
                pointBorderColor: "rgba(186, 196, 207, 1)",
                data: chartData
            }],
            labels: chartLabels
        },
    });
}

$.ajax({
    url: uSix,
    method: "GET",
    // dataType: "jsonp"
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

function stockHistory(stock, companyName) {
    var getStockPrice = "https://api.codetabs.com/v1/proxy/?quest=https://api.tiingo.com/tiingo/daily/" + stock + "/prices?format=json&token=5172699a46c83fd85068e9464c21ab8bff140042";
    
    $.ajax({
        url: getStockPrice,
        method: "GET",
        // dataType: "jsonp"
        }).then(function(response) {
            console.log(response);
            var closePrice = parseFloat(response[0].adjClose).toFixed(2);
            var closeDate = moment(response[0].date).add(1, "day").format('M/D/YYYY')
            createCard(companyName, closePrice);
            pricingDate(closeDate)
        });

    };

function pricingDate(closeDate) {
    $("#todayDate").text(`Prices as of: ${closeDate}`);

}

function createCard(companyName, closePrice) {
    var subCard = $(`<div style="margin: 10px">`)
    subCard.addClass("w3-card-4 w3-quarter w3-center w3-light-gray");
    subCard.append(`<section class="w3-gray cardtitle">${companyName}</section>`);
    subCard.append(`<p class="w3-light-gray">Closing Price: $${closePrice}</p>`);
    subCard.append(`<div class="w3-container w3-border-top"><i class="fa fa-trash w3-button"></i></div>`);
    portfolioSection.append(subCard);
}


function deleteCard() {
    var trash = $(this).parent();
    var theOne = trash.parent();
    var companyID = trash.siblings('section').text();

    for (var i = 0; i <stockPortfolio.length; i++) {
        if(stockPortfolio[i].companyName == companyID){
            console.log(i);
            stockPortfolio.splice(i, 1);
        }
        localStorage.setItem("portfolio", JSON.stringify(stockPortfolio));
    }
    theOne.remove();    
}

// function noteModal() {
//     // $("#modal").style.display="block";

//     var cardTitle = $(this).text()
//     console.log(cardTitle)


// }
    
    getStoredStocks()
    $("#submit").on("submit", searchStock);
    $(document).on("click", ".result", addStock);
    $(document).on("click", ".fa", deleteCard);
    // $(document).on("click", ".cardtitle", noteModal)
