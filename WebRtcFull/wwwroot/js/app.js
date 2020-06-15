const constrains = {
    video: true,
    audio: true
};
const selfVideo = document.querySelector('#self');
navigator.getUserMedia(constrains, (stream) => {
    selfVideo.src = window.URL.createObjectURL(stream);
}, (err) => {
    window.alert('You must enable video to use video call');
    console.log(err);
});
//# sourceMappingURL=app.js.map