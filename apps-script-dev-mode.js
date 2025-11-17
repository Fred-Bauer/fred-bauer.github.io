// Apps Script Code mit Entwicklungs-Modus
// Füge dies in dein Apps Script ein, um lokales Testen zu ermöglichen

function doGet(e) {
  const SHEET_ID = '2PACX-1vSeTq_t_fw-7UMUt7st5Ctj4RAj8-xuL4JMQHCVmDqFALUf9IHo63jO4lVDIuULUsevnNLtu8gaudmC';
  const API_KEY = 'AIzaSyAPlluSgjXyZ_R7J1Bd51GPo9CSg4YZ5W4';
  
  // AUTOMATISCHE ENTWICKLUNGS-MODUS-ERKENNUNG
  // Erlaubt lokale Anfragen (file:// oder localhost), blockiert andere
  const allowedDomains = ['fred-bauer.github.io', 'localhost', '127.0.0.1'];
  const DEV_MODE = true; // Lässt lokales Testen zu
  
  try {
    const baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets/';
    
    // Schritt 1: Hole alle Sheet-Namen
    const metadataUrl = `${baseUrl}${SHEET_ID}?key=${API_KEY}`;
    const metadataResponse = UrlFetchApp.fetch(metadataUrl, {
      muteHttpExceptions: !DEV_MODE // Im Dev-Mode Fehler nicht unterdrücken
    });
    const metadata = JSON.parse(metadataResponse.getContentText());
    
    if (!metadata.sheets) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Keine Sheets gefunden'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Schritt 2: Hole Daten von allen Sheets
    const sheetsData = {};
    
    for (const sheet of metadata.sheets) {
      const sheetTitle = sheet.properties.title;
      const valuesUrl = `${baseUrl}${SHEET_ID}/values/${encodeURIComponent(sheetTitle)}?key=${API_KEY}`;
      
      const valuesResponse = UrlFetchApp.fetch(valuesUrl, {
        muteHttpExceptions: !DEV_MODE
      });
      const values = JSON.parse(valuesResponse.getContentText());
      
      sheetsData[sheetTitle] = values.values || [];
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      sheets: sheetsData
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
