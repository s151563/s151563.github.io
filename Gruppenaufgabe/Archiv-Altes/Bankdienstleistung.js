var KundeLogin;

function login() {
    if (document.getElementById("LoginButton").innerHTML == "Logout") {
        var logedIn = false;
        KundeLogin = "";
        KundeAktiv = "";
        document.getElementById("mainMen").innerHTML = "";
        document.getElementById("Ebene1").innerHTML = "";
        document.getElementById("Ebene2").innerHTML = "";
        document.getElementById("mainHizu").innerHTML ="";
    }
    else {
        var KundeLoginT = document.getElementById("username").value;
        var logedIn = false;
        for (var i = 1; i < (Object.keys(Kunden).length+1); i++) {
            var t = "Kunde"+i;
            console.log(t+"  "+Kunden[t]+KundeLoginT);
            if (Kunden[t].Name == KundeLoginT) {
                console.log("Kunde erkannt");
                KundeLoginT = t;
                KundeLogin = KundeLoginT;
                logedIn=true;
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
        
        if(logedIn == false){
            alert("User existiert nicht! - Propieren Sie es nochmal");
        }
       
        
    }
    
    if (logedIn) {
    document.getElementById("Eingeloggt").innerHTML = "Eingeloggt als: "+Kunden[KundeLogin].Name;
    document.getElementById("LoginButton").innerHTML = "Logout";   
    }
    else {
        document.getElementById("Eingeloggt").innerHTML = "Nicht eingeloggt. Bitte einloggen!"+KundeAktiv+KundeLogin;
        //alert("Username ist dem System unbekannt.")
        document.getElementById("LoginButton").innerHTML = "Login";
    }
    document.getElementById("username").value = "";
}

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

function DatenSpeichern() {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("POST", "save-to-log.php");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(Rechnungen));
    console.log(JSON.stringify(Rechnungen))
}



function getDate() {
    var heute = new Date();
    var jahr = heute.getYear()-100;
    var monat = heute.getMonth()+1;
    var tag = heute.getDate();
    return tag+"."+monat+"."+jahr;
}

function kundenauswahl(aktiverKunde){
    KundeAktiv = aktiverKunde;
    console.log(KundeAktiv);
    document.getElementById("Ebene1").innerHTML = "<p id = \"pLL\">Name: "+Kunden[KundeAktiv].Name+"</p id = \"pLL\"><p id = \"pLL\">Vorname: "+Kunden[KundeAktiv].Vorname+"</p><p id = \"pLL\">IBAN: "+Kunden[KundeAktiv].IBAN+"</p><button class = \"button1\" style=\"vertical-align:middle\"onclick=\"rechnung_bezahlen()\"><a><span>Rechnung bezahlen </span></a></button><br><br><button class = \"button1\" style=\"vertical-align:middle\" onclick=\"rechung_erstellen()\"><a><span>Rechnung erstellen</span></a></button><br><br><button class = \"button1\" style=\"vertical-align:middle\"onclick=\"rechnungsübersicht()\"><a><span>Rechnungsübersicht</span></a></button>" 
    document.getElementById("Ebene2").innerHTML = "";
}
    
function rechnungsübersicht(){// Rechnungen verarbeiten in Tabelle
    console.log("debug");
    var listeRechnungen = AuswahlRechnungen(KundeAktiv);
        
    if (listeRechnungen != null) {
     
        document.getElementById("Ebene2").innerHTML  = "<p id = \"pLL\">Rechnungsübersicht:</p><table id =\"rechnung\"><tr>  <th>Rechnungsdatum</th><th>Betrag</th></tr></table>"

        if (Object.keys(listeRechnungen).length > 1) {
            for (var i = 1; i < (Object.keys(listeRechnungen).length+1); i++) {
                var Temp = "Rechnung" + i;
                  //Hier jetzt appendChield für jede Rechnung: listeRechnungen[Temp]
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


function rechung_erstellen(){//Automatische zuweisen der Felder vom aktivenKunden + API von JONAH
    console.log("debug");
    let tempName = Kunden[KundeAktiv].Vorname + Kunden[KundeAktiv].Name;
    document.getElementById("Ebene2").innerHTML  = "<p id = \"pLL\">Rechnung erstellen:</p> <dl><dt>Empfänger:</dt><dd><input type=\"text\"id=\"nameField\" value="+ tempName +" /></dd>               <dt>IBAN:</dt><dd><input type=\"text\" id=\"IBAN\" value="+Kunden[KundeAktiv].IBAN+" /></dd><dt>Betrag:</dt>                    <dd><input type=\"text\" id=\"Betrag\" value=\"0\" /></dd>                </div><button  style=\"vertical-align:middle\" href=\"#\" onclick=\"ausgabeRechnung()\" id=\"submitLink\"><span>Weiterleiten</span></button></div>" 
}

function rechnung_bezahlen(){//gestellte Rechnung in diesr Ansicht anzeigen (Verknüpfung zu gestellten Rechnungen vom aktiven Kunden)
    console.log("debug");
    var listeRechnungen = AuswahlRechnungen(KundeAktiv);
    if (listeRechnungen != null) {
        //Rechnungen durchgeben und ausgeben: Datum, Steller, Empfänger, Betrag
        //KundeN in Namen umwandeln: Kunden[KundeN].name
        document.getElementById("Ebene2").innerHTML  = "<p id = \"pLL\">Rechnung bezahlen:</p><p>Offene Rechnung:</p><div id=\"div1\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\"></div><p>Rechnung / Rechnungen bezahlen:</p><div id=\"div2\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\"></div><div><button class = \"button1\" style=\"vertical-align:middle\" onclick = \"bezahlen(0)\"><span>Bezahlen</span></button></div>"
         if (Object.keys(listeRechnungen).length > 1) {
            for (var i = 1; i < (Object.keys(listeRechnungen).length); i++) {
                var Temp = "Rechnung" + i;
                  //Hier jetzt appendChield für jede Rechnung: listeRechnungen[Temp]
                console.log(listeRechnungen[Temp]);
                
                var Rechnung = document.createElement("div");
                var boxTest = "<div id = Rechnung draggable=\"true\" ondragstart=\"drag(event)\" id=\"drag1\" width=\"88\" height=\"31\"><img src=Rechnung_schreiben-Beispiel-2.png alt= rechnung style=width:20% ><div id = container ><p>Betrag: " + listeRechnungen[Temp].Betrag +"</p></div></div>"
                
                Rechnung.innerHTML = boxTest;
                document.getElementById("div1").appendChild(Rechnung);   
            }
        }
        
    }
    else {
        console.log("Fehler: Keine Rechnungen für den Kunden vorhanden.")
    }
}

function bezahlen(Identifikationsnummer){//Nach Bezahlen Rechnung aus Liste streichen jedoch nicht aus Übersicht
    document.getElementById("div2").innerHTML = "";
    
    //Setzte Betrag auf 0, damit wird Rechnung bei erneutem Aufruf von AuswahlRechnungen() nicht mehr angezeigt, ist aber noch vorhanden; alter Betrag wird auf BetragAlt geschoben
    for (var i = 1; i < (Object.keys(Rechnungen).length); i++) {
        var rechnungT = "Rechnung" + i;
        if (Rechnungen[rechnungT].ID == Identifikationsnummer) {
            Rechnungen[rechnungT]["BetragAlt"] = Rechnungen[rechnungT].Betrag;
            Rechnungen[rechnungT].Betrag = 0;
            //rechnung_bezahlen();
            return;
        }
    }    
}
function person_hinzufügen(){//Funktion erweitern, dass wenn ein Kunde erzeugt worden ist man weiter erzeugen kann und dieser nicht überschrieben wird
    console.log("debug");
    if (Object.keys(Kunden).length > 3) {
        //es existieren mehr als die drei Initialkunden
    }
    document.getElementById("Ebene1").innerHTML  = "<p id = \"pLL\">Person hinzufügen:</p><dl><dt>Nachname:</dt><dd><input type=\"text\"id=\"lastNameField\" value=\"Mustermann\" /></dd><dt>Vorname:</dt><dd><input type=\"text\" id=\"nameField\" value=\"Max\" /></dd><dt>IBAN:</dt><dd><input type=\"text\" id=\"IBAN\" value=\"DE00000000000000000000\" /></dd></div><button  style=\"vertical-align:middle\" href=\"#\" onclick=\"PersonAnlegen()\" id=\"submitLink\"><span>Person anlegen</span></button></div>" 

    document.getElementById("Ebene2").innerHTML = "";
}


function PersonAnlegen() {
    var Nachname = document.getElementById("lastNameField").value;
    var VorName = document.getElementById("nameField").value;
    var Iban = document.getElementById("IBAN").value;
    var existiert = false;
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
    var neuerKunde = "Kunde" + (Object.keys(Kunden).length+1);
    console.log("Neuer Kunde ist: " + VorName + " " + Nachname + "; IBAN: " + Iban + "...als: " + neuerKunde);
    //alert(neuerKunde);
    Kunden[neuerKunde] = {Name:Nachname,Vorname:VorName,IBAN:Iban};
    console.log(Kunden[neuerKunde]);
    var button = document.createElement("div");
    var innerhtmlTest = "<button class = \"button\" style=\"vertical-align:middle\" onclick=\"kundenauswahl('"+neuerKunde+"')\" ><span>"+Nachname+"</span> </button>"
    button.innerHTML = innerhtmlTest;
    document.getElementById("mainMen").appendChild(button);
    }
    
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(data);
    ev.target.appendChild(document.getElementById(data));
    //Nächste Zeile gibt in der Konsole die ID des gezogenen Bildes aus.
    console.log(ev.id);
    var x = 1;
    document.getElementById(ev.id).id = 'Rechnung' + x;//Dadurch wird die ID des Bildes mit Rechnung überschrieben. Damit das bei mehreren
    //Rechnungen funktioniert, die Idee mit dem x. 
    x+1;
    //document.getElementById("div1").getAttribute(//welches dic rufe ich jetzt hier auf?)
    //muss hier jetzt die Funktion bezahlen() aufgerufen werden???
}


function ausgabeKunde(){
    var Nachname = document.getElementById("lastNameField").value;
    var VorName = document.getElementById("nameField").value;
    var Iban = document.getElementById("IBAN").value;
    console.log("Neuer Kunde ist: " + VorName + " " + Nachname + "; IBAN: " + Iban);
    var neuerKunde = "Kunde" + (Object.keys(Kunden).length+1);
    //alert(neuerKunde);
    Kunden[neuerKunde] = {Name:Nachname,Vorname:VorName,IBAN:Iban};
   
    document.getElementById("Ebene").innerHTML = "<button class = \"button\" style=\"vertical-align:middle\" onclick=\"kundenauswahl('neuerKunde')\" ><span>"+Nachname+"</span> </button>";
    
    
}
    
    


function ausgabeRechnung() {
    var empfang = "";
    for (var i = 1; i < (Object.keys(Kunden).length+1); i++) {
        var nameT = "Kunde" + i;
        //console.log(Kunden[nameT].IBAN);
        if (document.getElementById("IBAN").value == Kunden[nameT].IBAN) {
            empfang = nameT;
            console.log("gefunden");
        }
    }
    if ((Kunden[empfang].Vorname + " " + Kunden[empfang].Name) == document.getElementById("nameField").value || (Kunden[empfang].Vorname + Kunden[empfang].Name) == document.getElementById("nameField").value) {
        var neueRechnung = "Rechnung" + (Object.keys(Rechnungen).length);
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
        }
        var date = getDate();
        if (KundeLogin == null) {
            alert("Bitte einloggen!");
        }
        else {
            Rechnungen[neueRechnung] = {ID: neueID, Steller: KundeLogin, Empfaenger: empfang, Betrag: document.getElementById("Betrag").value, Datum: date};
            console.log(Rechnungen[neueRechnung]);
            alert("Rechnung erfolgreich angelegt.")
        }
    }
    else {
        alert("Name Empfänger stimmt nicht mit IBAN überein.");
    }
}

function AuswahlRechnungen(KundeWahl) {
    //Prüfung 1: Alle Rechnungen VOM ausgewählten Kunden
    //console.log(Rechnungen);
    let RechnungenKunde = {Platzhalter:"zur Initialisierung"};
    for (var i = 1; i < (Object.keys(Rechnungen).length); i++) {
        var rechnungT = "Rechnung" + i;
        if (Rechnungen[rechnungT].Steller == KundeWahl && Rechnungen[rechnungT].Betrag != 0) {
            var neueRechnungT = "Rechnung" + (Object.keys(RechnungenKunde).length);
            RechnungenKunde[neueRechnungT] = Rechnungen[rechnungT];
        }
    }
    //console.log(RechnungenKunde); //funzt
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
   // console.log(RechnungenKunde2);
    return RechnungenKunde2;
}




 