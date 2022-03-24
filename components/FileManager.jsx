const FileManager = ({changeFile, forceUpdateVal, editor}) => {
    const [fileNames, setFileNames] = React.useState([]);

    React.useEffect(async () => {
        const result = await fetch('/allFiles');
        setFileNames(await result.json());
    }, [forceUpdateVal]);

    return (
        <section className="file-manager">
            {
                fileNames.map((elem, index) => {
                    return (
                        <div className="file-name-title pd" key={index} onClick={() => {changeFile(elem.name)}}>
                            {elem.name}
                        </div>
                    );
                })
            }

            <div onClick={() => {editor.current.clear()}} className="new-file">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="black" fillOpacity="1"/>
                </svg>
            </div>

        </section>
    );
}
