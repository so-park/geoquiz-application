let table = document.getElementById('databaseTable');

let editingTd;

table.onclick = function(event) {

  // 3 possible targets
  let target = event.target.closest('.edit-cancel,.edit-ok,td');

  if (!table.contains(target)) return;

  if (target.className == 'edit-cancel') {
    finishTdEdit(editingTd.elem, false);
  } else if (target.className == 'edit-ok') {
    finishTdEdit(editingTd.elem, true);
  } else if (target.nodeName == 'TD') {
    if (editingTd) return; // already editing

    makeTdEditable(target);
  }

};

function makeTdEditable(td) {
  editingTd = {
    elem: td,
    data: td.innerHTML
  };

  td.classList.add('edit-td'); // td is in edit state, CSS also styles the area inside

  let textArea = document.createElement('textarea');
  textArea.style.width = td.clientWidth + 'px';
  textArea.style.height = td.clientHeight + 'px';
  textArea.className = 'edit-area';

  textArea.value = td.innerHTML;
  td.innerHTML = '';
  td.appendChild(textArea);
  textArea.focus();

  td.insertAdjacentHTML("beforeEnd",
    '<div class="edit-controls"><button class="edit-ok">OK</button><button class="edit-cancel">CANCEL</button></div>'
  );
}

function finishTdEdit(td, isOk) {
  if (isOk) {
    td.innerHTML = td.firstChild.value;
  } else {
    td.innerHTML = editingTd.data;
  }
  td.classList.remove('edit-td');
  editingTd = null;
}
console.log("function is called")
// function passWord() {
//   var testV = 1;
//   var pass1 = prompt('Please Enter Your Password',' ');
//   while (testV < 3) {
//     if (!pass1) history.go(-1);
//     if (pass1.toLowerCase() == "letmein") {
//       alert('You Got it Right!');
//       document.getElementById("editDatabase").style.display = "block";
//       break;
//     }
//     testV+=1;
//     var pass1 =
//     prompt('Access Denied - Password Incorrect, Please Try Again.','Password');
//   }
//     if (pass1.toLowerCase()!="password" & testV ==3)
//     history.go(-1);
//   return " ";
// }
//
var country = document.getElementById("countryName").value;
function submitCountryName(){
  //get country name that user types in the form
  console.log("submit is called")

  console.log(country)
  var urlforCountry =  window.location.host + "/get/" + country;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function ReceivedCallback() {
      if (this.readyState == 4 && this.status == 200) {
          selectedCountries =JSON.parse(this.responseText);
          console.log("Response Received")
      }
  };
  xhttp.open("GET", urlforCountry , true);
  xhttp.send(null);

}
