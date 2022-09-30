export function ProjectCard(props) {
    return <div className="w-full bg-orange-50 pb-1">
        <div className="bg-green-200 w-fit pl-2 pr-2 font-bold italic" style={{marginTop: "-0.5em"}}>
            {props.name}<a className="ml-1" href={props.url} target="_blank" rel="noreferrer">{"->"}</a>
        </div>
        <div className="p-3">
            {props.children}
        </div>
    </div>
}