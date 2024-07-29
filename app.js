let startDate = null;
let endDate = null;
let clickCount = 0;

const jsonData = [
    {"PERSONEL_NO":100852,"ADI_SOYADI":"BING_BONG","TARIH":"04.01.2024","SAAT":"08:25:00","TURNIKE":"TK05 - TURNIKE-1 GIRIS (R11)"},
    {"PERSONEL_NO":100852,"ADI_SOYADI":"BING_BONG","TARIH":"04.01.2024","SAAT":"10:41:00","TURNIKE":"TK05 - TURNIKE-2 CIKIS (R14)"},
    {"PERSONEL_NO":100852,"ADI_SOYADI":"BING_BONG","TARIH":"04.01.2024","SAAT":"10:53:00","TURNIKE":"TK05 - TURNIKE-1 GIRIS (R11)"},
    {"PERSONEL_NO":100852,"ADI_SOYADI":"BING_BONG","TARIH":"04.01.2024","SAAT":"12:10:00","TURNIKE":"TK05 - TURNIKE-2 CIKIS (R14)"},
    {"PERSONEL_NO":100852,"ADI_SOYADI":"BING_BONG","TARIH":"04.01.2024","SAAT":"12:35:00","TURNIKE":"TK05 - TURNIKE-1 GIRIS (R11)"},
    {"PERSONEL_NO":100852,"ADI_SOYADI":"BING_BONG","TARIH":"04.01.2024","SAAT":"13:35:00","TURNIKE":"TK05 - TURNIKE-2 CIKIS (R14)"},
    {"PERSONEL_NO":100852,"ADI_SOYADI":"BING_BONG","TARIH":"04.01.2024","SAAT":"13:55:00","TURNIKE":"TK05 - TURNIKE-1 GIRIS (R11)"},
    {"PERSONEL_NO":100852,"ADI_SOYADI":"BING_BONG","TARIH":"04.01.2024","SAAT":"17:25:00","TURNIKE":"TK05 - TURNIKE-2 CIKIS (R14)"},
    {"PERSONEL_NO":100852,"ADI_SOYADI":"BING_BONG","TARIH":"05.01.2024","SAAT":"08:25:00","TURNIKE":"TK05 - TURNIKE-1 GIRIS (R11)"},
    {"PERSONEL_NO":100852,"ADI_SOYADI":"BING_BONG","TARIH":"05.01.2024","SAAT":"17:25:00","TURNIKE":"TK05 - TURNIKE-2 CIKIS (R14)"}
];

$(document).ready(function() {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultDate: '2024-01-01',
        validRange: {
            start: '2024-01-01',
            end: '2024-01-31'
        },
        selectable: true,
        selectHelper: true,
        select: function(start, end) {
            clickCount++;
            if (clickCount === 1) {
                startDate = start;
                endDate = null;
                $('#calendar').fullCalendar('renderEvent', {
                    title: 'Start',
                    start: startDate,
                    end: startDate,
                    allDay: true,
                    color: '#ff0000',
                    textColor: '#fff'
                });
            } else if (clickCount === 2) {
                endDate = start;
                $('#calendar').fullCalendar('renderEvent', {
                    title: 'Finish',
                    start: endDate,
                    end: endDate,
                    allDay: true,
                    color: '#ff0000',
                    textColor: '#fff'
                });
                $('#calendar').fullCalendar('renderEvent', {
                    start: startDate,
                    end: moment(endDate).add(1, 'days'),
                    rendering: 'background',
                    color: '#ffcccc'
                });
            } else {
                clickCount = 0;
                startDate = null;
                endDate = null;
                $('#calendar').fullCalendar('removeEvents');
            }
            $('#calendar').fullCalendar('unselect');
        },
        editable: true,
        eventLimit: true
    });
});

function showEntryExitCount() {
    if (!startDate || !endDate) {
        alert('Lütfen başlangıç ve bitiş tarihlerini seçin.');
        return;
    }

    const startStr = startDate.format('YYYY-MM-DD');
    const endStr = endDate.format('YYYY-MM-DD');

    const filteredData = jsonData.filter(entry => {
        const entryDate = moment(entry.TARIH, 'DD.MM.YYYY');
        return entryDate.isBetween(startStr, endStr, null, '[]');
    });

    const count = filteredData.length;
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = Seçilen tarihler arasındaki giriş çıkış sayısı: ${count};
}

function showWorkDuration() {
    if (!startDate || !endDate) {
        alert('Lütfen başlangıç ve bitiş tarihlerini seçin.');
        return;
    }

    const startStr = startDate.format('YYYY-MM-DD');
    const endStr = endDate.format('YYYY-MM-DD');

    const filteredData = jsonData.filter(entry => {
        const entryDate = moment(entry.TARIH, 'DD.MM.YYYY');
        return entryDate.isBetween(startStr, endStr, null, '[]');
    });

    let totalMinutes = 0;
    let entryTime = null;

    filteredData.forEach(entry => {
        const entryDateTime = moment(${entry.TARIH} ${entry.SAAT}, 'DD.MM.YYYY HH:mm:ss');
        if (entry.TURNIKE.includes('GIRIS')) {
            entryTime = entryDateTime;
        } else if (entry.TURNIKE.includes('CIKIS') && entryTime) {
            const exitTime = entryDateTime;
            totalMinutes += exitTime.diff(entryTime, 'minutes');
            entryTime = null;
        }
    });

    const resultDiv = document.getElementById('result');
    resultDiv.textContent = Seçilen tarihler arasındaki toplam çalışma süresi: ${totalMinutes} dakika;
}

function showBreakDuration() {
    if (!startDate || !endDate) {
        alert('Lütfen başlangıç ve bitiş tarihlerini seçin.');
        return;
    }

    const startStr = startDate.format('YYYY-MM-DD');
    const endStr = endDate.format('YYYY-MM-DD');

    const filteredData = jsonData.filter(entry => {
        const entryDate = moment(entry.TARIH, 'DD.MM.YYYY');
        return entryDate.isBetween(startStr, endStr, null, '[]');
    });

    let totalBreakMinutes = 0;
    let exitTime = null;

    filteredData.forEach(entry => {
        const entryDateTime = moment(${entry.TARIH} ${entry.SAAT}, 'DD.MM.YYYY HH:mm:ss');
        if (entry.TURNIKE.includes('CIKIS')) {
            exitTime = entryDateTime;
        } else if (entry.TURNIKE.includes('GIRIS') && exitTime) {
            const entryTime = entryDateTime;
            totalBreakMinutes += entryTime.diff(exitTime, 'minutes');
            exitTime = null;
        }
    });

    const resultDiv = document.getElementById('result');
    resultDiv.textContent = Seçilen tarihler arasındaki toplam mola süresi: ${totalBreakMinutes} dakika;
}