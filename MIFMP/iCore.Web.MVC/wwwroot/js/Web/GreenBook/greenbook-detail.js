﻿function setArrows() {
    setTimeout(function () {
        var width = $(window).width();
        var bookWidth = $(".magazine").width();
        var arrowSize = $(".next-button").width();
        var magaLeft = $(".magazine").offset().left;
        var nextLeft = (width - bookWidth - magaLeft - 60) / 2;
        $('.next-button').animate({
            "right": nextLeft
        }, 300);
        $('.previous-button').animate({
            "left": nextLeft
        }, 300);
    }, 100);
}

function addPage(page, book) {
    var id, pages = book.turn('pages');
    var element = $('<div />', {});
    if (book.turn('addPage', element, page)) {
        element.html('<div class="gradient"></div><div class="loader"></div>');
        loadPage(page, element);
    }
}

function loadPage(page, pageElement) {
    //var img = $('<img />');
    //img.mousedown(function (e) {
    //    e.preventDefault();
    //});
    //img.load(function () {
    //    $(this).css({
    //        width: '100%',
    //        height: '100%'
    //    });
    //    $(this).appendTo(pageElement);
    //    pageElement.find('.loader').remove();
    //});
    //img.attr('src', 'pages/' + page + '.png');
    //loadRegions(page, pageElement);
    var div = $("#page_" + page.toString()).html();
    $(div).appendTo(pageElement);
    pageElement.find('.loader').remove();

}

function zoomTo(event) {
    setTimeout(function () {
        if ($('.magazine-viewport').data().regionClicked) {
            $('.magazine-viewport').data().regionClicked = false;
        } else {
            if ($('.magazine-viewport').zoom('value') == 1) {
                $('.magazine-viewport').zoom('zoomIn', event);
            } else {
                $('.magazine-viewport').zoom('zoomOut');
            }
        }
    }, 1);
}

function loadRegions(page, element) {
    //$.getJSON('pages/' + page + '-regions.json').done(function (data) {
    //    $.each(data, function (key, region) {
    //        addRegion(region, element);
    //    });
    //});
}

function addRegion(region, pageElement) {
    var reg = $('<div />', {
        'class': 'region  ' + region['class']
    }),
        options = $('.magazine').turn('options'),
        pageWidth = options.width / 2,
        pageHeight = options.height;
    reg.css({
        top: Math.round(region.y / pageHeight * 100) + '%',
        left: Math.round(region.x / pageWidth * 100) + '%',
        width: Math.round(region.width / pageWidth * 100) + '%',
        height: Math.round(region.height / pageHeight * 100) + '%'
    }).attr('region-data', $.param(region.data || ''));
    reg.appendTo(pageElement);
}

function regionClick(event) {
    var region = $(event.target);
    if (region.hasClass('region')) {
        $('.magazine-viewport').data().regionClicked = true;
        setTimeout(function () {
            $('.magazine-viewport').data().regionClicked = false;
        }, 100);
        var regionType = $.trim(region.attr('class').replace('region', ''));
        return processRegion(region, regionType);
    }
}

function processRegion(region, regionType) {
    data = decodeParams(region.attr('region-data'));
    switch (regionType) {
        case 'link':
            window.open(data.url);
            break;
        case 'zoom':
            var regionOffset = region.offset(),
                viewportOffset = $('.magazine-viewport').offset(),
                pos = {
                    x: regionOffset.left - viewportOffset.left,
                    y: regionOffset.top - viewportOffset.top
                };
            $('.magazine-viewport').zoom('zoomIn', pos);
            break;
        case 'to-page':
            $('.magazine').turn('page', data.page);
            break;
    }
}

function loadLargePage(page, pageElement) {
    var img = $('<img />');
    img.load(function () {
        var prevImg = pageElement.find('img');
        $(this).css({
            width: '100%',
            height: '100%'
        });
        $(this).appendTo(pageElement);
        prevImg.remove();
    });
    img.attr('src', 'pages/' + page + '-large.png');
}

function loadSmallPage(page, pageElement) {
    var img = pageElement.find('img');
    img.css({
        width: '100%',
        height: '100%'
    });
    img.unbind('load');
    img.attr('src', 'pages/' + page + '.png');
}

function isChrome() {
    return navigator.userAgent.indexOf('Chrome') != -1;
}

function disableControls(page) {
    if (page == 1) $('.previous-button').hide();
    else $('.previous-button').show();
    if (page == $('.magazine').turn('pages')) $('.next-button').hide();
    else $('.next-button').show();
}

function resizeViewport() {
    var width = $(window).width(),
        height = $(window).height(),
        options = $('.magazine').turn('options');
    $('.magazine').removeClass('animated');
    $('.magazine-viewport').css({
        width: width,
        height: height
    }).zoom('resize');
    setArrows();
    if ($('.magazine').turn('zoom') == 1) {
        var bound = calculateBound({
            width: options.width,
            height: options.height,
            boundWidth: Math.min(options.width, width),
            boundHeight: Math.min(options.height, height)
        });
        if (bound.width % 2 !== 0) bound.width -= 1;
        if (bound.width != $('.magazine').width() || bound.height != $('.magazine').height()) {
            $('.magazine').turn('size', bound.width, bound.height);
            if ($('.magazine').turn('page') == 1) $('.magazine').turn('peel', 'br');
        }
        $('.magazine').css({
            top: -bound.height / 2,
            left: -bound.width / 2
        });
    }
    var magazineOffset = $('.magazine').offset(),
        boundH = height - magazineOffset.top - $('.magazine').height(),
        marginTop = (boundH - $('.thumbnails > div').height()) / 2;
    if (marginTop < 0) {
        $('.thumbnails').css({
            height: 1
        });
    } else {
        $('.thumbnails').css({
            height: boundH
        });
        $('.thumbnails > div').css({
            marginTop: marginTop
        });
    }
    if (magazineOffset.top < $('.made').height()) $('.made').hide();
    else $('.made').show();
    $('.magazine').addClass('animated');
}

function numberOfViews(book) {
    return book.turn('pages') / 2 + 1;
}

function getViewNumber(book, page) {
    return parseInt((page || book.turn('page')) / 2 + 1, 10);
}

function largeMagazineWidth() {
    return 2214;
}

function decodeParams(data) {
    var parts = data.split('&'),
        d, obj = {};
    for (var i = 0; i < parts.length; i++) {
        d = parts[i].split('=');
        obj[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
    }
    return obj;
}

function calculateBound(d) {
    var bound = {
        width: d.width,
        height: d.height
    };
    if (bound.width > d.boundWidth || bound.height > d.boundHeight) {
        var rel = bound.width / bound.height;
        if (d.boundWidth / rel > d.boundHeight && d.boundHeight * rel <= d.boundWidth) {
            bound.width = Math.round(d.boundHeight * rel);
            bound.height = d.boundHeight;
        } else {
            bound.width = d.boundWidth;
            bound.height = Math.round(d.boundWidth / rel);
        }
    }
    return bound;
}