// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";
import "./App.css";

const App = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const results = response.data.results;

        const pokemonDetails = await Promise.all(
          results.map(async (pokemon) => {
            const res = await axios.get(pokemon.url);
            return {
              name: res.data.name,
              image: res.data.sprites.front_default,
              height: res.data.height,
              weight: res.data.weight,
            };
          })
        );

        setPokemonData(pokemonDetails);
        setFilteredPokemon(pokemonDetails);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    };

    fetchPokemonData();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = pokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(query)
    );
    setFilteredPokemon(filtered);
  };

  return (
    <div className="app">
      <h1>Pokemon List</h1>
      <input
        type="text"
        placeholder="Search Pokemon..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="pokemon-container">
        {filteredPokemon.length ? (
          filteredPokemon.map((pokemon, index) => (
            <PokemonCard key={index} pokemon={pokemon} />
          ))
        ) : (
          <p>No Pokemon found</p>
        )}
      </div>
    </div>
  );
};

export default App;
