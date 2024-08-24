
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-VYGHJ6X08E');


$(function () {
    $("a.hidelink").each(function (index, element) {
        var href = $(this).attr("href");
        $(this).attr("varhidelink", href);
        $(this).removeAttr("href");
    });
    $("a.hidelink").click(function () {
        url = $(this).attr("varhidelink");
        window.open(url, '_blank');
    });
    $("a.hidelinkself").each(function (index, element) {
        var href = $(this).attr("href");
        $(this).attr("varhidelinkself", href);
        $(this).removeAttr("href");
    });
    $("a.hidelinkself").click(function () {
        url1 = $(this).attr("varhidelinkself");
        window.open(url1, '_self');
    })
});

function textCopyToClipboard() {
    navigator.clipboard.writeText("https://www.deltaframework.net\nAuthor: Thiruvarasamurthy G\nDeltaFramework: A cutting-edge, modern, and robust software creation bundle. It offers advanced Architecture Styles, Frameworks, Libraries, and Project Templates will accelerate the projects.");
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'auto' });
}

function openImage(img) {
    alert('hi');
    var src = img.src;
    window.open(src);
}

function changeMovableHeader() {
    var element = document.getElementById("header");

    if (element.style.position === "absolute") {
        element.style.position = "fixed";
    } else if (element.style.position === "fixed") {
        element.style.position = "absolute";
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const dateInfo = {
        "01-01": {
            image: "images/WishesIcon/WISH.png",
            message: "Happy New Year!"
        },
        "-02-14": {
            image: "images/WishesIcon/WISH.png",
            message: "Happy Valentine's Day!"
        },
        "-12-25-": {
            image: "images/WishesIcon/WISH.png",
            message: "Merry Christmas!"
        },
        "08-31": {
            image: "images/WishesIcon/WISH.png",
            message: "Happy Birtyday DeltaFramework!"
        },
        "08-20": {
            image: "images/WishesIcon/WISH.png",
            message: "Happy Birtyday Author!"
        },
        "08-21": {
            image: "images/WishesIcon/WISH.png",
            message: "Belated Happy Birtyday Author!"
        },
        "04-06": {
            image: "images/WishesIcon/WISH.png",
            message: "Happy Birtyday SivSank-SD!"
        }
    };

    var displayVal;
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');

    const key = `${month}-${day}`;

    if (dateInfo[key] == null) {
        displayVal = "none";
    }
    else {

        displayVal = "block";
    }

    const info = dateInfo[key] || { image: "images/WishesIcon/HBD.png", message: "none" };

    document.getElementById("WishesPanel").style.display = displayVal;
    document.getElementById("WishesPanelImage").src = info.image;
    document.getElementById("WishesPanelMessage").innerText = info.message;
});
