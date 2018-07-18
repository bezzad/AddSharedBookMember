var apiAddress = "https://newsletter.taaghche.ir/api/v1/admin/newsletters/count"; //"https://newsletter.taaghche.ir/api/v1/newsletter/like?newsletterId={phoneNo}"
String.prototype.toPersianNums = function () {
    var persian = ""
    for (let c = 0; c < this.length; c++) {
        var ch = this[c].charCodeAt(0);
        if (48 <= ch && ch <= 57) // 0,1,...,9
            persian += String.fromCharCode(ch + 1728)
        else
            persian += this[c];
    }

    return persian;
}

String.prototype.toEnglishNums = function () {
    var persian = ""
    for (let c = 0; c < this.length; c++) {
        var ch = this[c].charCodeAt(0);
        if (48 + 1728 <= ch && ch <= 57 + 1728) // ۰,۱,...,۹
            persian += String.fromCharCode(ch - 1728)
        else
            persian += this[c];
    }

    return persian;
}

$(document).ready(function () {
    var telInput = $(".input-data");
    var persianTelRegexPattern = new RegExp('^۰۹[۰۱۲۳۴۵۶۷۸۹]{9}$');

    // zoom background when hover on input
    $(".input-data").hover(() => {
        $(".bgContainer").css("transform", "scale(1.3)")
    }, () => {
        $(".bgContainer").css("transform", "scale(1)")
    });

    // key down event to translate english numbers
    telInput.keydown(function (e) {
        if (persianTelRegexPattern.test(telInput.val()) == false && e.keyCode == 13) {
            e.preventDefault();
        }
    });

    telInput.keyup(function (e) {
        telInput.val(telInput.val().toPersianNums());
        if (persianTelRegexPattern.test(telInput.val())) {
            $("#divSubmit").css("display", "block");
        }
        else {
            $("#divSubmit").css("display", "none");
            if (e.keyCode == 13)
                e.preventDefault();
        }
    });

    // bootstrap validation
    bootstrapValidate('#telInput', 'min:11:طول شماره همراه حداقل ۱۱ رقم می‌باشد');
    bootstrapValidate('#telInput', 'max:11:طول شماره همراه حداکثر ۱۱ رقم می‌باشد');
    bootstrapValidate('#telInput', 'startsWith:۰۹:شماره همراه باید با  ‍‍"۰۹‍"  شروع گردد');
    bootstrapValidate('#telInput', 'required:این فیلد الزامی می‌باشد');
    // bootstrapValidate('#telInput', 'regex:^[۰۱۲۳۴۵۶۷۸۹]+$:ارقام شماره باید عدد باشند');

    // send phone no
    $("form").submit(function (e) {
        e.preventDefault();

        $.post(apiAddress.replace("{phoneNo}", telInput.val().toEnglishNums()), { "username": "behzad", "password": "H\\,g,d@13" }, function () {
            telInput.removeClass().addClass("input-data form-control is-valid");
        }).done(function () {
            $(".valid-feedback").html("کد تایید ارسال شد");
            telInput.val("");
            telInput.attr("placeholder", "کد تایید");
            telInput.attr("id", "verificateCode");
        }).fail(function (err) {
            $(".invalid-feedback").html(err.responseJSON.message);
            telInput.removeClass().addClass("input-data form-control is-invalid");
        });
    });
});

