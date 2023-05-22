import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import Users from "../../components/agent-components/users/list";
import AddUser from "../../components/agent-components/users/add";
import UserDetail from "../../components/agent-components/users/details";

function AgentUsers(props) {
    return (
        <div>
            <InsideNavbar />
            <PageHeader headertitle="Users" />
            
            {
                props.page === 'users' && (
                    <Users />
                )
            }
            
            {
                props.page === 'add-user' && (
                    <AddUser />
                )
            }

            {
                props.page === 'user-details' && (
                    <UserDetail />
                )
            }
        </div>
    );
}

export default AgentUsers;
