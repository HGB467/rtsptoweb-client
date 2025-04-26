import { Button } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { getStreams } from '../../utils/streams'
import Stream from './Stream'
import RTSPModal from './RTSPModal'

const Streams = () => {
    const [streams, setStreams] = useState([])
    const [modal, setModal] = useState(false)

    useEffect(() => {
        fetchStreams()
        const interv = setInterval(() => {
            fetchStreams()
        }, 10 * 1000)

        return () => {
            clearInterval(interv)
        }
    }, [])

    async function fetchStreams() {
        const streamData = await getStreams()
        setStreams(streamData)
    }

    const sortedStreams = useMemo(()=>{
        if(!streams) return {}
     return Object.fromEntries(Object.entries(streams).sort());
    },[streams])

    return (
        <>
            <div className='pl-3 flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                    <span className='text-xl'>Streams</span>
                    <Button onClick={() => setModal(true)} type='primary'>Add Stream</Button>
                </div>
                <div className='flex gap-2'>
                    {Object.keys(sortedStreams).length > 0 ? Object.keys(sortedStreams)?.map((stream) =>
                        <Stream key={stream} stream={stream} streamVal={sortedStreams?.[stream]} fetchStreams={fetchStreams} />
                    )
                        :
                        <span>No streams found</span>
                    }
                </div>
            </div>

            <RTSPModal open={modal} onCancel={() => setModal(false)} fetchStreams={fetchStreams} />
        </>
    )
}

export default Streams