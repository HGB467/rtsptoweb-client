import React, { useEffect, useRef, useState } from 'react'
import HLS from 'hls.js';
import { BASE_URL } from '../../utils/streams';
import Plyr from 'plyr';
import "plyr/dist/plyr.css";
import { addAutoQuality, HLSPlayerControls } from '../../utils/general';
import ErrorCard from '../Error/ErrorCard';
import Hls from 'hls.js';
import useObjectDetection from '../../hooks/useObjectDetection';
import { Button } from 'antd';
import MainPlayer from './MainPlayer';


const HLSPlayer = ({ rtsp }) => {
    const videoRef = useRef()
    const hlsRef = useRef();
    const playerRef = useRef();
    const canvasRef = useRef()
    const timeoutRef = useRef()

    const [error, setError] = useState({ status: false, title: '', message: '' })

    const { active: ObjectDetectionActive, beginDetection, stopDetection } = useObjectDetection(videoRef, canvasRef)

    function initializeHLS(videoSrc) {
        if (HLS.isSupported()) {
            hlsRef.current = new HLS({
                startLevel: -1
            });
            hlsRef.current?.loadSource(videoSrc);

            hlsRef.current?.on(HLS.Events.MANIFEST_PARSED, function () {
                const qualities = hlsRef.current?.levels?.map((level) => level.height);
                qualities.unshift(0)
                const options = {
                    controls: HLSPlayerControls,
                    quality: {
                        default: 0,
                        options: [...qualities, 0],
                        forced: true,
                        onChange: (quality) => {
                            if (quality === 0) {
                                hlsRef.current.currentLevel = -1;
                                return;
                            }

                            hlsRef.current?.levels?.forEach((level, index) => {
                                if (level?.height === quality) {
                                    hlsRef.current.currentLevel = index;
                                }
                            });
                        }
                    }
                }
                playerRef.current = new Plyr(videoRef.current, options)
            });

            hlsRef.current?.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS.js error:", event, data);

                if (data?.fatal && data?.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    console.warn('Network error, trying to recover...');

                    clearTimeout(timeoutRef.current)

                    timeoutRef.current = setTimeout(()=>{
                        hlsRef.current.startLoad();
                    },1000)
                  }
            });

            hlsRef.current?.on(HLS.Events.LEVEL_SWITCHED, function (event, data) {
                addAutoQuality(hlsRef.current?.autoLevelEnabled)

                console.log('Quality changed to:', hlsRef.current?.levels[data?.level]?.height + 'p');
            });

            hlsRef.current.attachMedia(videoRef.current);
        }
        else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = videoSrc;
        }
    }


    useEffect(() => {
        if (!rtsp) return;
        const formattedRTSP = rtsp?.replaceAll(/[\/:?&]/g, "_")
        const videoSrc = `${BASE_URL}/${formattedRTSP}/master.m3u`
        initializeHLS(videoSrc)

        return () => {
            hlsRef.current?.destroy();
            playerRef.current?.destroy();
            clearTimeout(timeoutRef.current)
        }
    }, [])


    if (!rtsp) {
        return <div className='flex justify-center items-center p-6 min-h-screen'>
            <ErrorCard title={"Invalid Params"} message={"Valid RTSP link not found"} />
        </div>
    }

    if (error?.status) {
        return <div className='flex justify-center items-center p-6 min-h-screen'>
            <ErrorCard title={error.title} message={error?.message} />
        </div>
    }

    return (
        <MainPlayer beginDetection={beginDetection} stopDetection={stopDetection} ObjectDetectionActive={ObjectDetectionActive} videoRef={videoRef} canvasRef={canvasRef} />
    )
}

export default HLSPlayer