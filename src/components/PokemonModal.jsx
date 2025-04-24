import React from "react"; // 리액트 기본 import (JSX 문법 사용 위해 필요)

// 포켓몬 모달 컴포넌트 정의
// props로 pokemon 객체(상세 정보), onClose 함수(모달 닫기용)를 받음
function PokemonModal({ pokemon, onClose }) {
  // pokemon 데이터가 없으면 모달을 렌더링하지 않음 (null 반환)
  if (!pokemon) return null;

  return (
    // 모달 배경 (화면 전체 덮음)
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* 모달 본체 박스 */}
      <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
        {/* 닫기 버튼 (우측 상단 X 아이콘) */}
        <button
          onClick={onClose} // 클릭 시 onClose 함수 실행 (부모가 넘긴 닫기 핸들러)
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
        >
          &times; {/* × 기호 (곱하기처럼 생긴 닫기 아이콘) */}
          
        </button>

        {/* 포켓몬 이름 (대문자 첫 글자) */}
        <h2 className="text-2xl font-bold mb-4 capitalize text-blue-600">{pokemon.name}</h2>

        {/* 포켓몬 이미지 (정면) */}
        <img
          src={pokemon.sprites.front_default} // PokeAPI에서 제공하는 정면 이미지
          alt={pokemon.name} // 이미지 alt 텍스트 (접근성용)
          className="w-32 h-32 mx-auto mb-4"
        />

        {/* 포켓몬 정보 설명 (높이, 무게, 타입) */}
        <div className="text-gray-700">
          <p>
            <span className="font-semibold">높이:</span> {pokemon.height}
          </p>
          <p>
            <span className="font-semibold">무게:</span> {pokemon.weight}
          </p>
          <p>
            <span className="font-semibold">타입:</span> {pokemon.types.map((t) => t.type.name).join(", ")} {/* 타입 여러 개일 수 있음 */}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PokemonModal; // 외부에서 사용 가능하도록 export
