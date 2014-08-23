// just copy/pasted from https://www.webrtc-experiment.com/webrtcpedia/
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


// compatibility shim
navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;
window.URL = window.webkitURL ||  window.URL;


// main start

$(function(){
    populateSelects();

    $('#resolutions').on('change', setUserMedia);
    $(window).on('resize', displayVideoSizes);
    $('#video').on('canplaythrough', adjustSizes);
});


function populateSelects (){
    var options = document.createDocumentFragment();
    _(resolutions).each(function(item){
        var values = item.split(':'),
            ratio = (values [0] / values [1]).toFixed(3);
        options.appendChild($('<option value="' + item + '">' + item + ' ['+ ratio + ']</option>') [0]);
    });
    $('select').append(options);
}

function displayVideoSizes (){
    var $video = $('#video');
    if ($video.attr('src')){
        $('#actual-resolutions').text('['+$video.outerWidth() + ':' + $video.outerHeight()+']');
    }
}

function adjustSizes (){
    var $this = $(this);

    console.log ('videoWidth:videoHeight', this.videoWidth + ':' + this.videoHeight);

    displayVideoSizes ();

    this.width = this.videoWidth;
    this.height = this.videoHeight;

    var ratio = 4/3, adjustment = 100 / (ratio / (this.width/this.height - ratio));

    if (adjustment === 0) return;

    if (adjustment > 0) {
        adjustment = Math.floor(adjustment);
        $this.css({
            width: 100 + adjustment + '%',
            height: '100%',
            top: 0,
            left: -adjustment/2 + '%',
        });
        console.log('adjust width:', adjustment, '%');
    } else {
        adjustment = Math.ceil(-adjustment);
        $this.css({
            width: '100%',
            height: 100 + adjustment + '%',
            top: -adjustment/2 + '%',
            left: 0
        });
        console.log('adjust height:', adjustment, '%');
    }

}

function setUserMedia (){
    var $video = $('#video'),
        values = $(this).val().split(':'),
        settings = {
            mandatory: {
                maxWidth: Number(values [0]),
                maxHeight: Number(values [1])
            }
        };

    console.log('settings:', settings.mandatory);

    if (window.localStream){
        window.localStream.stop();
        $video.attr('scr', '');
    }

    navigator.getUserMedia({
        video: settings
    }, function(stream){
        window.localStream = stream;
        $video.attr('src', window.URL.createObjectURL(stream));
    }, function(){
        console.error('Compatibility chesk failed: UserMedia Error', arguments);
    });

    return false;
}