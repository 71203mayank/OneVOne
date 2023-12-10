import React, {useEffect, useState, useRef} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import Peer from "simple-peer"
import io from "socket.io-client"


const socket = io.connect("http://localhost:5000")

export default function Chat() {

  const [me,setMe] = useState("");
  const [stream, setStream] = useState()
  const [receivingCall, setReceivingCall] = useState(false)
  const [caller, setCaller] = useState("")
  const [callerSignal,setCallerSignal] = useState()
  const [callAccepted, setCallAccepted] = useState(false)
  const [idToCall, setIdToCall] = useState("")
  const [callEnded, setCallEnded] = useState(false)
  const [name,setName] = useState("")

  const myVideo = useRef()
  const userVideo = useRef()
  const connectionRef = useRef()

  useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
				myVideo.current.srcObject = stream
		})

	socket.on("me", (id) => {
			setMe(id)
		})

		socket.on("callUser", (data) => {
			setReceivingCall(true)
			setCaller(data.from)
			setName(data.name)
			setCallerSignal(data.signal)
		})
	}, [])

	const callUser = (id) => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: name
			})
		})
		peer.on("stream", (stream) => {
			
				userVideo.current.srcObject = stream
			
		})
		socket.on("callAccepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	const answerCall =() =>  {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
		connectionRef.current.destroy()
	}

  return (
    <div>
      <h1>One V One</h1>
      <div>
        <div className='video-container'>
          <div>
            {stream && <video playsInline muted ref={myVideo} autoPlay style={{height: "400px", width: "400px"}}></video>}
          </div>
          <div>
            {callAccepted && !callEnded ?
            <video playsInline ref={userVideo} autoPlay style ={{height: "400px", width: "400px"}}></video>:
            null
          }
          </div>
        </div>
      </div>

      <div>
        <input value={name} onChange={(e) => setName(e.target.value)}></input>
      </div>


      <div>
        <CopyToClipboard text={me}><button>Copy to Clipboard : {}</button></CopyToClipboard>
      </div>


      <div>
        <input value={idToCall} onChange={(e) => setIdToCall(e.target.value)}></input>
      </div>


      <div>
        {callAccepted && !callEnded? (
          <button onClick={() =>leaveCall}>End Call</button>
        ) : (
          <button onClick={()=> callUser(idToCall)}> Call</button>
        )}

        {idToCall}
      </div>
      <div>
        {receivingCall && !callAccepted?(
          <button onClick={answerCall}>Anwser</button>
        ): null}
      </div>
    </div>
  )
}
