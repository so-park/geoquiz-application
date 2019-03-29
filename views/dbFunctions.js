// class NameForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {value: ''};
//
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }
//
//   handleChange(event) {
//     this.setState({value: event.target.value});
//   }
//
//   handleSubmit(event) {
//     alert('A name was submitted: ' + this.state.value);
//     event.preventDefault();
//   }
//
//   render() {
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <label>
//           Name:
//           <input type="text" value={this.state.value} onChange={this.handleChange} />
//         </label>
//         <input type="submit" value="Submit" />
//       </form>
//     );
//   }
// }
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
