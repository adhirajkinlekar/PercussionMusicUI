import React, { Component } from "react";
import Item from "./items";
import './list.css';
import Scroll from './scroll'
//import { useParams } from 'react-router-dom';
import { withRouter } from "react-router";
import AuthContext from '../store/auth-context';
import axios from 'axios';
class List extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      list: {},
      items: [],
      searchTerm: '',
      showModal: '',
      votes: []
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   //it is called when a component has updated and is receiving new props. componentWillReceiveProps is being deprecated
  // }

  componentDidUpdate(prevProps, prevState) {
    //console.log(prevState)
  }

  componentDidMount() {
    //runs only once
    this.fetchList();
  }

  fetchList = async (listId) => {

    await axios.get(`${axios.defaults.baseURL}/api/Lists/${this.props.match.params.id}`)
      .then(response => response.data)
      .then(response => {
        let tempObj = {};
        for (let key in response.data) {
          if (key !== 'items') {
            tempObj[key] = response.data[key]
          };
        }
        this.setState({ list: tempObj })
  
      
        let items =  response.data.items.sort( this.compare );
        items.forEach((item, index) => {
          item.order = index + 1;
        });
        this.setState({ items: items });
        if (this.context.user) {
          this.getVotes()
        }
      })
      .catch(err => {
      })

  }
   compare = ( a, b ) => {
    if ( a.likesCount < b.likesCount ){
      return 1;
    }
    if ( a.likesCount > b.likesCount ){
      return -1;
    }
    return 0;
  }
  
  getVotes = async () => {
    await axios.get(`${axios.defaults.baseURL}/api/Lists/${this.props.match.params.id}/${this.context.user._id}/votes`).then((response) => {

      this.setState({ votes: response.data.data })
    })
  }

  onSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value })
  }

  showHideModal = (value) => {
    this.setState({ showModal: value })
  }

  submitVote = async (itemId, userId) => {
    await axios.post(`${axios.defaults.baseURL}/api/Lists/items/${itemId}/vote`, {
      itemId: itemId,
      userId: userId,
      listId: this.props.match.params.id
    }).then(data => { 
      this.fetchList()
      this.getVotes()})
      .catch(err => {
      })
  }

  render() {

    const { items, searchTerm, showModal,votes } = this.state;
    const votedItems = []; 
    const filteredSongs = items.filter(song => {
      if(votes.some(x=> x.itemId ===song._id)){
        votedItems.push(song);
      }
     return song.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    );
    return (
      items.length === 0 ? null :
        <div>
          <div className="ui search searchBox">
            <div className="ui icon input">
              <input onChange={($event) => this.onSearchChange($event)} className="prompt" type="text" placeholder="search songs..." />
              <i className="search icon"></i>
            </div>
            <i className="trophy icon trophyicon" onClick={() => this.showHideModal('active')}></i>
            <div className="results"></div>
          </div>
          <div className="scrollableContent">
            <Scroll height="86vh">
            {window.screen.availWidth <= 1215 &&
                                <div className="changePageIconReverse">
                                    <i className="arrow alternate circle left outline icon" onClick={() => this.props.showProfileComponent(true)}></i>
                                </div>
                            }
              <div className="listContent">
                <Item items={filteredSongs} votes={votes} fetchList={this.fetchList} submitVote={this.submitVote} />
              </div>
            </Scroll>
          
            <div className="modalContainer">
              <div className={`ui modal ${showModal} commentModal`}>
                <div className="header modalHeader"><div className="headerItems"><div><h1>Votes</h1> { this.context.user && <h3>0{5-votes.length}/05 votes remaining</h3>} </div> <div><i onClick={() => this.showHideModal('')} className="fa fa-times closeModal" aria-hidden="true"></i></div></div></div>
                <Scroll height="38vh">
             {
          votedItems.length > 0 ?   votedItems?.map((item,i)=>{
               return (
              
                <div key={item._id} className ="voteContainer" >
                <div className="ui middle aligned selection list itemList" >
                    <div className="item">
                        <h1 className="ui avatar image rank">{i+1}</h1> 
                        <div className="content">
                            {item.order === 1 ? <h1 className="header itemName">{item.name.length > 50 ? item.name.substr(0, 40) + '...' : item.name}</h1> : <h2 className="header">{item.name.length > 50 ? item.name.substr(0, 40) + '...' : item.name}</h2>}
                        </div>
                        <div className="votesContainer">
                        <span className="votes"> {item.likes.length} votes  </span>
                     <i style={votes?.some(x=> x.itemId === item._id) ? {color:'rosybrown'}:{}} className="heart icon heartIcon" onClick={()=> this.submitVote(item._id,this.context.user._id)}></i> 
                        </div>
                    </div>
                </div>
                </div>
               )
             })
             :<div> {this.context.user ?<h3 style={{textAlign:'center'}}> Please touch/click on heart symbol to vote for a song of your choice</h3> : <h3 style={{textAlign:'center'}}> Please sign in or register to vote for a song of your choice</h3>}</div>
            }
            </Scroll>
              </div>
            </div>
          </div>
        </div>
    )
  }

}

