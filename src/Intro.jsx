import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

const Display = ({title}) =>{
    const [count, setCount] = useState(0)
    const[hasLiked, setHasLiked] = useState(false)

    useEffect(() => {
        console.log(hasLiked ? `${title} has been liked` : ``)

    },[hasLiked]);
    return(
        <div className="card">
            <h2>{title} {count || null}</h2>
            <button onClick={() =>{
                setHasLiked(!hasLiked)
                setCount(c => c+1)
            }}>
                {hasLiked ? "❤️" : "🤍"}
            </button>
        </div>
    )
}
const App = () => {
    return (
        <div className="card-container">
            <h2> Functional arrow component</h2>
            <Display title="Star Wars" />
            <Display title="Vikings" />
            <Display title="Game of thrones" />
        </div>

    )
}

export default App
