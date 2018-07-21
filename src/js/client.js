var sendPhoneNoApiAddress = "http://sep1.sepinno.ir/worldcup/landing3";
var sendVerficationCodeApiAddress = "http://sep1.sepinno.ir/worldcup/OtpEntryPostAjax";


var telInput, verificateCodeInput, smsSendTime;
var persianTelRegexPattern = new RegExp('^۰۹[۰۱۲۳۴۵۶۷۸۹]{9}$');
var numericPattern = new RegExp("^[۰۱۲۳۴۵۶۷۸۹0-9]*$");
var resendVerificationCodeTimeSec = 2;

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
    telInput = $("#telInput");
    verificateCodeInput = $("#verificateCode");

    // zoom background when hover on input
    $(".input-data").hover(() => {
        $(".bgContainer").css("transform", "scale(1.3)")
    }, () => {
        $(".bgContainer").css("transform", "scale(1)")
    });

    $(".btn-resend").click(sendSms);

    telInput.keydown(e => {
        if (persianTelRegexPattern.test(telInput.val()) && e.keyCode == 13)
            $(".contentWrap.levelOne .btn-submit").click();
    });

    telInput.on("input", function (e) {
        var newVal = telInput.val().toPersianNums();
        telInput.val(newVal);
        levelOneClearError();

        if (newVal.length > 1 && newVal.startsWith("۰۹") == false) {
            levelOneError('شماره همراه باید با  ‍‍"۰۹‍"  شروع گردد');
            return;
        }

        if (numericPattern.test(newVal) == false) {
            levelOneError('مقدار وارده باید عدد باشد');
            return;
        }

        if (persianTelRegexPattern.test(newVal)) {
            $("#submit-levelOne").removeClass("hidden");
        }
        else {
            $("#submit-levelOne").addClass("hidden");
        }
    });

    verificateCodeInput.keydown(e => {
        if (e.keyCode == 13)
            $(".contentWrap.levelTwo .btn-submit").click();
    });

    verificateCodeInput.on("input", function (e) {
        verificateCodeInput.val(verificateCodeInput.val().toPersianNums());
        if (e.keyCode == 13)
            $(".contentWrap.levelTwo .btn-submit").click();
    });

    // -------------------- send phone no ----------------------------------
    $(".contentWrap.levelOne .btn-submit").click(function () {
        sendSms();
    });
    // -------------------- send phone no ----------------------------------

    // -------------------- send verification code -------------------------
    $(".contentWrap.levelTwo .btn-submit").click(function () {
        sendVerificationCode();
    });
    // ---------------------------------------------------------------------

    telInput.focus();
});

function levelOneClearError() {
    $(".contentWrap.levelOne .invalid-feedback").addClass("hidden");
    telInput.removeClass("is-invalid");
    telInput.addClass("is-valid");
}

function levelOneError(text) {
    $(".contentWrap.levelOne .invalid-feedback").html(text);
    $(".contentWrap.levelOne .invalid-feedback").removeClass("hidden");
    telInput.addClass("is-valid");
    telInput.addClass("is-invalid");
    $(".contentWrap.levelOne .loader").addClass("hidden");
    $(".contentWrap.levelOne .btn-submit").removeClass("hidden");
}

function levelTwoError(text) {
    $(".contentWrap.levelTwo .invalid-feedback").html(text);
    (".contentWrap.levelTwo .invalid-feedback").removeClass("hidden");
    verificateCodeInput.addClass("is-invalid");
    verificateCodeInput.addClass("is-valid");
    $(".contentWrap.levelTwo .loader").addClass("hidden");
    $(".contentWrap.levelTwo .btn-submit").removeClass("hidden");
}

function startTimer() {
    var diff = Math.round(((resendVerificationCodeTimeSec * 1000) - (Date.now() - smsSendTime)) / 1000);
    if (diff > 0) {
        var reverseTimer = formatSeconds(diff);
        $("#timer").html(reverseTimer);
        setTimeout(startTimer, 500);
    }
    else {
        $("#timer").addClass("hidden");
        $(".btn-resend").removeAttr("disabled");
    }
}

function formatSeconds(seconds) {
    var date = new Date(1970, 0, 1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1").toPersianNums();
}

function sendVerificationCode() {
    $(".contentWrap.levelTwo .btn-submit").addClass("hidden");
    $(".contentWrap.levelTwo .loader").removeClass("hidden");

    var formData = new FormData();
    formData.append("PhoneNumber", telInput.val().toEnglishNums());
    formData.append("Opt", verificateCodeInput.val().toEnglishNums());

    $.ajax({
        "async": true,
        "url": sendVerficationCodeApiAddress,
        "method": "POST",
        "headers": { "Cache-Control": "no-cache" },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": formData
    }).done(function (resp) {
        var response = JSON.parse(resp);

        if (response.Data == "0") {
            $("#main-content").addClass("fadeOut");
            setTimeout(
                function () {
                    $("#main-content").addClass("hidden");
                    $("div.contentWrap.levelThree").removeClass("hidden");
                    $("div.contentWrap.levelThree").addClass("animated fadeIn");
                    verificateCodeInput.focus();
                }, 500);
        }
        else {
            levelTwoError("کد تایید صحیح نمی‌باشد");
        }
    }).fail(function (err) {
        if (err)
            levelTwoError(err);
        else
            levelTwoError("کد تایید صحیح نمی‌باشد");
    });
}

function sendSms() {
    $(".contentWrap.levelOne .btn-submit").addClass("hidden");
    $(".contentWrap.levelOne .loader").removeClass("hidden");

    $("#timer").removeClass("hidden");
    $(".btn-resend").attr("disabled", "");

    var formData = new FormData();
    formData.append("PhoneNumber", telInput.val().toEnglishNums());

    $.ajax({
        "async": true,
        "url": sendPhoneNoApiAddress,
        "method": "POST",
        "headers": { "Cache-Control": "no-cache" },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": formData
    }).done(function (resp) {
        var response = JSON.parse(resp);

        if (response.Data == "0") {
            $("div.contentWrap.levelOne").addClass("fadeOut");
            setTimeout(
                function () {
                    $("div.contentWrap.levelOne").addClass("hidden");
                    $("div.contentWrap.levelTwo").removeClass("hidden");
                    $("div.contentWrap.levelTwo").addClass("animated fadeIn");
                    verificateCodeInput.focus();
                }, 500);
            smsSendTime = Date.now();
            startTimer();
        }
        else {
            levelOneError("شماره وارد شده معتبر نمی‌باشد!");
        }
    }).fail(function (err) {
        if (err)
            levelOneError(err);
        else
            levelOneError("شماره وارد شده معتبر نمی‌باشد!");
    });
}