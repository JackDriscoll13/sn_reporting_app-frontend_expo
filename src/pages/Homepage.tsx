// Homeage component

function HomePage({ isNavBarCollapsed }: { isNavBarCollapsed: boolean }) {
    // Custom width for the page based on the navbar state
    const pageStyle = {
        width: isNavBarCollapsed ? '95%' : '80%', // adjust as needed
        marginLeft: isNavBarCollapsed ? '6%' : '17%', // adjust as needed
          }// adjust as neede

    const subpagestyle ={ 
        width: isNavBarCollapsed ? '98%' : '98%', // Takes up the full width of the the parent container
        marginLeft: isNavBarCollapsed ? '1%' : '1%', // 
    }
  
    return (
    <div className='min-h-screen top-0 left-0 right-0 bg-custom-gray-background '> {/* Our background container */}
    <img src="/SN_APP_LOGO_2023.png" alt="Logo" className="absolute top-0 right-0 mt-4 mr-4 w-20 h-18" />
      <div style={pageStyle} className='border-4 flex flex-col justify-center items-start w-full ' > {/* Our main content container, adjusts to width of navbar*/}
        <h1 className="self-center text-charterdeepblue text-4xl mb-12 mt-32 text-center font-bold">Welcome to the Audience Insights Data App!</h1>
        <div style={subpagestyle} className="flex flex-col justify-center items-start border border-red-600"> {/* Our Sub content container */}
            <h3 className="font-bold text-left text-gray-700 text-2xl mb-2">Overview</h3>
            <p  className="text-gray-700 text-base text-left pl-2 pt-0">
                Welcome to our data app, a full stack solution for streamlined data access and reporting. Our goal is simple: to empower you with instant access to critical, accurate insights, enabling informed decision-making at every turn.
            </p>
            <p  className="text-gray-700 text-base text-left pl-2 pt-2">
                Our journey began with a desire to automate recurring reports within our team and free up time for deeper viewership investigations. We recognized the need for a centralized platform that could automate reporting processes and deliver quality insights to the team. Leveraging the power of Python, we've successfully automated daily, weekly, monthly, and ad hoc reporting, laying the groundwork for our next innovation.
            </p>
            <p className="text-gray-700 text-base text-left pl-2 pt-2">
              Introducing our latest endeavor: a cutting-edge web application built with <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a>. Leveraging a robust
              Python back-end and hosted in the secure Charter AWS environment, it seamlessly integrates with our *validated* viewership data, saving you time by streamlining data exploration and empowering awesome insights.
            </p>
            <h3 className="font-bold text-left text-gray-700 text-2xl mb-2 mt-4">Goals</h3>
            <p className="text-gray-700 text-base text-left pl-2 pt-0">
            Our primary goal is to provide you with a user-friendly platform that simplifies data access and reporting. To achieve this, we've focused on the following key objectives:
                <ul className="text-gray-700 text-base text-left pl-4 pt-2">
                <li className="mb-2 list-none">- Automate data retrieval and reporting processes</li>
                <li className="mb-2 list-none">- Deliver real-time insights to end-users</li>
                <li className="mb-2 list-none">- Optimize performance and user experience</li>
                <li className="mb-2 list-none">- Ensure data security and compliance within existing charter protocols</li>
                </ul>
            </p>
            <h3 className="font-bold text-left text-gray-700 text-2xl mb-2 mt-4">The Data</h3> 
            <p className="text-gray-700 text-base text-left pl-2 pt-0">
            Add some info about the data this app uses and accessibility here.
            </p> 
          <h3 className="font-bold text-left text-gray-700 text-2xl mb-2 mt-4">Our Process</h3>  
            <p className="text-gray-700 text-base text-left pl-2 pt-0">
            We want to build a robust data application as an SPA (Single Page Application) We will be using Javascript for the front-end and Python for the back-end. 
            </p> 
            <p className="text-gray-700 font-bold text-left pl-2 pt-2"> Front End Key Technologies: React, React Router, Tailwind CSS</p>
            <p className="text-gray-700 text-base text-left pl-2 pt-2">
            React: React is a great choice for building SPAs and it's particularly well-suited to applications that require complex, interactive UIs. You can create multiple dashboards as different components and use state and props to manage data across them.
            </p>
            <p className="text-gray-700 text-base text-left pl-2 pt-2">
            React Router: Used to manage the front end routing in our application. It allows us to handle navigation for different dashboards and reports in a clean and organized way, without ever refreshing the page. It enables us to protect the private aspects of our application by using a private route component that checks for a token in local storage.
            </p>
            <p className="text-gray-700 text-base text-left pl-2 pt-2">
            Tailwind CSS: Css is arguably the most difficult part of web development for non-expereinced front end developers like us. We are going to use Tailwind CSS to style our application as it is a modern appraoch, that, simply put, makes styling easier.
            Tailwind CSS is a utility-first CSS framework that makes it easy to build complex, responsive layouts without ever leaving your HTML. It's a great choice for building a data application like ours, where we need to display a lot of data and UI in a clean and organized way.
            </p>
            <p className="text-gray-700 font-bold text-left pl-2 pt-2"> Back End Key Technologies: FastAPI, Pydantic, Pandas, SQLAlchemy</p>
            <p className="text-gray-700 text-base text-left pl-2 pt-2">
            Add some info about backend technologies here.
            </p> 
        </div>
      </div>
    </div>
    );
  }


export default HomePage;