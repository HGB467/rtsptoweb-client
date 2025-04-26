import { Button, Card } from 'antd'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { deleteStream } from '../../utils/streams'

const Stream = ({stream,streamVal,fetchStreams}) => {
    const [deleteLoading, setDeleteLoading] = useState(false)

    const streamItem = stream?.split('-')

    const rtsp = streamItem?.[0]
    const type = streamItem?.[1]

    function viewStream(){
        window.open(`/view?rtsp=${encodeURIComponent(rtsp)}&type=${type}`,'_blank')
      }

    async function handleDeleteStream(){
        setDeleteLoading(true)
        try{
            const resp = await deleteStream(rtsp,type)
            fetchStreams()
            toast.success(resp?.message || 'RTSP Stream deleted successfully')
        }
        catch(err){
            console.log(err)
            toast.error(err?.toString() || "Something went wrong")
        }
        setDeleteLoading(false)
    }

    return (
        <Card className='w-max'>
            <div className='flex flex-col items-start gap-1'>
                <span>{rtsp?.slice(0, 50)}...</span>
                <span>Type: {type}</span>

                <div className='flex items-center gap-2'>
                    <span>Status:</span>
                    <span className={`${streamVal?.status ? 'text-green-700' : 'text-red-700'}`}>{streamVal?.message}</span>
                </div>

                <div className='flex items-center gap-2 pt-3'>
                    <Button disabled={!streamVal?.status} onClick={viewStream} type="primary">View</Button>
                    <Button loading={deleteLoading} onClick={handleDeleteStream} type="default">Delete</Button>
                </div>
            </div>
        </Card>
    )
}

export default Stream