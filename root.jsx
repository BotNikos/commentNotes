const root = document.getElementById('root');

const App = () => {
    return (
        <div className="main">
            <FileManager />
            <Editor />
        </div>
    );
}

ReactDOM.render(<App />, root);