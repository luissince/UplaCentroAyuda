import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restore } from '../../store/authSlice';
 
const Load = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        const login = window.localStorage.getItem("login");
        if (login == null) {
            const user = null;
            const authentication = false;
            dispatch(restore({ user: user, authentication: authentication }));
        } else {
            const user = JSON.parse(login)
            const authentication = true;
            dispatch(restore({ user: user, authentication: authentication }));
        }
    }, []);

    return (
        <div>
            Loading...
        </div>
    );
}

export default Load;