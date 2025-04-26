export const BASE_URL = 'http://localhost:5005'
export const SIGNALLING_BASE_URL = 'ws://localhost:8443'

export async function getStreams(){
    try{
      const req = await fetch(`${BASE_URL}/getStreams`)
      const res = await req.json()
      if(!req.ok || !res?.status){
        throw new Error(res?.message || "Something went wrong")
      }

      return res?.data;
    }
    catch(err){
        console.log(err)
        return []
    }
}

export async function addStream(rtsp,type, encodeOptions, hlsOptions = null){
    try{
      const data = {
        rtsp,
        stream_type: type,
        encode_options: encodeOptions,
        hls_options: hlsOptions
      }
      const req = await fetch(`${BASE_URL}/addStream`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const res = await req.json()
      if(!req.ok || !res?.status){
        throw new Error(res?.message || "Something went wrong")
      }

      return res?.message;
    }
    catch(err){
        console.log(err)
        throw new Error(err)
    }
}

export async function deleteStream(rtsp,type){
    try{
      const req = await fetch(`${BASE_URL}/deleteStream?rtsp=${encodeURIComponent(rtsp)}&stream_type=${type}`,{
        method: 'DELETE'
      })
      const res = await req.json()
      if(!req.ok || !res?.status){
        throw new Error(res?.message || "Something went wrong")
      }

      return res?.message;
    }
    catch(err){
        console.log(err)
        throw new Error(err)
    }
}