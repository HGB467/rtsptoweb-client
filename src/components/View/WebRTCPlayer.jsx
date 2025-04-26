import { useEffect, useRef, useState } from 'react'
import GstWebRTCAPI from 'gstwebrtc-api/src/gstwebrtc-api.js'
import { SIGNALLING_BASE_URL } from '../../utils/streams'
import Plyr from 'plyr'
import { WEBRTCPlayerControls } from '../../utils/general'
import ErrorCard from '../Error/ErrorCard'
import { v4 } from 'uuid'
import useObjectDetection from '../../hooks/useObjectDetection'
import MainPlayer from './MainPlayer'

const WebRTCPlayer = ({ rtsp }) => {
  const videoRef = useRef()
  const canvasRef = useRef()
  const playerRef = useRef()
  const consumerSession = useRef()

  // for object detection
  const { active: ObjectDetectionActive, beginDetection, stopDetection } = useObjectDetection(videoRef, canvasRef)

  const [error, setError] = useState({ status: false, title: '', message: '' })

  function initRemoteStreams(api) {
    const listener = {
      producerAdded: function (producer) {
        if (producer?.meta?.rtsp !== rtsp) return;
        setError({ status: false, title: '', message: '' })

        const producerId = producer.id
        consumerSession.current = api.createConsumerSession(producerId);
        if (consumerSession.current) {
          consumerSession.current?.addEventListener("error", (event) => {
            console.log(event,'event')
            setError({ status: true, title: 'Stream Error', message: 'An error ocurred while consuming stream' })
          });

          consumerSession.current?.addEventListener("closed", () => {
            setError({ status: true, title: 'Stream ended', message: 'Please start the stream and try again' })
          });

          consumerSession.current?.addEventListener("streamsChanged", () => {
            const streams = consumerSession.current?.streams;
            if (streams.length > 0 && videoRef.current) {
              videoRef.current.srcObject = streams[0]
            }
          });


          consumerSession.current?.connect();
        }
      },

      producerRemoved: function (producer) {
        if (producer?.meta?.rtsp !== rtsp) return;
        setError({ status: true, title: 'Stream ended', message: 'Please start the stream and try again' })
      }
    };

    api.registerProducersListener(listener);

    for (const producer of api.getAvailableProducers()) {
      listener.producerAdded(producer);
    }
  }

  function initPlayer() {
    const options = {
      controls: WEBRTCPlayerControls,
    }
    playerRef.current = new Plyr(videoRef.current, options)
  }

  useEffect(() => {
    if (!rtsp) return;

    const gstWebRTCConfig = {
      meta: { name: `RTSPClient-${v4()}` },
      signalingServerUrl: `${SIGNALLING_BASE_URL}/webrtc`,
    };

    const api = new GstWebRTCAPI(gstWebRTCConfig);
    initPlayer()
    initRemoteStreams(api);

    return () => {
      consumerSession.current?.close()
    }

  }, [])


  if (!rtsp) {
    return <div className='flex justify-center items-center p-6'>
      <ErrorCard title={"Invalid Params"} message={"Valid RTSP link not found"} />
    </div>
  }

  if (error?.status) {
    return <div className='flex justify-center items-center p-6 min-h-screen'>
      <ErrorCard title={error.title} message={error?.message} />
    </div>
  }

  return (
    <MainPlayer
    ObjectDetectionActive={ObjectDetectionActive} 
    videoRef={videoRef} 
    canvasRef={canvasRef} 
    beginDetection={beginDetection}
    stopDetection={stopDetection}
    />
  )
}

export default WebRTCPlayer