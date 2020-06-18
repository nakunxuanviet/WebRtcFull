(function () {
	const startButton = document.querySelector('#startButton') as HTMLButtonElement
	const sendButton = document.querySelector('#sendButton') as HTMLButtonElement
	const closeButton = document.querySelector('#closeButton') as HTMLButtonElement

	const sendBox = document.querySelector('#sendBox') as HTMLTextAreaElement
	const receiveBox = document.querySelector('#receiveBox') as HTMLTextAreaElement

	let localPeerConnection: RTCPeerConnection, remotePeerConnection: RTCPeerConnection
	let sendChannel: RTCDataChannel, receiveChannel: RTCDataChannel

	startButton.disabled = false
	sendButton.disabled = true
	closeButton.disabled = true

	startButton.addEventListener('click', async function() {
		// no STUN server yet
		localPeerConnection = new RTCPeerConnection()

		remotePeerConnection = new RTCPeerConnection()

		localPeerConnection.onicecandidate = function (event) {
			if (event.candidate) {
				remotePeerConnection.addIceCandidate(event.candidate)
			}
		}
		remotePeerConnection.onicecandidate = function (event) {
			if (event.candidate) {
				localPeerConnection.addIceCandidate(event.candidate)
			}
		}

		sendChannel = localPeerConnection.createDataChannel('sendDataChannel')
		sendChannel.onopen = handleSendChannelStateChange
		sendChannel.onclose = handleSendChannelStateChange

		console.log('Created reliable data channel')
		remotePeerConnection.ondatachannel = function (event) {
			console.log('Receive Channel Callback: event --> ' + event)
			receiveChannel = event.channel

			receiveChannel.onopen = function (event) {
				console.log(receiveChannel.readyState)
			}
			receiveChannel.onmessage = function (event) {
				receiveBox.value = event.data
				sendBox.value = ''
			}
			receiveChannel.onclose = function (event) {
				console.log(receiveChannel.readyState)
			}
		}

		// all set, create an offer
		const localSessionDescription = await localPeerConnection.createOffer()
		console.log(`Offer from localPeerConnection: ${localSessionDescription.sdp}`)
		localPeerConnection.setLocalDescription(localSessionDescription)
		remotePeerConnection.setRemoteDescription(localSessionDescription)

		const remoteSessionDescription = await remotePeerConnection.createAnswer()
		console.log(`Answer from remotePeerConnection: ${localSessionDescription.sdp}`)
		localPeerConnection.setRemoteDescription(remoteSessionDescription)
		remotePeerConnection.setLocalDescription(remoteSessionDescription)

		startButton.disabled = true;
		closeButton.disabled = false;

	})

	sendButton.addEventListener('click', function () {
		sendChannel.send(sendBox.value)
	})

	closeButton.addEventListener('click', function () {
		sendChannel.close()
		receiveChannel.close()
		localPeerConnection.close()
		remotePeerConnection.close()
	})

	function handleSendChannelStateChange() {
		console.log(`Send data channel state: ${sendChannel.readyState}`)
		if (sendChannel.readyState === "open") {
			sendBox.disabled = false
			sendBox.focus()

			sendButton.disabled = false
			closeButton.disabled = false
		} else {
			sendBox.disabled = true

			sendButton.disabled = true
			closeButton.disabled = true
		}
	}
})()