import React, { Component } from 'react';
import { connect } from 'react-redux'
import'../App.css'
import Moment from 'moment'

class ListGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newInput:"",
            itemIndex:"",
            listId: "",
            flag:false,
            lists:[],
            itemsInput: "",
            sortingType:""
        }
    }
    componentDidMount() {
        setInterval(() => {
            fetch('./getAllLists',{method:"POST",body: JSON.stringify({
                sortingType: this.state.sortingType
            })}).then(res => { return res.text() })
                .then(response => {
                    let parsed = JSON.parse(response)
                    console.log(parsed)
                    this.setState({lists: parsed})
                    // this.props.dispatch({
                    //     type: "lists",
                    //     lists: parsed
                    // })
                })
        }, 500)
    }
    statusHandler=(id)=>{
        fetch('/completedList', {method: "POST", body: JSON.stringify({
            id: id
        })}).then(res=>{return res.text()})
        .then(response => {
            console.log(response)
        })
    }
    addItemHandler=(event)=>{
         this.setState({itemsInput: event.target.value})
    }

    itemSubmitHandler=(id)=>{
        fetch('/addItem', {method: "PUT", body: JSON.stringify({
            item: this.state.itemsInput,
            id: id
        })}).then(res=> {return res.text()})
        .then (response => {
            console.log(response.message)
        })
    }

    removeItemHandler=(index, id)=>{
        fetch('/removeItem', {method: "DELETE", body: JSON.stringify({
            index: index,
            id: id
        })}).then(res=>{return res.text()})
        .then(response=>{
            console.log(response)
        })
    }
editItemHandler =(id, index)=>{
    this.setState({flag: true, listId:id, itemIndex: index})
}

changedItemHandler=(event)=>{
    this.setState({newInput: event.target.value})
}
saveChangedHandler=(id, index)=>{
    fetch('/editItem', {method: "PUT", body: JSON.stringify({
        id: id,
        index: index, 
        newInput: this.state.newInput
    })}).then(res=>{return res.text()})
    .then(response=>{
        console.log(response)
    })
}

removeAllHandler=(id)=>{
    fetch('/removeAllItems', {method: "DELETE", body: JSON.stringify({
        id: id
    })}).then(res=>{return res.text()})
    .then(response=>{
        console.log(response)
    })
}
removeListHandler=(id)=>{
    fetch('/removeList', {method: "DELETE", body: JSON.stringify({
        id: id
    })}).then(res=>{return res.text()})
    .then(response=>{
        console.log(response)
    })
}
sortByDueDate=()=>{
    this.setState({sortingType: "dueDate"})
}
sortByTitle=()=>{
    this.setState({sortingType:"title"})
}
    render() {
        let editform = null

        if (this.state.flag){
            editform = (<div className="edit-form">
            <th>Edit Item Here:</th>
                <input onChange={this.changedItemHandler} type="text"/>
                <button onClick= {()=>this.saveChangedHandler(this.state.listId, this.state.itemIndex)}>save</button>
            </div>)
        }
        return (<div className="main">
            <div className="sort-nav">
            <th>Sort By:</th>
            <button onClick={this.sortByDueDate}>Due Date</button>
            <button onClick={this.sortByTitle}>Title</button>
            </div>
            {this.state.lists.map((list) => {
                return (<div className="list-container">
                    <div className="title1">{list.title}</div>
                    <div className="titles">Description:{list.description}</div>
                    <div className="titles">Due Date:{new Moment(list.dueDate).format("MMM Do YYYY")}</div>
                    <ol>{list.items.map((item,index)=>{
                        return(<div className="items">
                            <li>{item}</li>
                            <button className="small-btn"onClick={()=>this.removeItemHandler(index, list._id)}>Remove</button>
                            <button className="small-btn" onClick={()=>this.editItemHandler(list._id,index)}>Edit</button>
                        </div>)
                        
                    })}</ol>
                


                    <div>Created At:{new Moment(list.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                    <div>Completed At:{new Moment(list.completedAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                    <div>Updated At:{new Moment(list.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</div>

                  
                        <a className="status"onClick={()=>this.statusHandler(list._id)}>Status:&nbsp;{list.status}</a>
                        <div className="add-item">
                        <input className="input" type="text" onChange={this.addItemHandler} ></input>
                        <button onClick={()=>this.itemSubmitHandler(list._id)}>Add item</button>
                        </div>
                        <button onClick={()=>this.removeAllHandler(list._id)}>Remove All Items</button>
                        <button onClick={()=>this.removeListHandler(list._id)}>Delete List</button>
                    
                </div>)
            })}
             <div>{editform}</div>
        </div>)
    }
}
let connectedListGrid = connect((store) => {
    return ({ lists: store.lists })
})(ListGrid)
export default connectedListGrid