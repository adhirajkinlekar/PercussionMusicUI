import React, { useState, useRef, useContext, Fragment } from "react";
import './comments.css'
import AuthContext from '../store/auth-context';
import axios from "axios";
const Comment = (props) => {
    const authctx = useContext(AuthContext);
    const textArea = useRef();
    const [commentId, setCommentId] = useState(null);
    const [textAreaValue, setTextAreaValue] = useState('');
    const [isTextAreaValueValid, checkIfValid] = useState(null);

    const onEditComment = (id, value) => {
        if (id === commentId) {
            setCommentId(null);
            checkIfValid(false);
        }
        else {
            setCommentId(id)
            setTextAreaValue(value)
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
    const editComment = ($event, commentId) => {
        $event.preventDefault();
        let comment = $event.target.elements.comment.value;
        axios.patch(`${axios.defaults.baseURL}/api/Lists/items/${props.itemId}/comments/${commentId}`, {
            text: comment
        })
            .then(() => {
                setCommentId(null)
                setTextAreaValue('')
                props.fetchList();
            })
            .catch(err => {
            })
    }
    const deleteComment = ($event, commentId) => {
        $event.preventDefault();
        axios.delete(`${axios.defaults.baseURL}/api/Lists/items/${props.itemId}/comments/${commentId}`)
            .then(() => {
                props.fetchList();
            })
            .catch(err => {
            })
    }

    // fetch(`http://localhost:3001/api/Lists/items/${props.itemId}/comments/${commentId}`, {
    //     method: 'PATCH',
    //     headers: new Headers({
    //         'Authorization': `Bearer ${authctx.token}`,
    //         'Content-Type': 'application/json'
    //     }),
    //     body: JSON.stringify({
    //         text: comment,
    //         likes: 1,
    //         createdBy: `${authctx.user._id}`
    //     })
    // })
    //     .then(() => {
    //         setCommentId(null)
    //         setTextAreaValue('')
    //         props.fetchList();
    //     })
    //     .catch(err => {
    //     })




    // fetch(`http://localhost:3001/api/Lists/items/${props.itemId}/comments/${commentId}`, {
    //     method: 'DELETE',
    //     headers: new Headers({
    //         'Authorization': `Bearer ${authctx.token}`,
    //         'Content-Type': 'application/json'
    //     })
    // })
    //     .then(() => {
    //         props.fetchList();
    //     })
    //     .catch(err => {
    //     })


    const isToday = (createdDate) => {
        let today = new Date()
        let time = createdDate.toLocaleTimeString('en-US');
        if (createdDate.getDate() === today.getDate() &&
            createdDate.getMonth() === today.getMonth() &&
            createdDate.getFullYear() === today.getFullYear()) {
            return `today at ${time}`
        }
        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (createdDate.getDate() === yesterday.getDate() &&
            createdDate.getMonth() === yesterday.getMonth() &&
            createdDate.getFullYear() === yesterday.getFullYear()) {
            return `yesterday at ${time}`
        }
        else {
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return createdDate.toLocaleDateString("en-US", options);
        }
    }

    const slicedArray = props.isModal === true ? props.comments : props.comments?.slice(0, (props.comments.length - 1 >= 1 ? 3 : 1));
    const comments = slicedArray?.map((comment, index) =>

        <div className="ui segment comments commentContainer" key={comment._id}>

            <div className="comment customComment">
                <div className="avatar profilePic" >
                    <img alt="profilePic" src={comment.createdBy?.photo} />
                </div>
                <div className="content">
                    <span className="author">{comment.createdBy?.name}</span>
                    <div className="metadata">
                        <span className="date">{isToday(new Date(comment.createdDate))}</span>
                        {authctx?.user?._id === comment.createdBy?._id ? <Fragment>
                            <i onClick={() => onEditComment(comment._id, comment.text)} className="fa fa-pencil penIcon" aria-hidden="true"></i>
                            <i onClick={($event) => deleteComment($event, comment._id)} className="fa fa-trash-o trashIcon" aria-hidden="true"></i>
                        </Fragment> : null
                        }
                    </div>
                    <div className={`${commentId === comment._id ? 'hide' : ''}`}>
                        <div className="text commentSection">
                            <p> {comment.text} </p>
                        </div>
                        {/* <div className="actions">
                            <div className="reply">Reply</div>
                        </div> */}
                    </div>

                    <form className="ui reply form commentForm" onSubmit={($event) => editComment($event, comment._id)}>
                        <div className={`field ${commentId === comment._id ? '' : 'hide'}`}>
                            <textarea className="textArea" value={textAreaValue} onChange={(e) => checkMinLength(e)} ref={textArea} name="comment"></textarea>
                        </div>
                        <div className="addComment">
                            <button disabled={isTextAreaValueValid ? false : true} type="submit" className={`ui blue labeled submit icon button ${commentId === comment._id ? '' : 'hide'}`}>
                                <i className="paper plane icon"></i> Submit
                            </button>
                        </div>
                    </form>

                </div>

            </div>
            <div className="actions seeMore">
                {props.comments.length > slicedArray.length && index === slicedArray.length - 1 && !props.isModal ?
                    <div onClick={() => props.showModal('active', props.itemId)} className="seeMoreAnchor">See More...</div> : null}
            </div>
        </div>
    );
    return (
        <div>
            <div> {comments}</div>
        </div>

    )
}

export default Comment;