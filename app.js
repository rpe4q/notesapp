import { saveAs } from './FileSaver.js';

const cards = document.querySelector('.cards')
const addButton = document.querySelector('#addButton')
const rmButton = document.querySelector('.rmButton')
const impButton = document.querySelector('#impButton')
const expButton = document.querySelector('#expButton')
const addPlBtn = document.querySelector('[name="addPl"]')
const addIgBtn = document.querySelector('[name="addImg"]')
const addVdBtn = document.querySelector('[name="addVid"]')
const addAuBtn = document.querySelector('[name="addAud"]')
const txtContent = document.querySelector('#text')
const loginForm = document.forms[0];
let eValid = '';
const STORAGE_KEY = 'notes';
var notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

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

function renderNotes() {
    cards.innerHTML = '';
    notes.forEach((note, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = note.html;

        const rmButton = document.createElement('button');
        rmButton.className = 'rmButton';
        rmButton.textContent = 'x';

        const chgButton = document.createElement('button');
        chgButton.className = 'chgButton';
        chgButton.textContent = '✏';

        chgButton.addEventListener('click', () => editNote(index));
        rmButton.addEventListener('click', () => {
            notes.splice(index, 1);
            saveNotes();
            renderNotes();
        });

        card.append(chgButton, rmButton, contentDiv);
        cards.appendChild(card);
    });
}

async function loadNotes(){
    notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    renderNotes();    
} await loadNotes();

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
    const html = txtContent.value.trim();
    if (!html) return;

    notes.push({ html });
    saveNotes();
    renderNotes();
    txtContent.value = '';

    cardAnim(0, 1);

    // thats how look before localstorage
    /*
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
    */
}

function impNote(noteText) {
    const html = noteText.trim();
    if (!html) return;

    notes.push({ html });
    saveNotes();
    renderNotes();
    noteText = '';
    cardAnim(0, 1);
}

