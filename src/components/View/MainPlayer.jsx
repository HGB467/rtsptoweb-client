import { Button } from "antd"

const MainPlayer = ({ObjectDetectionActive, videoRef, canvasRef,  beginDetection, stopDetection }) => {
  return (
    <div className='p-6 flex gap-2 flex-col'>
        <Button className='w-max' type={ObjectDetectionActive ? 'default' : 'primary'} onClick={ObjectDetectionActive ? stopDetection : beginDetection}>{ObjectDetectionActive ? 'Stop' : 'Start'} Object Detection</Button>
        <div className='flex justify-center items-start gap-10 h-[70vh] w-full'>
  
          <div className={`${ObjectDetectionActive ? 'flex-1' : 'h-[50%] w-[50%]'}`}>
            <video ref={videoRef} autoPlay playsInline muted className='rounded-2xl'></video>
          </div>
  
          <canvas className={`${ObjectDetectionActive ? 'flex flex-1' : 'hidden'}`} ref={canvasRef}></canvas>
        </div>
      </div>
  )
}

export default MainPlayer