import React, { Component } from 'react';
import Particles from 'react-particles-js';
// import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import './App.css';
import 'tachyons';


// const app = new Clarifai.App({
//  apiKey: 'a02e73c421414cbb9e5a72c66a80dd87'
// });

const particlesOptions = {
    particles: {
      number: {
        value: 90,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
  }

const initalState = {
    input:'',
    imageURL: '',
    box:'{}',
    route: 'signin',
    isSignedIn: false,
    user: {
      email:'',
      id: '',
      name: '',
      entries: 0,
      joined: new Date()

    }
}


class App extends Component {
constructor(){
  super();
  this.state =  initalState;
    
  
}

// componentDidMount(){
//   fetch('http://localhost:3001/')
//   .then(response => response.json())
//   .then(console.log)
// }

loadUser=(data) =>{
  this.setState({user:{
      email:data.email,
      id: data.id,
      name: data.name,
      entries: data.entries,
      joined: data.joined
  }})
}

calculateFaceLocation = (data) => {
const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
const image = document.getElementById('inputimage');
const width = Number(image.width);
const height = Number(image.height);
return{
  leftCol: clarifaiFace.left_col*width,
  topRow: clarifaiFace.top_row*height,
  rightCol: width - (clarifaiFace.right_col*width),
  bottomRow: height - (clarifaiFace.bottom_row*height)
}
}

displayFace = (box)=>{
  this.setState({box: box});
}
onInputChange = (event) => {
  this.setState({input: event.target.value});
}


onButtonSubmit = () => {
  this.setState({imageURL: this.state.input});

    fetch('http://localhost:3001/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
            })
        })
        .then(response => response.json())
  // app.models
  // .predict(
  //   Clarifai.FACE_DETECT_MODEL, 
  //   this.state.input)
    .then(response => {
      if(response){
        fetch('http://localhost:3001/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
            })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
          
        })
        .catch(console.log)

      }
      this.displayFace(this.calculateFaceLocation(response))

    })
    .catch(err => console.log(err));
  
}
onRouteChange = (route) => {
  if (route === 'signout'){
   this.setState(initalState) 
  } else if (route === 'home'){
   this.setState({isSignedIn: true}) 
  }
  this.setState({route: route});
}
  render() {
    return (
      <div className="App">
        <Particles className='particles' 
              params={particlesOptions}
            />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home' 
          ? <div>
            <Logo />
            <Rank name={this.state.user.name} 
            entries={this.state.user.entries}/>
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
              />

            <FaceRecognition box ={this.state.box} imageURL={this.state.imageURL} />
            </div>

            : ( 
                this.state.route === 'signin'
                ? <SignIn loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange}/>
              )
          
          
        }
      </div>
    );
  }
}

export default App;