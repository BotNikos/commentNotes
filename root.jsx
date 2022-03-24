const root = document.getElementById('root');

const App = () => {

    const [fileName, setFileName] = React.useState('');
    const [forceUpdateVal, setForceUpdateVal] = React.useState(0);

    const editor = React.useRef();

    const changeFile = (fileName) => {
        setFileName(fileName);
    }

    const forceUpdate = () => {
        setForceUpdateVal(forceUpdateVal + 1);
    }

    return (
        <div className="main">
            <FileManager changeFile={changeFile} forceUpdateVal={forceUpdateVal} editor={editor}/>
            <Editor ref={editor} fileName={fileName} forceUpdate={forceUpdate}/>
        </div>
    );
}

ReactDOM.render(<App />, root);
