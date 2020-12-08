import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kakaomap',
  templateUrl: './kakaomap.component.html',
  styleUrls: ['./kakaomap.component.css']
})
export class KakaomapComponent implements OnInit {

  nowKeyword = '';
  
  constructor() { }
  
  ngOnInit(): void {
    let kakao = window['kakao'];
    // 건물 검색어
    let keyword = '잠실타워';
    this.nowKeyword = keyword;

    let mapMarker;

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
    * NOTE 장소 검색 및 결과 목록
    */
    // 장소 검색 객체를 생성합니다
    var ps = new kakao.maps.services.Places();  

    // 마커를 담을 배열입니다
    var markers = [];

    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({zIndex:1});

    // 키워드로 장소를 검색합니다
    searchPlaces();
    // 키워드 검색을 요청하는 함수입니다
    function searchPlaces() {
      // if (!this.keyword.replace(/^\s+|\s+$/g, '')) {
      //     alert('키워드를 입력해주세요!');
      //     return false;
      // }

      // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
      ps.keywordSearch(keyword, placesSearchCB);
    }

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {

          // 정상적으로 검색이 완료됐으면 검색 목록과 마커를 표출합니다
          displayPlaces(data);

          // 페이지 번호를 표출합니다
          // displayPagination(pagination);

      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          alert('검색 결과가 존재하지 않습니다.');
          return;
      } else if (status === kakao.maps.services.Status.ERROR) {
          alert('검색 결과 중 오류가 발생했습니다.');
          return;
      }
    }

    // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
    // 인포윈도우에 장소명을 표시합니다
    function displayInfowindow(marker, title) {
      var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
      infowindow.setContent(content);
      infowindow.open(map, marker);
    }

    function displayAddress(title, lat, lng) {
      // 주소/장소 출력
      var elViewaddress = document.getElementById('viewAddress');
      elViewaddress.innerHTML = title;

      // 위/경도 출력
      displayLatlng(lat, lng);
    }

    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places) {
      var listEl = document.getElementById('placesList'), 
      // menuEl = document.getElementById('menu_wrap'),
      fragment = document.createDocumentFragment(), 
      bounds = new kakao.maps.LatLngBounds(), 
      listStr = '';
      
      // 검색 결과 목록에 추가된 항목들을 제거합니다
      removeAllChildNods(listEl);

      // 지도에 표시되고 있는 마커를 제거합니다
      removeMarkers();
      
      for ( var i=0; i<places.length; i++ ) {

          // 마커를 생성하고 지도에 표시합니다
          var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
              marker = addMarker(placePosition, i), 
              itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          bounds.extend(placePosition);

          // 마커와 검색결과 항목에 
          // mouseover 했을때 해당 장소에 인포윈도우에 장소명을 표시합니다
          // mouseout 했을 때는 인포윈도우를 닫습니다
          // click 했을 때는 해당 장소에 인포윈도우에 장소명을 표시하고, 외부에 주소를 표시합니다.
          (function(marker, title, x, y) {
            /*
            kakao.maps.event.addListener(marker, 'mouseover', function() {
                displayInfowindow(marker, title);
            });
            kakao.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
            });
            itemEl.onmouseover =  function () {
                displayInfowindow(marker, title);
            };
            itemEl.onmouseout =  function () {
                infowindow.close();
            };
            */

            kakao.maps.event.addListener(marker, 'click', function() {
              displayInfowindow(marker, title);
              displayAddress(title, x, y);
              if (mapMarker) mapMarker.setVisible(false);
            });
            itemEl.onclick = () => {
              displayInfowindow(marker, title);
              displayAddress(title, x, y);
              if (mapMarker) mapMarker.setVisible(false);
            }

          })(marker, places[i].place_name, places[i].x, places[i].y);

          fragment.appendChild(itemEl);
      }

      // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
      listEl.appendChild(fragment);
      // menuEl.scrollTop = 0;

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);
    }

    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index, places) {
      var el = document.createElement('li'),
      itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                '<div class="info">' +
                '   <h3>' + `${index+1}. ${places.place_name}` + '</h3>';
      if (places.road_address_name) {
          itemStr += '    <span>도로명 주소 : ' + places.road_address_name + '</span><br>' +
                      '   <span class="jibun gray">지번 주소 : ' +  places.address_name  + '</span>';
      } else {
          itemStr += '    <span>지번 주소 : ' +  places.address_name  + '</span>'; 
      }
                '</div>';
      el.innerHTML = itemStr;
      el.className = 'item';

      return el;
    }

    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
    function addMarker(position, idx, title?) {
      var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
          spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
          marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage 
        });

      marker.setMap(map); // 지도 위에 마커를 표출합니다
      markers.push(marker);  // 배열에 생성된 마커를 추가합니다

      return marker;
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarkers() {
      for ( var i = 0; i < markers.length; i++ ) {
          markers[i].setMap(null);
      }   
      markers = [];
    }

    // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
    /*
    function displayPagination(pagination) {
      var paginationEl = document.getElementById('pagination'),
          fragment = document.createDocumentFragment(),
          i; 

      // 기존에 추가된 페이지번호를 삭제합니다
      while (paginationEl.hasChildNodes()) {
          paginationEl.removeChild (paginationEl.lastChild);
      }

      for (i=1; i<=pagination.last; i++) {
          var el = document.createElement('a');
          el.href = "#";
          el.innerHTML = i;

          if (i===pagination.current) {
              el.className = 'on';
          } else {
              el.onclick = (function(i) {
                  return function() {
                      pagination.gotoPage(i);
                  }
              })(i);
          }

          fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    }
    */

    // 검색결과 목록의 자식 Element를 제거하는 함수입니다
    function removeAllChildNods(el) {   
      while (el.hasChildNodes()) {
          el.removeChild (el.lastChild);
      }
    }

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
      displayLatlng(latlng.getLat(), latlng.getLng());

      // 오픈된 인포윈도우 닫기
      infowindow.close();
    });

    // 경/위도 출력
    function displayLatlng(lat, lng) {
      var message = '위도 : ' + lat + ' / ';
      message += '경도 : ' + lng + '';
      
      var resultDiv = document.getElementById('clickLatlng'); 
      resultDiv.innerHTML = message;
    }

    /*
    * NOTE 지도 클릭 시 위치 좌표로 주소 가져오기
    */
    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
      marker.setVisible(true);
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
          mapMarker = marker;

          // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
          infowindow.setContent(result[0].address.address_name);
          infowindow.open(map, marker);
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

