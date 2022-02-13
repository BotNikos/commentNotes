const Editor = () => {
    const [commentText, setCommentText] = React.useState('\n');
    const [lineNumber, setLineNumber] = React.useState([0]);
    const [hoverLine, setHoverLine] = React.useState(null);
    const [comments, setComments] = React.useState({});

    const setNewComment = (event) => {
        setCommentText(event.target.value);
    }

    React.useEffect(() => {
        const wrapCharArr = commentText.match(/[\n]/g);

        if (wrapCharArr) {
            setLineNumber(Array.from(Array(wrapCharArr.length).keys()));
            const infoEditor = document.getElementById('editor');
            infoEditor.style.height = `${wrapCharArr.length * 29 + 25 + 20}px`;
        }
    }, [commentText]);

    const showPlus = (event) => {
        setHoverLine(event.target.innerHTML);
        event.target.innerHTML = '+';
    }

    const showNumber = (event) => {
        event.target.innerHTML = hoverLine;
    }

    const enableComment = () => {
        const commentEditor = document.getElementById('comment_editor');
        commentEditor.disabled = false;
        commentEditor.focus();
        
        if (comments[hoverLine]) 
            commentEditor.value = comments[hoverLine];
        else
            commentEditor.value = '';
    }

    const editComment = (event) => {
        const commentsEdited = comments;
        commentsEdited[hoverLine] = event.target.value;
        setComments(commentsEdited);
    }


    const parentHighlight = (event) => {
        event.target.parentNode.style.border = '2px solid #00EAFF';
    }

    const disableParentHighligh = (event) => {
        event.target.parentNode.style.border = '';
    }

    return (
        <section className="editor">
            <h1 className="editor__title">Заметка номер 1</h1>
            <div className="editor__window">
                <div className="editor-window-info-wrapper">
                    <div className="editor__window__line-numbers">
                        {
                            lineNumber.map(elem => {
                                return <div className="line-numbers__one-number" onMouseEnter={showPlus} onMouseLeave={showNumber} onClick={enableComment} key={elem}>{elem}</div> 
                            })
                        }
                    </div>

                    <textarea 
                        className="editor__window__info editor_windows" 
                        id="editor" 
                        onChange={setNewComment} 
                        onFocus={parentHighlight} 
                        onBlur={disableParentHighligh} 
                        value={commentText}
                    ></textarea>
                </div>

                <div className="comment-window-info-wrapper">
                    <textarea 
                        className="comment__window__info editor_windows" 
                        id="comment_editor" 
                        onChange={editComment} 
                        onFocus={parentHighlight} 
                        onBlur={disableParentHighligh} 
                        disabled
                    ></textarea>
                </div>

            </div>
        </section>
    );
}