import React, { useState } from "react";

import Error from "../components/homepage/section/error";
import Login from "../components/auth/login";
import RegisterAgent from "../components/auth/register-agent";
import RegisterCustomer from "../components/auth/register-customer";
import ResetPassword from "../components/auth/reset-password";
import Blogs from "../components/cms/blog/index";
import BlogsDetails from "../components/cms/blog/details";
import News from "../components/cms/news/index";
import NewsDetails from "../components/cms/news/details";
import Community from "../components/cms/community/index";
import CommunityPosts from '../components/cms/community/posts';
import CommunityPostComments from '../components/cms/community/post-comments'
import ContactInfo from "../components/homepage/section/contact-info";
import ContactForm from "../components/homepage/section/contact-form";
import PropertyDetails from '../components/homepage/property/details';
import PropertyGrid from '../components/homepage/property/grid';
import TermAndCondition from "../components/homepage/section/term-and-condition";
import Navbar from "../components/global/navbar";
import PageHeader from "../components/global/header";
import CallToActonV1 from "../components/homepage/section/call-to-action-v1";
import Footer from "../components/global/footer";
import ResponseHandler from "../components/partial/response-handler";
import { setResponseHandler } from "../utils";

export default function HomePages({ page, type, hideBookDemo }) {
    const [responseMessage, setResponseMessage] = useState();

    const setResponseMessageHandler = (response, isSuccess = false) => {
        setResponseMessage(setResponseHandler(response, isSuccess));
    }

    let pageTitle;
    let pageSubTitle = "";
    let pageType = "";
    let ComponentToRender;
    let componentProps = {
        responseHandler: setResponseMessageHandler
    };

    switch(page) {
        case 'login':
            pageTitle = "Account"
            pageSubTitle = "Login";
            componentProps.type = type;
            ComponentToRender = Login;
            break;

        case 'register':
            pageTitle = "Account";
            pageType = "register";
            pageSubTitle = "Register";
            ComponentToRender = type === 'agent' ? RegisterAgent : RegisterCustomer;
            break;

        case 'reset-password':
            pageTitle = "Account"
            pageSubTitle = "Reset Password";
            componentProps.type = type;
            ComponentToRender = ResetPassword;
            break;

        case 'blogs':
            pageTitle = "Blogs";
            ComponentToRender = Blogs;
            break;

        case 'blog-details':
            pageTitle = "Blogs Detail";
            ComponentToRender = BlogsDetails;
            break;
        
        case 'news':
            pageTitle = "News";
            ComponentToRender = News;
            break;
        
        case 'news-details':
            pageTitle = "News Detail";
            ComponentToRender = NewsDetails;
            break;

        case 'community':
            pageTitle = "Community";
            ComponentToRender = Community;
            break;
        
        case 'community-posts':
            pageTitle = "Community Posts";
            ComponentToRender = CommunityPosts;
            break;

        case 'community-post-comments':
            pageTitle = "Community Post Comments";
            ComponentToRender = CommunityPostComments;
            break;
        
        case 'contact-us':
            pageTitle = "Contact Us";
            pageSubTitle = "Contact";
            ComponentToRender = ContactInfo;
            break;
        
        case 'book-demo':
            pageTitle = "Book a Demo";
            pageSubTitle = "Demo";
            ComponentToRender = ContactForm;
            break;

        case 'property-grid':
            pageTitle = "Property Grid";
            ComponentToRender = PropertyGrid;
            break;

        case 'property-details':
            pageTitle = "Property Details";
            ComponentToRender = PropertyDetails;
            break;

        case 'terms-conditions':
            pageTitle = "TERMS AND CONDITIONS";
            pageSubTitle = "TERMS AND CONDITIONS";
            ComponentToRender = TermAndCondition;
            break;

        default:
            pageTitle = "404 Page"
            pageSubTitle = "";
            pageType = "";
            ComponentToRender = Error;
            break;
    }

    return (
        <div>
            <Navbar page={pageType} hideBookDemo={hideBookDemo} />
            <PageHeader headertitle={pageTitle} subheader={pageSubTitle} />
            {ComponentToRender && (
                <ComponentToRender {...componentProps} />
            )}
            {
                !hideBookDemo && (
                    <CallToActonV1 />
                )
            }
            <ResponseHandler response={responseMessage} />
            <Footer page={pageType}/>
        </div>
    );
}