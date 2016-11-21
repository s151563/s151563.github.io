function rechung_erstellen(){
            console.log("debug");
            document.getElementById("demo").innerHTML  =
                "<p>Rechnung erstellen:</p> <dl><dt>Empfänger:</dt><dd><input type=\"text\"id=\"nameField\" value=\"Max Mustermann\" /></dd>               <dt>IBAN:</dt><dd><input type=\"text\" id=\"lastNameField\" value=\"DE00000000000000000000\" /></dd><dt>Wasauchimmer:</dt>                    <dd><input type=\"radio\" checked=\"checked\" name=\"gender\" value=\"M\" id=\"genderMale\" />Maledieven<input type=\"radio\" checked=\"checked\" name=\"gender\" value=\"F\" />Frankreich </dl>                <p><a href=\"#\" onclick=\"ausgabe()\" id=\"submitLink\">Save as TXT</a></p>"
                    
        }

// This will generate the text file content based on the form data
function buildData(){
    var txtData = "Name: "+$("#nameField").val()+
            "\r\nLast Name: "+$("#lastNameField").val()+
            "\r\nGender: "+($("#genderMale").is(":checked")?"Male":"Female");

    return txtData;
}

function ausgabe(){
    console.log("ausgabe");
    var txtData = buildData();
    (this).attr('download','Rechnung.txt').attr('href',"data:application/octet-stream;base64,"+Base64.encode(txtData));   
/*$(function(){
    // This will act when the submit BUTTON is clicked
    $("#formToSave").submit(function(event){
        event.preventDefault();
        var txtData = buildData();
        window.location.href="data:application/octet-stream;base64,"+Base64.encode(txtData);
    });

    // This will act when the submit LINK is clicked
    $("#submitLink").click(function(event){
        var txtData = buildData();
        $(this).attr('download','sugguestedName.txt')
            .attr('href',"data:application/octet-stream;base64,"+Base64.encode(txtData));
    });
})*/
}
