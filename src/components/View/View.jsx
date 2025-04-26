import React from 'react'
import { useSearchParams } from "react-router-dom";
import { STREAM_TYPES } from '../../utils/general';
import HLSPlayer from './HLSPlayer';
import WebRTCPlayer from './WebRTCPlayer';
import ErrorCard from '../Error/ErrorCard';

const View = () => {
    const [searchParams] = useSearchParams();

    const rtspLink = searchParams.get("rtsp");
    const streamType = searchParams.get("type");
    return (
        streamType === STREAM_TYPES.HLS ?
        <HLSPlayer rtsp={rtspLink}/>
        : streamType === STREAM_TYPES.WEBRTC ?
        <WebRTCPlayer rtsp={rtspLink}/>
        :
        <div className='flex justify-center items-center p-6'>
        <ErrorCard title={"Invalid Stream Type"} message={"Valid stream type not found"} />
        </div>
    )
}

export default View