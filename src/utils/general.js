export const STREAM_TYPES = {
    HLS: 'HLS',
    WEBRTC: 'WEBRTC'
}

export const HLSPlayerControls = [
    'play-large',
    'rewind',
    'play',
    'fast-forward',
    'progress',
    'current-time',
    'duration',
    'settings',
    'pip',
    'airplay',
    'fullscreen'
]

export const WEBRTCPlayerControls = [
    'play-large',
    'play',
    'progress',
    'current-time',
    'duration',
    'pip',
    'airplay',
    'fullscreen'
]

export function addAutoQuality(autoLevelEnabled){
        const innerQuality = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='0'] span")
        if(innerQuality){
            innerQuality.innerHTML = `Auto`
        }


        if(autoLevelEnabled){
            const outerQuality = document.querySelectorAll('.plyr__control .plyr__menu__value')?.[1]

            if(outerQuality){
                outerQuality.innerHTML = 'Auto'
            }
        }
}