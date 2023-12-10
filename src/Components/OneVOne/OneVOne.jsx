import React, {useRef, useState} from 'react'
import Webcam from 'react-webcam';
import "./OneVOne.css"

export default function OneVOne() {

    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [isRecording,setIsRecording] = useState(false);
    const [isMediaActive,setIsMediaActive] = useState(false);
    const [recordedChunks,setRecordedChunks] = useState([]);


    const startRecording = () => {
        if(!isMediaActive){
            navigator.mediaDevices.getUserMedia({audio: true, video: true})
                .then((stream) => {
                    webcamRef.current.video.srcObject = stream;
                    setIsMediaActive(true);


                    const recorder = new MediaRecorder(stream);
    
                    recorder.ondataavailable = (e) => {
                        if(e.data.size > 0){
                            setRecordedChunks((prev) => [...prev,e.data]);
                        }
                    };


                    recorder.onstop = () => {
                        const blob = new Blob(recordedChunks,{type: 'video/webm'});
                        const videoUrl = URL.createObjectURL(blob);
                        console.log('Video URL:', videoUrl);
                    };

                    mediaRecorderRef.current = recorder;
                    recorder.start();
                    setIsRecording(true);
                })
                .catch((error) => {
                    console.error('Error accessing media devices:', error);
                });
        }
    }

    const stopRecording = () => {
        if(mediaRecorderRef.current){
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // disabling camera and microphone tracks
            const tracks = webcamRef.current.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());

            //Reset the MediaStream
            webcamRef.current.video.srcObject = null;
            setIsMediaActive(false);
        }
    }



    return (
    <div className='one-v-one'>
        <div className='video-frame user-frame'>
            <Webcam
                audio={true}
                video={true}
                ref={webcamRef}
                mirrored={true}
                screenshotFormat="image/jpeg"
                style={{width:'100%', height:'100%'}}
            />
        </div>
        <div className='video-frame'>
            two
        </div>
        <div>
            {isRecording?(<button onClick={stopRecording}>Stop Recording</button>)
            :(<button onClick={startRecording}>Start Recording</button>)}
        </div>
    </div>
    )
}


// import React, { useRef, useState } from 'react';
// import Webcam from 'react-webcam';
// import './OneVOne.css';

// export default function OneVOne() {
//   const webcamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isMediaActive, setIsMediaActive] = useState(false);
//   const [recordedChunks, setRecordedChunks] = useState([]);

//   const startRecording = () => {
//     if (!isMediaActive) {
//       navigator.mediaDevices.getUserMedia({ audio: true, video: true })
//         .then((stream) => {
//           webcamRef.current.video.srcObject = stream;
//           setIsMediaActive(true);

//           const recorder = new MediaRecorder(stream);

//           recorder.ondataavailable = (e) => {
//             if (e.data.size > 0) {
//               setRecordedChunks((prev) => [...prev, e.data]);
//             }
//           };

//           recorder.onstop = () => {
//             const blob = new Blob(recordedChunks, { type: 'video/webm' });
//             const videoUrl = URL.createObjectURL(blob);
//             console.log('Video URL:', videoUrl);
//           };

//           mediaRecorderRef.current = recorder;
//           recorder.start();
//           setIsRecording(true);
//         })
//         .catch((error) => {
//           console.error('Error accessing media devices:', error);
//         });
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);

//       // Disable camera and microphone tracks
//       const tracks = webcamRef.current.video.srcObject.getTracks();
//       tracks.forEach(track => track.stop());

//       // Reset the MediaStream
//       webcamRef.current.video.srcObject = null;
//       setIsMediaActive(false);
//     }
//   };

//   return (
//     <div className='one-v-one'>
//       <div className='video-frame user-frame'>
//         <Webcam
//           audio={true}
//           video={true}
//           ref={webcamRef}
//           mirrored={true}
//           screenshotFormat="image/jpeg"
//           style={{ width: '100%', height: '100%' }}
//         />
//       </div>
//       <div className='video-frame'>
//         {/* Display the second video frame here */}
//       </div>
//       <div>
//         {isRecording ? (
//           <button onClick={stopRecording}>Stop Recording</button>
//         ) : (
//           <button onClick={startRecording}>Start Recording</button>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useRef, useState } from 'react';
// import Webcam from 'react-webcam';
// import './OneVOne.css';

// export default function OneVOne() {
//   const webcamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedChunks, setRecordedChunks] = useState([]);

//   const startRecording = () => {
//     setRecordedChunks([]);
//     const stream = webcamRef.current.video.srcObject;

//     // Check if the stream is active before starting the recorder
//     if (stream.active) {
//       const recorder = new MediaRecorder(stream);

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           setRecordedChunks((prev) => [...prev, e.data]);
//         }
//       };

//       recorder.onstop = () => {
//         const blob = new Blob(recordedChunks, { type: 'video/webm' });
//         const videoUrl = URL.createObjectURL(blob);
//         console.log('Video URL:', videoUrl);
//       };

//       mediaRecorderRef.current = recorder;
//       recorder.start();
//       setIsRecording(true);
//     } else {
//       console.error('The MediaStream is inactive.');
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);

//       // Disable camera and microphone tracks
//       const tracks = webcamRef.current.video.srcObject.getTracks();
//       tracks.forEach(track => track.stop());

//       // Reset the MediaStream
//       webcamRef.current.video.srcObject = null;
//     }
//   };

//   return (
//     <div className='one-v-one'>
//       <div className='video-frame user-frame'>
//         <Webcam
//           audio={true}
//           video={true}
//           ref={webcamRef}
//           mirrored={true}
//           screenshotFormat="image/jpeg"
//           style={{ width: '100%', height: '100%' }}
//         />
//       </div>
//       <div className='video-frame'>
//         {/* Display the second video frame here */}
//       </div>
//       <div>
//         {isRecording ? (
//           <button onClick={stopRecording}>Stop Recording</button>
//         ) : (
//           <button onClick={startRecording}>Start Recording</button>
//         )}
//       </div>
//     </div>
//   );
// }



