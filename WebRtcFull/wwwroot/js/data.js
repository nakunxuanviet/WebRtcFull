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
    const startButton = document.querySelector('#startButton');
    const sendButton = document.querySelector('#sendButton');
    const closeButton = document.querySelector('#closeButton');
    const sendBox = document.querySelector('#sendBox');
    const receiveBox = document.querySelector('#receiveBox');
    let localPeerConnection, remotePeerConnection;
    let sendChannel, receiveChannel;
    startButton.disabled = false;
    sendButton.disabled = true;
    closeButton.disabled = true;
    startButton.addEventListener('click', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // no STUN server yet
            localPeerConnection = new RTCPeerConnection();
            remotePeerConnection = new RTCPeerConnection();
            localPeerConnection.onicecandidate = function (event) {
                if (event.candidate) {
                    remotePeerConnection.addIceCandidate(event.candidate);
                }
            };
            remotePeerConnection.onicecandidate = function (event) {
                if (event.candidate) {
                    localPeerConnection.addIceCandidate(event.candidate);
                }
            };
            sendChannel = localPeerConnection.createDataChannel('sendDataChannel');
            sendChannel.onopen = handleSendChannelStateChange;
            sendChannel.onclose = handleSendChannelStateChange;
            console.log('Created reliable data channel');
            remotePeerConnection.ondatachannel = function (event) {
                console.log('Receive Channel Callback: event --> ' + event);
                receiveChannel = event.channel;
                receiveChannel.onopen = function (event) {
                    console.log(receiveChannel.readyState);
                };
                receiveChannel.onmessage = function (event) {
                    receiveBox.value = event.data;
                    sendBox.value = '';
                };
                receiveChannel.onclose = function (event) {
                    console.log(receiveChannel.readyState);
                };
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
            startButton.disabled = true;
            closeButton.disabled = false;
        });
    });
    sendButton.addEventListener('click', function () {
        sendChannel.send(sendBox.value);
    });
    closeButton.addEventListener('click', function () {
        sendChannel.close();
        receiveChannel.close();
        localPeerConnection.close();
        remotePeerConnection.close();
    });
    function handleSendChannelStateChange() {
        console.log(`Send data channel state: ${sendChannel.readyState}`);
        if (sendChannel.readyState === "open") {
            sendBox.disabled = false;
            sendBox.focus();
            sendButton.disabled = false;
            closeButton.disabled = false;
        }
        else {
            sendBox.disabled = true;
            sendButton.disabled = true;
            closeButton.disabled = true;
        }
    }
})();
//# sourceMappingURL=data.js.map