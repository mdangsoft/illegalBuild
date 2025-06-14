import React from 'react';
import SearchOption from './components/SearchOption';
import MapButton from './components/MapButton';
import './index.css'; // Import the main CSS file for styling

function App() {
  const handleSearchOptionClick = (option) => {
    alert(`"${option}" 옵션을 클릭했습니다.`);
    // In a real application, you would navigate or perform an action here.
  };

  const handleViewMapClick = () => {
    alert('지도에서 보기 버튼을 클릭했습니다.');
    // In a real application, this would likely open a map view.
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>위반건축물 찾기</h1>
        <p>내 주변 위반 건축물, 쉽게 확인하세요.</p>
      </div>

      <div className="search-options-grid">
        <SearchOption
          icon="📍" // Unicode for location pin
          label="내 위치로 검색"
          onClick={() => handleSearchOptionClick('내 위치로 검색')}
        />
        <SearchOption
          icon="🏠" // Unicode for house
          label="주소로 검색"
          onClick={() => handleSearchOptionClick('주소로 검색')}
        />
        <SearchOption
          icon="☰" // Unicode for horizontal lines (list/menu)
          label="최근 검색"
          onClick={() => handleSearchOptionClick('최근 검색')}
        />
        <SearchOption
          icon="📢" // Unicode for megaphone
          label="신고/제보 하기"
          onClick={() => handleSearchOptionClick('신고/제보 하기')}
        />
      </div>

      <div className="map-placeholder">
        <div className="icon">📍</div>
      </div>

      <MapButton
        label="지도에서 보기"
        onClick={handleViewMapClick}
      />

      <div className="info-message">
        <span className="icon">ⓘ</span>
        새로 등록된 규제 지역을 확인하세요
      </div>
    </div>
  );
}

export default App;