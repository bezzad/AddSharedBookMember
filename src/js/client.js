function getAjaxParam(url) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": { "Cache-Control": "no-cache" }
    }

    return settings;
}

Number.prototype.toPersianNums = function () { return this.toString().toPersianNums() }

String.prototype.toPersianNums = function () {
    var persian = ""
    for (let c = 0; c < this.length; c++) {
        if (48 <= this[c].charCodeAt(0) <= 57) // 0,1,...,9
            persian += String.fromCharCode(this[c].charCodeAt(0) + 1728)
        else
            persian += this[c];
    }

    return persian;
}

function getStars(real) {
    var stars = ""
    if (real) {
        switch (Math.round(real)) {
            case 1:
                stars = "";
                break;
            case 2:
                stars = "";
                break;
            case 3:
                stars = "";
                break;
            case 4:
                stars = "";
                break;
            case 5:
                stars = "";
                break;
            default:
                stars = "";
        }
    }

    return stars;
}

$(document).ready(function () {
    $('a.smoothScroll').on("click",
        function () {
            $("html,body").animate({ scrollTop: $("#focus").offset().top }, 1200);            
        });

    // fill text books
    $.ajax(getAjaxParam("https://get.taaghche.ir/v1/everything?filters={%27list%27:[{%27type%27:9}]}&size=8&start=0&order=1"))
        .done(function (response) {
            var index = 1;
            response.booksList.booksList.forEach(book => {
                var author = ""
                if (book.authors.length > 0)
                    author = book.authors[0].firstName + " " + book.authors[0].lastName;

                $('#text-book-' + index++).html("<a class='book-link' href='https://taaghche.ir/book/" + book.id + "' target='_blank'>" +
                    "<img class='book-image' src='" + book.coverUri + "?w=181&h=268' alt='" + book.title + "' title='" + book.title + "'>" +
                    "<h2 class='book-title'>" +
                    "    <strong>" + book.title + "</strong>" +
                    "</h2>" +
                    "<h3 class='book-sub-title'>" +
                    "    <span>" + author + "</span>" +
                    "</h3></a>")
            });
        });

    // fill selected books
    $.ajax(getAjaxParam("https://get.taaghche.ir/v1/everything?filters={%22list%22:[{%22id%22:3478,%22type%22:4}]}&size=6&start=0&order=0&trackingData=110"))
        .done(function (response) {
            var index = 1;
            response.booksList.booksList.forEach(book => {
                var author = ""
                if (book.authors.length > 0)
                    author = book.authors[0].firstName + " " + book.authors[0].lastName;

                var sticker = ""
                if (book.sticker)
                    sticker = book.sticker              

                $('#selected-book-' + index++).html(
                    "<a class='book-link' href='https://taaghche.ir/book/" + book.id + "' target='_blank'>" +
                    "<img class='sticker-img-small' src='" + sticker + "'>" +
                    "<img class='book-image' src='" + book.coverUri + "?w=181&h=268' alt='" + book.title + "' title='" + book.title + "'>" +
                    "<h2 class='book-title'>" +
                    "    <strong>" + book.title + "</strong>" +
                    "</h2>" +
                    "<h3 class='book-sub-title'>" +
                    "    <span>" + author + "</span>" +
                    "</h3></a>")
            });
        });

    // fill SHARED books
    $.ajax(getAjaxParam("https://get.taaghche.ir/v1/everything?filters={'list':[{'type':17}]}&order=1&size=12"))
        .done(function (response) {
            var index = 1;
            response.booksList.booksList.forEach(book => {
                $('#shared-book-' + index++).html("<a class='book-link' href='https://taaghche.ir/book/" + book.id + "' target='_blank'>" +
                    "<img class='book-image' src='" + book.coverUri + "?w=181&h=268' alt='" + book.title + "' title='" + book.title + "'></a>")
            });
        });

    // fill audio books
    $.ajax(getAjaxParam("https://get.taaghche.ir/v1/everything?filters={'list':[{'type':14}]}&size=8&start=0&order=1"))
        .done(function (response) {
            var index = 1;
            response.booksList.booksList.forEach(book => {
                var author = ""
                if (book.authors.length > 0)
                    author = book.authors[0].firstName + " " + book.authors[0].lastName;

                var sticker = ""
                if (book.sticker)
                    sticker = book.sticker

                var stars = getStars(book.rating);
                var price = book.price == 0 ? "رایگان" : book.price.toPersianNums() + " تومان";

                $('.audio-book-' + index++).html(
                    "<a class='book-link' href='https://taaghche.ir/book/" + book.id + "' target='_blank'>" +
                    "<img class='sticker-img-small' src='" + sticker + "'>" +
                    "<img class='book-image' src='" + book.coverUri + "?w=181&h=268' alt='" + book.title + "' title='" + book.title + "'>" +
                    "<h2 class='book-title'>" +
                    "    <strong>" + book.title + "</strong>" +
                    "</h2>" +
                    "<h3 class='book-sub-title'>" +
                    "    <span>" + author + "</span>" +
                    "<p class='book-list-stars'><span class='list-starts'>" + stars + "</span></p>" +
                    "</h3><p class='list-price'><span> " + price + "</span></p></a>")
            });
        });
});

