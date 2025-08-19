import React from 'react'

const Spinner = () => {
    return (

        <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] animate-pulse [animation-delay:.2s]" />
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] animate-pulse [animation-delay:.4s]" />
        </div>

    )
}
export default Spinner
