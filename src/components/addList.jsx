import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../store/auth-context';
import { useHistory } from "react-router";
const AddList = () => {
    const history = useHistory();
    const authctx = useContext(AuthContext);
    const [artistName, setArtistName] = useState('');
    const [artistId, setArtistId] = useState('');
    const [genre, setGenre] = useState('');

    useEffect(() => {
        if (authctx.user?.role !== 'admin') {
            history.push("/unauthorized");
        }
    })
    const addList = (e) => {
        e.preventDefault();
        axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&mbid=${artistId}&api_key=354503444ede1338a6be8cf0c335fdb0&format=json&limit=100`,).then(res => {
            return res.data;
        })
            .then(data => {
                const songs = data.toptracks?.track?.filter((song) => {
                    let currentSong = song.name.toLowerCase()
                    return !(currentSong.includes('mix')) && !(currentSong.includes('full album')) && !(currentSong.includes('live')) && !(currentSong.includes('demo')) && !(currentSong.includes('rehearsal')) && !(currentSong.includes('bonus'))
                        && !(currentSong.includes('cover')) && !(currentSong.includes('(full)')) && !(currentSong.includes('(instrumental)')) && !(currentSong.includes('(official')) && !(currentSong.includes('playthrough'))
                        && !(currentSong.includes('(guitar')) && !(currentSong.includes('(drum')) && !(currentSong.includes('(bass'))
                        && !(currentSong.includes('01')) && !(currentSong.includes('02')) && !(currentSong.includes('03')) && !(currentSong.includes('04')) && !(currentSong.includes('05')) && !(currentSong.includes('06'))
                        && !(currentSong.includes('07')) && !(currentSong.includes('08')) && !(currentSong.includes('09')) && !(currentSong.includes('10')) && !(currentSong.includes('11')) && !(currentSong.includes('12'))
                        && !(currentSong.includes('deluxe')) && !(currentSong.includes('version')) && !(currentSong.includes('studio')) && !(currentSong.includes('intro')) && !(currentSong.includes('lyrics'))
                        && !(currentSong.includes('edit')) && !(currentSong.includes('remake')) && !(currentSong.includes('?')) && !(currentSong.includes('reprise'))
                })
                const filteredSongs = [];
                songs?.forEach(song => {
                    let songExists = filteredSongs.some(x => {
                        return (x?.name?.toLowerCase().substr(0, 4).includes(song?.name?.toLowerCase().substr(0, 4)))
                    });
                    if (!songExists) {
                        filteredSongs.push(song)
                    }
                })
                const songNames = filteredSongs.map(x => {
                    return {
                        name: x.name,
                        createdBy: authctx?.user?._id
                    }
                }
                );
                if (songNames.length > 0) {
                    //    var a = songNames.filter((song,i)=>{
                    //         return i === 0|| i === 3|| i === 2
                    //     })
                    axios.post(`http://localhost:3001/api/lists`, {
                        listInfo: {
                            name: artistName,
                            artistId: artistId,
                            genre: genre,
                            createdBy: authctx?.user?._id
                        },
                        songs: songNames
                    }).then(data => {
                        history.push("/");
                    }).catch(err => {

                    })
                }
            })
    }
    const onNameChange = (value) => {
        setArtistName(value);
    }

    const onIdChange = (value) => {
        setArtistId(value)
    }

    const onGenreChange = (value) => {
        setGenre(value)
    }

    return (
        <form className="ui form">
            <h4 className="ui dividing header">Add List</h4>
            <div className="field">
                <label>List Info</label>
                <div className="two fields">
                    <div className="field">
                        <input value={artistName} onChange={(e) => onNameChange(e.target.value)} type="text" name="ListName" placeholder="Enter artist name" />
                    </div>
                    <div className="field">
                        <input value={artistId} onChange={(e) => onIdChange(e.target.value)} type="text" name="artistId" placeholder="enter last fm artist's mbid" />
                    </div>
                    <div className="field">
                        <input value={genre} onChange={(e) => onGenreChange(e.target.value)} type="text" name="genre" placeholder="enter genre" />
                    </div>
                </div>
            </div>
            <button disabled={artistName.length === 0 || setArtistId.length === 0 || setArtistId.length === 0} className="ui button" onClick={(e) => addList(e)}>submit</button>
        </form>
    )
}

export default AddList;