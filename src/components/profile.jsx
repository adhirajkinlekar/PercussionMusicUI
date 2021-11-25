import './profile.css'
import Scroll from './scroll'
import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router';
import axios from 'axios';
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artistInfo: {},
            artistReleases: []
        }
    }

    componentDidMount() {
        this.fetchDiscogsId();
    }

    fetchDiscogsId = () => {
        axios.get(`${axios.defaults.baseURL}/api/Lists/${this.props.match.params.id}/discogsId`)
            .then(response => response.data)
            .then(response => {
                this.fetchArtistInfo(response.data.artistId)
            })
            .catch(err => {

            });

    }
    fetchArtistInfo = (artistId) => {

        axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=${artistId}&api_key=354503444ede1338a6be8cf0c335fdb0&format=json`)
            .then(response => {
                return response.data.artist
            })
            .then(data => {
                this.setState({ artistInfo: data })
            }).catch(err => {
            })


        axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&mbid=${artistId}&api_key=354503444ede1338a6be8cf0c335fdb0&format=json`)
            .then(response => response.data.topalbums.album)
            .then(data => {
                const albums = data.filter(album => {
                    return !(album.name.toLowerCase().includes('(null)'))
                })
                this.setState({ artistReleases: albums })
            })
    }

    render() {
      /// console.log(this.state.artistInfo.image[0]) weird

        return (Object.keys(this.state.artistInfo).length === 0 && this.state.artistInfo.constructor === Object ? null :
            <div className="ui card artistProfile">
                <div className="artistProfile">
                    <h2 className="artistName">{this.props.match.params.name} </h2>
                    <div className="extra content">

                        <i className="music icon musicIcon"></i>    {this.state.artistInfo.stats.playcount} Last Fm Playcount
                    </div>
                    <hr />
                    <Scroll height="38vh">
                        <p className="artistBio">{this.state.artistInfo.bio.content}</p>
                        {/* <img src={this.state.artistInfo.image[2].#text}/> */}
                    </Scroll>
                    {window.screen.availWidth <= 1215 &&
                                <div className="changePageIcon">
                                    <i className="arrow alternate circle right outline icon" onClick={() => this.props.showProfileComponent(false)}></i>
                                </div>
                            }
                    <Scroll height="38vh">
                        <table className="ui celled table">
                            <thead>
                                <tr><th>Release Title</th>
                                    <th>Last FM play count</th>
                                    {/* <th>Action</th> */}
                                </tr></thead>
                            <tbody>
                                {
                                    this.state.artistReleases?.map((release, i) => {
                                        return (<Fragment key={i}>
                                            <tr className="positive">

                                                <td data-label="Release Title">{release.name}</td>
                                                <td data-label="Last FM play count">{release.playcount}</td>
                                                {/* <td data-label="Action"><i style={{ color: 'black' }} className="eye icon"></i></td> */}
                                            </tr>
                                        </Fragment>)
                                    })
                                }
                            </tbody>
                        </table>
                    </Scroll>

                </div>
            </div>
        )
    }

}

export default withRouter(Profile);