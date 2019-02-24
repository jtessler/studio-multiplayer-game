import React, { Component } from 'react';
import firebase from 'firebase';
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const gameMessage = [
    [
        "Which ocean lies on the east coast of the United States?",
        "Atlantic Ocean"
    ],
    [
        "What is the 5th president of the United States?",
        "Donald Trump"
    ],
    [
        "Whos face is on a one dollor bill?",
        "George Washignton"
    ],
    [
        "How many State in the USA?",
        "50"
    ],
    [
        "What year was America found?",
        "1600"
    ],
    [
        "What is the worlds largest mountain?",
        "Mount Everest"
    ],
    [
        "How many great lakes are there?",
        "5"
    ],
    [
        "What is the longest River in the US?",
        "Missouri River"
    ],
    [
        "The biggest desert in the world is...",
        "Sahara"
    ],
    [
        "How many Kindoms is the United Kindom comprised of?",
        "4"
    ],
    [
        "Dry Ice is a Frozen form of which gas?",
        "Carbon Dioxide"
    ],
    [
        "What is the longest river in the world?",
        "Nile River"
    ],
    [
        "What is the largest body of water?",
        "Pacific Ocean"
    ],
    [
        "What is the most popular country?",
        "China"
    ],
    [
        "What is the capital of IceLand?",
        "Reykjavik"
    ],
    [
        "What continent is the largest in terms of land?",
        "Asia"
    ],
    [
        "What is the largest mountain range in the world?",
        "Andes"
    ],
    [
        "What is the smallest country in the world?",
        "Vatican City"
    ],
    [
        "What is the river that runs through Paris, France is called?",
        "The Seine"
    ],
    [
        "What is the most common speaking language in the world?",
        "English"
    ],
    [
        "What is the name of the household garget that South Karean people believe can kill you?",
        "Electric fan"
    ]
];

