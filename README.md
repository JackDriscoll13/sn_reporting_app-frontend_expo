To read more about how this frontend fits into our project, please please visit [jackdriscoll.io](https://jackdriscoll.io). (Add link to project demo)


### Overview

This is an expo of some of the code I wrote for a project in the Spring and Summer of 2024. 

It is the Typescript frontend that pairs with this a REST API found here: [sn_reporting_app-backend_expo](https://github.com/JackDriscoll13/sn_reporting_app-backend_expo). 

This code is served to the client in a browser, and retrieves data by pinging our backend REST API. The application on a whole is a full stack data application that allows stakeholders to understand and report on viewership data related to Spectrum News and its competitors. 

This code comes from an old commit and only contains logic for about 1/3 of the features currently active in the app.


### Features Present in this expo:

**Authentication**
  - I rolled my own custom auth for this app
  - The following pages are part of our Auth: 
    - [src/pages/Login.tsx](src/pages/Login.tsx)
    - [src/pages/Signup.tsx](src/pages/Signup.tsx)
    - [src/pages/VerifyNewUser.tsx](src/pages/VerifyNewUser.tsx)
    - [src/pages/ReqNewPassword.tsx](src/pages/ReqNewPassword.tsx)
    - [src/pages/ResetPassword.tsx](src/pages/ResetPassword.tsx)
  
-  The auth features at a high level:
  - User Registration and Verification: Users can register by providing their email and password. A verification code is sent to the user's email to complete the registration process.

  - Login: Users can log in using their email and password. A JWT token is generated upon successful login

  - Password Recovery: Users can request a password reset, which sends a secure link to their email to reset their password.

**Coverage Map**
- Found at [src/pages/CoverageMap.tsx](src/pages/CoverageMap.tsx)
- Uses mapboxGL and some lazy loading logic to render a detailed coverage map
- Relies on some heavy GEOJSON files retrieved from our backend


**Nielsen Daily Report**
- at [src/pages/NielsenDaily.tsx](src/pages/NielsenDaily.tsx)
- File Verification and Report Generation: Verifies uploaded Nielsen files and generates reports based on daily and benchmark data. Supports downloading of generated reports.
  
  - Meat of this report is [transformations/nielsen/nielsen_daily_report.py](/app/transformations/nielsen/nielsen_daily_report.py)
  

- Configuration and Report Data Management: Manages subject lines, email recipients, and DMA lists in the database, allowing updates and retrievals.

**Engagement**
- at [src/pages/Engagement.tsx](src/pages/Engagement.tsx)
- Fetches and displays the available date range for engagement data.
Uses a responsive layout that adapts to the navigation bar state.
- Implements a tab-based navigation system with 8 main sections (table views with [tanstack_table](https://tanstack.com/table/latest)):
- YTD, MoM, Over Time, Rank, Hev Penn, Quarterly, Periodicity History, and Excel/PPT Download.
- Each tab loads a different component with specific engagement data visualizations or reports.
- Manages state for active tab and data range.
- Provides a scrollable content area for handling large datasets.
- This page serves as a central hub for stakeholders to access and analyze various aspects of viewership engagement data for Spectrum News and competitors.
- 

**Basic User Administration**
- at [src/pages/UserManagement.tsx](src/pages/UserManagement.tsx)
- User and Role Management: Provides a frontend page for managing user permissions and adding new users (through pre-approval) to the app
