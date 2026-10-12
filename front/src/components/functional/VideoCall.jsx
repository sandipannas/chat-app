import React, { useEffect, useRef } from "react";
import { Camera, CameraOff, Mic, MicOff, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallStore } from "@/store/CallStore";

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const callStatus = useCallStore((state) => state.callStatus);
  const incomingCall = useCallStore((state) => state.incomingCall);
  const localStream = useCallStore((state) => state.localStream);
  const remoteStream = useCallStore((state) => state.remoteStream);
  const isMuted = useCallStore((state) => state.isMuted);
  const isCameraOff = useCallStore((state) => state.isCameraOff);
  const acceptCall = useCallStore((state) => state.acceptCall);
  const rejectCall = useCallStore((state) => state.rejectCall);
  const finishCall = useCallStore((state) => state.finishCall);
  const toggleMute = useCallStore((state) => state.toggleMute);
  const toggleCamera = useCallStore((state) => state.toggleCamera);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callStatus === "ringing" && incomingCall) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
          <Video className="mx-auto mb-4 size-10 text-green-600" />
          <h2 className="text-xl font-semibold">Incoming video call</h2>
          <p className="mt-2 text-gray-600">
            {incomingCall.callerName || "A contact"} is calling you
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              className="bg-red-500 text-white hover:bg-red-700"
              onClick={rejectCall}
            >
              <Phone className="size-4 rotate-[135deg]" />
              Decline
            </Button>
            <Button
              className="bg-green-500 text-white hover:bg-green-700"
              onClick={acceptCall}
            >
              <Video className="size-4" />
              Accept
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!["calling", "connecting", "connected"].includes(callStatus)) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative flex h-full max-h-[800px] w-full max-w-5xl flex-col overflow-hidden rounded-lg backdrop-blur-lg p-4 ">
        <div className="relative flex min-h-0 flex-1 items-center justify-center rounded-lg">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-center text-white">
              <Video className="mx-auto mb-3 size-10 animate-pulse" />
              <p>
                {callStatus === "calling"
                  ? "Calling..."
                  : "Connecting video..."}
              </p>
            </div>
          )}

          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="absolute bottom-4 right-4 aspect-video w-32 rounded-md border-2 border-white object-cover shadow-lg sm:w-48"
          />
        </div>

        <div className="flex items-center justify-center gap-3 p-4">
          <Button
            size="icon"
            variant="secondary"
            title={isMuted ? "Unmute microphone" : "Mute microphone"}
            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
            onClick={toggleMute}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            title={isCameraOff ? "Turn camera on" : "Turn camera off"}
            aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}
            onClick={toggleCamera}
          >
            {isCameraOff ? <CameraOff /> : <Camera />}
          </Button>
          <Button
            size="icon"
            className="bg-red-500 text-white hover:bg-red-700"
            title="End call"
            aria-label="End call"
            onClick={() => finishCall()}
          >
            <Phone className="rotate-[135deg]" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
