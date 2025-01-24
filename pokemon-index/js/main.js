import punctuateArray from '../util/punctuateArray.js'
import convertToTitleCase from '../util/convertToTitleCase.js';

/* const for specified elements for readability */
const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon'
const searchInput = document.querySelector('.searchInput');
const searchSubmit = document.querySelector('.searchSubmit');
const pokemonNameTitle = document.querySelector('.pokemonTitle');
const imgContainer = document.querySelector('.pokemon-img');
const typeContainer = document.querySelector('#type');
const hpContainer = document.querySelector('#hp');
const attackContainer = document.querySelector('#attack');
const defenseContainer = document.querySelector('#defense');
const heightContainer = document.querySelector('#height');
const weightContainer = document.querySelector('#weight');
const knownAbilitiesContainer = document.querySelector('#knownAbilities');
const hiddenAbilitiesContainer = document.querySelector('#hiddenAbilities');

let allPokemonNames;

fetch(`${POKEMON_URL}/?limit=100000&offset=0`)
  .then(res => {
    return res.json();
  })
  .then(data => {
    allPokemonNames = data.results.map(pokemonObj => pokemonObj.name);
})

const getPokemonInfo = (url) => {
  fetch(url)
    .then(res => {
      return res.json();
    })
    .then(data => {
      /* storing data in vars from pokemon data */
      let svgUrl = data.sprites.other.dream_world.front_default;
      let altSvgUrl = data.sprites.other["official-artwork"].front_default;
      let pokemonName = data.name;
      let elementType = data.types.map(obj => obj.type.name);
      let hp = data.stats.filter(item => item.stat.name === 'hp')[0].base_stat;
      let attack = data.stats.filter(item => item.stat.name === 'attack')[0].base_stat;
      let defense = data.stats.filter(item => item.stat.name === 'defense')[0].base_stat;
      let heightNum = Number(data.height * 0.1).toFixed(1);
      let weightNum = Number(data.weight * 0.1).toFixed(1);
      let knownAbilitiesArray = data.abilities.filter(obj => obj.is_hidden === false).map(obj => obj.ability.name);
      let hiddenAbilitiesArray = data.abilities.filter(obj => obj.is_hidden === true).map(obj => obj.ability.name);

      /* put info on the page */
      imgContainer.src = data.sprites.other.dream_world.front_default ? svgUrl : altSvgUrl;
      imgContainer.alt = pokemonName;
      pokemonNameTitle.textContent = convertToTitleCase(pokemonName);
      typeContainer.textContent = punctuateArray(elementType)
      hpContainer.textContent = hp;
      attackContainer.textContent = attack;
      defenseContainer.textContent = defense;
      heightContainer.textContent = `${heightNum} meters`;
      weightContainer.textContent = `${weightNum} kilograms`;
      knownAbilitiesContainer.textContent = punctuateArray(knownAbilitiesArray);
      hiddenAbilitiesContainer.textContent = hiddenAbilitiesArray.length > 0 ? punctuateArray(hiddenAbilitiesArray) : 'none';
    });
}

  searchSubmit.addEventListener('click', event => {
    event.preventDefault();
    let sanitizedUserInput = searchInput.value.toLowerCase().trim();
    let pokemonUrl = `${POKEMON_URL}/${sanitizedUserInput}`;
    if (allPokemonNames.includes(sanitizedUserInput)) {
      getPokemonInfo(pokemonUrl);
    }
    else {
      alert('Please make sure your spelling is correct.')
    }
})