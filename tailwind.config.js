/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",/* Pattern matching for all javascript, jsx, files in the src directory */
  ],
  theme: {
    extend: {
      colors: {
        // Defining custom spectrum colors
        // Coordinate to "Spectrum News Pallete" found here: https://chalk.charter.com/display/AUDIENCEINSIGHT/Style+Guide
        'snbluehero1': '#2B5CAF',
        'snbluehero2': '#143C82',
        'snbluelight1': '#E5E9EF',
        'snbluelight2': '#88A2DE',
        'snblue-medium1': '#689DF3', 
        'snblue-medium2': '#2C5FBC', 
        'snblue-dark1': '#0A2F6E',
        'snblue-dark2': '#081B3B',
        // Charter deep blue
        'charterdeepblue': '#003057',

        // Custom colors I like for the project
        'custom-gray-background': '#f0f0f0',
      },
      width: {
        '5vw': '5vw',
        '16vw': '16vw',
        '84': '21rem',
        '88': '22rem',
      }, 
      height: {
        
        '90p': '90%',  // Add this line
      },
      gridTemplateColumns: {
        'custom': '0.85fr 1fr 1fr 1fr',
      }
      
    },
  },
  variants: {
    extend: {
      backgroundColor: ['group-hover'],
    },
  },
  plugins: [],
}

