var resolutions = _.chain([
    '1920:1080',
    '1280:720',
    '960:720',
    '640:360',
    '640:480',
    '320:240',
    '320:180',
    '1280:720',
    '1280:800',
    '960:600',
    '960:540',
    '640:400',
    '640:360',
    '640:480',
    '480:300',
    '480:270',
    '480:360',
    '320:200',
    '320:180',
    '320:240',
    '240:150',
    '240:135',
    '240:180',
    '160:100',
    '160:90',
    '160:120'
]).uniq()
.sortBy(function(item){
    var res = item.split(':')
    return 1 / (Number(res [0]) + Number(res [1]));
}).value();

navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;
window.URL = window.webkitURL ||  window.URL;


$(function(){

    populateSelects();

    $('#resolutions-both').on('change', setUserMedia);
    $('#resolutions-width').on('change', setUserMedia);


    $(window).on('resize', displayVideoSizes);
});

function populateSelects(){
    var options = document.createDocumentFragment();
    _.each(resolutions, function(item){
        options.appendChild($('<option value=' + item + '>' + item + '</option>') [0]);
    });
    $('select').append(options);
}

function displayVideoSizes(){
    var $video = $('#video');
    if ($video.attr('src')){
        $('#display-resolutions').text('['+$video.outerWidth() + ':' + $video.outerHeight()+']');
    }
}

function setUserMedia (event){
    var $target = $(event.target),
        values = $target.val().split(':'),
        settings = {
            mandatory: {
                maxWidth: Number(values [0]),
                maxHeight: Number(values [1])
            }
        };

    if (window.localStream){
        window.localStream.stop();
        $('#video').attr('scr', '');
    }

    if ($target.attr('id').match(/width$/)){
        delete settings.mandatory.maxHeight;
    }

    console.log('settings:', settings.mandatory);

    navigator.getUserMedia({
        video: settings
    }, function(stream){
        var $video = $('#video');
        window.localStream = stream;

        if (!$('#dont-set')[0].checked){
            $video [0].width = values [0];
            $video [0].height = values [1];
        } else {
            $video.removeAttr('width');
            $video.removeAttr('height');
        }

        $video.attr('src', window.URL.createObjectURL(stream));
        $video.on('canplay', displayVideoSizes);

    }, function(){
        console.error('Compatibility chesk failed: UserMedia Error', arguments);
    });

    return false;
}