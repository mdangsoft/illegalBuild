import React, { useState } from 'react';
// import './index.css'; // 이 환경에서는 CSS 파일을 직접 임포트하지 않습니다.

// 메시지/데이터를 표시하기 위한 간단한 모달 컴포넌트
const MessageModal = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="message-modal-overlay">
      <div className="message-modal-content">
        <h2 className="message-modal-title">{title}</h2>
        <div className="modal-scroll-area">
          {typeof message === 'string' ? (
            <p className="modal-text pre-wrap">{message}</p>
          ) : (
            <pre className="modal-pre-formatted">
              {JSON.stringify(message, null, 2)}
            </pre>
          )}
        </div>
        <button
          onClick={onClose}
          className="message-modal-close-button"
          aria-label="모달 닫기"
        >
          &times;
        </button>
        <button
          onClick={onClose}
          className="message-modal-confirm-button"
        >
          확인
        </button>
      </div>
    </div>
  );
};

// 검색 옵션 버튼 컴포넌트
const SearchOption = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="search-option"
    >
      <div className="icon">{icon}</div>
      <span className="label">{label}</span>
    </button>
  );
};

// 지도에서 보기 버튼 컴포넌트
const MapButton = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="map-button"
    >
      {label}
    </button>
  );
};

// 최근 검색 화면 컴포넌트
const RecentSearchesScreen = ({ data, onClearAll, onBack }) => {
  return (
    <div className="recent-searches-screen">
      <div className="recent-searches-header">
        <button onClick={onBack} className="back-arrow" aria-label="뒤로 가기">←</button>
        <div className="header-text-container">
          <h1 className="header-title-recent">최근 검색 결과</h1> {/* 변경된 제목 */}
          <p className="header-subtitle-recent">Your Recent Building Searches</p>
        </div>
      </div>
      <div className="recent-searches-list-container">
        {Array.isArray(data) && data.length > 0 ? (
          <div className="recent-searches-list-cards">
            {data.map((item, index) => {
              // 현재 시간을 이미지의 형식(YY. MM. DD. HH:mm)에 맞춰 생성
              const now = new Date();
              const year = String(now.getFullYear()).slice(2);
              const month = String(now.getMonth() + 1).padStart(2, '0');
              const day = String(now.getDate()).padStart(2, '0');
              const hours = String(now.getHours()).padStart(2, '0');
              const minutes = String(now.getMinutes()).padStart(2, '0');
              const dateTimeString = `${year}. ${month}. ${day}. ${hours}:${minutes}`;

              return (
                <div key={index} className="recent-search-item-card">
                  <div className="item-icon">📍</div>
                  <div className="item-content-wrapper"> {/* 새로운 래퍼 */}
                    <p className="item-address-display">
                      {item.user_address || item.user_road_address || '알 수 없는 주소'}
                    </p>
                    <p className="item-violation-status-text">
                      위반: {item.violation || 'N/A'} ({dateTimeString})
                    </p>
                    <p className="item-violation-description">
                      {item.violation_desc || '위반 설명 없음'}
                    </p>
                  </div>
                  <div className="item-arrow">›</div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-results-message">최근 검색 결과가 없습니다.</p>
        )}
      </div>
      <button onClick={onClearAll} className="clear-all-button">Clear All</button>
    </div>
  );
};

// 검색 결과 화면 컴포넌트
const SearchResultsScreen = ({ data, onBack }) => {
  return (
    <div className="search-results-screen">
      <div className="search-results-header">
        <button onClick={onBack} className="back-arrow" aria-label="뒤로 가기">←</button>
        <div className="header-text-container">
          <h1 className="header-title-results">Search Results</h1>
          {/* 부제목이나 결과 수 등을 여기에 표시할 수 있습니다 */}
        </div>
      </div>
      <div className="search-filters">
        <div className="filter-dropdown">
            <span className="filter-label">Address</span>
            <span className="filter-value">All Address <span className="arrow-down">▼</span></span>
        </div>
        <div className="filter-dropdown">
            <span className="filter-label">Area</span>
            <span className="filter-value">All Area <span className="arrow-down">▼</span></span>
        </div>
        <div className="filter-dropdown">
            <span className="filter-label">Violation Type</span>
            <span className="filter-value">All Types <span className="arrow-down">▼</span></span>
        </div>
      </div>
      <div className="search-results-list-container">
        {Array.isArray(data) && data.length > 0 ? (
          <div className="search-results-list-items">
            {data.map((item, index) => {
              const addressPart = item.user_address ? item.user_address.split(' ')[1] : 'N/A'; // 예: '강남구'
              const violationType = item.violation_desc ? item.violation_desc.split(']')[0].replace('[', '') : 'N/A'; // 예: '증축'
              const statusText = item.status === 1 ? '위반' : '정상'; // 'status' 속성 사용, 1은 위반으로 가정

              return (
                <div key={index} className="search-result-item-card">
                  <div className="item-icon">📍</div>
                  <div className="item-details">
                    <p className="item-main-text">{item.user_address || item.user_road_address || '주소 정보 없음'}</p>
                    <p className="item-sub-text">
                      지역: {addressPart} &middot; 유형: {violationType}
                    </p>
                  </div>
                  <div className="item-status">{statusText}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-results-message">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};


function App() {
  // 최근 검색 데이터를 저장할 상태 (RecentSearchesScreen과 SearchResultsScreen 모두에 사용)
  const [recentSearchesData, setRecentSearchesData] = useState(null);
  // 모달 표시 여부를 제어할 상태 (일반 메시지용)
  const [showModal, setShowModal] = useState(false);
  // 모달에 표시될 제목과 메시지를 저장할 상태
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  // 로딩 상태를 제어할 상태
  const [isLoading, setIsLoading] = useState(false);
  // 현재 표시될 화면을 제어할 상태 ('main', 'recentSearches', 'searchResults')
  const [currentScreen, setCurrentScreen] = useState('main');

  const handleSearchOptionClick = async (option) => {
    setShowModal(false); // 기존 모달 닫기

    if (option === '최근 검색') {
      setIsLoading(true); // 로딩 시작
      setModalContent({ title: '로딩 중', message: '최근 검색 데이터를 불러오는 중입니다...' });
      setShowModal(true); // 로딩 메시지 모달 표시

      try {
        const response = await fetch('https://mongddang.me/archViolationList.php');
        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태: ${response.status}`);
        }
        const result = await response.json();
        const data = result.violation || []; // 'violation' 배열 추출
        setRecentSearchesData(data); // 데이터 상태에 저장
        setCurrentScreen('recentSearches'); // 최근 검색 화면으로 전환
        setShowModal(false); // 로딩 모달 숨기기
      } catch (error) {
        console.error('최근 검색 데이터를 가져오는 중 오류 발생:', error);
        setModalContent({ title: '오류 발생', message: `데이터를 가져오는 데 실패했습니다: ${error.message}` });
        setShowModal(true); // 오류 메시지 모달 표시
        setRecentSearchesData(null); // 오류 발생 시 데이터 초기화
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    } else if (option === '주소로 검색' || option === '내 위치로 검색') { // '주소로 검색' 또는 '내 위치로 검색' 클릭 시
      setIsLoading(true);
      setModalContent({ title: '로딩 중', message: '검색 결과를 불러오는 중입니다...' });
      setShowModal(true);

      try {
        const response = await fetch('https://mongddang.me/archViolationList.php'); // 동일 API 사용 (데모용)
        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태: ${response.status}`);
        }
        const result = await response.json();
        const data = result.violation || []; // 'violation' 배열 추출
        setRecentSearchesData(data); // 검색 결과 데이터 상태에 저장
        setCurrentScreen('searchResults'); // 검색 결과 화면으로 전환
        setShowModal(false); // 로딩 모달 숨기기
      } catch (error) {
        console.error('검색 결과를 가져오는 중 오류 발생:', error);
        setModalContent({ title: '오류 발생', message: `데이터를 가져오는 데 실패했습니다: ${error.message}` });
        setShowModal(true); // 오류 메시지 모달 표시
        setRecentSearchesData(null); // 오류 발생 시 데이터 초기화
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    } else {
      // 다른 옵션 클릭 시 일반 메시지 모달 표시
      setModalContent({ title: '옵션 클릭', message: `"${option}" 옵션을 클릭했습니다.` });
      setShowModal(true);
    }
  };

  const handleViewMapClick = () => {
    setShowModal(false);
    setCurrentScreen('main'); // 다른 화면에서 돌아올 때를 대비 (필요시)

    // 지도에서 보기 버튼 클릭 시 메시지 모달 표시
    setModalContent({ title: '지도에서 보기', message: '지도에서 보기 버튼을 클릭했습니다.' });
    setShowModal(true);
  };

  const handleClearAllRecentSearches = () => {
    setRecentSearchesData([]); // 모든 최근 검색 데이터 지우기
    setModalContent({ title: '완료', message: '최근 검색 기록이 모두 지워졌습니다.' });
    setShowModal(true); // 완료 메시지 모달 표시
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent({ title: '', message: '' });
  };

  // 현재 화면을 'main'으로 되돌리는 함수 (뒤로 가기)
  const handleBackToMain = () => {
    setCurrentScreen('main');
    setRecentSearchesData(null); // 데이터 초기화 (선택 사항)
  };

  // 현재 화면을 렌더링하는 헬퍼 함수
  const renderScreen = () => {
    switch (currentScreen) {
      case 'main':
        return (
          <div className="app-container">
            {/* 헤더 섹션 */}
            <div className="header">
              <h1>위반건축물 찾기</h1>
              <p>내 주변 위반 건축물, 쉽게 확인하세요.</p>
            </div>

            {/* 검색 옵션 그리드 */}
            <div className="search-options-grid">
              <SearchOption
                icon="📍"
                label="내 위치로 검색"
                onClick={() => handleSearchOptionClick('내 위치로 검색')}
              />
              <SearchOption
                icon="🏠"
                label="주소로 검색"
                onClick={() => handleSearchOptionClick('주소로 검색')}
              />
              <SearchOption
                icon="☰"
                label="최근 검색"
                onClick={() => handleSearchOptionClick('최근 검색')}
              />
              <SearchOption
                icon="📢"
                label="신고/제보 하기"
                onClick={() => handleSearchOptionClick('신고/제보 하기')}
              />
            </div>

            {/* 지도 플레이스홀더 */}
            <div className="map-placeholder">
              <div className="icon">📍</div>
            </div>

            {/* 지도에서 보기 버튼 */}
            <MapButton
              label="지도에서 보기"
              onClick={handleViewMapClick}
            />

            {/* 정보 메시지 */}
            <div className="info-message">
              <span className="icon">ⓘ</span>
              새로 등록된 규제 지역을 확인하세요
            </div>
          </div>
        );
      case 'recentSearches':
        return (
          <RecentSearchesScreen
            data={recentSearchesData}
            onClearAll={handleClearAllRecentSearches}
            onBack={handleBackToMain} // 뒤로 가기 버튼 클릭 시 메인으로
          />
        );
      case 'searchResults':
        return (
          <SearchResultsScreen
            data={recentSearchesData} // 동일한 데이터 상태 사용
            onBack={handleBackToMain} // 뒤로 가기 버튼 클릭 시 메인으로
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderScreen()}
      {/* 메시지 모달 컴포넌트 (로딩, 에러, 일반 메시지용) */}
      <MessageModal
        show={showModal}
        title={modalContent.title}
        message={modalContent.message}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default App;
