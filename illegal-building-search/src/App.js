import React, { useState } from 'react';
import SearchOption from './components/SearchOption';
import MapButton from './components/MapButton';
import './index.css'; // Import the main CSS file for styling

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
            // 메시지가 객체 또는 다른 타입일 경우 JSON 포맷으로 표시
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

// 최근 검색 화면 컴포넌트
const RecentSearchesScreen = ({ data, onClearAll, onBack }) => {
  return (
    <div className="recent-searches-screen">
      <div className="recent-searches-header">
        <button onClick={onBack} className="back-arrow" aria-label="뒤로 가기">←</button>
        <div className="header-text-container">
          <h1 className="header-title-recent">Recent Searches</h1>
          <p className="header-subtitle-recent">Your Recent Building Searches</p>
        </div>
      </div>
      <div className="recent-searches-list-container">
        {Array.isArray(data) && data.length > 0 ? (
          <div className="recent-searches-list-cards">
            {data.map((item, index) => (
              <div key={index} className="recent-search-item-card">
                <div className="item-icon">📍</div>
                <div className="item-details">
                  {/* user_address를 메인 텍스트로 사용하고 없으면 user_road_address를 사용 */}
                  <p className="item-main-text">{item.user_address || item.user_road_address || '알 수 없는 주소'}</p>
                  {/* violation과 함께 현재 날짜 및 시간을 표시 */}
                  <p className="item-sub-text">
                    위반: {item.violation || 'N/A'} (
                    {new Date().toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                    {' '}
                    {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    )
                  </p>
                  <p className="item-sub-text">
                  {item.violation_desc}
                  </p>
                </div>
                <div className="item-arrow">›</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results-message">최근 검색 결과가 없습니다.</p>
        )}
      </div>
      <button onClick={onClearAll} className="clear-all-button">Clear All</button>
    </div>
  );
};


function App() {
  // 최근 검색 데이터를 저장할 상태
  const [recentSearchesData, setRecentSearchesData] = useState(null);
  // 모달 표시 여부를 제어할 상태 (일반 메시지용)
  const [showModal, setShowModal] = useState(false);
  // 모달에 표시될 제목과 메시지를 저장할 상태
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  // 로딩 상태를 제어할 상태 (현재 사용되지 않지만 유지를 위해 남겨둠)
  const [isLoading, setIsLoading] = useState(false);
  // 최근 검색 화면 표시 여부를 제어할 상태
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  const handleSearchOptionClick = async (option) => {
    // 모든 모달/화면을 일단 닫기
    setShowModal(false);
    setShowRecentSearches(false);
    if (option === '최근 검색') {
      setIsLoading(true); // 로딩 시작
      setModalContent({ title: '로딩 중', message: '최근 검색 데이터를 불러오는 중입니다...' });
      setShowModal(true); // 로딩 메시지를 잠시 보여줍니다.

      try {
        const response = await fetch('https://mongddang.me/archViolationList.php');
        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태: ${response.status}`);
        }
        const data = await response.json();
        // 실제 데이터 형식이 배열이 아니라면, 여기서 데이터 변환 필요
        // 예: const processedData = data.someArrayField;
        setRecentSearchesData(data.violation); // 데이터를 상태에 저장
        setShowRecentSearches(true); // 최근 검색 화면 표시
        setShowModal(false); // 로딩 모달 숨기기
      } catch (error) {
        console.error('최근 검색 데이터를 가져오는 중 오류 발생:', error);
        setModalContent({ title: '오류 발생', message: `데이터를 가져오는 데 실패했습니다: ${error.message}` });
        setShowModal(true); // 오류 메시지 모달 표시
        setRecentSearchesData(null); // 오류 발생 시 데이터 초기화
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    } else {
      // 다른 옵션 클릭 시 메시지 모달 표시
      setModalContent({ title: '옵션 클릭', message: `"${option}" 옵션을 클릭했습니다.` });
      setShowModal(true);
    }
  };

  const handleViewMapClick = () => {
    // 모든 모달/화면을 일단 닫기
    setShowModal(false);
    setShowRecentSearches(false);

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

  const handleBackToMain = () => {
    setShowRecentSearches(false); // 최근 검색 화면 닫기
    setRecentSearchesData(null); // 데이터 초기화 (선택 사항)
  };

  return (
    <>
      {showRecentSearches ? (
        <RecentSearchesScreen
          data={recentSearchesData}
          onClearAll={handleClearAllRecentSearches}
          onBack={handleBackToMain}
        />
      ) : (
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
      )}

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