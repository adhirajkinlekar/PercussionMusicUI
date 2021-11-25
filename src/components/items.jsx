import React, { useState, useRef, useEffect, useContext, useReducer } from "react"
import Comment from "./comments";
import Scroll from "./scroll";
import './items.css';
import AuthContext from '../store/auth-context';
import axios from "axios";

function reducer(state, action) {
    switch (action.type) {
        case 'active':
            return { modalItem: action.payload.tempItemObj }
        case "inActive":
            return { modalItem: [] }
        default:
            return state
    }
}

const Item = (props) => {
    const authctx = useContext(AuthContext);
    const textArea = useRef();
    const [textAreaValue, setTextAreaValue] = useState('');
    const [itemId, setItemId] = useState();
    const [isTextAreaValueValid, checkIfValid] = useState();
    const [showModal, setModalVisibility] = useState('');
    const [state, Dispatch] = useReducer(reducer, { modalItem: [] })

    useEffect(() => {
        dispatchItem(showModal, state.modalItem?._id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return ()=>{
            console.log('this will run when component is about to be unmounteds')
        }
    }, [props.items])

    const onAddComment = (id) => {
        if (id === itemId) {
            setItemId(null);
            checkIfValid(false);
        }
        else {
            setItemId(id)
        }
    }

    const checkMinLength = (e) => {
        setTextAreaValue(e.target.value)
        if (e.target.value.length > 0 && e.target.value.trim() !== '') {
            checkIfValid(true);
        }
        else {
            checkIfValid(false);
        }
    }

    const showHideModal = (value, itemId) => {
        setModalVisibility(value);
        dispatchItem(value, itemId);
    }

    const dispatchItem = (value, itemId) => {
        if (value === 'active') {
            let tempItemObj = props.items.find(x => x._id === itemId)
            Dispatch({ type: 'active', payload: { tempItemObj } })
        }
        else {
            Dispatch({ type: 'inActive' })
        }
    }

    const submitComment = ($event) => {
        $event.preventDefault();
        let comment = $event.target.elements.comment.value;
        axios.post(`${axios.defaults.baseURL}/api/Lists/items/${itemId}/comments`, {
            text: comment,
            likes: 1,
            createdBy: `${authctx.user._id}`
        }
        )
            .then(() => {
                setItemId(null)
                setTextAreaValue('')
                props.fetchList();
            })
            .catch(err => {
            })
    }

    const items = props.items?.map((item, index) =>
        <div key={item._id}>
            <div className="ui middle aligned selection list itemList" style={{ backgroundColor: item.order === 1 ? 'rgb(250, 232, 186)' : '' }}>
                {item.order === 1 ? <p className="crown">👑</p> : null}
                <div className="item">
       
                    {item.order === 1 ? <h1 className="ui avatar image rank">{item.order}</h1> : <h5 className="ui avatar image rank">{item.order}</h5>}
                    <div className="content">
                        {item.order === 1 ? <h1 className="header itemName">{item.name.length > 50 ? item.name.substr(0, 40) + '...' : item.name}</h1> : <h2 className="header">{item.name.length > 50 ? item.name.substr(0, 40) + '...' : item.name}</h2>}
                    </div>
                    <div className="votesContainer">
                    <span className="votes"> {item.likes.length} votes  </span>
                 {  authctx.user && (props.votes.length < 5 || props.votes?.some(x=> x.itemId === item._id)) ? <i style={props.votes?.some(x=> x.itemId === item._id) ? {color:'rosybrown'}:{}} className="heart icon heartIcon" onClick={()=> props.submitVote(item._id,authctx.user._id)}></i> :null }
                    </div>
                </div>
            </div>

            <Comment comments={item.comments} itemId={item._id} fetchList={props.fetchList} showModal={showHideModal} isModal={false} />
            <form className="ui reply form commentForm" onSubmit={($event) => submitComment($event)}>
                <div className={`field ${itemId === item._id ? '' : 'hide'}`}>
                    <textarea className="textArea" value={textAreaValue} onChange={(e) => checkMinLength(e)} ref={textArea} name="comment"></textarea>
                </div>
                <div className="addComment" style={!authctx.isLoggedIn ? { pointerEvents: 'none', opacity: '0.7' } : {}} >
                    <div className="addCommentButton" onClick={() => onAddComment(item._id)}>
                        <i className="pencil alternate icon"></i> Add comment
                    </div>
                    <button disabled={isTextAreaValueValid ? false : true} type="submit" className={`ui blue labeled submit icon button ${itemId === item._id ? '' : 'hide'}`}>
                        <i className="paper plane icon"></i> Submit
                    </button>
                </div>

            </form>
            <hr />

        </div>
    );
    return (
        <div>
            <div>{items}</div>
            <div className="modalContainer">
                <div className={`ui modal ${showModal} commentModal`}>
                    <div className="header modalHeader"><div className="headerItems"><div><h1>{state.modalItem?.name}</h1> </div> <div><i onClick={() => showHideModal('')} className="fa fa-times closeModal" aria-hidden="true"></i></div></div></div>
                    <Scroll height="45vh">
                        <div className="commentModalContentContainer">
                            <Comment className="commentModalContent" comments={state.modalItem?.comments} itemId={state.modalItem?._id} fetchList={props.fetchList} showModal={showHideModal} isModal={true} />
                        </div>
                    </Scroll>
                </div>
            </div>
        </div>
    )
}

export default Item;