export default withRouter(List);




// import React, { Component, useEffect, useState } from "react";
// import Item from "./items";
// import './list.css';
// import Scroll from './scroll'
// //import { useParams } from 'react-router-dom';
// import { withRouter } from "react-router";

// const List = (props) => {
//   const [list, setList] = useState({});
//   const [items, setItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredSongs, setFilteredSongs] = useState([]);
//   // componentWillReceiveProps(nextProps) {
//   //   //it is called when a component has updated and is receiving new props. componentWillReceiveProps is being deprecated
//   // }

//   // componentDidUpdate(prevProps, prevState) {
//   //   //console.log(prevState)
//   // }

//   // componentDidMount() {
//   //   //runs only once
//   //   this.fetchList();
//   // }


//   const fetchList = (listId) => {
//     fetch(`http://localhost:3001/api/Lists/${props.match.params.id}`, {
//       method: 'GET',
//       headers: new Headers({
//         'Content-Type': 'application/json'
//       })
//     })
//       .then(response => response.json())
//       .then(jsonResponse => {
//         let tempObj = {};
//         for (let key in jsonResponse.data) {
//           if (key !== 'items') {
//             tempObj[key] = jsonResponse.data[key]
//           };
//         }
//         // this.setState({ list: tempObj })
//         setList(tempObj)
//         jsonResponse.data.items.forEach((item, index) => {
//           item.order = index + 1;
//         });
//         // this.setState({ items: jsonResponse.data.items });
//         setItems(jsonResponse.data.items);
//         setFilteredSongs(jsonResponse.data.items);
//       })
//       .catch(err => {
//       })
//   }
//   useEffect(() => {
//     fetchList();
//   }, [])

//   const onSearchChange = (e) => {
//     //this.setState({ searchTerm: e.target.value })
//     setSearchTerm(e.target.value);
//   }
//   useEffect(() => {
//     const identifier = setTimeout(() => {
//       setFilteredSongs(items.filter(song =>
//         song.name.toLowerCase().includes(searchTerm.toLowerCase())
//       ))
//       return () => {
//         clearTimeout(identifier)
//       }
//     }, 500)

//   }, [searchTerm])

//   return (
//     Object.keys(list).length === 0 && list.constructor === Object ? null :
//       <div>
//         <div className="ui search searchBox">
//           <div className="ui icon input">
//             <input onChange={($event) => onSearchChange($event)} className="prompt" type="text" placeholder="search songs..." />
//             <i className="search icon"></i>
//           </div>
//           <div className="results"></div>
//         </div>
//         <div className="scrollableContent">

//           <Scroll height="86vh">
//             <div className="listContent">
//               <Item items={filteredSongs} fetchList={fetchList} />
//             </div>
//           </Scroll>
//         </div>
//       </div>
//   )
// }

// export default withRouter(List);