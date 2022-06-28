function trans(query, el){
	var result;
	$.ajax({
	 type:"POST", //전송방식
	 url:"https://thubandiablo.xyz/temp/papago.php", //호출 URL
	 data:{query:query}, //넘겨줄 데이터
	 success:function(args){
	   //alert(args); //통신에 성공했을시 실행되는 함수
	   el.innerHTML = args;
	 },
	 error:function(e){
	   //alert(e.responseText); //통신에 실패했을시 실행되는 함수
	   el.innerHTML = args;
	 }
   });
}   

function setVideoSubtitles(){

	if(document.getElementById('subtitle') == null){
		
		document.querySelector('#udemy > div.main-content-wrapper > div.main-content > div > div > main').insertAdjacentHTML("beforebegin", "\
					<div style='padding:10px;background-color:rgba(0, 0, 0, 0.3);width:100%;text-align:center;text-shadow: black 0px 0px 7px, rgb(0 0 0 / 80%) 0px 0px 18px;color: white;font-size:30px'>\
					<div id='subtitle'>subtitle</div>\
					<div id='subtitle2'>subtitle2</div>\
					</div>");
		
	}else{
		setTimeout(setVideoSubtitles, 1000);
	}
	
}
setTimeout(setVideoSubtitles, 1000);


var latest_cue_text = '';
var cue_el = null;
var cue_div = null;

var video = null;


function change_subtitles(){
	
	if (cue_div == null){
		cue_div_temp = document.getElementsByClassName('captions-display--captions-container--1-aQJ captions-display--user-inactive--2QVjh');
		if (cue_div_temp.length > 0){
			cue_div = cue_div_temp;
			cue_div[0].style.display = 'none';
		}
	}

	
	
	cue_el = document.getElementsByClassName('captions-display--captions-cue-text--ECkJu');

	if (cue_el.length > 0){

		cue_text = cue_el[0].textContent;
		
		if (cue_text != null){
		
			if (cue_text != latest_cue_text){
				latest_cue_text = cue_text;
				document.getElementById("subtitle").innerHTML = cue_text;
				trans(cue_text, document.getElementById("subtitle2"));
				video.pause();
			}

		}
	}
	
}
setInterval(change_subtitles, 100);


function set_video(){
	video = document.querySelector('video');
	if(video == null){
		setTimeout(set_video, 1000);
	}else{

		window.addEventListener("keyup", (e) => {
			console.log(e.keyCode);
			if(e.keyCode == 32){
				if(video.paused == true){
					video.play();
				}
			}else if (e.keyCode == 38){
				video.currentTime = latest_cue_time - 0.2;
				cue_text = latest_cue_text;
				video.play();

				
			}
		});
		
		
	}
}

setTimeout(set_video, 1000);



			