import { Socket } from 'socket.io-client';

export class WebRTCManager {
    private peerConnection: RTCPeerConnection;
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;
    private socket: Socket;
    private targetUserId: string;

    public onRemoteStream: ((stream: MediaStream) => void) | null = null;

    constructor(socket: Socket, targetUserId: string) {
        this.socket = socket;
        this.targetUserId = targetUserId;

        // STUN servers for NAT traversal
        const configuration = {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        };

        this.peerConnection = new RTCPeerConnection(configuration);

        this.registerPeerConnectionListeners();
    }

    private registerPeerConnectionListeners() {
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket.emit('signal:exchange', {
                    targetUserId: this.targetUserId,
                    signal: { candidate: event.candidate },
                });
            }
        };

        this.peerConnection.ontrack = (event) => {
            this.remoteStream = event.streams[0];
            if (this.onRemoteStream) {
                this.onRemoteStream(this.remoteStream);
            }
        };
    }

    public async start(isCaller: boolean, localStream: MediaStream) {
        this.localStream = localStream;
        localStream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, localStream);
        });

        if (isCaller) {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            this.socket.emit('signal:exchange', {
                targetUserId: this.targetUserId,
                signal: { offer },
            });
        }
    }

    public async handleSignalingData(data: any) {
        if (data.offer) {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.socket.emit('signal:exchange', {
                targetUserId: this.targetUserId,
                signal: { answer },
            });
        } else if (data.answer) {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.candidate) {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    }

    public close() {
        this.peerConnection.close();
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
    }

    public toggleMute(isMuted: boolean) {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
        }
    }

    public toggleVideo(isVideoOff: boolean) {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = !isVideoOff;
            });
        }
    }
}