var latest_eng_sub = null;

function trans_when_change_subtitle(){
	
	var current_eng_sub = document.getElementsByClassName('ejoy-subtitles__sub')[0].textContent;
	
	
	if(current_eng_sub != latest_eng_sub){
		latest_eng_sub = current_eng_sub;
		trans_subtitle();
	}
}

function trans_subtitle(){
	
	var current_eng_sub = document.getElementsByClassName('ejoy-subtitles__sub')[0].textContent;
	
	var data = new Object() ;
	
	data.msg = current_eng_sub;
	
	send(data);
}

setInterval(trans_when_change_subtitle, 100);


///////////////////////////////

var server_ip = '192.168.0.22'

var webSocket = null;

var is_use_socket = false;

function set_wsk(){
	
	webSocket = new WebSocket('ws://' + server_ip + ':19998');
	
	webSocket.onclose = function(event) {
		onClose(event)
	};

	webSocket.onopen = function(event) {
		onOpen(event)
	};

	webSocket.onmessage = function(event) {
		onMessage(event)
	};
	
}

function onMessage(event) {
	if(!event.data.toString().includes('Could not read from Socket') && event.data.toString() != 'None'){
		console.log(event.data.toString());
		document.getElementsByClassName('enl-whole-title-translation')[0].childNodes[0].textContent = event.data.toString();
	}
    is_use_socket = false;
}

function onOpen(event) {
	console.log('자막서버 연결 완료');
}

function onClose(event) {
	console.log('자막서버 접속 중');
	setTimeout(set_wsk, 1000)
}

function send(data) {
	
	if(!is_use_socket){
		is_use_socket = true;

		webSocket.send(JSON.stringify(data));
	}
}

set_wsk();