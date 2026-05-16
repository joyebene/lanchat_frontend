'use client';

import { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { WebRTCManager } from '@/lib/webrtc';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
} from 'lucide-react';

interface CallViewProps {
  onEndCall: () => void;
  contactName: string;
  callType: 'voice' | 'video';
  targetUserId: string;
  isCaller: boolean;
}

export default function CallView({
  onEndCall,
  contactName,
  callType,
  targetUserId,
  isCaller,
}: CallViewProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'voice');
  const { socket } = useSocket();
  const webRTCManagerRef = useRef<WebRTCManager | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!socket) return;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: callType === 'video',
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const manager = new WebRTCManager(socket, targetUserId);
        webRTCManagerRef.current = manager;

        manager.onRemoteStream = (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        };

        manager.start(isCaller, stream);

        socket.on('signal:incoming', (data) => {
          manager.handleSignalingData(data.signal);
        });

      } catch (error) {
        console.error('Error initializing call:', error);
        onEndCall();
      }
    };

    init();

    return () => {
      webRTCManagerRef.current?.close();
      socket?.off('signal:incoming');
    };
  }, [socket, callType, targetUserId, isCaller, onEndCall]);

  const handleToggleMute = () => {
    webRTCManagerRef.current?.toggleMute(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    webRTCManagerRef.current?.toggleVideo(!isVideoOff);
    setIsVideoOff(!isVideoOff);
  };

  const handleEndCall = () => {
    webRTCManagerRef.current?.close();
    onEndCall();
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      {/* Remote Video / Avatar */}
      <div className="flex-1 flex items-center justify-center">
        {callType === 'video' && !isVideoOff ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full bg-gray-800 object-cover" />
        ) : (
          <div className="w-48 h-48 bg-gray-800 rounded-full flex items-center justify-center">
            <p className="text-5xl font-bold text-gray-400">
              {contactName.charAt(0).toUpperCase()}
            </p>
          </div>
        )}
        <p className="absolute top-8 left-1/2 -translate-x-1/2 text-lg font-semibold">
          {contactName}
        </p>
      </div>

      {/* Local Video (Picture-in-Picture) */}
      {callType === 'video' && !isVideoOff && (
        <div className="absolute top-8 right-8 w-48 h-32 bg-gray-700 rounded-lg border-2 border-gray-600 overflow-hidden">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
      )}

      {/* Call Controls */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-t-xl absolute bottom-0 left-0 right-0">
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={handleToggleMute}
            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          {callType === 'video' && (
            <button
              onClick={handleToggleVideo}
              className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
            </button>
          )}
          <button
            onClick={handleEndCall}
            className="p-3 bg-red-600 rounded-full hover:bg-red-500 transition-colors"
            title="End Call"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}