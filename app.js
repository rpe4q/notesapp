import { saveAs } from './FileSaver.js';

const cards = document.querySelector('.cards')
const addButton = document.querySelector('#addButton')
const rmButton = document.querySelector('.rmButton')
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
        
        const chgButton = document.createElement('button');
        chgButton.className = 'chgButton';
        chgButton.textContent = '✏';

        greetCard.appendChild(chgButton);
        
        chgButton.addEventListener('click', editNote);
        document.body.appendChild(greetCard);
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
    
    const chgButton = document.createElement('button');
    chgButton.className = 'chgButton';
    chgButton.textContent = '✏';
    
    card.appendChild(chgButton);
    card.appendChild(rmButton);
    card.appendChild(contentDiv);
    
    chgButton.addEventListener('click', editNote);
    document.body.appendChild(card);
    cardAnim(0, 1);
}

function changedNote(stuff, cardToRemove = null) {
    if (cardToRemove) {
        cardToRemove.remove();
    }
    let card = document.createElement('div');
    card.className = 'card';
    
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = stuff;
    //contentDiv.innerHTML = safeContent.textContent.replace(/\n/g, '<br>');

    const rmButton = document.createElement('button');
    rmButton.className = 'rmButton';
    rmButton.textContent = 'x';
    
    const chgButton = document.createElement('button');
    chgButton.className = 'chgButton';
    chgButton.textContent = '✏';
    
    card.appendChild(chgButton);
    card.appendChild(rmButton);
    card.appendChild(contentDiv);
    
    chgButton.addEventListener('click', editNote(card));
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
    
    const chgButton = document.createElement('button');
    chgButton.className = 'chgButton';
    chgButton.textContent = '✏';

    card.appendChild(chgButton);
    
    card.appendChild(rmButton);
    card.appendChild(contentDiv);

    cards.appendChild(card);
    chgButton.addEventListener('click', editNote);
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

function editNote(event) {
    let eDiag = document.createElement('dialog');
    eDiag.className = 'editDiag';
    eDiag.innerHTML = `
        <h3>Редактирование заметки</h3>
        <textarea id="editText" placeholder="Введите текст заметки"></textarea>
        <div class="dialog-buttons">
            <button type="button" id="saveBtn">Сохранить</button>
            <button type="button" id="cancelBtn">Отмена</button>
        </div>
    `;

    document.body.appendChild(eDiag);
    
    eDiag.showModal();
    
    const saveBtn = eDiag.querySelector('#saveBtn');
    const cancelBtn = eDiag.querySelector('#cancelBtn');
    
    saveBtn.addEventListener('click', () => {
        changedNote(document.getElementById('editText').value,
            event.target.closest('.card'));
        eDiag.close();
        eDiag.remove();
    });

    cancelBtn.addEventListener('click', () => {
        eDiag.close();
        eDiag.remove();
    });
}

addButton.addEventListener('click', () => { addNote(); })
expButton.addEventListener('click', () => { expNote(); })
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