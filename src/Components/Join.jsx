import React, { useState } from 'react';
import { Link, } from 'react-router-dom';


const Join = () => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');


    


 

    // const ENDPOINT = io('http://localhost:3000', {
    //     withCredentials: true,
    // });




    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Join</h2>

                 
                   <div className='space-y-3'>
                   <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            onChange={e => setName(e.target.value)}
                            name='name'
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                        <input
                            onChange={e => setRoom(e.target.value)}
                            name='room'
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="room"
                            required
                        />
                    </div>


                    <Link to={`/chat?name=${name}&room=${room}`} type='submit' className="w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                        Join
                    </Link>


                   </div>



            


            </div>
        </div>
    );
};

export default Join;