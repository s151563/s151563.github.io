var KundeLogin;
var bezahlListe;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////Alle Funktionen, die zum Login relevant sind/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function login() {
    //Prüfung, ob der Button auf Logout steht. Wenn ja werden alle personenbezogenen Daten gelöscht.
    if (document.getElementById("LoginButton").innerHTML == "Logout") {
        var logedIn = false;
        KundeLogin = "";
        KundeAktiv = "";
        document.getElementById("mainMen").innerHTML = "";
        document.getElementById("Ebene1").innerHTML = "";
        document.getElementById("Ebene2").innerHTML = "";
        document.getElementById("mainHizu").innerHTML ="";
    }
    //Wenn der Button auf Login steht, wird der USer angemeldet.
    else {
        var KundeLoginT = document.getElementById("username").value;
        var logedIn = false;
        //Abgleich des Nutzernamens mit den gespeicherten Namen
        for (var i = 1; i < (Object.keys(Kunden).length+1); i++) {
            var t = "Kunde"+i;
            if (Kunden[t].Name == KundeLoginT) {
                console.log("Kunde erkannt");
                KundeLoginT = t;
                KundeLogin = KundeLoginT;
                logedIn=true;
                //Die Personenbezogene Oberfläche des Kunden wird angelegt.
                for (var i = 1; i < (Object.keys(Kunden).length+1); i++) {
                    var nameT = "Kunde" + i;
                    if(document.getElementById("username").value != Kunden[nameT].Name){
                        var xtest = document.createElement("div");
                        var y = "<button class = \"button\"  onclick=\"kundenauswahl('"+nameT+"')\"><span>"+ Kunden[nameT].Name+"</span> </button>"
                        xtest.innerHTML = y;
                        document.getElementById("mainMen").appendChild(xtest);

                    }
            
                }
                var atest = document.createElement("div");
                var b = "<button class = \"button\"  onclick=\"person_hinzufügen()\"><span> + </span> </button>"
                atest.innerHTML = b;
                document.getElementById("mainHizu").appendChild(atest);
                
            }
            
        }
        //Fehlermeldung, wenn die Erkennung fehlgeschlagen ist.
        if(logedIn == false){
            alert("User existiert nicht! - Propieren Sie es nochmal");
        }
       
        
    }
    //Umschalten des Buttons und des Loginbezogenen Textes im Menüfeld
    if (logedIn) {
    document.getElementById("Eingeloggt").innerHTML = "Eingeloggt als: "+Kunden[KundeLogin].Name;
    document.getElementById("LoginButton").innerHTML = "Logout";   
    }
    else {
        document.getElementById("Eingeloggt").innerHTML = "Nicht eingeloggt. Bitte einloggen!"+KundeAktiv+KundeLogin;
        document.getElementById("LoginButton").innerHTML = "Login";
    }
    //Zurücksetzen des Eingabefeldes
    document.getElementById("username").value = "";
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////Alle Hilfsfunktionen, z.B. Datum und Daten///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Einlesen der Startdaten aus einer JSON Datei.
//Hier zu Demozwecken.
function DatenEinlesen() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE){                    
            var responseObject = JSON.parse(this.response);
            
            Rechnungen = responseObject.Rechnungen[0];
            //console.log(Rechnungen);
            Kunden = responseObject.Kunden[0];
            //console.log(Kunden);
            
            for (var i = 1; i < (Object.keys(Kunden).length+1); i++) {
                var nameT = "Kunde" + i;
                try {
                document.getElementById(nameT).innerHTML = Kunden[nameT].Name;
                } catch (e) {}
            }
            
        } else { }
    };
    httpRequest.open('GET', 'Daten.json', true);
    httpRequest.send(null);
}

//Senden der Daten zum Speichern an den Server, hier nur als Demo (nicht funktionsfähig)
function DatenSpeichern() {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("POST", "save-to-log.php");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(Rechnungen));
    console.log(JSON.stringify(Rechnungen))
}

