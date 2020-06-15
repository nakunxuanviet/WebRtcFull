var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        function getMediaFromDevice() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true
                    });
                }
                catch (err) {
                    window.alert('You must enable video to use video call');
                    console.log(err);
                }
            });
        }
        const localVideo = document.querySelector('#localVideo');
        const remoteVideo = document.querySelector('#remoteVideo');
        const localStream = yield getMediaFromDevice();
        localVideo.srcObject = localStream;
        const serverConfig = null;
        const localPeerConnection = new RTCPeerConnection(serverConfig);
        localStream.getTracks().forEach(track => {
            localPeerConnection.addTrack(track, localStream);
        });
        const remotePeerConnection = new RTCPeerConnection(serverConfig);
        localPeerConnection.onicecandidate = function (event) {
            // adding candidate to remote peer connection
            if (event.candidate) {
                remotePeerConnection.addIceCandidate(event.candidate);
                console.log(`Local ice candidate: ${event.candidate.candidate}`);
            }
        };
        remotePeerConnection.onicecandidate = function (event) {
            // adding candidate to local peer connection
            if (event.candidate) {
                localPeerConnection.addIceCandidate(event.candidate);
                console.log(`Remote ice candidate: ${event.candidate.candidate}`);
            }
        };
        remotePeerConnection.ontrack = function (event) {
            remoteVideo.srcObject = event.streams[0];
            console.log('Received remote stream');
        };
        // all set, create an offer
        const localSessionDescription = yield localPeerConnection.createOffer();
        console.log(`Offer from localPeerConnection: ${localSessionDescription.sdp}`);
        localPeerConnection.setLocalDescription(localSessionDescription);
        remotePeerConnection.setRemoteDescription(localSessionDescription);
        const remoteSessionDescription = yield remotePeerConnection.createAnswer();
        console.log(`Answer from remotePeerConnection: ${localSessionDescription.sdp}`);
        localPeerConnection.setRemoteDescription(remoteSessionDescription);
        remotePeerConnection.setLocalDescription(remoteSessionDescription);
    });
})();
//# sourceMappingURL=app.js.map