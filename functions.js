// Função para buscar drinks da API
async function searchDrinks(query) {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data.drinks);
    } catch (error) {
        console.error('Erro ao buscar drinks:', error);
    }
}

// Função para exibir os resultados na página
function displayResults(drinks) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpa os resultados anteriores
    resultsDiv.style.display = 'block'; // Mostra a área de resultados

    document.getElementById('home-button').style.display = 'inline-block'; // Mostra o botão Home

    if (drinks === null) {
        resultsDiv.innerHTML = '<p>Nenhum drink encontrado.</p>';
        return;
    }

    drinks.forEach(drink => {
        const drinkDiv = document.createElement('div');
        drinkDiv.className = 'drink';
        drinkDiv.innerHTML = `
            <h3>${drink.strDrink}</h3>
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="100">
            <h4>Ingredientes:</h4>
            <ul>${getIngredientsList(drink)}</ul>
            <p>${drink.strInstructions}</p>
        `;
        resultsDiv.appendChild(drinkDiv);
    });

    // Scroll automático para os resultados
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Função para retornar à página inicial
document.getElementById('home-button').addEventListener('click', function() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('home-button').style.display = 'none';
    document.getElementById('search-input').value = '';
});

// Função para listar ingredientes
function getIngredientsList(drink) {
    let ingredients = '';
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
            ingredients += `<li>${measure ? measure : ''} ${ingredient}</li>`;
        }
    }
    return ingredients;
}

// Função para buscar sugestões de drinks conforme o usuário digita
async function getSuggestions(query) {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        displaySuggestions(data.drinks);
    } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
    }
}

// Função para exibir sugestões abaixo da caixa de pesquisa
function displaySuggestions(drinks) {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = ''; // Limpa as sugestões anteriores

    if (drinks === null) {
        suggestionsDiv.style.display = 'none'; // Esconde a lista se não houver sugestões
        return;
    }

    suggestionsDiv.style.display = 'block'; // Mostra a lista de sugestões

    drinks.forEach(drink => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion-item';
        suggestion.innerText = drink.strDrink;
        suggestion.addEventListener('click', () => {
            document.getElementById('search-input').value = drink.strDrink; // Preenche a caixa de pesquisa
            suggestionsDiv.style.display = 'none'; // Esconde as sugestões
            searchDrinks(drink.strDrink); // Faz a busca
        });
        suggestionsDiv.appendChild(suggestion);
    });
}

// Captura o evento de submissão do formulário de busca
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    searchDrinks(query);
});

// Evento para capturar a digitação e chamar o autofill
document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value;
    if (query.length >= 2) { // Começa a sugerir após 2 caracteres
        getSuggestions(query);
    } else {
        document.getElementById('suggestions').style.display = 'none';
    }
});

function convert() {
    const ounces = document.getElementById("ounces").value;
    const grams = (ounces * 28.3495).toFixed(2); // 1 onça = 28.3495 gramas
    const result = document.getElementById("result");

    if (ounces) {
        result.textContent = `${ounces} onça(s) é igual a ${grams} grama(s).`;
    } else {
        result.textContent = "Por favor, insira um valor válido.";
    }
}
