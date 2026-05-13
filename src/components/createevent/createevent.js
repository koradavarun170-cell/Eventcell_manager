import './createevent.css'
function CreateEvent({func}) {
    return ( <>
        <div className='box'>
            <button onClick={func}>Create/Check</button>
        </div>
    </> );
}

export default CreateEvent;