//Auslesen des Datums in lesbarem Format
function getDate() {
    var heute = new Date();
    var jahr = heute.getYear()-100;
    var monat = heute.getMonth()+1;
    var tag = heute.getDate();
    return tag+"."+monat+"."+jahr;
}

//Folgende drei Funktionen handlen Drag&Drop
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    //Übernimm das verschobene Element und speichere es in einer Liste zum Übergeben an die Bezahlfunktion
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    var KeyT = Object.keys(bezahlListe).length-1;
    bezahlListe[KeyT] = data;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////Alle Funktionen, die für die Menüstruktur interessant sind///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Klick auf einen Kunden --> Kunde wird angewählt und Untermenü wird erstellt.
function kundenauswahl(aktiverKunde){
    KundeAktiv = aktiverKunde;
    console.log(KundeAktiv);
    document.getElementById("Ebene1").innerHTML = "<p id = \"pLL\">Name: "+Kunden[KundeAktiv].Name+"</p id = \"pLL\"><p id = \"pLL\">Vorname: "+Kunden[KundeAktiv].Vorname+"</p><p id = \"pLL\">IBAN: "+Kunden[KundeAktiv].IBAN+"</p><button class = \"button1\" style=\"vertical-align:middle\"onclick=\"rechnung_bezahlen()\"><a><span>Rechnung bezahlen </span></a></button><br><br><button class = \"button1\" style=\"vertical-align:middle\" onclick=\"rechung_erstellen()\"><a><span>Rechnung erstellen</span></a></button><br><br><button class = \"button1\" style=\"vertical-align:middle\"onclick=\"rechnungsübersicht()\"><a><span>Rechnungsübersicht</span></a></button>" 
    document.getElementById("Ebene2").innerHTML = "";
}

//Klick auf Kundenübersicht --> Die Rechnungen von dem betreffenden Kunden werden ausgewählt und in Tabelle dargestellt
function rechnungsübersicht(){
    //Auswahl aller Rechnungen (inklusive historischer)
    var listeRechnungen = AuswahlRechnungen2(KundeAktiv);
    //Wenn Rechnungen vorhanden, werden sie dargestellt.
    if (listeRechnungen != null) {
        document.getElementById("Ebene2").innerHTML  = "<p id = \"pLL\">Rechnungsübersicht:</p><table id =\"rechnung\"><tr>  <th>Rechnungsdatum</th><th>Betrag</th></tr></table>"
        if (Object.keys(listeRechnungen).length > 1) {
            for (var i = 2; i < (Object.keys(listeRechnungen).length+1); i++) {
                var Temp = "Rechnung" + (i-1);
                console.log(listeRechnungen[Temp]);
                var Übersicht= document.createElement("tr");
                var übersichtTest = "<td>"+ listeRechnungen[Temp].Datum +"</td><td>"+listeRechnungen[Temp].Betrag+" €</td>"
                Übersicht.innerHTML = übersichtTest;
                document.getElementById("rechnung").appendChild(Übersicht);    
            }
        }
    }
    else {
        console.log("Fehler: Keine Bezahlten Rechungen für den Kunden vorhanden.")
    }
}

//Klick auf Rechnung erstellen --> Ein Formular zum Erstellen einer Rechnung an den angewählten Kunden wird aufgerufen
function rechung_erstellen(){
    let tempName = Kunden[KundeAktiv].Vorname + Kunden[KundeAktiv].Name;
    document.getElementById("Ebene2").innerHTML  = "<p id = \"pLL\">Rechnung erstellen:</p> <dl><dt>Empfänger:</dt><dd><input type=\"text\"id=\"nameField\" value="+ tempName +" /></dd><dt>IBAN:</dt><dd><input type=\"text\" id=\"IBAN\" value="+Kunden[KundeAktiv].IBAN+" /></dd><dt>Betrag:</dt><dd><input type=\"text\" id=\"Betrag\" value=\"0\" /></dd><form id =\"Feld\" action=\"#\" method=\"post\" enctype=\"multipart/form-data\"><br><dt> Wählen Sie eine Rechnung von Ihrem Rechner aus:<br><br><input name=\"Datei\" type=\"file\" size=\"50\"> </dt></form></div><button  style=\"vertical-align:middle\" href=\"#\" onclick=\"ausgabeRechnung()\" id=\"submitLink\"><span>Weiterleiten</span></button></div>" 
}

