//Rounds -- A parent component for the app's "rounds" mode.
//Manages the rounds data for the current user and conditionally renders the
//appropriate rounds mode page based on App's mode, which is passed in as a prop.

import React from 'react';
import AppMode from './../AppMode.js';
import RoundsTable from './RoundsTable.js';
import RoundForm from './RoundForm.js';
import FloatingButton from './FloatingButton.js';

class Rounds extends React.Component {

    //Initialize a Rounds object based on local storage
    constructor() {
        super();
        this.state = {deleteId: "",
                      editId: ""};           
    }

    //componentDidMount -- After the component moutns, obtain current user's 
    //rounds from the server and push them into component state
    // componentDidMount = async () => {
    //     let url = "/rounds/" + this.props.userObj.id;
    //     let res = await fetch(url, {method: 'GET'});
    //     if (res.status != 200) {
    //         let msg = await res.text();
    //         alert("There was an error obtaining rounds data for this user: " 
    //         + msg);
    //         return;
    //     } 
    //     let body = await res.json();
    //     body = JSON.parse(body);
    //     alert("in componentDidMount with GET results: " + body);
    //     this.setState({rounds: body}, this.props.changeMode(AppMode.ROUNDS));
    // }

    //addRound -- Given an object newData containing a new round, use the 
    //server POST route to add the new round to the database. If the add is
    //successful, call on the refreshOnUpdate() method to force the parent
    //App component to refresh its state from the database and re-render itself,
    //allowing the change to be propagated to the Rounds table. Then switch
    //the mode back to AppMode.ROUNDS since the user is done adding a round.
    addRound = async (newData) => {
        const url = '/rounds/' + this.props.userObj.id;
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(newData)}); 
        const msg = await res.text();
        if (res.status != 200) {
            alert("An error occurred when attempting to add new round to database: "    
            + msg);
            this.props.changeMode(AppMode.ROUNDS);
        } else {
            this.props.refreshOnUpdate(AppMode.ROUNDS);
        }
    }

    //editRound -- Given an object newData containing updated data on an
    //existing round, update the current user's round in the database. 
    //toggle the mode back to AppMode.ROUNDS since the user is done editing the
    //round. 
    editRound = async (newData) => {
        const url = '/rounds/' + this.props.userObj.id + '/' + 
            this.props.userObj.rounds[this.state.editId]._id;
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'PUT',
            body: JSON.stringify(newData)}); 
        const msg = await res.text();
        if (res.status != 200) {
            alert("An error occurred when attempting to add new round to database: " 
            + msg);
            this.props.changeMode(AppMode.ROUNDS);
        } else {
            this.props.refreshOnUpdate(AppMode.ROUNDS);
        }
    }


    //deleteRound -- Delete the current user's round uniquely identified by
    //this.state.deleteId, delete from the database, and reset deleteId to empty.
    deleteRound = async () => {
        //TO DO: Fill this in
    }
 
    //setDeleteId -- Capture in this.state.deleteId the unique id of the item
    //the user is considering deleting.
    setDeleteId = (val) => {
        this.setState({deleteId: val});
    }

    //setEditId -- Capture in this.state.editId the unique id of the item
    //the user is considering editing.
    setEditId = (val) => {
        this.setState({editId: val});
    }
    
    //render -- Conditionally render the Rounds mode page as either the rounds
    //table, the rounds form set to obtain a new round, or the rounds form set
    //to edit an existing round.
    render() {
        switch(this.props.mode) {
            case AppMode.ROUNDS:
                return (
                    <>
                    <RoundsTable 
                        rounds={this.props.userObj.rounds}
                        setEditId={this.setEditId}
                        setDeleteId={this.setDeleteId}
                        deleteRound={this.deleteRound}
                        changeMode={this.props.changeMode}
                        menuOpen={this.props.menuOpen} /> 
                    <FloatingButton
                        handleClick={() => 
                        this.props.changeMode(AppMode.ROUNDS_LOGROUND)}
                        menuOpen={this.props.menuOpen}
                        icon={"fa fa-plus"} />
                    </>
                );
            case AppMode.ROUNDS_LOGROUND:
                return (
                    <RoundForm
                        mode={this.props.mode}
                        startData={""} 
                        saveRound={this.addRound} />
                );
            case AppMode.ROUNDS_EDITROUND:
                let thisRound = {...this.props.userObj.rounds[this.state.editId]};
                thisRound.date = thisRound.date.substr(0,10);
                if (thisRound.seconds < 10) {
                    thisRound.seconds = "0" + thisRound.seconds;
                } 
                delete thisRound.SGS;
                return (
                    <RoundForm
                        mode={this.props.mode}
                        startData={thisRound} 
                        saveRound={this.editRound} />
                );
        }
    }

}   

export default Rounds;
