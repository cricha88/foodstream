import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import SpeechToText from 'speech-to-text';

class App extends Component {

	constructor() {
		super();
		this.state = {
			newData: [],
			data: [],

			finalisedText: [],
			interimText: "",
			listening: false,
			error: "",
		};

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);

	    this.drag = this.drag.bind(this);
	    this.drop = this.drop.bind(this);
	    this.allowDrop = this.allowDrop.bind(this);
		// const onAnythingSaid = text => {
		// 	this.setState({ interimText: text });
		// };

		// const onFinalised = text => {
		// 	this.setState({finalisedText: [text, ...this.state.finalisedText], interimText: ''});
		// };

	}

	componentDidMount() {
		// this.getDBData()
		// 	.then(res => {this.setState({data: res.result})})
		// 	.catch(err => {console.log(err)});

	}


	onEndEvent = () => {
		if (this.state.listening) {
			this.startListening();
		}
	};
	onAnythingSaid = text => {
		this.setState({ interimText: text });
	};

	onFinalised = text => {
		this.setState({finalisedText: [text, ...this.state.finalisedText], interimText: ''});
	};


	startListening = () => {
		try {
			this.listener = new SpeechToText(this.onFinalised, this.onEndEvent, this.onAnythingSaid, this.state.language);
			this.listener.startListening();
			this.setState({ listening: true });
		} catch (err) {
			console.log(err);
			this.setState({error: err})
		}
	};

	stopListening = () => {
		this.listener.stopListening();
		this.setState({ listening: false });
		this.getNewData().then(res => 
			this.setState({ newData: res.result })).catch(err => console.log(err));	
	};




	// getDBData = async () => {
	// 	const response = await fetch('/bring_existing');
	// 	const body = await response.json();
	// 	if (response.status !=200) {
	// 		throw Error(body.message)
	// 	}
	// 	return body;
	// }

	getNewData = async () => {
		var finalised = '';

		for (var i=0; i<this.state.finalisedText.length; i++) {
			finalised = this.state.finalisedText[i].concat(" ", finalised)
		}
		

		const config = {
			method: 'POST',
			headers: {
		        'Accept': 'application/json',
	    		'Content-Type': 'application/json',

			},
			body: JSON.stringify({query: finalised}),
		};
		const response = await fetch('/add_new', config);
		const body = await response.json();
		if (response.status != 200) {
			throw Error(body.message)
		}
		console.log(body);
		return body;
	}


	drag(event) {
		event.dataTransfer.setData("dragged", event.target.value);
	}

	allowDrop(event) {
		event.preventDefault();
	}


	onDragOver = (event) => {
		event.preventDefault();
	}
	drop(event) {
		event.preventDefault();
		var dropData = event.dataTransfer.getData("dragged");

	}

	renderItems(array) {
		try {
			return array.map((item, i) => 
			    <div class="tile is-child box" key={item[0]} draggable onDragStart={(e) => this.onDragStart(e, item[0])}>
			            <img class="image" src={item[1]} alt={item[0]} ></img>
				        <p class="title"> {item[0]}</p>
				        <p class="subtitle"> {item[2]} </p>			
				</div>			
			);
		} catch {
			return(<div></div>);
		}
	}


	handleChange() {}

	handleSubmit() {}

	render() {


		return(

			<div className="App">
				<title>Egglist</title>
			    <nav class="navbar is-transparent">
			        <div class="navbar-brand">
			            <img src="foodbag.png" width="80px"></img>
			            
			        </div>

				    <div class="navbar-item">
				  		<h1 class="title">Your Grocery Dashboard</h1>
				  	</div>
			        <div class="navbar-end">

			            <div class="navbar-item">
			                <button class="button is-rounded is-large"></button>
			            </div>

			        </div>
			    </nav>

			    <div class="columns">
			    <div class="column">
			    </div>

			    <div class="column">
			    <div>
			    	{ !this.state.listening ?
			        	<button onClick={() => this.startListening()} class="button is-large">Start Listening</button> : 
			        	<button onClick={() => this.stopListening()} class="button is-large">Stop Listening</button>
			    	}
			    </div> 

		        <p> <b>Heard:</b> {this.state.interimText} </p>

			    </div>

			    <div class="column">
			    </div>

				</div>

	    		<div class='tile is-ancestor'>
	    			<div class='tile is-parent'>
						{this.renderItems(this.state.newData)}
					</div>
				</div>

				<nav class="navbar">
					<div class="navbar-end is-fixed-bottom">
		        		<input type="image" src="delbutton.PNG" alt="add" width="80px" ondrop={this.drop} onDragOver={(e) => this.onDragOver}></input>		    
			    	</div>

				</nav>


			</div>

		);



	}

}

export default App;
