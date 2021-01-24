import fetchCountries from './js/fetchCountries.js';
import countriesCardTemplate from './templates/country-card.hbs';
import countriesListTemplate from './templates/country-list.hbs';
import './styles.css';
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/core/dist/PNotify.css";
import { error } from "@pnotify/core";
import debounce from "lodash.debounce";

const formRef = document.querySelector('.js-search-form');
const articlesContainer = document.querySelector('.js-articles-container');

formRef.addEventListener("input", debounce(queryHandler, 500));

function queryHandler(event) {
 event.preventDefault();     // блок перезагрузки после ввода
 clearCountriesContainer();  // очистить интерфейс

  const searchQuery = event.target.value;  // - значение инпута
  
   if (!searchQuery) {       // если пустой инпут
    return;
  }

 fetchCountries(searchQuery)
   .then((data) => {
    if (data.length > 10) {   //Если бекенд вернул больше чем 10 стран подошедших под критерий введенный пользователем
     error({
      text: "Too many matches found. Please enter a more specific name!",
     });
    } else if (data.status === 404) {  // неверный ввод
     error({
      text: "No country has been found.",
     });
    } else if (data.length > 1 && data.length <= 10) {   
     countriesListMarkupHandler(data);         //Если бекенд вернул от 2-х до 10-х стран, под инпутом отображается список имен найденных стран.
    } else countriesCardMarkupHandler(data);   // Если бекенд вернул массив с одной страной, в интерфейсе рендерится разметка.
   })
   .catch((Error) => {
    Error({ text: "Enter name!" });
    console.log(Error);
   });
 }

function countriesCardMarkupHandler(country) { // создание шаблон-разметки-страны(данные)
 articlesContainer.insertAdjacentHTML('afterbegin', countriesCardTemplate(country));
}

function countriesListMarkupHandler(countries) {  // создание шаблон-разметки-списка-стран(данные)
 articlesContainer.insertAdjacentHTML('afterbegin', countriesListTemplate(countries)); 
}

function clearCountriesContainer() {
  articlesContainer.innerHTML = '';
}