export default class TwentyOneQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choice: "",
            opponent: "",
            answer: "",
            answer2: "",
            tally1: 0,
            tally2: 0,
            answerIsCorrect: false,
            hidden: true,
            open: false,
            cUser: this.props.location.state.creator,
            winner: "",
            isGameFinished: false,
            question1: [],
            question2: []
        };
        var currentUser = firebase.auth().currentUser.uid;
        this.creator = props.location.state.creator === currentUser;
    }

    componentWillMount() {
        var id = this.props.match.params.id;
        var sessionDatabaseRef = firebase.database().ref("/session/" + id);
        sessionDatabaseRef.on("value", (snapshot) => {
            var sessionSnapshot = snapshot.val();
            if (sessionSnapshot !== null) {
                var tally1 = 0;
                var tally2 = 0;
                var quest1 =[];
                var quest2 = [];
                
                if(sessionSnapshot.tally1){
                    tally1 = sessionSnapshot.tally1;
                }
                
                if(sessionSnapshot.tally2){
                    tally2 = sessionSnapshot.tally2;
                }
                
                if(sessionSnapshot.question1){
                    quest1 = Object.values(sessionSnapshot.question1);
                }
                
                if(sessionSnapshot.question2){
                    quest2 = Object.values(sessionSnapshot.question2);
                }
                
               if(tally1 + tally2 === 21){
                    if(tally1 > tally2){
                        this.setState({winner: "Player 1 Wins!!", isGameFinished: true});
                    } else {
                        this.setState({winner: "Player 2 Wins!!", isGameFinished: true});
                    }
                } else {
                    this.setState({isGameFinished: false});
                }
                
                this.setState({
                    tally1: tally1,
                    tally2: tally2,
                    cUser: sessionSnapshot.current_user,
                    question1: quest1,
                    question2: quest2
                });
            }
        });

    }

    sayMessage() {
        this.setState({ 'message': gameMessage })
    }

    toggleHidden() {
        this.setState({
            hidden: !this.state.hidden
        })
    }

    handleOpen = (i) => {
        this.setState({ open: true, choice: i });
        console.log(i);
    };
    
    handleInsertQChange = (event) => {
        this.setState({'insertQ': event.target.value });
    }
    handleInsertAChange = (event) => {
        this.setState({'insertA': event.target.value });
    }
    
    handleSubmit = () => {
        var currentUser = firebase.auth().currentUser.uid;
        var insertA = this.state.insertA || "";
        var insertQ = this.state.insertQ || "";
        var sessionId = this.props.match.params.id;
        var sessionDatabaseRef = firebase.database().ref("/session/" + sessionId);
        if(this.creator){
            sessionDatabaseRef.child("question1").push({
                question: insertQ,
                answer: insertA,
                uid: currentUser,
            });
        }else{
            sessionDatabaseRef.child("question2").push({
                question: insertQ,
                answer: insertA,
                uid: currentUser,
            });
        }
    }
    
    handleClose = () => {
        let a = this.check(this.state.choice, this.creator? this.state.answer: this.state.answer2);
        console.log(a, this.state.choice, this.state.answer, this.state.answer2);

        if (a) {
            var sessionId = this.props.match.params.id;
            var sessionDatabaseRef = firebase.database().ref("/session/" + sessionId);
         
            if(this.creator) {
                sessionDatabaseRef.child("tally1").set(this.state.tally1 + 1, (error) => {
                    if (error) {
                        console.error("Error storing session metadata", error);
                    }
                });
            } else {
                sessionDatabaseRef.child("tally2").set(this.state.tally2 + 1, (error) => {
                    if (error) {
                        console.error("Error storing session metadata", error);
                    }
                });
            }
            this.setState({ open: false });
        }
        else {
            this.setState({ open: false, answerIsCorrect: a });
        }
    };
    
    reset = () => {
        this.setState({
            open: false,
            tally1: 0,
            tally2: 0,
            answerIsCorrect: false,
            hidden: true,
            cUser: this.props.location.state.creator,
            winner: "",
            isGameFinished: false
        });
    }


    handleChange = name => event => {
        if (this.creator) {
            this.setState({ answer: event.target.value });
        }
        else {
            this.setState({ answer2: event.target.value });
        }
    };

    check(choice, answer) {
        if (answer === choice[1]) {
            return true;
        }
        else {
            return false;
        }
    }
    
    render() {
        const list = gameMessage.map((item) => {
            return <li className = "question" key={item} onClick={() => this.handleOpen(item)}> {item[0]} </li>
        });
        
        const quest1 = this.state.question1.map((item) => {
            return <li className = "question" key={item} onClick={() => this.handleOpen([item.question, item.answer])}> {item.question} </li>
        });
        
        const quest2 = this.state.question2.map((item) => {
            return <li className = "question" key={item} onClick={() => this.handleOpen([item.question, item.answer])}> {item.question} </li>
        });

        const actions = [
            <FlatButton
            label="Cancel"
            primary={true}
            onClick={() => { console.log(1); this.handleClose() }}
            //onClick={this.handleClose}
          />,
            <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onClick={this.handleClose}
          />,
        ];

        const inpt = () => (
            <Dialog title="Answer Question" actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
            <p>{this.state.choice[0]}</p>
            <TextField id="text-field-default" placeholder="Answer" value={this.creator? this.state.answer: this.state.answer2} onChange={this.handleChange()}/>
        </Dialog>
        );

        const showWin = () => (
            <Dialog title="Winner" actions={actions} modal={false} open={this.state.isGameFinished} onRequestClose={this.reset}>
                <h1>{this.state.winner}</h1>
            </Dialog>
        );

        const txt = () => (
            <div>
            <TextField id="text-field-default" onChange = {this.handleInsertQChange} placeholder="Question"/><br />
            <TextField id="text-field-default" onChange = {this.handleInsertAChange} placeholder="Answer"/><br />
        <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onClick={this.handleSubmit}
        />
         </div>
        );

        return (<div className="twentyonequestion">
        <center><h1>Welcome to 21 Questions!</h1></center>
        <div>
        
          <Tabs
    value={this.state.value}
    onChange={this.handleChange}
  >
    <Tab label="Questions" value="a">
      <div>
        <ol>
            {list}
            {this.creator? quest2: quest1}
        </ol>
        <div style={{flexDirection: 'row'}}>
            <h1>Tally</h1>
            <hr />
            <h2 style={{marginLeft: 'auto'}}>Player 1: {this.state.tally1}</h2>
            <h2 style={{marginLeft: 'auto'}}>Player 2: {this.state.tally2}</h2>
        </div>
      </div>
    </Tab>
    <Tab label="Input your own Question" value="b">
      <div>
      <br />
        {txt()}
        <br/>
      </div>
    </Tab>
  </Tabs>
  
  {inpt()}
  {showWin()}
  
        </div>
      </div>);
    }
}
