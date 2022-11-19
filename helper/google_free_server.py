from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time
from urllib import parse
import nest_asyncio
import asyncio              # 웹 소켓 모듈을 선언한다.
import websockets           # 클라이언트 접속이 되면 호출된다.
import json
from io import StringIO
from selenium.webdriver.common.keys import Keys




def driver_set():
    option = webdriver.ChromeOptions()

    option.add_argument('--start-maximized')
    #option.add_argument('headless')
    option.add_argument("disable-gpu")
    option.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36")
    option.add_argument("lang=ko_KR") # 한국어!
    
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=option)
    return driver
    
def set_trans_hompage():
    driver = driver_set()
    driver.implicitly_wait(3)
    driver.get('https://www.google.com/search?q=%EA%B5%AC%EA%B8%80%EB%B2%88%EC%97%AD')
    return driver


def trans_text(query, driver):
    
    input_lng = None
    output_lng = None
    input_msg = None
    
    io = StringIO(query)
    json_data = json.load(io)
    
    query = json_data['msg']
    
    query = query.replace('\n', ' ')

    input_el = driver.find_element(By.XPATH, '//*[@id="tw-source-text-ta"]')
    
    js_code = '(function (element, text) {\
        Array.prototype.forEach.call(text, function (char) {\
            element.value += char;\
            element.dispatchEvent(new KeyboardEvent("keydown"));\
            element.dispatchEvent(new KeyboardEvent("keypress"));\
            element.dispatchEvent(new KeyboardEvent("input"));\
            element.dispatchEvent(new KeyboardEvent("keyup"));\
        });\
    }).apply(null, arguments);\
    '
   
    latest_text = ''
    current_text = ''
    
    driver.execute_script(js_code, input_el, query);


    text_check = 0
    
    while True:
        
        try:
            output_el = driver.find_element(By.XPATH, '//*[@id="tw-target-text"]')
            current_text = output_el.text
            
            if latest_text == current_text:
                text_check = text_check + 1
            else:
                print(current_text)
                text_check = 0
            
            if len(current_text) != 0 and current_text != '번역 중...' and current_text != '번역' and text_check >= 5:
                break
        except:
            pass
        
        latest_text = current_text
        
        time.sleep(0.1)
            
    input_el.send_keys(Keys.CONTROL, 'a')
    input_el.send_keys(Keys.BACKSPACE)
    

    return current_text.replace('\n', ' ').strip()
        
        

async def accept_func(websocket, path):
    while True:
        data = await websocket.recv();# 클라이언트로부터 메시지를 대기한다.
        print("receive : " + data);
        text = None
        text = trans_text(data, driver)
                                   
        if text != None:
            text.strip()
            print(data + '->' + text)
            #client_socket.sendall(text.encode(encoding="utf-8"))
            
            await websocket.send(text);# 클라인언트로 echo를 붙여서 재 전송한다.
        else:
            await websocket.send('None');# 클라인언트로 echo를 붙여서 재 전송한다.
            





driver = set_trans_hompage()

nest_asyncio.apply()


# "0.0.0.0" => 서버 pc에 ip 주소를 입력해준다.
# 0000 => 서버 pc에 포트를 입력 해 준다.
start_server = websockets.serve(accept_func, "0.0.0.0", 19998);

# 비동기로 서버를 대기한다.
asyncio.get_event_loop().run_until_complete(start_server);
asyncio.get_event_loop().run_forever();

########################