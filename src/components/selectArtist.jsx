import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import Scroll from './scroll';
import './selectArtist.css';
import AuthContext from '../store/auth-context';
import axios from 'axios';
class SelectArtist extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            listsInfo: [],
            searchTerm: ''
        }
        //this.randomProperty = React.createRef(); You can add this variable in jsx to get the details of the element.
    }
    componentDidMount() {
        this.fetchListsInfo();
    }

    fetchListsInfo = () => {
        axios.get(`${axios.defaults.baseURL}/api/Lists/listsInfo`)
            .then(response => response.data.data)
            .then(data => {
                const sortedList = data?.sort(this.compare);
                this.setState({ listsInfo: sortedList }, () => {
                })
            })
            .catch(err => {
            })
    }
    compare = (a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }
    onSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value })
    }

    render() {
        const { listsInfo, searchTerm } = this.state;
        const filteredListInfo = listsInfo?.filter(song =>
            song.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
            listsInfo.length === 0 ? null :
                <div className="ui card feed selectCard">
                    <div className="content">
                        <div className="header">Select an artist </div>
                        <hr />
                        <div className="ui icon input">
                            <input onChange={($event) => this.onSearchChange($event)} className="prompt" type="text" placeholder="search artists..." />
                            <i className="search icon"></i>
                        </div>
                        <hr />
                        <Scroll height="50vh">
                            <div className="ui list">
                                {
                                    filteredListInfo.map(list => {
                                        return (
                                            <NavLink key={list._id} activeClassName="" to={`/artist/${list.name}/${list._id}`}>
                                                <h2 className="band">{list.name}</h2>
                                            </NavLink>

                                        )
                                    })
                                }

                            </div>
                        </Scroll>
                    </div>
                    <div className="extra content">

                        {this.context.user === null ? <div> <i className="user icon"></i> Guest </div> : <div>  <img width="40px" src={this.context.user.photo} alt="avatar" />  {this.context.user.name}</div>}
                    </div>
                </div>

        )
    }
}

export default SelectArtist;