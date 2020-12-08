import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kakaomap',
  templateUrl: './kakaomap.component.html',
  styleUrls: ['./kakaomap.component.css']
})
export class KakaomapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let kakao = window['kakao'];

    /*
    * NOTE 지도 띄우기
    */
    var container = document.getElementById('map');
    var options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };
    var map = new kakao.maps.Map(container, options);

    /*
    * NOTE 사용자 컨트롤 표시
    */
    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    /*
    * NOTE 마커 표시하기
    */
    // 지도를 클릭한 위치에 표출할 마커입니다
    var marker = new kakao.maps.Marker({ 
      // 지도 중심좌표에 마커를 생성합니다 
      position: map.getCenter() 
    }); 
    // 지도에 마커를 표시합니다
    marker.setMap(map);

    // 지도에 클릭 이벤트를 등록합니다
    // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
      
      // 클릭한 위도, 경도 정보를 가져옵니다 
      var latlng = mouseEvent.latLng; 
      
      // 마커 위치를 클릭한 위치로 옮깁니다
      marker.setPosition(latlng);
      
      // 경/위도 출력
      var message = '위도 : ' + latlng.getLat() + ' / ';
      message += '경도 : ' + latlng.getLng() + '';
      
      var resultDiv = document.getElementById('clickLatlng'); 
      resultDiv.innerHTML = message;
    });

    /*
    * NOTE 지도 클릭 시 위치 좌표로 주소 가져오기
    */
    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
      searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
          console.log(result[0]);

          var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
          detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
          
          var content = '<div class="bAddr">' +
                          '<span class="title">법정동 주소정보</span>' + 
                          detailAddr + 
                        '</div>';

          // 마커를 클릭한 위치에 표시합니다 
          marker.setPosition(mouseEvent.latLng);
          marker.setMap(map);

          // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
          // infowindow.setContent(content);
          // infowindow.open(map, marker);
          var resultDiv = document.getElementById('viewAddress'); 
          resultDiv.innerHTML = content;

        }   
      });
    });

    function searchDetailAddrFromCoords(coords, callback) {
      // 좌표로 법정동 상세 주소 정보를 요청합니다
      geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    }
  }
}

