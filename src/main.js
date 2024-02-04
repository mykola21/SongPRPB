// Показати або приховати кнопку, в залежності від положення користувача на сторінці
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollToTopBtn").style.display = "block";
    } else {
        document.getElementById("scrollToTopBtn").style.display = "none";
    }
}

// Функція прокрутки сторінки наверх
function scrollToTop() {
    document.body.scrollTop = 0; // Для Safari
    document.documentElement.scrollTop = 0; // Для Chrome, Firefox, IE та Opera
}

function toggleForm() {
    var form = document.getElementById('songForm');
    if (form.style.display === 'none') {
        form.style.display = 'block'; // Показуємо форму
    } else {
        form.style.display = 'none'; // Ховаємо форму
    }
}

// Перевірка чи є дані про пісні в localStorage при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('songs')) {
        var savedSongs = JSON.parse(localStorage.getItem('songs'));
        savedSongs.forEach(function(song) {
            addSongToList(song);
        });
    }
});

function addSong() {
    var verificationCode = document.getElementById('verificationCode').value;
    if (verificationCode !== '132') {
        alert('Невірне кодове слово!');
        return;
    }

    // Отримання значень з полів введення
    var songTitle = document.getElementById('songTitle').value;
    var songWords = document.getElementById('songWords').value;
    var songTones = document.getElementById('songTones').value;

    // Додавання пісні до списку та збереження у localStorage
    var newSong = { id: Date.now(), title: songTitle, words: songWords, tones: songTones };
    addSongToList(newSong);
    saveSong(newSong);

    // Очистка полів вводу
    document.getElementById('songTitle').value = '';
    document.getElementById('songWords').value = '';
    document.getElementById('songTones').value = '';
    document.getElementById('verificationCode').value = '';
}

function addSongToList(song) {
    // Додавання посилання на пісню у список з посиланнями
    var songLinks = document.getElementById('songLinks');
    var songLinkItem = document.createElement('li');
    var songLink = document.createElement('a');
    songLink.textContent = song.title;
    songLink.href = '#song' + song.id;
    songLinkItem.appendChild(songLink);
    songLinks.appendChild(songLinkItem);

     // Додавання кнопки видалення
     var deleteButton = document.createElement('button');
     deleteButton.textContent = 'Видалити';
     var verificationInput = document.createElement('input');
     verificationInput.type = 'password';
     verificationInput.classList = 'inputcodeword';
     verificationInput.placeholder = 'Кодове слово';
     deleteButton.onclick = function() {
         var verificationCode = verificationInput.value;
         if (verificationCode !== '132') {
             alert('Невірне кодове слово!');
             return;
         }
         removeSong(song);
         songLinks.removeChild(songLinkItem);
     };

    songLinkItem.appendChild(deleteButton);
    songLinkItem.appendChild(verificationInput);
    songLinks.appendChild(songLinkItem);

    // Додавання тексту пісні на сторінку
    var songText = '<div id="song' + song.id + '">';
    songText += '<h2>' + song.title + '</h2>';
    songText += '<p>Тональності: ' + song.tones + '</p>';
    songText += '<pre class="songword">' + song.words + '</pre>';
    songText += '</div> <hr>';
    

    var songTextContainer = document.createElement('div');
    songTextContainer.innerHTML = songText;
    document.body.appendChild(songTextContainer);

    
    // Сортування списку посилань на пісні у алфавітному порядку
    sortList(songLinks);
    
}



function saveSong(song) {
    var savedSongs = localStorage.getItem('songs') ? JSON.parse(localStorage.getItem('songs')) : [];
    savedSongs.push(song);
    localStorage.setItem('songs', JSON.stringify(savedSongs));
}

function removeSong(song) {
    var savedSongs = localStorage.getItem('songs') ? JSON.parse(localStorage.getItem('songs')) : [];
    var updatedSongs = savedSongs.filter(function(savedSong) {
        return savedSong.id !== song.id;
    });
    localStorage.setItem('songs', JSON.stringify(updatedSongs));
    removeSongText(song.id);
    removeSongLink(song.id);
}

function removeSongText(songId) {
    var songTextElement = document.getElementById('song' + songId);
    if (songTextElement) {
        songTextElement.remove();
    }
}

function removeSongLink(songId) {
    var songLinkElement = document.querySelector('#songLinks a[href="#song' + songId + '"]');
    if (songLinkElement) {
        songLinkElement.parentElement.remove();
    }
}

function sortList(list) {
    var listItems = Array.from(list.getElementsByTagName('li'));
    listItems.sort(function(a, b) {
        return a.textContent.localeCompare(b.textContent);
    });
    listItems.forEach(function(item) {
        list.appendChild(item);
    });
}
