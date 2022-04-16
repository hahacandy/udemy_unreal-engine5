<?php
	header("Access-Control-Allow-Origin: *");
	// 네이버 Papago NMT 기계번역 Open API 예제
	$client_id_secrets = array(); // 네이버 개발자센터에서 발급받은 CLIENT ID,CLIENT SECRET
	array_push($client_id_secrets, array("id"=>"your_id", "secret"=>"your_secret"));

	

	
	$encText = urlencode($_POST["query"]);
	$postvars = "source=en&target=ko&text=".$encText;
	$url = "https://openapi.naver.com/v1/papago/n2mt";
	$is_post = true;

	while(true){

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, $is_post);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch,CURLOPT_POSTFIELDS, $postvars);
		$headers = array();
		$headers[] = "X-Naver-Client-Id: ".$client_id_secrets[count($client_id_secrets)-1]['id'];
		$headers[] = "X-Naver-Client-Secret: ".$client_id_secrets[count($client_id_secrets)-1]['secret'];
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		$response = curl_exec ($ch);
		$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close ($ch);
		if($status_code == 200) {
			$arr = json_decode($response, true);
			echo $arr['message']['result']['translatedText'];
		} else {
			$arr = json_decode($response, true);
			$errMessage = $arr['errorMessage'];
			if(strpos($errMessage, "쿼리 한도를 초과했습니다.")){
				array_pop($client_id_secrets);
				continue;
			}else{
				echo $errMessage;
			}
			
		}
		break;
	}
	
?>