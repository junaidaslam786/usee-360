import React, { Component } from 'react';

class Social extends Component {

    render() {

        let publicUrl = process.env.PUBLIC_URL+'/'

    	return <div className="ltn__social-media">
			<ul>
				<li><a href="#" title="Facebook"><i className="fab fa-facebook-f" /></a></li>
				<li><a href="#" title="Twitter"><i className="fab fa-twitter" /></a></li>
				<li><a href="#" title="Instagram"><i className="fab fa-instagram" /></a></li>
				<li><a href="#" title="Dribbble"><i className="fab fa-dribbble" /></a></li>
			</ul>
		</div>
    }
}

export default Social