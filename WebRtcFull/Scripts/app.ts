(async function () {
	async function getMediaFromDevice() {
		try {
			return await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true
			})
		} catch (err) {
			window.alert('You must enable video to use video call')
			console.log(err)
		}
	}
	const localVideo = document.querySelector('#localVideo') as HTMLVideoElement
	const remoteVideo = document.querySelector('#remoteVideo') as HTMLVideoElement

	const localStream = await getMediaFromDevice()
	localVideo.srcObject = localStream

	const serverConfig = null
	const localPeerConnection = new RTCPeerConnection(serverConfig)
	localStream.getTracks().forEach(track => {
		localPeerConnection.addTrack(track, localStream)
	})

	const remotePeerConnection = new RTCPeerConnection(serverConfig)

	localPeerConnection.onicecandidate = function (event) {
		// adding candidate to remote peer connection
		if (event.candidate) {
			remotePeerConnection.addIceCandidate(event.candidate)
			console.log(`Local ice candidate: ${event.candidate.candidate}`)
		}
	}

	remotePeerConnection.onicecandidate = function (event) {
		// adding candidate to local peer connection
		if (event.candidate) {
			localPeerConnection.addIceCandidate(event.candidate)
			console.log(`Remote ice candidate: ${event.candidate.candidate}`)
		}
	}
	remotePeerConnection.ontrack = function (event) {
		remoteVideo.srcObject = event.streams[0]
		console.log('Received remote stream')
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

})()