import React, { useState, useEffect } from "react";
import Header from "./Header"; // 상단 헤더 컴포넌트 불러오기
import PokemonModal from "./PokemonModal"; // 포켓몬 상세 정보 표시용 모달 컴포넌트 불러오기

function Pokedex() {
  // 전체 포켓몬 리스트 저장
  const [pokemonList, setPokemonList] = useState([]);

  // 선택된 포켓몬의 상세 정보 저장
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // 모달 창 열림 여부 저장
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 검색창 입력값 저장
  const [searchTerm, setSearchTerm] = useState("");

  // 자동완성 후보 포켓몬 리스트 저장
  const [suggestions, setSuggestions] = useState([]);

  // 컴포넌트가 처음 렌더링될 때 한 번 실행 (151마리 포켓몬 가져오기)
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json()) // 응답을 JSON으로 파싱
      .then((data) => setPokemonList(data.results)); // 포켓몬 리스트 저장
  }, []);

  // 특정 포켓몬의 상세 정보를 API에서 가져오는 함수
  const fetchPokemonDetail = (url) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSelectedPokemon(data); // 포켓몬 상세 정보 저장
        setIsModalOpen(true); // 모달 열기
      });
  };

  // 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = () => {
    if (!searchTerm.trim()) return; // 빈 값일 경우 아무 작업 안 함

    const name = searchTerm.toLowerCase(); // 소문자로 변환

    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found"); // 찾지 못했을 경우 에러 처리
        return res.json(); // JSON으로 파싱
      })
      .then((data) => {
        setSelectedPokemon(data); // 상세 정보 저장
        setIsModalOpen(true); // 모달 열기
        setSuggestions([]); // 자동완성 닫기
      })
      .catch(() => alert("포켓몬을 찾을 수 없습니다!")); // 에러 메시지 출력
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {" "}
      {/* 전체 레이아웃 */}
      <Header /> {/* 상단 헤더 */}
      {/* 검색창 + 자동완성 기능 */}
      <div className="relative mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="포켓몬 이름을 입력하세요"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            value={searchTerm} // 입력값 바인딩
            onChange={(e) => {
              const value = e.target.value.toLowerCase(); // 입력값 소문자로 저장
              setSearchTerm(value); // 상태 업데이트

              // 자동완성 후보 필터링 (이름에 포함된 포켓몬만 추출)
              const filtered = pokemonList.filter((pokemon) => pokemon.name.includes(value));
              setSuggestions(filtered.slice(0, 5)); // 최대 5개까지만 보여줌
            }}
          />
          <button
            onClick={handleSearch} // 검색 실행
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            검색
          </button>
        </div>

        {/* 자동완성 드롭다운 목록 */}
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border rounded shadow w-full mt-1 z-10">
            {suggestions.map((pokemon, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSearchTerm(pokemon.name); // 선택한 이름 입력창에 채움
                  setSuggestions([]); // 자동완성 닫기
                  fetchPokemonDetail(pokemon.url); // 해당 포켓몬 상세 정보 가져오기
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 capitalize"
              >
                {pokemon.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* 포켓몬 카드 리스트 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pokemonList.map((pokemon, idx) => {
          // 포켓몬 ID 추출 (이미지 URL에 사용됨)
          const id = pokemon.url.split("/").filter(Boolean).pop();

          // 포켓몬 이미지 URL
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

          return (
            <div
              key={idx}
              onClick={() => fetchPokemonDetail(pokemon.url)} // 카드 클릭 시 상세 정보 표시
              className="cursor-pointer border rounded-lg p-4 text-center shadow hover:shadow-md transition-all hover:bg-gray-50"
            >
              <img
                src={imageUrl} // 포켓몬 이미지
                alt={pokemon.name}
                className="w-20 h-20 mx-auto mb-2"
              />
              <p className="capitalize font-medium text-gray-800">{pokemon.name}</p>
            </div>
          );
        })}
      </div>
      {/* 포켓몬 상세 정보 모달 */}
      {isModalOpen && (
        <PokemonModal
          pokemon={selectedPokemon} // 상세 데이터 전달
          onClose={() => setIsModalOpen(false)} // 닫기 함수 전달
        />
      )}
    </div>
  );
}

export default Pokedex;
