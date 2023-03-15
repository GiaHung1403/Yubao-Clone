import {useState ,useEffect } from 'react'

const useScaling  = () =>{
    const [newState, setNewState] = useState(false)
    // useEffect(()=>{
    //     setNewState(state)
    // },[state])

    return {newState}
}

export default useScaling