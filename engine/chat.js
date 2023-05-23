

function censorText(text) {
    const forbiddenWords = ['chuj', 'cipa', 'czarnuch', 'debil', 'dupa', 'dupek', 'frajer', 'jebac', 'jebana', 'jebany', 'jebać', 'kurwa', 'kurwie', 'kurwo', 'kurwy', 'kurwom', 'pedal', 'pedał', 'szmata', 'zjebac', 'zjebana', 'zjebany', 'zjebać'];
    let censoredText = ' ' + text.toLowerCase() + ' '; // dodajemy spacje na początku i na końcu, żeby obsłużyć słowa na początku i na końcu tekstu
    forbiddenWords.forEach(word => {
        let regex;
        // Jeżeli słowo zawiera polskie znaki diakrytyczne, używamy metody ze spacjami
        if (word.match(/[ąęćżźółńś]/)) {
            regex = new RegExp(' ' + word + ' ', 'g');
            censoredText = censoredText.replace(regex, ' ' + '*'.repeat(word.length) + ' ');
        }
        // Jeżeli nie, używamy metody z \b
        else {
            regex = new RegExp('\\b' + word + '\\b', 'g');
            censoredText = censoredText.replace(regex, '*'.repeat(word.length));
        }
    });

    return censoredText.trim(); // usuwamy dodane na początku i na końcu spacje
}


function chatBan(val) {
    console.log(`Zostałeś zablokowany`);
}

module.exports = {
    censorText,
    chatBan,
};
