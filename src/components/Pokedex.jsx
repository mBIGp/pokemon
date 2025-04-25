import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import PokemonModal from "./PokemonModal";

const generationRanges = {
  "1세대": [1, 151],
  "2세대": [152, 251],
  "3세대": [252, 386],
  "4세대": [387, 493],
  "5세대": [494, 649],
  "6세대": [650, 721],
  "7세대": [722, 809],
  "8세대": [810, 905],
  "9세대": [906, 1025],
};

function Pokedex() {
  const [typeGrouped, setTypeGrouped] = useState({});
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [selectedGen, setSelectedGen] = useState("1세대");
  const searchRef = useRef();

  const loadGeneration = ([start, end]) => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${end}&offset=${start - 1}`)
      .then((res) => res.json())
      .then(async (data) => {
        const detailData = await Promise.all(data.results.map((pokemon) => fetch(pokemon.url).then((res) => res.json())));

        setAllPokemon(detailData);

        const grouped = {};
        detailData.forEach((pokemon) => {
          pokemon.types.forEach((typeInfo) => {
            const typeName = typeInfo.type.name;
            if (!grouped[typeName]) grouped[typeName] = [];
            grouped[typeName].push(pokemon);
          });
        });

        setTypeGrouped(grouped);
      });
  };

  // 세대 변경 시 포켓몬 로딩
  useEffect(() => {
    loadGeneration(generationRanges[selectedGen]);
  }, [selectedGen]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const name = searchTerm.toLowerCase();
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setSelectedPokemon(data);
        setIsModalOpen(true);
        setSuggestions([]);
      })
      .catch(() => alert("포켓몬을 찾을 수 없습니다!"));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 pt-44">
      <Header />

      {/* 고정된 검색창 + 세대 버튼 */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-3">
          {/* 세대 선택 버튼 */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(generationRanges).map((gen) => (
              <button key={gen} onClick={() => setSelectedGen(gen)} className={`px-3 py-1 rounded-full border text-sm ${selectedGen === gen ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {gen}
              </button>
            ))}
          </div>

          {/* 검색창 */}
          <div ref={searchRef} className="flex gap-2">
            <input
              type="text"
              placeholder="포켓몬 이름을 입력하세요"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                setSearchTerm(value);

                const filtered = allPokemon.filter((pokemon) => pokemon.name.includes(value));
                setSuggestions(filtered.slice(0, 5));
              }}
            />
            <button onClick={handleSearch} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              검색
            </button>
          </div>

          {/* 자동완성 */}
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border rounded shadow w-full mt-1 z-10">
              {suggestions.map((pokemon) => (
                <li
                  key={pokemon.id}
                  onClick={() => {
                    setSearchTerm(pokemon.name);
                    setSuggestions([]);
                    setSelectedPokemon(pokemon);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 capitalize"
                >
                  {pokemon.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 타입별 섹션 */}
      {Object.entries(typeGrouped).map(([type, pokemons]) => (
        <div key={type} className="mb-10">
          <h2 className="text-2xl font-bold capitalize mb-4 text-gray-700">{type} 타입</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pokemons.map((pokemon) => (
              <div
                key={pokemon.id}
                onClick={() => {
                  setSelectedPokemon(pokemon);
                  setIsModalOpen(true);
                }}
                className="cursor-pointer border rounded-lg p-4 text-center shadow hover:shadow-md transition-all hover:bg-gray-50"
              >
                <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-20 h-20 mx-auto mb-2" />
                <p className="capitalize font-medium text-gray-800">{pokemon.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {isModalOpen && <PokemonModal pokemon={selectedPokemon} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Pokedex;
