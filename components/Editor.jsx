const Editor = React.forwardRef(({fileName, forceUpdate}, ref) => {
    const [fileId, setFileId] = React.useState('');
    const [commentText, setCommentText] = React.useState('\n');
    const [lineNumber, setLineNumber] = React.useState([0]);
    const [hoverLine, setHoverLine] = React.useState(null);
    const [comments, setComments] = React.useState({});
    const [commentViewType, setCommentViewType] = React.useState(true);
    const [fileTitle, setFileTitle] = React.useState("Название заметки");

    const commentTextRef = React.useRef(null);
    const mainEditorRef = React.useRef(null);
    
    React.useEffect(() => {
        const wrapCharArr = commentText.match(/[\n]/g);

        if (wrapCharArr) {
            setLineNumber(Array.from(Array(wrapCharArr.length).keys()));
            const infoEditor = document.getElementById('editor');
            infoEditor.style.height = `${wrapCharArr.length * 29 + 25 + 20}px`;
        }
    }, [commentText]);

    React.useEffect(async () => {
        if (fileName) {
            let result = await fetch(`/file/${fileName}`);
            result = await result.json();

            let string = '';
            let comments = {};

            result.strings.forEach((elem, index) => {
                string += `${elem.content}\n`;
                comments[index] = elem.comment;
            });
        
            setFileId(result._id);
            setFileTitle(result.name);
            setCommentText(string);
            setCommentViewType(true);
            setComments(comments);

            commentTextRef.current.value = '';
        }
    }, [fileName]);

    React.useImperativeHandle(ref, () => ({
        clear: clearEditor,
    }));

    const clearEditor = () => {
        setFileId('');
        setCommentText('\n');
        setComments({});
        setFileTitle("Название заметки");
        setCommentViewType(true);
        
        commentTextRef.current.value = '';
    }


    const setNewComment = (event) => {
        setCommentText(event.target.value);
    }

    const showPlus = (event) => {
        setHoverLine(event.target.innerHTML);
        event.target.innerHTML = '+';
    }

    const showNumber = (event) => {
        event.target.innerHTML = hoverLine;
    }

    const enableComment = () => {
        const commentEditor = document.getElementById('comment_editor');
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
        event.target.parentNode.style.border = '2px solid #7AFDD6';
    }

    const disableParentHighligh = (event) => {
        event.target.parentNode.style.border = '';
    }

    const changeCommentViewType = () => {
        setCommentViewType(!commentViewType);

        if (commentViewType) {
            let joinString = '';

            for (let i = 0; i < lineNumber.length; i++) {
                joinString += (comments[i]) ? comments[i].split('\n').join(' ') : '';
                joinString += '\n';
            }

            commentTextRef.current.style.height = mainEditorRef.current.style.height;
            commentTextRef.current.wrap = 'off';
            commentTextRef.current.value = joinString;
        } else {
            let splitedText = commentTextRef.current.value.split('\n');
            let newComments = {}
            splitedText.forEach((elem, index) => {
                newComments[index] = elem;
            });

            setComments(newComments);
            commentTextRef.current.wrap = 'soft';
            commentTextRef.current.value = '';
        }
    }

    const changeFileTitle = (event) => {
        setFileTitle(event.target.value);
    }

    const saveFile = async () => {
        const info = {
            id: fileId,
            fileName: fileTitle,
            strings: commentText.split('\n'),
            comments,
        }

        let result = await fetch('/saveFile', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(info),
        });

        result = await result.json();
        console.log(result.message);

        forceUpdate();
    }

    const deleteFile = async () => {

        const info = {
            fileName: fileTitle,
        }

        let result = await fetch('/delete', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(info),
        });

        result = await result.json();
        console.log(result);

        forceUpdate();
        clearEditor();
    }

    return (
        <section className="editor">
            <div className="pd">
                <input className="editor__title" value={fileTitle} onChange={changeFileTitle}></input>
            </div>

            <div className="pd action-buttons">
                <button onClick={changeCommentViewType} className="comment-view pd">Показать комментари для {commentViewType ? 'всех строк' : 'одной строки'}</button>
                <button onClick={saveFile} className="comment-view pd">Сохранить</button>
                <button onClick={deleteFile} className="comment-view pd">Удалить</button>
            </div>

            <div className="editor__window pd">
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
                        ref={mainEditorRef}
                        wrap="off"
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
                        ref={commentTextRef}
                        wrap="off"
                        onChange={editComment} 
                        onFocus={parentHighlight} 
                        onBlur={disableParentHighligh} 
                    ></textarea>
                </div>

            </div>
        </section>
    );
});