//Klick auf Rechnung bezaheln --> FOrmular zum bezahlen der Rechnungen wird angezeigt. Alle Rechnungen mit verbleibendem Betrag werden dargestellt und können bezahlt werden.
function rechnung_bezahlen(){
    bezahlListe = null;
    bezahlListe = {Platzhalter:"zur Initialisierung"};
    //Auswählen aktueller Rechnungen
    var listeRechnungen = AuswahlRechnungen(KundeAktiv);
    //Wenn Rechnungen vorhanden sind:
    if (listeRechnungen != null) {
        //Vorbereitung: Fläche für Drag&Drop wird erstellt
        document.getElementById("Ebene2").innerHTML  = "<p id = \"pLL\">Rechnung bezahlen:</p><p>Offene Rechnung:</p><div id=\"div1\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\"></div><p>Rechnung / Rechnungen bezahlen:</p><div id=\"div2\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\"></div><div><button class = \"button1\" style=\"vertical-align:middle\" onclick = \"bezahlen(bezahlListe)\"><span>Bezahlen</span></button></div>"
        //Wenn Rechnungen zum Anzeigen da sind.
        if (Object.keys(listeRechnungen).length > 1) {
            //Für alle Rechnungen wird ein ziehbares Element angelegt
            for (var i = 1; i < (Object.keys(listeRechnungen).length); i++) {
                var Temp = "Rechnung" + i;
                // An dieser Stelle werden die Drag&Drop-Elemente angelegt.
                var Rechnung = document.createElement("div");
                var boxTest = "<div id = "+listeRechnungen[Temp].ID+" draggable=\"true\" ondragstart=\"drag(event)\" id=\"drag1\" width=\"88\" height=\"31\" style= \"display: block;float: left;   margin: 4px; width: 130px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); text-align: center;\"><img src=\"Rechnung_schreiben-Beispiel-2.png\" id=\"bsp\" alt=rechnung style=width:20% ><div id = container ><p>Betrag: " + listeRechnungen[Temp].Betrag +"</p></div></div>"
                Rechnung.innerHTML = boxTest;
                document.getElementById("div1").appendChild(Rechnung);   
            }
        } 
    }
    else {
        console.log("Fehler: Keine Rechnungen für den Kunden vorhanden.")
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////Alle Kunden/Kontakbezogenen Funktionen///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Generiert ein Formular um neue Kontakte anzulegen.
function person_hinzufügen(){
    document.getElementById("Ebene1").innerHTML  = "<p id = \"pLL\">Person hinzufügen:</p><dl><dt>Nachname:</dt><dd><input type=\"text\"id=\"lastNameField\" value=\"Mustermann\" /></dd><dt>Vorname:</dt><dd><input type=\"text\" id=\"nameField\" value=\"Max\" /></dd><dt>IBAN:</dt><dd><input type=\"text\" id=\"IBAN\" value=\"DE00000000000000000000\" /></dd></div><button  style=\"vertical-align:middle\" href=\"#\" onclick=\"PersonAnlegen()\" id=\"submitLink\"><span>Person anlegen</span></button></div>" 
    document.getElementById("Ebene2").innerHTML = "";
}

//Generiert  aus den Eingaben des Kontakte Formulars eine neue Person.
function PersonAnlegen() {
    //Übernehmen der Eingaben
    var Nachname = document.getElementById("lastNameField").value;
    var VorName = document.getElementById("nameField").value;
    var Iban = document.getElementById("IBAN").value;
    var existiert = false;
    //Prüfe, ob Kunde schon existiert
    for (var i = 1; i < (Object.keys(Kunden).length+1); i++) {
        var KundeTem = "Kunde"+i;
        if (Kunden[KundeTem].IBAN == Iban) {
            existiert = true;
            alert("IBAN ist bereits vergeben!");
        } 
        else if ((Kunden[KundeTem].Name == Nachname && Kunden[KundeTem].Vorname == VorName)) {
            existiert = true;
            alert("Kunde existiert bereits!");
        }
    }
    if (!existiert) {
    //Generieren des neuen Kunden
    var neuerKunde = "Kunde" + (Object.keys(Kunden).length+1);
    console.log("Neuer Kunde ist: " + VorName + " " + Nachname + "; IBAN: " + Iban + "...als: " + neuerKunde);
    Kunden[neuerKunde] = {Name:Nachname,Vorname:VorName,IBAN:Iban};
    //Anlegen des Buttons für den neuen Kunden
    var button = document.createElement("div");
    var innerhtmlTest = "<button class = \"button\" style=\"vertical-align:middle\" onclick=\"kundenauswahl('"+neuerKunde+"')\" ><span>"+Nachname+"</span> </button>"
    button.innerHTML = innerhtmlTest;
    document.getElementById("mainMen").appendChild(button);
    }
    
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// Alle Rechnungsbezogenen Funktionen //////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Aus dem Formular zum Erstellen einer neuen Rechnung werden die Inhalte ausgelesen
function ausgabeRechnung() {
    //IBAN des Empfängers wird in Liste der gültigen IBANs gesucht und dessen Kundennummer als EMpfänger gepsiechert
    var empfang = "";
    for (var i = 1; i < (Object.keys(Kunden).length+1); i++) {
        var nameT = "Kunde" + i;
        if (document.getElementById("IBAN").value == Kunden[nameT].IBAN) {
            empfang = nameT;
        }
    }
    //Es wird abgeglichen, ob der Name des Empfängers mit der IBAN übereinstimmt
    if ((Kunden[empfang].Vorname + " " + Kunden[empfang].Name) == document.getElementById("nameField").value || (Kunden[empfang].Vorname + Kunden[empfang].Name) == document.getElementById("nameField").value) {
        //Name wird erstellt
        var neueRechnung = "Rechnung" + (Object.keys(Rechnungen).length);
        //ID wird erstellt und geprüft, ob sie vergeben ist.
        var neueID = 1;
        if (Object.keys(Rechnungen).length > 1) {
        var belegt = true;
        while (belegt) {
            neueID = neueID + 1;
            belegt = false;
            for (var i = 1; i < (Object.keys(Rechnungen).length); i++) {
            var rechnungT = "Rechnung" + i;
                if (Rechnungen[rechnungT].ID == neueID) {
                    belegt = true;
                }
            }
        }
        //Datum der Rechung wird ausgelesen
        }
        var date = getDate();
        //Prüfung ob Kunde überhaupt eingeloggt ist (zum Abfangen eventueller Fehler)
        if (KundeLogin == null) {
            alert("Bitte einloggen!");
        }
        else {
            //neue Rechnung wird als Objekt angelegt.
            Rechnungen[neueRechnung] = {ID: neueID, Steller: KundeLogin, Empfaenger: empfang, Betrag: document.getElementById("Betrag").value, Datum: date};
            console.log(Rechnungen[neueRechnung]);
            alert("Rechnung erfolgreich angelegt.")
        }
    }
    else {
        alert("Name Empfänger stimmt nicht mit IBAN überein.");
    }
}

//Funktion um Rechnungen zu bezahlen
function bezahlen(Identifikationsnummer){
    //Innerer Bereich wird resettet
    document.getElementById("div2").innerHTML = "";
    //Setzte Betrag auf 0, damit wird Rechnung bei erneutem Aufruf von AuswahlRechnungen() nicht mehr angezeigt, ist aber noch vorhanden; alter Betrag wird auf BetragAlt geschoben
    for (var j = 0; j < (Object.keys(Identifikationsnummer).length); j++) { //Wenn Fehler -1
        for (var i = 1; i < (Object.keys(Rechnungen).length); i++) {
            var rechnungT = "Rechnung" + i;
            console.log(Rechnungen[rechnungT].ID + Identifikationsnummer[j]);
            if (Rechnungen[rechnungT].ID == Identifikationsnummer[j]) {
                Rechnungen[rechnungT]["BetragAlt"] = Rechnungen[rechnungT].Betrag;
                Rechnungen[rechnungT].Betrag = 0;
                alert("Rechnung erfolgreich bezahlt.")
            }
        }
    }
    //rufe Oberfläche mit Rechnungen erneut auf und zeige übrige an.
    rechnung_bezahlen();
}

//Rechnungen werden nach unteren Kriterien ausgewählt
function AuswahlRechnungen(KundeWahl) {
    //Prüfung 1: Alle Rechnungen VOM ausgewählten Kunden
    let RechnungenKunde = {Platzhalter:"zur Initialisierung"};
    for (var i = 1; i < (Object.keys(Rechnungen).length); i++) {
        var rechnungT = "Rechnung" + i;
        //Prüfung, ob Rechnung noch offenen Betrag hat.
        if (Rechnungen[rechnungT].Steller == KundeWahl && Rechnungen[rechnungT].Betrag != 0) {
            var neueRechnungT = "Rechnung" + (Object.keys(RechnungenKunde).length);
            RechnungenKunde[neueRechnungT] = Rechnungen[rechnungT];
        }
    }
    //Prüfung 2: Alle Rechnungen AN den eingelogten Kunden
    let RechnungenKunde2 = {Platzhalter:"zur Initialisierung"};
    for (var i = 1; i < (Object.keys(RechnungenKunde).length); i++) {
        var rechnungT = "Rechnung" + i;
        console.log(RechnungenKunde[rechnungT].Empfaenger + KundeLogin)
        if (RechnungenKunde[rechnungT].Empfaenger == KundeLogin) {
            var neueRechnungT = "Rechnung" + (Object.keys(RechnungenKunde2).length);
            RechnungenKunde2[neueRechnungT] = RechnungenKunde[rechnungT];
        }
    }
    return RechnungenKunde2;
}

//Keine Prüfung des  Betrages, auch historische Rechnungen erlaubt
function AuswahlRechnungen2(KundeWahl) {
    //Prüfung 1: Alle Rechnungen VOM ausgewählten Kunden
    let RechnungenKunde = {Platzhalter:"zur Initialisierung"};
    for (var i = 1; i < (Object.keys(Rechnungen).length); i++) {
        var rechnungT = "Rechnung" + i;
        //Keine Prüfung des  Betrages, auch historische Rechnungen erlaubt
        if (Rechnungen[rechnungT].Steller == KundeWahl) {
            var neueRechnungT = "Rechnung" + (Object.keys(RechnungenKunde).length);
            RechnungenKunde[neueRechnungT] = Rechnungen[rechnungT];
        }
    }
    //Prüfung 2: Alle Rechnungen AN den eingelogten Kunden
    let RechnungenKunde2 = {Platzhalter:"zur Initialisierung"};
    for (var i = 1; i < (Object.keys(RechnungenKunde).length); i++) {
        var rechnungT = "Rechnung" + i;
        console.log(RechnungenKunde[rechnungT].Empfaenger + KundeLogin)
        if (RechnungenKunde[rechnungT].Empfaenger == KundeLogin) {
            var neueRechnungT = "Rechnung" + (Object.keys(RechnungenKunde2).length);
            RechnungenKunde2[neueRechnungT] = RechnungenKunde[rechnungT];
        }
    }
    return RechnungenKunde2;
}


 