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

$(document).ready(function () {

    $(".input-data").hover(() => {
        $(".bgContainer").css("transform", "scale(1.2)")
    }, () => {
        $(".bgContainer").css("transform", "scale(1)")
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

});

