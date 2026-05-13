import './checkevent.css'
function CheckEvent({func}) {
    return (<>
    <div className='box'>
        <button onClick={func}>Check Events</button>
    </div>
    </> );
}

export default CheckEvent;