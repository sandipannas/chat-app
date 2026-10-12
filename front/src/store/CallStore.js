import { create } from "zustand";
import Peer from "peerjs";
import toast from "react-hot-toast";
import { useChatStore } from "./ChatStore";

const initialState = {
  peer: null,
  call: null,
  localStream: null,
  remoteStream: null,
  pendingIncomingPeerCall: null,
  incomingCall: null,
  otherUserId: null,
  callStatus: "idle",
  isMuted: false,
  isCameraOff: false,
  error: null,
};

const stopStream = (stream) => {
  stream?.getTracks().forEach((track) => track.stop());
};

const getSocket = () => useChatStore.getState().socket;

export const useCallStore = create((set, get) => ({
  ...initialState,

  createPeer: () =>
    new Promise((resolve, reject) => {
      if (get().peer) {
        resolve(get().peer);
        return;
      }

      const peer = new Peer(undefined, {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:turn.peerjs.com:3478",
            username: "peerjs",
            credential: "peerjsp",
          },
        ],
      });

      peer.on("open", () => {
        set({ peer });
        resolve(peer);
      });

      peer.on("error", (error) => {
        set({ error: error.message });
        reject(error);
      });

      peer.on("call", (incomingPeerCall) => {
        const localStream = get().localStream;

        if (localStream) {
          incomingPeerCall.answer(localStream);
          get().attachCall(incomingPeerCall);
        } else {
          set({ pendingIncomingPeerCall: incomingPeerCall });
        }
      });
    }),

  attachCall: (peerCall) => {
    set({ call: peerCall, callStatus: "connected", error: null });

    peerCall.on("stream", (remoteStream) => {
      set({ remoteStream, callStatus: "connected" });
    });

    peerCall.on("close", () => {
      if (get().call === peerCall) {
        get().finishCall(false);
      }
    });

    peerCall.on("error", (error) => {
      set({ error: error.message });
      get().finishCall(false);
    });
  },

  initializeCallListeners: () => {
    const socket = getSocket();

    if (!socket) {
      return () => {};
    }

    const handleIncomingCall = (callDetails) => {
      if (get().callStatus !== "idle") {
        socket.emit("call:reject", { callerId: callDetails.callerId });
        return;
      }

      set({
        incomingCall: callDetails,
        otherUserId: callDetails.callerId,
        callStatus: "ringing",
      });
    };

    const handleCallAccepted = ({ receiverPeerId }) => {
      const { peer, localStream, callStatus } = get();

      if (callStatus !== "calling" || !peer || !localStream) {
        return;
      }

      get().attachCall(peer.call(receiverPeerId, localStream));
    };

    const handleCallRejected = () => {
      toast("Video call declined");
      get().finishCall(false);
    };

    const handleCallEnded = () => {
      toast("Video call ended");
      get().finishCall(false);
    };

    socket.off("call:incoming");
    socket.off("call:accepted");
    socket.off("call:rejected");
    socket.off("call:ended");
    socket.on("call:incoming", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("call:rejected", handleCallRejected);
    socket.on("call:ended", handleCallEnded);

    return () => {
      socket.off("call:incoming", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("call:rejected", handleCallRejected);
      socket.off("call:ended", handleCallEnded);
    };
  },

  startCall: async (receiverId, callerName) => {
    if (get().callStatus !== "idle") {
      return;
    }

    const socket = getSocket();

    if (!socket) {
      toast.error("Socket not connected");
      return;
    }

    let localStream = null;

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const peer = await get().createPeer();

      set({
        localStream,
        otherUserId: receiverId,
        callStatus: "calling",
        error: null,
      });

      socket.emit("call:invite", {
        receiverId,
        callerName,
        callerPeerId: peer.id,
      });
    } catch (error) {
      stopStream(localStream);
      get().finishCall(false);
      set({ error: error.message });
      toast.error("Camera and microphone access is required");
    }
  },

  acceptCall: async () => {
    const incomingCall = get().incomingCall;
    const socket = getSocket();

    if (!incomingCall || !socket) {
      return;
    }

    let localStream = null;

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const peer = await get().createPeer();

      set({
        localStream,
        incomingCall: null,
        otherUserId: incomingCall.callerId,
        callStatus: "connecting",
        error: null,
      });

      const pendingCall = get().pendingIncomingPeerCall;
      if (pendingCall) {
        get().attachCall(pendingCall);
        set({ pendingIncomingPeerCall: null });
      }

      socket.emit("call:accept", {
        callerId: incomingCall.callerId,
        receiverPeerId: peer.id,
      });
    } catch (error) {
      stopStream(localStream);
      socket.emit("call:reject", { callerId: incomingCall.callerId });
      get().finishCall(false);
      set({ error: error.message });
      toast.error("Camera and microphone access is required");
    }
  },

  rejectCall: () => {
    const incomingCall = get().incomingCall;
    const socket = getSocket();

    if (incomingCall && socket) {
      socket.emit("call:reject", { callerId: incomingCall.callerId });
    }

    get().finishCall(false);
  },

  finishCall: (notifyOtherUser = true) => {
    const { call, peer, localStream, otherUserId } = get();
    const socket = getSocket();

    if (notifyOtherUser && socket && otherUserId) {
      socket.emit("call:end", { otherUserId });
    }

    call?.removeAllListeners();
    call?.close();
    peer?.destroy();
    stopStream(localStream);
    set({ ...initialState });
  },

  toggleMute: () => {
    const stream = get().localStream;
    const audioTrack = stream?.getAudioTracks()[0];

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      set({ isMuted: !audioTrack.enabled });
    }
  },

  toggleCamera: () => {
    const stream = get().localStream;
    const videoTrack = stream?.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      set({ isCameraOff: !videoTrack.enabled });
    }
  },
}));
