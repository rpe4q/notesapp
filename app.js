import { saveAs } from './FileSaver.js';

const cards = document.querySelector('.cards')
const addButton = document.querySelector('#addButton')
const rmButton = document.querySelector('.rmButton')
const chgButton = document.querySelector('.chButton')
const impButton = document.querySelector('#impButton')
const expButton = document.querySelector('#expButton')
const txtContent = document.querySelector('#text')

async function loadGreeting() {
    try {
        const url = "greeting.json";
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log(data)

        if (data.Response === "False") {
            cards.innerHTML = `<p style="color:red;">Greeting not found</p>`;
            return;
        }

        let greetCard = document.createElement('div')
        greetCard.className = "card"
        greetCard.innerHTML += `<button class="rmButton">x</button>
                
                <h1>${data.notes.title}</h1>
                ${data.notes.text}`;
        document.body.appendChild(greetCard);
        //<button class="chButton">✏</button>
    } catch (error) {
        console.error("Ошибка:", error);
        cards.innerHTML = `<p style="color:red;">Ошибка при загрузке данных</p>`;
    }
} await loadGreeting();

// async function loadNotes(){
    
// } await loadNotes();

function cardAnim(_i, _o) {
    const cardAnime = document.querySelector(".card");
    cardAnime.animate(
        [
            { opacity: _i },
            { opacity: _o },
        ],
        {
            duration: 80,
            easing: "ease-in-out",
            fill: "forwards"
        }
    );
}

function addNote() {
    let card = document.createElement('div');
    card.className = 'card';

    const safeContent = document.createTextNode(txtContent.value);
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = safeContent.textContent;
    //contentDiv.innerHTML = safeContent.textContent.replace(/\n/g, '<br>');

    const rmButton = document.createElement('button');
    rmButton.className = 'rmButton';
    rmButton.textContent = 'x';
    
    /*
    const chButton = document.createElement('button');
    chButton.className = 'chButton';
    chButton.textContent = '✏';

    card.appendChild(chButton);
    */
    card.appendChild(rmButton);
    card.appendChild(contentDiv);

    document.body.appendChild(card);
    cardAnim(0, 1);
}

function impNote(noteText) {
    let card = document.createElement('div');
    card.className = 'card';

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = noteText;
    //contentDiv.innerHTML = noteText.replace(/\n/g, '<br>');

    const rmButton = document.createElement('button');
    rmButton.className = 'rmButton';
    rmButton.textContent = 'x';
    /*
    const chButton = document.createElement('button');
    chButton.className = 'chButton';
    chButton.textContent = '✏';

    card.appendChild(chButton);
    */
    
    card.appendChild(rmButton);
    card.appendChild(contentDiv);

    cards.appendChild(card);
}

function expNote() {
    const noteContent = txtContent.value;
    if (!noteContent) return;
    const data = {
        notes: {
            text: noteContent
        }
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    saveAs(blob, "export.json");
}

/*
function editNote(button) {
    if (isEditMode) {
        alert('Завершите редактирование текущей строки перед редактированием другой.');
        return;
    }

    isEditMode = true;

    const ced = button.closest('card');
    ced.dataset.originalHtml = row.innerHTML;

    const originalValues = ced.textContent;

    ced.innerHTML = `
        <button class="rmButton">x</button>
                <button class="chButton">✏</button>
                ${data.notes.text}
                <button type="button" onclick="saveEdit(this)">Сохранить</button>
                <button type="button" onclick="cancelEdit(this)">Отмена</button>
                `;
}
*/

addButton.addEventListener('click', () => { addNote(); })
expButton.addEventListener('click', () => { expNote(); })
//chgButton.addEventListener('click', () => { editNote(this); })
impButton.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                impNote(data.notes.text);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                impNote("Error parsing JSON, see console for details");
            }
        };
        reader.readAsText(file);
    }
});

document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('rmButton')) {
        event.target.closest('.card').remove();
    }
});