function expNote() {
    const noteContent = txtContent.value;
    if (!noteContent) return;
    const data = {
        notes: {
            text: notes
        }
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    saveAs(blob, "export.json");
}

function editNote(index) {
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
    
    eDiag.querySelector('#editText').value = notes[index].html;

    const saveBtn = eDiag.querySelector('#saveBtn');
    const cancelBtn = eDiag.querySelector('#cancelBtn');
    
    saveBtn.addEventListener('click', () => {
        notes[index].html = eDiag.querySelector('#editText').value;
        saveNotes();
        renderNotes();
        eDiag.close();
        eDiag.remove();
    });

    cancelBtn.addEventListener('click', () => {
        eDiag.close();
        eDiag.remove();
    });
}

function addPlaceFx() {
    let eDiag = document.createElement('dialog');
    eDiag.className = 'editDiag';
    eDiag.innerHTML = `
        <form>
            <h3>Добавление геолокации</h3>
                <table>
                    <tr>
                        <td>
                            <input type="text" id="laField"
                                placeholder="Введите ширину">
                        </td>
                        <td>
                        <input type="text" id="loField"
                            placeholder="Введите долготу">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" id="fwField"
                                placeholder="Ширина виджета">
                        </td>
                        <td>
                            <input type="text" id="fhField"
                                placeholder="Длина виджета">
                        </td>
                    </tr>
                <table>
            <p>
                <div class="dialog-buttons">
                    <button type="button" id="pOkBtn">ОК</button>
                    <button type="button" id="pCancelBtn">Отмена</button>
                </div>
            </p>
        </form>
    `;

    document.body.appendChild(eDiag);
    eDiag.showModal();

    const loP = document.querySelector('#loField')
    const laP = document.querySelector('#laField')
    const fwP = document.querySelector('#fwField')
    const fhP = document.querySelector('#fhField')

    const pOkBtn = eDiag.querySelector('#pOkBtn');
    const pCancelBtn = eDiag.querySelector('#pCancelBtn');

    pOkBtn.addEventListener('click', () => {
        txtContent.value += `<iframe src="https://yandex.com/map-widget/v1/?ll=${loP.value}%2C${laP.value}" 
                width="${fwP.value}" height="${fhP.value}" 
                frameborder="1" allowfullscreen="true" style="position:relative;">
            </iframe>`
        eDiag.close();
        eDiag.remove();
    });

    pCancelBtn.addEventListener('click', () => {
        eDiag.close();
        eDiag.remove();
    });
}

function addImageFx() {
    let eDiag = document.createElement('dialog');
    eDiag.className = 'editDiag';
    eDiag.innerHTML = `
        <form>
            <h3>Добавление картинки</h3>
                <table>
                    <tr>
                        <td>
                            Ссылка картинки:
                        </td>
                        <td>
                            <input type="text" id="imgField"
                                placeholder="*.jpg/png/webp/avif...">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" id="fwField"
                                placeholder="Ширина виджета">
                        </td>
                        <td>
                            <input type="text" id="fhField"
                                placeholder="Длина виджета">
                        </td>
                    </tr>
                <table>
            <p>
                <div class="dialog-buttons">
                    <button type="button" id="pOkBtn">ОК</button>
                    <button type="button" id="pCancelBtn">Отмена</button>
                </div>
            </p>
        </form>
    `;

    document.body.appendChild(eDiag);
    eDiag.showModal();

    const imgSrc = document.querySelector('#imgField')
    const fwP = document.querySelector('#fwField')
    const fhP = document.querySelector('#fhField')

    const pOkBtn = eDiag.querySelector('#pOkBtn');
    const pCancelBtn = eDiag.querySelector('#pCancelBtn');

    pOkBtn.addEventListener('click', () => {
        const src = imgSrc.value.trim() !== ''
            ? imgSrc.value.trim()
            : 'img/default.png';

        txtContent.value += `<img src="${src}" 
        width="${fwP.value}" height="${fhP.value}">`
        eDiag.close();
        eDiag.remove();
    });
    
    pCancelBtn.addEventListener('click', () => {
        eDiag.close();
        eDiag.remove();
    });
}

function addVideoFx() {
    let eDiag = document.createElement('dialog');
    eDiag.className = 'editDiag';
    eDiag.innerHTML = `
        <form>
            <h3>Добавление видео</h3>
                <table>
                    <tr>
                        <td>
                            Ссылка видео:
                        </td>
                        <td>
                            <input type="text" id="vidField"
                                placeholder="*.mp4/webm...">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Тип видео:
                        </td>
                        <td>
                            <input type="text" id="vTypeField"
                                placeholder="video/* (mp4/webm...)">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" id="fwField"
                                placeholder="Ширина виджета">
                        </td>
                        <td>
                            <input type="text" id="fhField"
                                placeholder="Длина виджета">
                        </td>
                    </tr>
                <table>
            <p>
                <div class="dialog-buttons">
                    <button type="button" id="pOkBtn">ОК</button>
                    <button type="button" id="pCancelBtn">Отмена</button>
                </div>
            </p>
        </form>
    `;

    document.body.appendChild(eDiag);
    eDiag.showModal();

    const vidSrc = document.querySelector('#vidField')
    const vidType = document.querySelector('#vTypeField')
    const fwP = document.querySelector('#fwField')
    const fhP = document.querySelector('#fhField')

    const pOkBtn = eDiag.querySelector('#pOkBtn');
    const pCancelBtn = eDiag.querySelector('#pCancelBtn');

    pOkBtn.addEventListener('click', () => {
        const src = vidSrc.value.trim() !== ''
            ? vidSrc.value.trim()
            : 'defaultmedia/default.mp4';
        const type = vidType.value.trim() !== ''
            ? vidType.value.trim()
            : 'mp4';
        const wDims = {
            width: fwP.value.trim() !== ''
                ? fwP.value.trim()
                : 180,
            height: fhP.value.trim() !== ''
                ? fhP.value.trim()
                : 320,
        }
        txtContent.value += `<video controls name="media" 
            width="${wDims.width}" height="${wDims.height}">
            <source src="${src}" type="video/${type}">
        </video>`
        eDiag.close();
        eDiag.remove();
    });

    pCancelBtn.addEventListener('click', () => {
        eDiag.close();
        eDiag.remove();
    });
}

function addAudioFx() {
    let eDiag = document.createElement('dialog');
    eDiag.className = 'editDiag';
    eDiag.innerHTML = `
        <form>
            <h3>Добавление аудио</h3>
                <table>
                    <tr>
                        <td>
                            Ссылка аудио:
                        </td>
                        <td>
                            <input type="text" id="audField"
                                placeholder="*.mp3/ogg/m4a/aac...">
                        </td>
                    </tr>
                <table>
            <p>
                <div class="dialog-buttons">
                    <button type="button" id="pOkBtn">ОК</button>
                    <button type="button" id="pCancelBtn">Отмена</button>
                </div>
            </p>
        </form>
    `;

    document.body.appendChild(eDiag);
    eDiag.showModal();

    const auSrc = document.querySelector('#audField')

    const pOkBtn = eDiag.querySelector('#pOkBtn');
    const pCancelBtn = eDiag.querySelector('#pCancelBtn');

    pOkBtn.addEventListener('click', () => {
        const src = auSrc.value.trim() !== ''
            ? auSrc.value.trim()
            : 'defaultmedia/default.mp3';
        txtContent.value += `<audio controls src="${src}"></audio>`
        eDiag.close();
        eDiag.remove();
    });

    pCancelBtn.addEventListener('click', () => {
        eDiag.close();
        eDiag.remove();
    });
}

addButton.addEventListener('click', () => { addNote(); })
addPlBtn.addEventListener('click', addPlaceFx)
addIgBtn.addEventListener('click', addImageFx)
addVdBtn.addEventListener('click', addVideoFx)
addAuBtn.addEventListener('click', addAudioFx)
expButton.addEventListener('click', () => { expNote(); })
impButton.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.notes && Array.isArray(data.notes.text)) {
                    data.notes.text.forEach(noteObj => {
                        if (noteObj.html) {
                            impNote(noteObj.html);
                        }
                    });
                } else {
                    impNote("Неверная структура JSON");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                impNote("Ошибка парсинга JSON, смотрите консоль");
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