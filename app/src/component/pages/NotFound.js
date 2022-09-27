import React from 'react';
import { Link  } from 'react-router-dom';

const NotFound = () => {

    return (
        <div className="page-error tile">
            <h1><i className="fa fa-exclamation-circle"></i> Error 404: Page not found</h1>
            <p>The page you have requested is not found.</p>
            <p><Link className="btn btn-primary" to={-1}>Go Back</Link></p>
        </div>
    );
}

export default NotFound;